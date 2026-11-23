import { Fragment, Suspense, lazy, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { BentoGrid } from '../components/BentoGrid'
import { ButtonLink } from '../components/ButtonLink'
import { Section } from '../components/Section'
import { bentoSkillItems } from '../data/bentoSkills'
import { site } from '../data/site'

const HorizontalProjects = lazy(() =>
  import('../components/HorizontalProjects').then((m) => ({ default: m.HorizontalProjects }))
)

const words = site.headline.split(' ')

type Greeting = 'Good Morning' | 'Good Afternoon' | 'Good Evening' | 'Good Night'

const getGreeting = (date = new Date()): Greeting => {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 17) return 'Good Afternoon'
  if (hour >= 17 && hour < 21) return 'Good Evening'
  return 'Good Night'
}

const getNextGreetingChange = (date = new Date()) => {
  const next = new Date(date)
  const hour = date.getHours()
  const nextHour = hour < 5 ? 5 : hour < 12 ? 12 : hour < 17 ? 17 : hour < 21 ? 21 : 29
  next.setHours(nextHour, 0, 0, 0)
  return next
}

export function Home() {
  const [copied, setCopied] = useState(false)
  const [greeting, setGreeting] = useState<Greeting>(getGreeting)
  const [greetingChanging, setGreetingChanging] = useState(false)

  // A single boundary-aware timer keeps the greeting current without a render loop.
  useEffect(() => {
    let boundaryTimer: ReturnType<typeof setTimeout>
    let transitionTimer: ReturnType<typeof setTimeout>

    const scheduleGreetingChange = () => {
      const delay = Math.max(0, getNextGreetingChange().getTime() - Date.now())
      boundaryTimer = setTimeout(() => {
        const nextGreeting = getGreeting()
        if (nextGreeting !== greeting) {
          setGreetingChanging(true)
          transitionTimer = setTimeout(() => {
            setGreeting(nextGreeting)
            setGreetingChanging(false)
          }, 180)
        }
        scheduleGreetingChange()
      }, delay)
    }

    scheduleGreetingChange()
    return () => {
      clearTimeout(boundaryTimer)
      clearTimeout(transitionTimer)
    }
  }, [greeting])

  const handleCopyEmail = (emailToCopy: string) => {
    navigator.clipboard.writeText(emailToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    })
  }

  return (
    <>
      {/* 1. HERO / INTRODUCTION */}
      <Section
        id="top"
        theme="dark"
        label="Introduction"
        size="hero"
      >
        <div className="max-w-[44rem]">
            <p className="rise badge-interactive inline-flex min-h-9 items-center gap-2.5 rounded-full border border-line px-4 text-sm bg-surface/50 backdrop-blur-sm cursor-default">
              <span aria-hidden className="availability-dot size-2 rounded-full bg-accent" />
              {site.status}
            </p>
            <p
              aria-live="polite"
              className={`hero-greeting mt-7 text-sm font-medium uppercase tracking-[0.18em] text-accent-text ${greetingChanging ? 'is-changing' : ''}`}
            >
              {greeting}
            </p>
            <h1 className="hero-name mt-3 font-serif text-headline font-normal">
              {words.map((w, i) => (
                <Fragment key={i}>
                  <span
                    className={`word ${site.headlineAccent && w.replace(/[.,]/g, '') === site.headlineAccent ? 'word-accent' : ''}`}
                    style={{ '--i': i } as CSSProperties}
                  >
                    {w}
                  </span>{' '}
                </Fragment>
              ))}
            </h1>
            <p className="hero-role mt-5 text-base font-medium text-accent-text">
              UI/UX Designer
            </p>
            <p className="hero-intro mt-6 max-w-prose text-lg text-muted leading-relaxed">
              {site.intro}
            </p>
            <div className="hero-cta mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/#about" className="transition-all duration-200 hover:shadow-[0_0_22px_rgba(243,200,121,0.35)] hover:-translate-y-0.5">
                Get to Know Me
              </ButtonLink>
              <ButtonLink to="/#work" variant="secondary" className="transition-all duration-200 hover:shadow-[0_0_16px_rgba(243,200,121,0.2)] hover:-translate-y-0.5">
                Explore My Work
              </ButtonLink>
            </div>
        </div>
      </Section>

      {/* 2. SELECTED PROJECTS (Horizontal Storytelling Showcase) */}
      <Suspense
        fallback={
          <section
            id="work"
            data-theme="dark"
            aria-label="Selected Projects"
            className="relative overflow-hidden bg-bg text-fg -mt-8 rounded-t-[2rem] md:-mt-12 md:rounded-t-[3rem] py-20 px-6 min-h-[500px] flex items-center justify-center"
          >
            <div className="text-center">
              <span className="font-serif text-3xl font-normal text-fg">Selected Projects</span>
              <p className="mt-2 text-sm text-muted">Loading storytelling showcase...</p>
            </div>
          </section>
        }
      >
        <HorizontalProjects />
      </Suspense>

      {/* 3. ABOUT ME */}
      <Section id="about" theme="dark" title="About Me" overlap fireflies={{ count: 12, peak: 0.75 }}>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <h3 className="font-serif text-h3 font-normal">My Story</h3>
            <div className="space-y-4 text-muted leading-relaxed">
              {site.aboutParagraphs ? (
                site.aboutParagraphs.map((paragraph, idx) => (
                  <p key={idx} className={idx === 0 ? 'text-lg text-fg/90' : ''}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-lg text-muted leading-relaxed">{site.story}</p>
              )}
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-line bg-surface/50 p-6 md:p-8 backdrop-blur-sm self-start shadow-sm">
            {/* Design Interests */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Design Interests</h4>
                <span className="text-[11px] font-mono text-muted/70">Focus Areas</span>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {site.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-surface/80 px-3 py-1 text-xs font-medium text-fg/90 transition-all duration-200 hover:border-accent/60 hover:bg-accent/10 hover:text-accent hover:scale-105 cursor-default shadow-xs"
                  >
                    <span aria-hidden className="size-1 rounded-full bg-accent" />
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability & Location */}
            <div className="border-t border-line/70 pt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Availability</h4>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent-text border border-accent/25">
                  <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                  Actively Looking
                </span>
              </div>

              <p className="mt-3 text-sm text-fg/90 leading-relaxed">
                Open to UI/UX internship opportunities.
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-muted">
                <div className="flex items-center gap-2.5">
                  <svg className="size-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Based in <strong className="text-fg font-medium">Ahmedabad, Gujarat</strong> (Open to Remote & In-Office)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="size-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  <span>Pursuing <strong className="text-fg font-medium">M.Des in UI/UX Design</strong> at Indus University</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Education */}
        <div className="mt-16 border-t border-line pt-12">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="font-serif text-h3 font-normal text-fg" id="education">
              My Education
            </h3>
            <span className="text-xs uppercase tracking-wider text-muted">Academic Journey</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {site.educationHistory?.map((edu) => (
              <div
                key={edu.number}
                className="group relative flex flex-col justify-between rounded-xl border border-line bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/60 hover:bg-surface/90 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[0_12px_28px_rgba(243,200,121,0.12)] cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl text-muted font-normal group-hover:text-accent group-hover:scale-110 transition-all duration-300">
                      {edu.number}
                    </span>
                    <span className="text-xs font-mono text-muted/80">{edu.period}</span>
                  </div>
                  <h4 className="mt-4 text-base font-semibold text-fg group-hover:text-accent transition-colors duration-200">
                    {edu.degree}
                  </h4>
                  {edu.focus && (
                    <p className="mt-1 text-sm font-semibold text-accent-text">
                      {edu.focus}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted">
                    {edu.institution}
                  </p>
                </div>
                <div className="mt-6 border-t border-line/60 pt-3">
                  <p className="text-xs text-muted/70">
                    {edu.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. SKILLS (Kokonut UI Bento Grid) */}
      <Section
        id="skills"
        theme="dark"
        title="Skills"
        overlap
        fireflies={{ count: 14, peak: 0.75 }}
        spotlight
      >
        <BentoGrid items={bentoSkillItems} />
      </Section>

      {/* 6. CONTACT & FOOTER */}
      <Section
        id="contact"
        theme="dark"
        title="Let's Connect"
        overlap
        fireflies={{ count: 18, peak: 0.95 }}
        spotlight
      >
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h3 className="font-serif text-h2 font-normal">
              Let&apos;s Create Something Meaningful.
            </h3>
            <p className="mt-4 max-w-prose text-lg text-muted leading-relaxed">
              Have an interesting idea, project, or opportunity? I&apos;d love to connect, exchange ideas, and learn something new.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* 1. WhatsApp Button */}
              <ButtonLink
                href="https://wa.me/917096447726"
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                arrow={false}
                className="gap-2.5 transition-all duration-300 hover:shadow-[0_0_24px_rgba(243,200,121,0.35)] hover:-translate-y-0.5"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-4 shrink-0 fill-current"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
              </ButtonLink>

              {/* 2. Email Address Buttons */}
              <ButtonLink
                href={`mailto:${site.email}`}
                variant="secondary"
                arrow={false}
                className="gap-2.5 transition-all duration-300 hover:shadow-[0_0_18px_rgba(243,200,121,0.2)] hover:-translate-y-0.5"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4 shrink-0"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>Send Email</span>
              </ButtonLink>

              <ButtonLink
                onClick={() => handleCopyEmail(site.email!)}
                variant="specular"
                arrow={false}
                className={`gap-2.5 transition-all duration-300 hover:shadow-[0_0_22px_rgba(243,200,121,0.25)] hover:-translate-y-0.5 ${copied ? 'btn-success-state' : ''}`}
              >
                {copied ? (
                  <>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 shrink-0 text-accent"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 shrink-0"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    <span>Copy Email</span>
                  </>
                )}
              </ButtonLink>

              {/* 3. LinkedIn Profile Button */}
              <ButtonLink
                href="https://www.linkedin.com/in/vipul-khunti-2464313a3/"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                arrow={false}
                className="gap-2.5 transition-all duration-300 hover:shadow-[0_0_18px_rgba(243,200,121,0.2)] hover:-translate-y-0.5"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-4 shrink-0 fill-current"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </ButtonLink>

              {/* 4. Instagram Profile Button */}
              <ButtonLink
                href="https://www.instagram.com/mr__vipul__khunti/"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                arrow={false}
                className="gap-2.5 transition-all duration-300 hover:shadow-[0_0_18px_rgba(243,200,121,0.2)] hover:-translate-y-0.5"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4 shrink-0"
                >
                  <rect width="18" height="18" x="3" y="3" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                </svg>
                <span>Instagram</span>
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface/50 p-6 md:p-8 backdrop-blur-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">What I Bring</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="text-accent" aria-hidden>✓</span> End-to-end design from research to high-fidelity UI
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent" aria-hidden>✓</span> User research, surveys, interviews and usability testing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent" aria-hidden>✓</span> Wireframing and prototyping in Figma
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent" aria-hidden>✓</span> Open to remote and in-office UI/UX internships
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}
