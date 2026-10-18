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
  image: '',
  video: '',
  pinned: false,
}

export const createEmptyProject = () => ({ ...DEFAULT_PROJECT, tech: [] })

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
