import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { featuredProjects, type Project } from '../data/projects'
import { Cover } from './Cover'
import { Fireflies } from './Fireflies'
import { Tag } from './Tag'

export function HorizontalProjects() {
  const triggerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  const [currentProjectIndex, setCurrentProjectIndex] = useState(1)
  const [isDesktop, setIsDesktop] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Detect screen size & reduced motion
  useEffect(() => {
    const checkMedia = () => {
      const desktopQuery = window.matchMedia('(min-width: 768px)')
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setIsDesktop(desktopQuery.matches)
      setReducedMotion(motionQuery.matches)
    }

    checkMedia()
    window.addEventListener('resize', checkMedia)
    return () => window.removeEventListener('resize', checkMedia)
  }, [])

  // Desktop / Tablet GSAP ScrollTrigger horizontal scroll - loaded dynamically on demand
  useEffect(() => {
    if (!isDesktop || reducedMotion) return

    let isMounted = true
    let cleanup: (() => void) | undefined

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (!isMounted) return

        gsap.registerPlugin(ScrollTrigger)

        const trigger = triggerRef.current
        const track = trackRef.current
        if (!trigger || !track) return

        const ctx = gsap.context(() => {
          const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 80)

          const tween = gsap.to(track, {
            x: getScrollAmount,
            ease: 'none',
            scrollTrigger: {
              id: 'projects-horizontal-scroll',
              trigger: trigger,
              pin: true,
              scrub: 0.8,
              start: 'top top',
              end: () => `+=${Math.max(track.scrollWidth - window.innerWidth + 600, 1400)}`,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                if (progressFillRef.current) {
                  progressFillRef.current.style.width = `${Math.min(100, Math.max(0, self.progress * 100))}%`
                }
                const total = featuredProjects.length
                let activeIdx = 1
                if (self.progress > 0.1) {
                  const projectProgress = (self.progress - 0.1) / 0.9
                  activeIdx = Math.min(total, Math.max(1, Math.floor(projectProgress * total) + 1))
                }
                setCurrentProjectIndex(activeIdx)
              },
            },
          })

          // Phase 10.2: Project Reveal Animations synchronized with horizontal container scroll
          const panels = gsap.utils.toArray<HTMLElement>('.project-panel')
          panels.forEach((panel) => {
            const visual = panel.querySelector('.project-panel-visual')
            const title = panel.querySelector('.project-panel-title')
            const desc = panel.querySelector('.project-panel-desc')

            if (visual) {
              gsap.from(visual, {
                scale: 0.96,
                opacity: 0.7,
                duration: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: tween,
                  start: 'left 85%',
                  toggleActions: 'play none none none',
                },
              })
            }

            if (title) {
              gsap.from(title, {
                y: 14,
                opacity: 0.5,
                duration: 0.4,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: tween,
                  start: 'left 85%',
                  toggleActions: 'play none none none',
                },
              })
            }

            if (desc) {
              gsap.from(desc, {
                y: 8,
                opacity: 0.6,
                duration: 0.4,
                delay: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: tween,
                  start: 'left 85%',
                  toggleActions: 'play none none none',
                },
              })
            }
          })

          return () => {
            tween.kill()
          }
        }, trigger)

        const timer = setTimeout(() => {
          ScrollTrigger.refresh()
        }, 200)

        cleanup = () => {
          clearTimeout(timer)
          ctx.revert()
        }
      }
    )

    return () => {
      isMounted = false
      if (cleanup) cleanup()
    }
  }, [isDesktop, reducedMotion])

  // Track mobile scroll position for indicator dots
  const handleMobileScroll = () => {
    const el = mobileScrollRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / (el.clientWidth * 0.85)) + 1
    setCurrentProjectIndex(Math.min(featuredProjects.length, Math.max(1, index)))
  }

  // Smooth keyboard navigation within the horizontal showcase
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      goToProject(Math.min(featuredProjects.length, currentProjectIndex + 1))
    } else if (e.key === 'ArrowLeft') {
      goToProject(Math.max(1, currentProjectIndex - 1))
    }
  }

  const goToProject = (targetIndex: number) => {
    if (!isDesktop || reducedMotion) {
      const el = mobileScrollRef.current
      if (el) {
        const targetCard = el.children[targetIndex - 1] as HTMLElement
        if (targetCard) {
          el.scrollTo({ left: targetCard.offsetLeft - 16, behavior: 'smooth' })
        }
      }
      return
    }

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      const st = ScrollTrigger.getById('projects-horizontal-scroll')
      if (st) {
        const total = featuredProjects.length
        // Approximate progress mapping for target project
        const targetProgress = 0.12 + ((targetIndex - 1) / total) * 0.88
        const targetScroll = st.start + targetProgress * (st.end - st.start)
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
      }
    })
  }

  return (
    <section
      id="work"
      data-theme="dark"
      aria-label="Selected Projects"
      className="relative overflow-hidden bg-bg text-fg -mt-8 rounded-t-[2rem] md:-mt-12 md:rounded-t-[3rem]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
    >
      <Fireflies count={6} peak={0.35} />

      {/* DESKTOP & TABLET: Pin & Horizontal Scroll */}
      {isDesktop && !reducedMotion ? (
        <div ref={triggerRef} className="relative h-screen overflow-hidden flex flex-col justify-between pt-16 pb-8">
          {/* Header bar with position and progress */}
          <div className="container mx-auto px-6 md:px-12 flex items-center justify-between border-b border-line/60 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-normal text-fg">Selected Projects</span>
              <span className="text-xs uppercase tracking-wider text-muted/70">
                Storytelling Showcase
              </span>
            </div>

            {/* Horizontal progress indicator & navigation controls */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-muted">
                  {String(currentProjectIndex).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
                </span>
                <div
                  className="w-28 sm:w-36 md:w-44 h-1.5 rounded-full bg-line overflow-hidden"
                  role="progressbar"
                  aria-valuenow={currentProjectIndex}
                  aria-valuemin={1}
                  aria-valuemax={featuredProjects.length}
                  aria-label="Projects horizontal progress"
                >
                  <div
                    ref={progressFillRef}
                    className="h-full bg-accent transition-all duration-75 ease-out rounded-full"
                    style={{ width: `${(currentProjectIndex / featuredProjects.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Arrow navigation buttons with equal, balanced spacing and clean SVG icons */}
              <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-line/60">
                <button
                  type="button"
                  onClick={() => goToProject(Math.max(1, currentProjectIndex - 1))}
                  disabled={currentProjectIndex === 1}
                  aria-label="Previous project"
                  className="group size-10 rounded-full border border-line bg-surface/80 flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_12px_rgba(244,215,119,0.25)] disabled:opacity-25 disabled:pointer-events-none transition-all duration-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => goToProject(Math.min(featuredProjects.length, currentProjectIndex + 1))}
                  disabled={currentProjectIndex === featuredProjects.length}
                  aria-label="Next project"
                  className="group size-10 rounded-full border border-line bg-surface/80 flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/10 hover:shadow-[0_0_12px_rgba(244,215,119,0.25)] disabled:opacity-25 disabled:pointer-events-none transition-all duration-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Track of Large Distinct Panels */}
          <div className="flex-1 flex items-center overflow-visible my-auto">
            <div ref={trackRef} className="flex items-center gap-8 md:gap-12 pl-6 md:pl-12 pr-24 will-change-transform">
              {/* Intro Context Panel */}
              <div className="w-[320px] md:w-[380px] shrink-0 p-8 rounded-3xl border border-line bg-surface/80 backdrop-blur-sm flex flex-col justify-between h-[520px] md:h-[580px]">
                <div>
                  <span className="text-xs uppercase font-semibold tracking-wider text-muted">
                    Curated Case Studies
                  </span>
                  <h2 className="mt-4 font-serif text-4xl md:text-5xl font-normal leading-tight text-fg">
                    Designing with purpose.
                  </h2>
                  <p className="mt-6 text-sm md:text-base text-muted leading-relaxed">
                    A selection of projects where I explore ideas, understand user needs, and turn problems into simple and useful digital experiences.
                  </p>
                </div>

                <div className="pt-6 border-t border-line/60">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="inline-block animate-pulse text-accent">●</span>
                    <span>Scroll vertically to explore panels</span>
                    <span aria-hidden className="text-muted/60">→</span>
                  </div>
                </div>
              </div>

              {/* Project Storytelling Panels */}
              {featuredProjects.map((p, index) => (
                <ProjectPanel key={p.slug} project={p} index={index + 1} total={featuredProjects.length} />
              ))}
            </div>
          </div>

          {/* Subtle bottom hint */}
          <div className="container mx-auto px-6 md:px-12 flex items-center justify-between text-xs text-muted/70 shrink-0">
            <span>Use trackpad, mouse wheel, or ← → keys</span>
            <span>Scrolling past the last panel continues downward</span>
          </div>
        </div>
      ) : (
        /* MOBILE & REDUCED MOTION: Touch-friendly horizontal swiping */
        <div className="py-16 px-4 sm:px-6">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="font-serif text-3xl font-normal text-fg">Selected Projects</h2>
            <p className="text-sm text-muted">
              Swipe horizontally to explore mobile case studies and UI systems.
            </p>
          </div>

          {/* Touch horizontal swipe container */}
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none -mx-4 px-4"
          >
            {featuredProjects.map((p, index) => (
              <div
                key={p.slug}
                className="w-[86vw] max-w-[360px] shrink-0 snap-center rounded-2xl border border-line bg-surface/90 p-5 shadow-lg shadow-black/20 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-accent/40"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted mb-3">
                    <span className="font-mono font-semibold">
                      {String(index + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
                    </span>
                    <span className="uppercase tracking-wider text-[11px] text-muted">{p.category}</span>
                  </div>

                  <Link to={`/work/${p.slug}`} className="block group">
                    <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4 transition-transform duration-500 group-hover:scale-[1.02] flex items-center justify-center">
                      <Cover cover={p.cover} objectFit="contain" className="w-full h-full border-none shadow-none bg-transparent" />
                    </div>
                    <h3 className="font-serif text-2xl font-normal text-fg group-hover:text-accent transition-colors">
                      {p.name}
                    </h3>
                  </Link>

                  <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-3">
                    {p.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.tags.slice(0, 2).map((t) => (
                      <span key={t} className="rounded-full bg-surface border border-line/60 px-2.5 py-0.5 text-[10px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-line/40 flex items-center justify-between">
                    <Link
                      to={`/work/${p.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                    >
                      <span>View Case Study</span>
                      <span aria-hidden>→</span>
                    </Link>
                    <span className="text-[10px] text-muted">{p.previewLabel}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Mobile Dot Navigation */}
          <div className="flex justify-center items-center gap-1.5 mt-2">
            {featuredProjects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                aria-label={`Jump to project ${i + 1}`}
                onClick={() => goToProject(i + 1)}
                className="flex size-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span
                  aria-hidden
                  className={`h-1.5 rounded-full transition-all ${
                    currentProjectIndex === i + 1 ? 'w-6 bg-accent' : 'w-1.5 bg-line'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function ProjectPanel({
  project,
  index,
  total,
}: {
  project: Project
  index: number
  total: number
}) {
  return (
    <article
      aria-label={`${project.name} project showcase`}
      className="project-panel w-[82vw] max-w-[1080px] shrink-0 h-[520px] md:h-[580px] rounded-3xl border border-line bg-surface/90 backdrop-blur-md p-6 sm:p-8 md:p-10 shadow-xl shadow-black/30 flex flex-col md:flex-row gap-8 justify-between items-stretch transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
    >
      {/* Left Column: Editorial Information */}
      <div className="w-full md:w-[46%] flex flex-col justify-center">
        <div>
          {/* Index & Category */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
              {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')} &bull; {project.category}
            </span>
            {project.namePending && (
              <span className="text-[11px] text-muted rounded-full border border-line px-2.5 py-0.5">
                Name pending
              </span>
            )}
          </div>

          {/* Project Title */}
          <Link to={`/work/${project.slug}`} className="block group mt-4">
            <h3 className="project-panel-title font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-fg leading-tight transition-colors group-hover:text-accent">
              {project.name}
            </h3>
          </Link>

          {/* Project Summary */}
          <p className="project-panel-desc mt-3 text-sm md:text-base text-muted leading-relaxed line-clamp-3 md:line-clamp-4">
            {project.summary}
          </p>

          {/* Tags */}
          {project.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </ul>
          )}

          {/* View Case Study Button - Cleanly positioned right below tags */}
          <div className="mt-7">
            <Link
              to={`/work/${project.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-xs font-semibold text-accent transition-all duration-200 hover:bg-accent hover:text-on-accent hover:shadow-[0_0_16px_rgba(244,215,119,0.35)]"
            >
              <span>View Case Study</span>
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Showcase Frame */}
      <div className="project-panel-visual w-full md:w-[54%] flex items-center justify-center relative overflow-hidden rounded-2xl bg-surface/50 p-4 md:p-6 border border-line/60 group/visual">
        <Link
          to={`/work/${project.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Main Cover Banner */}
          <div className="relative w-full max-w-[540px] aspect-[16/9] rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover/visual:scale-[1.02] flex items-center justify-center">
            <Cover cover={project.cover} objectFit="contain" className="w-full h-full border-none shadow-none bg-transparent" />
          </div>


          <div className="absolute bottom-3 left-3 rounded-full bg-surface/90 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-muted border border-line">
            {project.previewLabel} &bull; Open Interactive Case Study
          </div>
        </Link>
      </div>
    </article>
  )
}
