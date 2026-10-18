import { firebaseApp, firebaseConfig, isFirebaseConfigured } from './firebase'

/**
 * Image uploads for the admin.
 *
 * Files go to Cloud Storage for Firebase (`portfolio/projects/...`) and the
 * document only stores the resulting download URL — Firestore stays small.
 *
 * firebase/storage is imported lazily so visitors never download the upload SDK.
 *
 * NOTE — billing: since February 3rd, 2026 Cloud Storage for Firebase requires
 * the project to be on the Blaze (pay-as-you-go) plan. On the free Spark plan
 * every call returns 402/403, which the SDK surfaces as a confusing
 * `storage/unauthorized` or `storage/quota-exceeded`. `describeStorageError`
 * below turns that into something actionable.
 */

/**
 * Master switch for in-browser image uploads.
 *
 * Cloud Storage for Firebase has required the Blaze (pay-as-you-go) plan since
 * February 2026, so uploads are switched off — the editor asks for an image URL
 * instead. Flip this to `true` once Storage is enabled on the project and
 * `storage.rules` is published, and the upload button comes straight back.
 */
export const UPLOADS_ENABLED = false

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export const isStorageConfigured = isFirebaseConfigured && Boolean(firebaseConfig.storageBucket)

/** Console link that takes the owner straight to the upgrade flow. */
export const storageUpgradeUrl = firebaseConfig.projectId
    ? `https://console.firebase.google.com/project/${firebaseConfig.projectId}/overview?purchaseBillingPlan=metered`
    : 'https://firebase.google.com/pricing'

const STORAGE_UNAVAILABLE_KEY = 'portfolio.storageUnavailable'

/**
 * Whether the editor should offer an upload button at all.
 * False when uploads are switched off, unconfigured, or already refused by
 * Firebase (remembered in localStorage so we stop offering a broken button).
 */
export const isStorageAvailable = () => {
    if (!UPLOADS_ENABLED || !isStorageConfigured) return false
    try {
        return window.localStorage.getItem(STORAGE_UNAVAILABLE_KEY) !== '1'
    } catch {
        return true
    }
}

export const markStorageUnavailable = () => {
    try {
        window.localStorage.setItem(STORAGE_UNAVAILABLE_KEY, '1')
    } catch {
        /* private mode — the in-memory flag is enough */
    }
}

export const clearStorageUnavailable = () => {
    try {
        window.localStorage.removeItem(STORAGE_UNAVAILABLE_KEY)
    } catch {
        /* ignore */
    }
}

/**
 * Turns a raw Storage error into a message the owner can act on.
 * @returns {{ kind: 'pricing'|'rules'|'auth'|'setup'|'network'|'unknown', message: string }}
 */
export function describeStorageError(error) {
    const code = error?.code ?? ''
    const raw = String(error?.message ?? '')
    const text = raw.toLowerCase()

    const mentionsBilling =
        text.includes('spark pricing plan') ||
        text.includes('blaze pricing plan') ||
        text.includes('absent billing account') ||
        text.includes('billing account') ||
        text.includes('quota for bucket')

    if (mentionsBilling || code === 'storage/quota-exceeded') {
        return {
            kind: 'pricing',
            message:
                'Firebase now requires the Blaze (pay-as-you-go) plan for Cloud Storage — free Spark projects cannot upload. ' +
                'Inside the free tier you still pay $0, and project thumbnails stay far below it.',
        }
    }

    if (code === 'storage/unauthenticated') {
        return { kind: 'auth', message: 'Your sign-in expired. Sign in again, then retry the upload.' }
    }

    if (code === 'storage/unauthorized') {
        return {
            kind: 'rules',
            message:
                'The upload was rejected by the storage rules. Open Firebase console → Storage → Rules, ' +
                'make sure storage.rules is published, and confirm you are signed in as the owner account.',
        }
    }

    if (
        code === 'storage/bucket-not-found' ||
        text.includes('bucket') && (text.includes('not found') || text.includes('does not exist'))
    ) {
        return {
            kind: 'setup',
            message:
                `No storage bucket called "${firebaseConfig.storageBucket}" exists yet. ` +
                'Open Firebase console → Storage and finish the setup, then retry.',
        }
    }

    if (code === 'storage/retry-limit-exceeded' || code === 'storage/canceled') {
        return { kind: 'network', message: 'The upload stalled — check your connection and try again.' }
    }

    if (code === 'storage/unknown' && (text.includes('402') || text.includes('403'))) {
        return {
            kind: 'pricing',
            message:
                'Firebase refused the upload with a 402/403. Free Spark projects cannot use Cloud Storage — ' +
                'upgrade the project to Blaze, or paste an image URL instead.',
        }
    }

    return { kind: 'unknown', message: raw || 'Upload failed. Paste an image URL instead.' }
}

const slug = (name) =>
    String(name || 'image')
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(-60) || 'image'

const readableSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

/**
 * Uploads an image and resolves with its public download URL.
 * Rejects with an Error carrying `.kind` from `describeStorageError`.
 * @param {File} file
 * @param {{ onProgress?: (percent: number) => void }} options
 */
export async function uploadPortfolioImage(file, { onProgress } = {}) {
    if (!UPLOADS_ENABLED) {
        const error = new Error('Image uploads are switched off. Paste an image URL instead.')
        error.kind = 'disabled'
        throw error
    }
    if (!isStorageConfigured) {
        const error = new Error('Firebase Storage is not configured. Paste an image URL instead.')
        error.kind = 'setup'
        throw error
    }
    if (!file) throw new Error('No file selected.')
    if (!String(file.type).startsWith('image/')) throw new Error('Only image files can be uploaded.')
    if (file.size > MAX_IMAGE_BYTES) {
        throw new Error(`That image is ${readableSize(file.size)} — the limit is ${readableSize(MAX_IMAGE_BYTES)}.`)
    }

    const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')

    const storage = getStorage(firebaseApp)
    const path = `portfolio/projects/${Date.now()}-${slug(file.name)}`
    const task = uploadBytesResumable(ref(storage, path), file, {
        contentType: file.type || 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
    })

    const fail = (cause) => {
        const described = describeStorageError(cause)
        if (described.kind === 'pricing' || described.kind === 'setup') markStorageUnavailable()
        const error = new Error(described.message)
        error.kind = described.kind
        return error
    }

    return new Promise((resolve, reject) => {
        task.on(
            'state_changed',
            (snapshot) => {
                if (onProgress && snapshot.totalBytes) {
                    onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
                }
            },
            (error) => reject(fail(error)),
            async () => {
                try {
                    resolve(await getDownloadURL(task.snapshot.ref))
                } catch (error) {
                    reject(fail(error))
                }
            },
        )
    })
}
