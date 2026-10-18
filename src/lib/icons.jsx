/**
 * Icon registry.
 *
 * Portfolio content (stored as JSON in Firestore) can only hold data, so icons
 * are referenced by *name*. Everything an editor can pick is listed in
 * `ICON_NAMES` (used by the admin dropdown) and rendered through `<Icon />`.
 */

const S = ({ className = 'w-5 h-5', children }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const icons = {
  /* Programming */
  java: (p) => (
    <S {...p}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </S>
  ),
  python: (p) => (
    <S {...p}>
      <path d="M12 2C6.5 2 6 4 6 6v3h6V8h3v3H5c-3 0-3 3-3 3s0 3 3 3h2v-2h4v4H6c-3 0-3 3-3 3s0 3 3 3h7c5.5 0 6-2 6-6v-3h-6v1h-3v-3h10c3 0 3-3 3-3s0-3-3-3h-2v2h-4V2h3z" />
    </S>
  ),
  cpp: (p) => (
    <S {...p}>
      <path d="M12 20h9" />
      <path d="M16.5 15.5v9" />
      <path d="M5 8h3a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5V8z" />
    </S>
  ),
  sql: (p) => (
    <S {...p}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </S>
  ),

  /* Backend */
  'spring-boot': (p) => (
    <S {...p}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </S>
  ),
  'rest-api': (p) => (
    <S {...p}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </S>
  ),
  hibernate: (p) => (
    <S {...p}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </S>
  ),
  security: (p) => (
    <S {...p}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </S>
  ),
  jwt: (p) => (
    <S {...p}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </S>
  ),

  /* Frontend */
  react: (p) => (
    <S {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </S>
  ),
  'react-native': (p) => (
    <S {...p}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </S>
  ),
  html: (p) => (
    <S {...p}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </S>
  ),
  css: (p) => (
    <S {...p}>
      <path d="M12 2l-9.5 3.5 1 14.5L12 22l8.5-2 1-14.5L12 2z" />
    </S>
  ),
  javascript: (p) => (
    <S {...p}>
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      <path d="M16 16v-3a2 2 0 0 0-2-2h-2" />
      <path d="M12 11v6" />
    </S>
  ),

  /* Machine learning */
  pytorch: (p) => (
    <S {...p}>
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 12l8-8" />
    </S>
  ),
  'scikit-learn': (p) => (
    <S {...p}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </S>
  ),
  'computer-vision': (p) => (
    <S {...p}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </S>
  ),
  'data-processing': (p) => (
    <S {...p}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </S>
  ),

  /* Database & tools */
  mysql: (p) => (
    <S {...p}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </S>
  ),
  postgresql: (p) => (
    <S {...p}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </S>
  ),
  firebase: (p) => (
    <S {...p}>
      <path d="M12 2l-9 16.5L7.5 22 12 15l4.5 7L21 18.5z" />
    </S>
  ),
  git: (p) => (
    <S {...p}>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </S>
  ),
  linux: (p) => (
    <S {...p}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </S>
  ),
  docker: (p) => (
    <S {...p}>
      <path d="M2 12h20M2 16h20M6 8h2M10 8h2M14 8h2M6 4h2M10 4h2" />
    </S>
  ),
  tailwind: (p) => (
    <S {...p}>
      <path d="M3 12c1-4 3-6 6-6 3 0 4 2 5 4s2 4 5 4c3 0 5-2 6-6" />
      <path d="M3 19c1-4 3-6 6-6 3 0 4 2 5 4s2 4 5 4c3 0 5-2 6-6" />
    </S>
  ),
  node: (p) => (
    <S {...p}>
      <path d="M12 2l9 5v10l-9 5-9-5V7z" />
      <path d="M12 22V12l9-5" />
    </S>
  ),
  typescript: (p) => (
    <S {...p}>
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M7 11h6M10 11v6" />
      <path d="M14.5 17v-3a1.5 1.5 0 0 1 3 0v3" />
    </S>
  ),

  /* Generic / about */
  server: (p) => (
    <S {...p}>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </S>
  ),
  brain: (p) => (
    <S {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </S>
  ),
  cpu: (p) => (
    <S {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </S>
  ),

  /* Contact */
  mail: (p) => (
    <S {...p}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </S>
  ),
  github: (p) => (
    <S {...p}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </S>
  ),
  linkedin: (p) => (
    <S {...p}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </S>
  ),
  link: (p) => (
    <S {...p}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </S>
  ),
  'file-text': (p) => (
    <S {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </S>
  ),
  code: (p) => (
    <S {...p}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </S>
  ),
  sparkle: (p) => (
    <S {...p}>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    </S>
  ),
}

export const ICON_NAMES = Object.keys(icons).sort()

/** Renders an icon by name; falls back to a neutral dot for unknown names. */
export function Icon({ name, className = 'w-5 h-5' }) {
  const Component = icons[name]
  if (!Component) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
      </svg>
    )
  }
  return <Component className={className} />
}
