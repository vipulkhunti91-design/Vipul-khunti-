import { useEffect, useState } from 'react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 350px
      if (window.scrollY > 350) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`group fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full border border-line bg-surface/90 text-fg shadow-lg backdrop-blur-md transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto hover:-translate-y-1 hover:scale-110 hover:border-accent hover:text-accent hover:shadow-[0_0_24px_rgba(243,200,121,0.35)]'
          : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
