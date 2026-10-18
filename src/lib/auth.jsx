import { createContext } from 'preact'
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks'
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from './firebase'
import { ADMIN_EMAILS } from '../config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return undefined

    // Completes a sign-in that came back from a redirect (popup blocked case).
    getRedirectResult(auth).catch(() => {})

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase is not configured.')
    }
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (popupError) {
      const fallbackCodes = [
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request',
        'auth/operation-not-supported-in-this-environment',
      ]
      if (fallbackCodes.includes(popupError?.code)) {
        await signInWithRedirect(auth, googleProvider)
        return
      }
      setError(popupError?.message ?? 'Sign-in failed.')
      throw popupError
    }
  }, [])

  const signOutUser = useCallback(async () => {
    if (!auth) return
    await signOut(auth)
  }, [])

  const email = user?.email?.toLowerCase() ?? null
  const isAdmin = Boolean(email && ADMIN_EMAILS.includes(email))

  const value = useMemo(
    () => ({ user, email, isAdmin, loading, error, signInWithGoogle, signOutUser }),
    [user, email, isAdmin, loading, error, signInWithGoogle, signOutUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
