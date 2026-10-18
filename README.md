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

4. Open `/login`, continue with Google, land on `/admin`.

## Editing content

- **Fields** tab: click through the sections and edit anything. Add or remove projects,
  skills, contact links, nav items, even new fields.
- **JSON** tab: view/format/import/export the entire document.
- Press **Save changes** (`⌘/Ctrl + S`) to publish. Until then, edits stay a draft in your
  browser only. **Revert** throws the draft away.

The public site reads the same document, so published changes appear after a reload. If
Firestore is unreachable, visitors get the bundled defaults from
`src/data/defaultContent.js`.

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
