import { useEffect, useState } from 'preact/hooks'
import './app.css'
import { AuthProvider } from './lib/auth'
import { ContentProvider, useContent } from './lib/content'
import { useLinkInterception, useRoute } from './lib/router'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <Shell />
      </ContentProvider>
    </AuthProvider>
  )
}

function Shell() {
  const path = useRoute()
  useLinkInterception()

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('portfolio-theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  return (
    <Routes path={path} theme={theme} onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
  )
}

function Routes({ path, theme, onToggleTheme }) {
  const { content } = useContent()

  // Keep <title> and the meta description in sync with the editable content.
  useEffect(() => {
    if (content.site?.title) document.title = content.site.title
    if (content.site?.description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content.site.description)
    }
  }, [content.site?.title, content.site?.description])

  switch (path) {
    case '/':
      return <Home theme={theme} onToggleTheme={onToggleTheme} />
    case '/login':
      return <Login />
    case '/admin':
      return <Admin />

    default:
      return <NotFound path={path} />
  }
}
