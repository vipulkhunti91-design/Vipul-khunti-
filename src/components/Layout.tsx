import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BackToTop } from './BackToTop'
import { Footer } from './Footer'
import { FireflyCursor } from './FireflyCursor'
import { Nav } from './Nav'

// The router does not scroll for us: jump to the hash target, or to the top.
// Moving between sections of the same page scrolls smoothly; changing page jumps.
function ScrollToTarget() {
  const { pathname, hash } = useLocation()
  const lastPath = useRef<string | undefined>(undefined)
  useEffect(() => {
    const samePage = lastPath.current === pathname
    lastPath.current = pathname
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior = samePage && !calm ? 'smooth' : 'instant'
    if (hash) {
      // Small timeout ensures DOM elements (especially lazy loaded horizontal track) are ready
      setTimeout(() => {
        const target = document.getElementById(hash.slice(1))
        if (target) {
          target.scrollIntoView({ behavior, block: 'start' })
        }
      }, 50)
    } else {
      window.scrollTo({ top: 0, behavior })
    }
  }, [pathname, hash])
  return null
}

export function Layout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-sm bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:inline-flex focus:min-h-11 focus:items-center"
      >
        Skip to content
      </a>
      <ScrollToTarget />
      <FireflyCursor />
      <Nav />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
