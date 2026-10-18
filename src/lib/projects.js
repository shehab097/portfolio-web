/**
 * Project ordering + pinning helpers, shared by the public section and the admin
 * so both agree on what "pinned" and "sort" mean.
 *
 * Rule: pinned projects always come first, then the chosen sort mode is applied
 * *within* the pinned group and within the rest.
 */

export const PROJECT_SORT_MODES = [
  { value: 'manual', label: 'Manual order' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
]

export const DEFAULT_PROJECT = {
  title: 'New project',
  subtitle: '',
  description: '',
  tech: [],
  github: '',
  demo: '',
  links: [],
  image: '',
  video: '',
  pinned: false,
}

export const createEmptyProject = () => ({ ...DEFAULT_PROJECT, tech: [], links: [] })

/** Tag suggestions offered for an extra project link. */
export const LINK_TAGS = [
  'Frontend',
  'Backend',
  'Mobile App',
  'Web App',
  'API',
  'Admin',
  'Docs',
  'Design',
  'Dataset',
  'Notebook',
  'Package',
  'Other',
]

/**
 * Every link a project exposes, in display order:
 *   1. the primary repository (`github`) — the one whose README the popup loads
 *   2. the live demo (`demo`)
 *   3. extra tagged links (`links`), e.g. Frontend / Backend / Mobile App
 * Empty rows are dropped, so half-filled entries in the admin are harmless.
 */
export function projectLinks(project = {}) {
  const links = []
  if (project.github) links.push({ label: 'Code', url: project.github, kind: 'github' })
  if (project.demo) links.push({ label: 'Live demo', url: project.demo, kind: 'demo' })
  for (const link of project.links ?? []) {
    const url = String(link?.url ?? '').trim()
    if (!url) continue
    links.push({ label: String(link?.label ?? '').trim() || 'Link', url, kind: 'extra' })
  }
  return links
}

const byTitle = (direction) => (a, b) =>
  direction * String(a.title ?? '').localeCompare(String(b.title ?? ''), undefined, { sensitivity: 'base' })

/** Returns the projects in the order they should be displayed. */
export function orderedProjects(items = [], sortMode = 'manual') {
  const decorate = (item, index) => ({ item: item ?? {}, index })
  const entries = items.map(decorate)

  const applySort = (list) => {
    if (sortMode === 'title-asc') return [...list].sort(byTitle(1))
    if (sortMode === 'title-desc') return [...list].sort(byTitle(-1))
    return list
  }

  const pinned = applySort(entries.filter((entry) => entry.item.pinned))
  const rest = applySort(entries.filter((entry) => !entry.item.pinned))

  return [...pinned, ...rest].map((entry) => entry.item)
}

export const countPinned = (items = []) => items.filter((item) => item?.pinned).length
