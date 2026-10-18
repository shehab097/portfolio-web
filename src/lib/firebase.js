import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

/**
 * Firebase configuration comes from `.env` (see `.env.example`).
 * Vite inlines these at build time, so the same variables must be set in your
 * hosting provider's environment settings for production builds.
 */
const env = import.meta.env

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
}

/** Every variable the app cannot run without, with its .env name for messages. */
const REQUIRED_VARIABLES = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID',
}

export const missingFirebaseVariables = Object.entries(REQUIRED_VARIABLES)
  .filter(([key]) => !firebaseConfig[key])
  .map(([, variable]) => variable)

/** Lets the whole app degrade gracefully to the bundled JSON when unconfigured. */
export const isFirebaseConfigured = missingFirebaseVariables.length === 0

if (!isFirebaseConfigured && typeof window !== 'undefined') {
  console.warn(
    `[firebase] Missing ${missingFirebaseVariables.join(', ')}. ` +
      'Copy .env.example to .env and fill in your Firebase web app keys.',
  )
}

const app = isFirebaseConfigured ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null

export const firebaseApp = app
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

/** Single shared Google provider — used for popup + redirect sign-in. */
export const googleProvider = app ? new GoogleAuthProvider() : null

if (googleProvider) {
  googleProvider.setCustomParameters({ prompt: 'select_account' })
}

// Analytics is optional, browser-dependent and never on the critical path —
// load it lazily so it cannot delay or break the app.
if (app && typeof window !== 'undefined') {
  import('firebase/analytics')
    .then(({ getAnalytics, isSupported }) => isSupported().then((supported) => supported && getAnalytics(app)))
    .catch(() => {})
}
