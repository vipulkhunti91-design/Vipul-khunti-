import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { Container } from './Container'

type NavItem = { label: string; hash?: string; href?: string }

const navItems: NavItem[] = [
  { label: 'Case Studies', hash: 'work' },
  { label: 'About', hash: 'about' },
  { label: 'Skills', hash: 'skills' },
  { label: 'Contact', hash: 'contact' },
  ...(site.resume ? [{ label: 'Resume', href: site.resume }] : []),
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [activeHash, setActiveHash] = useState<string>('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [effectsEnabled, setEffectsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('visual-effects')
      if (stored !== null) return stored === 'enabled'
      return false
    }
    return false
  })
  const button = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  // Initialize visual effects attribute on mount
  useEffect(() => {
    if (effectsEnabled) {
      document.documentElement.removeAttribute('data-visual-effects')
    } else {
      document.documentElement.setAttribute('data-visual-effects', 'disabled')
    }
  }, [effectsEnabled])

  // Track scroll exploration progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Highlight active section on home page
  useEffect(() => {
    if (location.pathname !== '/') return

    const handleScrollActive = () => {
      // If at the very top of the page, no section link should be highlighted
      if (window.scrollY < 200) {
        setActiveHash('')
        return
      }

      const sections = ['contact', 'skills', 'about', 'work']
      const viewportMid = window.innerHeight * 0.4
      let found = ''

      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= viewportMid && rect.bottom > 80) {
            found = id
            break
          }
        }
      }
      setActiveHash(found)
    }

    handleScrollActive()
    window.addEventListener('scroll', handleScrollActive, { passive: true })
    return () => window.removeEventListener('scroll', handleScrollActive)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const toggleEffects = () => {
    const next = !effectsEnabled
    setEffectsEnabled(next)
    if (next) {
      document.documentElement.removeAttribute('data-visual-effects')
      localStorage.setItem('visual-effects', 'enabled')
    } else {
      document.documentElement.setAttribute('data-visual-effects', 'disabled')
      localStorage.setItem('visual-effects', 'disabled')
    }
  }

  return (
    <header data-theme="dark" className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md text-fg">
      {/* Exploration progress bar */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading exploration progress"
        className="absolute top-0 left-0 h-[2px] bg-accent transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <Container className="relative flex h-16 items-center justify-between">
        <Link to="/" className="inline-flex min-h-11 items-center font-serif text-2xl tracking-tight">
          {site.name}
        </Link>

        <div className="flex items-center gap-3">
          {/* Visual Effects Toggle */}
          <button
            type="button"
            onClick={toggleEffects}
            aria-label={effectsEnabled ? 'Disable decorative fireflies and lighting' : 'Enable decorative effects'}
            title={effectsEnabled ? 'Disable decorative fireflies' : 'Enable decorative fireflies'}
            className="hidden sm:inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-surface/40 px-3 text-xs text-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus transition-colors"
          >
            <span
              aria-hidden
              className={`size-2 rounded-full ${effectsEnabled ? 'bg-accent' : 'bg-control'}`}
            />
            <span>{effectsEnabled ? 'Fireflies on' : 'Fireflies off'}</span>
          </button>

          <nav aria-label="Primary">
            <button
              ref={button}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(!open)}
              className="min-h-11 rounded-sm border border-control px-4 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {open ? 'Close' : 'Menu'}
            </button>
            <ul
              id="site-menu"
              className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col border-b border-line bg-bg px-5 pb-4 sm:px-8 md:static md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0`}
            >
              {navItems.map((item) => {
                const isActive = activeHash === item.hash
                const key = item.hash ?? item.href ?? item.label
                const className = `nav-reveal-link inline-flex min-h-11 items-center px-3 text-sm rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                  isActive ? 'is-active text-[#F3C879] font-medium' : 'text-muted'
                } ${item.hash === 'contact' ? 'md:ml-2' : ''}`
                const inner = (
                  <span className="nav-reveal-track">
                    <span className="nav-reveal-base">{item.label}</span>
                    <span aria-hidden="true" className="nav-reveal-hover">{item.label}</span>
                  </span>
                )
                return (
                  <li key={key}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={className}
                        aria-current={isActive ? 'location' : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link
                        to={`/#${item.hash}`}
                        onClick={() => setOpen(false)}
                        className={className}
                        aria-current={isActive ? 'location' : undefined}
                      >
                        {inner}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  )
}
