# portfolio-web

Personal portfolio (Preact + Vite + Tailwind 4). All content is stored as JSON, edited
from a private Google-authenticated dashboard at `/login` → `/admin`.

- Design & architecture: [`design.md`](./design.md)

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Owner setup (one time)

1. **Environment** — copy `.env.example` to `.env` and fill it in:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_MEASUREMENT_ID=...
   VITE_ADMIN_EMAILS=you@gmail.com
   ```

   `.env` is gitignored. `VITE_ADMIN_EMAILS` is the only account allowed into `/admin`
   (comma separated for several owners) — mirror it in `firestore.rules`.

2. **Google sign-in** — Firebase console → *Authentication* → *Sign-in method* → enable
   **Google**. Under *Settings → Authorized domains* add every domain you deploy to
   (`localhost` is there by default).

3. **Database** — Firebase console → *Firestore Database* → create database.
   Paste `firestore.rules` into *Firestore → Rules* → **Publish**, or deploy with
   `firebase deploy --only firestore:rules`.

4. **Storage (for project image uploads) — optional.**

   > **Heads-up:** since **February 3rd 2026** Cloud Storage for Firebase requires the project
   > to be on the **Blaze (pay-as-you-go)** plan. On the free Spark plan every upload returns
   > 402/403. Blaze still includes a no-cost tier (5 GB stored, 100 GB/month downloaded,
   > 5 000 uploads/month for `*.firebasestorage.app` buckets in `us-central1`, `us-east1` or
   > `us-west1`), so a portfolio costs **$0** — but it does ask for a billing account.

   On Blaze: Firebase console → *Storage* → get started, then paste `storage.rules` into
   *Storage → Rules* → **Publish**, or deploy with `firebase deploy --only storage`.

   **Uploads are currently switched off.** `UPLOADS_ENABLED` in `src/lib/storage.js` is
   `false`, so the project card shows a disabled *Upload image* control, keeps the
   **Image URL** field visible, and the upload SDK is left out of the bundle entirely.
   Set it to `true` once Storage is live and the button comes back — no other changes needed.

   Until then, put the image somewhere public and paste its URL into the card's
   **Image URL** field. A refused upload is also remembered, so the editor never keeps
   offering a button that Firebase has rejected.

5. Open `/login`, continue with Google, land on `/admin`.

## Editing content

The dashboard is one screen: a section rail on the left, the editor on the right, Save in the
header.

- **Projects** is a card view. Collapse/expand a card, add, duplicate or delete it, mark it
  **Pinned** (pinned projects always show first, with a badge), reorder it with the ↑ ↓ arrows
  in *Manual order*, or let the site sort by title with the **Sort by** selector. Each card has
  a **thumbnail preview** — paste an image URL (uploads are off, see above). Tech stacks are
  edited as chips.
- **Primary GitHub URL** is the repository whose **README is rendered in the project popup** —
  set it once per project and the popup fills itself in.
- **Additional links** — when a project spans several repositories, add a row per piece with a
  **tag** (*Frontend*, *Backend*, *Mobile App*, *Web App*, *API*, … or anything you type).
  They stay **hidden on the card** and appear only in the popup, along with the primary code
  link and the live demo.
- **Every other section** uses a calm recursive form: nested groups collapse, chips for string
  lists, textareas for long copy, and a **searchable visual icon picker** for icon fields.
- **Raw JSON** (bottom of the rail) shows the whole document — format, copy, download, import.
- Press **Save** (`⌘/Ctrl + S`) to publish. Until then, edits stay a draft in your browser only.
  **Revert** throws the draft away.

The public site reads the same document, so published changes appear after a reload. If
Firestore is unreachable, visitors get the bundled defaults from
`src/data/defaultContent.js`.

## Project popups

Clicking a project card (or its **Details** button — the card is keyboard-reachable through the
title) opens a full popup: media, description, tech chips, **every link** including the extra
tagged repositories, and the **README of the primary GitHub repository**, rendered as styled
markdown.

- The README comes from GitHub's public API, anonymously — no token, **60 requests/hour per
  visitor IP**. It is fetched only when the popup opens, and `marked` + `dompurify` are
  lazily loaded, so the normal page load is unaffected.
- Relative images and links inside a README (screenshots in `docs/`, etc.) are rewritten against
  the repository so they resolve, and all links open in a new tab.
- Markdown is sanitised before rendering, so a README cannot inject scripts into your site.
- If the repository is private, missing, or GitHub is rate-limiting, the popup says so and links
  to the repo instead — it never shows a broken panel.
- To switch the popup's README source, just change the project's **Primary GitHub URL**.

## Security

Reads are public, writes are restricted to you by `firestore.rules`, which runs on Google's
servers — no client edit can bypass it. Pin your **uid** (Authentication → Users → User UID)
or, more simply, your Gmail address; the file documents both options. The client-side list in
`src/config.js` is a convenience gate only; the rules are the real lock.

## Deploying

Any static host works — make sure unknown paths (`/login`, `/admin`) rewrite to
`index.html`. `firebase.json` already does this for Firebase Hosting
(`firebase deploy --only hosting,firestore:rules`).

Vite inlines `.env` values at **build time**, so the variables above must also be set in your
hosting provider's environment settings (Vercel/Netlify/Firebase Hosting build config), and
the production domain added to Firebase Authentication → Settings → Authorized domains.
