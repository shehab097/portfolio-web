# Design & Architecture

How this portfolio is put together, and how the private admin works.

---

## 1. Stack

| Concern | Choice |
| --- | --- |
| UI | Preact (`@preact/preset-vite` aliases `react` → `preact/compat`) |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`, CSS-first `@theme`) |
| Auth | Firebase Authentication — Google provider only |
| Data | Cloud Firestore — one document, `portfolio/content` |
| Images | Cloud Storage for Firebase — uploaded from `/admin`, URL stored in the document. Requires the Blaze plan (free tier covers a portfolio); falls back to pasted URLs otherwise |
| Routing | Tiny history router in `src/lib/router.jsx` (no dependency) |

---

## 2. Theme tokens

Defined once in `src/index.css` under `@theme`, used everywhere as Tailwind utilities:

| Token | Value | Usage |
| --- | --- | --- |
| `--color-bg-dark` | `#0D0D0D` | page background |
| `--color-bg-light` | `#EEEEEE` | body text |
| `--color-primary-dark` | `#f35a6f` | accent, links, hovers |
| `--color-primary-light` | `#980c1e` | deeper accent |
| `--font-oranienbaum` | Oranienbaum | headings, titles |
| `--font-instrument` | Instrument Serif | body copy, UI |

### Recurring patterns

- **Section shell** — `bg-bg-dark text-bg-light py-24 px-6` + inner `max-w-6xl mx-auto`.
- **Section header** — small `font-instrument text-2xl text-primary-dark` kicker above a
  `font-oranienbaum text-4xl md:text-6xl` title, separated by `border-b border-white/10`.
- **Surface** — `bg-white/[0.02] border border-white/10 rounded-xl`, hover `border-primary-dark/50`.
- **Links** — `hover:text-primary-dark` with `underline underline-offset-4/8 decoration-white/20`.
- **Motion** — `transition-colors duration-200` for text, `duration-300` for surfaces.

The `/login` and `/admin` screens reuse these exact tokens and patterns, so the private
area reads as part of the same site.

---

## 3. Content as data

The whole portfolio is one JSON object (`src/data/defaultContent.js`):

```
{
  site:     { title, description },
  navbar:   { links: [{ name, href }] },
  hero:     { role, name, bio, focus, links: [{ label, href }] },
  projects: { label, heading, previewCount, sortMode: "manual" | "title-asc" | "title-desc",
              items: [ { title, subtitle, description, tech[], github, demo, image, video,
                         pinned } ] },
  skills:   { label, heading, categories: [ { category, skills: [ { name, icon } ] } ] },
  about:    { label, heading, sections: [ { title, layout: "text" | "cards", items: [...] } ] },
  contact:  { label, heading, intro, note, links: [ { label, value, href, icon } ] }
}
```

Icons are stored as **names** (`"java"`, `"github"`, …). `src/lib/icons.jsx` owns the SVG
registry, so JSON stays data-only and unknown names degrade to a neutral dot.

`ContentProvider` (`src/lib/content.jsx`) subscribes to the Firestore document, deep-merges
it over the defaults, and exposes:

| Value | Meaning |
| --- | --- |
| `content` | what the site renders (draft while editing) |
| `savedContent` | last published version (target of *Revert*) |
| `status` | `loading` · `live` · `empty` · `error` · `local` |
| `dirty` | unpublished changes exist |
| `updateContent` / `replaceContent` | edit the draft |
| `saveContent` / `revert` / `resetToDefaults` | publish, discard, factory reset |

A snapshot arriving mid-edit never clobbers the draft, and the draft is mirrored into
`localStorage` so a refresh cannot lose work. If Firebase is unreachable the site silently
serves the bundled defaults.

---

## 4. Routes

| Path | Page | Access |
| --- | --- | --- |
| `/` | `pages/Home.jsx` | public |
| `/login` | `pages/Login.jsx` | public, Google sign-in only |
| `/admin` | `pages/Admin.jsx` | owner only |
| anything else | `pages/NotFound.jsx` | public |

`navigate()` + `useRoute()` handle history and `popstate`; `useLinkInterception()` upgrades
plain `<a href="/...">` clicks to client-side navigation (hash links, external links and
new-tab links are untouched).

### The owner gate

Two independent locks:

1. **Client** — `ADMIN_EMAILS`, built from `VITE_ADMIN_EMAILS` in `.env` (`src/config.js`). A signed-in
   account that is not listed sees "Not authorized" and never reaches the editor.
2. **Server** — `firestore.rules` only allows writes when the verified token email is in
   the same list. Even a tampered client cannot publish.

`/admin` deep-links straight to `/login` when no session exists, and `/login` forwards to
`/admin` as soon as the owner signs in.

---

## 5. Admin editing model

Draft → Save is the whole model. Field edits, card edits and JSON edits all mutate the same
in-memory draft, which is instantly reflected on `/` (open the site in another tab to preview
live).

### Layout

One screen, three parts: a **section rail** on the left (each entry shows a count, plus
*Raw JSON* — *Reset to defaults* is present but disabled for now, gated by
`RESET_TO_DEFAULTS_ENABLED` in `Admin.jsx`), a **panel header** with the section name and a
hint, and the **editor** for that section. The header bar holds the status pill,
**Save** (`⌘/Ctrl + S`), Revert and sign-out. A `beforeunload` guard warns before leaving
with unpublished edits.

### Projects — card view (`ProjectsEditor` + `ProjectCard`)

- Every project is a card that **collapses and expands**; collapsed cards show a **thumbnail**,
  the title, subtitle, `#index · tech count` and quick actions.
- **Add**, **duplicate** and **delete** cards (with an empty state when there are none).
- **Pin** a card (`pinned: true`) — pinned projects always render first on the site, with a
  badge, and have their card outlined in the accent colour.
- **Sort**: `Manual order` (arrange with the ↑ ↓ arrows), `Title A–Z`, or `Title Z–A`.
  Arrow controls disable themselves when the site sorts automatically.
- **Thumbnail** (`ImageField`) — shows the current image (or video poster) and the source
  control. **Uploads are off for now:** `UPLOADS_ENABLED = false` in `lib/storage.js` renders
  the *Upload image* control disabled, keeps the **Image URL** field visible, and lets Rollup
  drop the Storage SDK from the bundle (verified: the 30.7 kB chunk only exists when the flag
  is `true`). Flip the flag once Storage is live — files then go to `portfolio/projects/…`,
  validated client-side (image type, 5 MB) and server-side (`storage.rules`), and only the
  download URL is stored in Firestore. A refused upload is remembered in `localStorage`, so
  the editor offers the URL field instead of a button Firebase has already rejected.
- **Video poster** — a YouTube URL is previewed through `img.youtube.com` (no iframe), so the
  admin thumbnail matches what visitors see.
- Tech stacks are edited as **chips** (Enter or comma to add, Backspace to remove).

### Everything else — generic editor (`JsonField`)

A recursive editor that walks whatever shape the JSON has: top-level sections render flat,
nested objects and arrays become **collapsible groups**, array items are labelled by their own
`title` when they have one, long strings become textareas, arrays of strings become chips, and
`icon` keys become a dropdown of the icon registry. Remove/move controls only appear on hover
(always visible on touch layouts) so the view stays calm. New fields and array items can be
created without touching code.

### Raw JSON (`JsonEditor`)

The exact document with validation, format, copy, download and import. Invalid JSON is
flagged and cannot be applied.

### Ordering is shared

`src/lib/projects.js` owns `orderedProjects()` and `countPinned()`, so the public grid and the
admin toolbar always agree: **pinned first, then the chosen sort applied within each group.**

---

## 6. Files of interest

```
src/
├── config.js                  owner allowlist, content paths, draft key
├── lib/
│   ├── firebase.js            app/auth/firestore/analytics bootstrap
│   ├── auth.jsx               Google sign-in + isAdmin
│   ├── content.jsx            Firestore-backed content store
│   ├── router.jsx             history router + link interception
│   ├── projects.js            ordering + pinning rules (shared)
│   ├── media.js               YouTube id/embed/poster helpers
│   ├── storage.js             image upload (lazy-loaded Storage SDK)
│   └── icons.jsx              icon registry (name → SVG)
├── data/defaultContent.js     the portfolio itself (fallback + shape)
├── components/                public sections, now data-driven
│   └── admin/
│       ├── controls.jsx       buttons, inputs, icons shared by the editors
│       ├── ProjectsEditor.jsx card list: add / sort / pin
│       ├── ProjectCard.jsx    one collapsible project card
│       ├── ImageField.jsx     thumbnail preview + upload
│       ├── IconPicker.jsx     visual icon chooser (searchable grid)
│       ├── TagInput.jsx       chip editor for string arrays
│       ├── JsonField.jsx      recursive form for every other section
│       └── JsonEditor.jsx     raw JSON view
└── pages/                     Home, Login, Admin, NotFound
firestore.rules                server-side write lockdown
storage.rules                  upload lockdown (owner, images, 5 MB)
```

## 7. Editing shortcuts

| Action | Where |
| --- | --- |
| Upload / replace a project image | *Thumbnail* → drop a file or **Upload image** |
| Pin / unpin a project | Pin icon on the card header |
| Reorder projects | ↑ ↓ arrows (Manual order mode) |
| Sort automatically | *Sort by* selector — affects the live site |
| Add / duplicate / delete a project | Card header icons, or *Add project* |
| Change how many cards show first | *Cards before “See more”* |
| Change an icon (skills, about, contact) | Icon field → searchable visual picker |
| Publish everything | **Save** / `⌘/Ctrl + S` |
