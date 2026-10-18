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
  projects: { label, heading, previewCount, items: [ { title, subtitle, description,
               tech[], github, demo, image, video } ] },
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

Draft → Save is the whole model. Field edits and JSON edits both mutate the same in-memory
draft, which is instantly reflected on `/` (open the site in another tab to preview live).

- **Fields tab** — a generic recursive editor (`components/admin/JsonField.jsx`) walks the
  JSON: objects render labelled inputs, arrays get add/remove/reorder, long strings become
  textareas, and `icon` keys become a dropdown of the icon registry. New fields and new
  array items can be created without touching code.
- **JSON tab** — the raw document with validation, format, copy, download and import.
  Invalid JSON is flagged and cannot be applied.
- **Top bar** — live status pill (Live · saved …, Unpublished changes, Database
  unreachable, Offline mode), **Save changes** (`⌘/Ctrl + S` also works), **Revert**,
  **Sign out**.
- A `beforeunload` guard warns before leaving with unpublished edits.

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
│   └── icons.jsx              icon registry (name → SVG)
├── data/defaultContent.js     the portfolio itself (fallback + shape)
├── components/                public sections, now data-driven
│   └── admin/                 JsonField (recursive form), JsonEditor (raw)
└── pages/                     Home, Login, Admin, NotFound
firestore.rules                server-side write lockdown
```
