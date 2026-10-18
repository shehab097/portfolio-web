import { useEffect, useState } from 'preact/hooks'

/**
 * Minimal history-based router (no dependency needed for 3 routes).
 * Vite's dev server + `vite preview` already fall back to index.html for
 * unknown paths, which is what makes deep links like /login work.
 */

const NAVIGATION_EVENT = 'portfolio:navigate'

const currentPath = () => {
  if (typeof window === 'undefined') return '/'
  const path = window.location.pathname || '/'
  return path.length > 1 ? path.replace(/\/+$/, '') || '/' : path
}

export function navigate(to, { replace = false } = {}) {
  if (typeof window === 'undefined') return
  if (currentPath() === to) {
    window.dispatchEvent(new Event(NAVIGATION_EVENT))
    return
  }
  if (replace) window.history.replaceState({}, '', to)
  else window.history.pushState({}, '', to)
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

/** Subscribes to the current pathname. */
export function useRoute() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const update = () => setPath(currentPath())
    window.addEventListener('popstate', update)
    window.addEventListener(NAVIGATION_EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(NAVIGATION_EVENT, update)
    }
  }, [])

  return path
}

/**
 * Turns plain `<a href="/login">` into client-side navigation so the app never
 * reloads. Hash links (#projects), external links and new-tab links are left
 * to the browser.
 */
export function useLinkInterception() {
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = event.target?.closest?.('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || anchor.hasAttribute('download')) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.dataset.native === 'true') return

      const url = new URL(anchor.href, window.location.origin)
      if (url.origin !== window.location.origin) return

      event.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
