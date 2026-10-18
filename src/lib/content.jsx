import { createContext } from 'preact'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import { CONTENT_COLLECTION, CONTENT_DOC_ID, DRAFT_STORAGE_KEY } from '../config'
import { defaultContent } from '../data/defaultContent'

const ContentContext = createContext(null)

const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Deep-merges stored content over the bundled defaults so newly added fields
 * (or a partly-filled document) never break the site.
 */
export function withDefaults(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : override
  }
  const result = { ...base }
  for (const [key, value] of Object.entries(override)) {
    result[key] = isPlainObject(value) && isPlainObject(base[key]) ? withDefaults(base[key], value) : value
  }
  return result
}

const readDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)
  const [savedContent, setSavedContent] = useState(defaultContent)
  const [status, setStatus] = useState(isFirebaseConfigured ? 'loading' : 'local')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState(null)
  // Guards against a Firestore snapshot overwriting in-progress edits.
  const dirtyRef = useRef(false)

  const setContentDirty = useCallback((next) => {
    dirtyRef.current = true
    setDirty(true)
    setContent(next)
  }, [])

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return undefined

    const ref = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID)
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const raw = snapshot.exists() ? snapshot.data() : null
        // `updatedAt` is server metadata, not portfolio content — keep it out of the JSON.
        const { updatedAt = null, ...data } = raw ?? {}
        const stored = withDefaults(defaultContent, data)
        setSavedContent(stored)
        if (!dirtyRef.current) {
          setContent(stored)
          setLastSavedAt(updatedAt)
        }
        setStatus(snapshot.exists() ? 'live' : 'empty')
        setError(null)
      },
      (snapshotError) => {
        setStatus('error')
        setError(snapshotError?.message ?? 'Could not reach Firestore.')
      },
    )

    return unsubscribe
  }, [])

  // Restore an unsaved local draft after a refresh.
  useEffect(() => {
    const draft = readDraft()
    if (draft && isPlainObject(draft)) {
      dirtyRef.current = true
      setDirty(true)
      setContent(withDefaults(defaultContent, draft))
    }
  }, [])

  // Keep the draft safe in localStorage (admin-only data, but harmless + tiny).
  useEffect(() => {
    if (!dirty) return
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(content))
    } catch {
      /* storage full / disabled — edits still live in memory */
    }
  }, [content, dirty])

  const updateContent = useCallback(
    (updater) => {
      setContentDirty(typeof updater === 'function' ? updater(content) : updater)
    },
    [content, setContentDirty],
  )

  const replaceContent = useCallback(
    (next) => {
      setContentDirty(next)
    },
    [setContentDirty],
  )

  const saveContent = useCallback(async () => {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase is not configured, so changes cannot be published.')
    }
    setSaving(true)
    try {
      await setDoc(doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID), {
        ...content,
        updatedAt: serverTimestamp(),
      })
      setSavedContent(content)
      setLastSavedAt(new Date())
      dirtyRef.current = false
      setDirty(false)
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      } catch {
        /* ignore */
      }
    } finally {
      setSaving(false)
    }
  }, [content])

  const revert = useCallback(() => {
    dirtyRef.current = false
    setDirty(false)
    setContent(savedContent)
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [savedContent])

  const resetToDefaults = useCallback(() => {
    setContentDirty(defaultContent)
  }, [setContentDirty])

  const value = useMemo(
    () => ({
      content,
      savedContent,
      status,
      error,
      saving,
      dirty,
      lastSavedAt,
      updateContent,
      replaceContent,
      saveContent,
      revert,
      resetToDefaults,
    }),
    [
      content,
      savedContent,
      status,
      error,
      saving,
      dirty,
      lastSavedAt,
      updateContent,
      replaceContent,
      saveContent,
      revert,
      resetToDefaults,
    ],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

/** Reads the live portfolio content. */
export function useContent() {
  const context = useContext(ContentContext)
  if (!context) throw new Error('useContent must be used inside <ContentProvider>')
  return context
}
