import { useEffect, useRef, useState } from 'react'
import type { Block, Shot } from '../data/projects'
import { ShotImg } from './Shot'

// Renders a case-study section's content blocks. Keeping this generic lets each project
// show only the sections it actually has (no "Pending" placeholders for work not done yet).
export function CaseStudyBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  )
}

function StatCard({ stat }: { stat: { value: string; label: string } }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [displayValue, setDisplayValue] = useState(stat.value)

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (calm) return

    // Parse stat value into prefix, number, suffix
    const match = stat.value.match(/^([^0-9.]*)([0-9.]+)(.*)$/)
    if (!match) return

    const prefix = match[1] || ''
    const targetNum = parseFloat(match[2])
    const suffix = match[3] || ''
    const isDecimal = match[2].includes('.')
    const decimals = isDecimal ? match[2].split('.')[1]?.length || 0 : 0

    if (isNaN(targetNum)) return

    let ctx: { revert: () => void } | undefined

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          if (!cardRef.current) return

          const proxy = { val: 0 }
          gsap.to(proxy, {
            val: targetNum,
            duration: 0.78, // under 800ms
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 88%',
              once: true,
            },
            onUpdate: () => {
              const currentFormatted = isDecimal
                ? proxy.val.toFixed(decimals)
                : Math.round(proxy.val).toString()
              setDisplayValue(`${prefix}${currentFormatted}${suffix}`)
            },
            onComplete: () => {
              setDisplayValue(stat.value)
            },
          })
        }, cardRef)
      }
    )

    return () => {
      if (ctx) ctx.revert()
    }
  }, [stat.value])

  return (
    <div ref={cardRef} className="group rounded-xl border border-line bg-surface p-5 shadow-sm transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-[0_8px_20px_rgba(244,215,119,0.1)]">
      <p aria-label={stat.value} className="font-serif text-3xl font-normal text-fg group-hover:text-accent transition-colors">
        {displayValue}
      </p>
      <p className="mt-1 text-xs text-muted leading-relaxed">{stat.label}</p>
    </div>
  )
}

function ScreensGrid({ items, captions }: { items: Shot[]; captions?: string[] }) {
  return (
    <div className="case-screens-grid grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((shot, i) => (
        <div key={i} className="case-screen-card flex flex-col">
          <ShotImg shot={shot} className="aspect-[9/19.5] w-full" />
          {captions?.[i] && (
            <p className="mt-2.5 text-xs font-medium text-fg/85 leading-snug">
              {captions[i]}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p className="max-w-prose text-base md:text-lg text-fg/90 leading-relaxed font-normal">{block.text}</p>

    case 'quote':
      return (
        <div className="rounded-2xl border border-line bg-surface p-6 md:p-8 shadow-sm">
          {block.label && <span className="text-xs uppercase font-semibold tracking-wider text-muted">{block.label}</span>}
          <p className="mt-2 font-serif text-xl md:text-2xl font-normal text-fg italic leading-snug">&ldquo;{block.text}&rdquo;</p>
        </div>
      )

    case 'list':
      return (
        <div>
          {block.title && <h3 className="text-sm font-semibold uppercase tracking-wider text-fg/80 mb-3">{block.title}</h3>}
          <ul className="space-y-2.5">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-fg/85">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'stats':
      return (
        <div>
          {block.title && <h3 className="text-sm font-semibold uppercase tracking-wider text-fg/80 mb-3">{block.title}</h3>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {block.items.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </div>
          {block.note && <p className="mt-3 text-xs text-muted">{block.note}</p>}
        </div>
      )

    case 'cards':
      return (
        <div>
          {block.title && <h3 className="text-sm font-semibold uppercase tracking-wider text-fg/80 mb-3">{block.title}</h3>}
          <div className={`grid gap-4 ${block.cols === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {block.items.map((c, i) => (
              <div key={i} className="rounded-xl border border-line bg-surface p-5 shadow-sm transition-all duration-300 hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-sm font-semibold text-fg">{c.title}</p>
                <p className="mt-2 text-sm text-fg/80 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'steps':
      return (
        <div>
          {block.title && <h3 className="text-sm font-semibold uppercase tracking-wider text-fg/80 mb-3">{block.title}</h3>}
          <ol className="flex flex-wrap gap-3">
            {block.items.map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="rounded-full border border-line bg-surface px-4 py-2 text-sm shadow-sm transition-all duration-200 hover:border-accent/40 hover:scale-105 cursor-default">
                  <span className="mr-1.5 text-accent-text font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-medium text-fg">{step.title}</span>
                  {step.text && <span className="ml-1.5 text-muted">— {step.text}</span>}
                </div>
                {i < block.items.length - 1 && <span aria-hidden className="text-muted/60">→</span>}
              </li>
            ))}
          </ol>
        </div>
      )

    case 'persona':
      return (
        <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <p className="font-serif text-xl font-normal text-fg">{block.name}</p>
            <p className="text-xs uppercase tracking-wider text-muted font-medium">{block.role}</p>
          </div>
          <ul className="mt-3 space-y-1.5">
            {block.facts.map((f, i) => (
              <li key={i} className="text-sm text-fg/85 leading-relaxed">
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 border-t border-line/60 pt-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-fg/80 mb-2">Frustrations</p>
              <ul className="space-y-1.5">
                {block.frustrations.map((f, i) => (
                  <li key={i} className="text-sm text-muted leading-relaxed">
                    · {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-fg/80 mb-2">Goals</p>
              <ul className="space-y-1.5">
                {block.goals.map((g, i) => (
                  <li key={i} className="text-sm text-muted leading-relaxed">
                    · {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )

    case 'screens':
      return (
        <div>
          {block.title && <h3 className="text-sm font-semibold uppercase tracking-wider text-fg/80 mb-3">{block.title}</h3>}
          {block.label && <p className="mb-4 text-xs uppercase tracking-wider text-muted font-medium">{block.label}</p>}
          <ScreensGrid items={block.items} captions={block.captions} />
        </div>
      )

    case 'palette':
      return (
        <div>
          {block.title && <h3 className="text-sm font-semibold uppercase tracking-wider text-fg/80 mb-3">{block.title}</h3>}
          <div className="flex flex-wrap gap-4">
            {block.colors.map((c) => (
              <div key={c.hex} className="flex items-center gap-2.5">
                <span className="size-7 rounded-md border border-line shrink-0 shadow-sm" style={{ backgroundColor: c.hex }} />
                <div className="text-xs">
                  <p className="font-medium text-fg">{c.name}</p>
                  <p className="text-muted font-mono text-[11px]">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
          {block.note && <p className="mt-3 text-xs text-muted">{block.note}</p>}
        </div>
      )

    case 'links':
      return (
        <ul className="flex flex-wrap gap-3">
          {block.items.map((link, i) => (
            <li key={i}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-control px-5 text-sm font-medium text-fg hover:border-fg transition-colors"
              >
                {link.label} <span aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
      )
  }
}
