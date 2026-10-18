/**
 * Site-wide configuration — values come from `.env` (see `.env.example`).
 *
 * ADMIN_EMAILS — the ONLY Google accounts allowed into /admin.
 *   Set `VITE_ADMIN_EMAILS` in `.env` (comma separated for several owners) and
 *   mirror the same addresses in `firestore.rules`, otherwise Firebase will
 *   reject the write even if the UI lets you in.
 */
export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

/** False until at least one owner address is provided — nothing is editable then. */
export const ADMIN_EMAILS_CONFIGURED = ADMIN_EMAILS.length > 0

if (!ADMIN_EMAILS_CONFIGURED && typeof window !== 'undefined') {
  console.warn('[config] VITE_ADMIN_EMAILS is empty — nobody can sign in to /admin. Add it to .env.')
}

/** Firestore location of the portfolio document. */
export const CONTENT_COLLECTION = 'portfolio'
export const CONTENT_DOC_ID = 'content'

/** localStorage key used to keep unsaved admin edits safe on refresh. */
export const DRAFT_STORAGE_KEY = 'portfolio-admin-draft'
