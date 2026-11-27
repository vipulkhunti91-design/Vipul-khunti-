import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ButtonLink } from '../components/ButtonLink'
import { CaseStudyBlocks } from '../components/CaseStudyBlocks'
import { Section } from '../components/Section'
import { Tag } from '../components/Tag'
import { getNextProject, getProject } from '../data/projects'
import { NotFound } from './NotFound'

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const project = getProject(slug)
  const nextProject = getNextProject(slug)
  const titleRef = useRef<HTMLHeadingElement>(null)

  // Scroll to top on navigation & SplitText Scatter for Case Study Title
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!project) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (calm) return

    let ctx: { revert: () => void } | undefined

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
    ]).then(([{ default: gsap }, { ScrollTrigger }, { SplitText }]) => {
      gsap.registerPlugin(ScrollTrigger, SplitText)

      ctx = gsap.context(() => {
        // Character/word-level scatter for main Case Study Title (h1)
        if (titleRef.current) {
          const split = new SplitText(titleRef.current, { type: 'chars,words' })
          gsap.from(split.chars, {
            duration: 0.8,
            opacity: 0,
            x: () => (Math.random() - 0.5) * 18,
            y: () => (Math.random() - 0.5) * 14 + 6,
            rotation: () => (Math.random() - 0.5) * 10,
            stagger: 0.02,
            ease: 'power3.out',
          })
        }
      })
    })

    return () => {
      if (ctx) ctx.revert()
    }
  }, [slug, project])

  if (!project) return <NotFound />

  const { caseStudy } = project

  return (
    <>
      {/* HERO */}
      <Section
        id="case-study-hero"
        theme="dark"
        label={`${project.name} case study`}
        size="hero"
        fireflies={{ count: 14, peak: 0.6 }}
        spotlight
        beam
      >
        <title>{`${project.name} | Vipul Khunti UI/UX Case Study`}</title>
        <ButtonLink
          to="/#work"
          variant="secondary"
          arrow={false}
          className="inline-flex items-center gap-2"
        >
          &larr; Back to Selected Projects
        </ButtonLink>

        <div className={`mt-8 ${project.previewVideo ? 'grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] lg:items-end' : 'max-w-4xl'}`}>
          <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-muted">{project.category}</span>
            <span className="text-muted/60">•</span>
            <span className="text-xs uppercase tracking-wider text-muted">UX Case Study</span>
            {project.namePending && (
              <span className="rounded-full border border-control/50 px-2.5 py-0.5 text-xs text-muted">
                Working title
              </span>
            )}
          </div>

          <h1
            key={slug}
            ref={titleRef}
            aria-label={project.name}
            className="mt-4 font-serif text-h1 font-normal leading-tight"
          >
            {project.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted md:text-xl leading-relaxed">{project.summary}</p>

          {project.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </ul>
          )}
          </div>

          {project.previewVideo && (
            <aside className="overflow-hidden rounded-2xl border border-line bg-surface/70 p-3 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-xs font-semibold text-fg">
                  <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
                  Prototype walkthrough
                </span>
                <span className="font-mono text-[10px] tracking-wide text-muted">03:20</span>
              </div>
              <video
                className="aspect-video w-full rounded-xl bg-bg object-contain"
                controls
                playsInline
                preload="metadata"
                poster={project.cover?.src}
                aria-label={`${project.name} prototype walkthrough video`}
              >
                <source src={project.previewVideo} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </aside>
          )}
        </div>

        <div className="mt-14 grid gap-6 rounded-2xl border border-line bg-surface/50 p-6 sm:grid-cols-2 lg:grid-cols-4 backdrop-blur-sm">
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-muted">My Role</p>
            <p className="mt-1 font-medium">{caseStudy.overview.role}</p>
          </div>
          {caseStudy.overview.timeline && (
            <div>
              <p className="text-xs uppercase font-semibold tracking-wider text-muted">Timeline</p>
              <p className="mt-1 font-medium">{caseStudy.overview.timeline}</p>
            </div>
          )}
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-muted">Platform</p>
            <p className="mt-1 font-medium">{caseStudy.overview.platform}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-muted">Disciplines</p>
            <p className="mt-1 text-sm">{caseStudy.overview.discipline.join(', ')}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold tracking-wider text-muted">Semester</p>
            <p className="mt-1 text-sm">{project.semester}</p>
          </div>
        </div>
      </Section>

      {/* CONTENT */}
      <Section id="case-study-content" theme="dark" overlap reveal={false} fireflies={{ count: 10, peak: 0.6 }}>
        <div className="grid gap-16 lg:grid-cols-[240px_1fr]">
          <nav aria-label="Case Study Section Index" className="hidden lg:block">
            <div className="sticky top-28 space-y-2.5 border-l border-line pl-4 text-xs">
              <p className="font-semibold uppercase tracking-wider text-fg mb-4">On this page</p>
              {caseStudy.sections.map((s, i) => (
                <a key={s.id} href={`#${s.id}`} className="block text-muted hover:text-fg transition-colors">
                  {String(i + 1).padStart(2, '0')}. {s.title}
                </a>
              ))}
            </div>
          </nav>

          <article className="space-y-16">
            {caseStudy.sections.map((section, i) => (
              <div
                key={section.id}
                id={section.id}
                className={`case-study-section space-y-6 ${i > 0 ? 'border-t border-line pt-12' : ''}`}
              >
                <div className="flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-muted">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span>/</span>
                </div>
                <h2 className="font-serif text-h2 font-normal">{section.title}</h2>
                <CaseStudyBlocks blocks={section.blocks} />
              </div>
            ))}

            <div className="border-t border-line pt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
              <ButtonLink to="/#work" variant="secondary" arrow={false}>
                &larr; Back to Selected Projects
              </ButtonLink>
              {nextProject && (
                <ButtonLink to={`/work/${nextProject.slug}`} variant="primary">
                  Next Project: {nextProject.name} &rarr;
                </ButtonLink>
              )}
            </div>
          </article>
        </div>
      </Section>
    </>
  )
}
