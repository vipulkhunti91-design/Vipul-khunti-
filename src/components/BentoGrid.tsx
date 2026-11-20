import type { ReactNode } from 'react'

export interface BentoSkill {
  name: string
  tag?: string
  icon?: ReactNode
}

export interface BentoItem {
  id: string
  title: string
  meta: string
  badge: string
  description: string
  icon: ReactNode
  skills: BentoSkill[]
  colSpan?: 1 | 2
  categoryNumber: string
  tags?: string[]
  cta?: string
}

export interface BentoGridProps {
  items: BentoItem[]
  className?: string
}

export function BentoGrid({ items, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 ${className}`}
    >
      {items.map((item) => {
        const isWide = item.colSpan === 2
        return (
          <div
            key={item.id}
            className={`group relative flex flex-col justify-between rounded-2xl border border-line bg-surface/80 p-6 md:p-7 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-[0_8px_30px_rgba(243,200,121,0.08)] ${
              isWide ? 'md:col-span-2' : 'md:col-span-1'
            }`}
          >
            {/* Kokonut UI Signature: Subtle Dot Grid overlay on hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(243,200,121,0.06)_1px,transparent_1px)] bg-[length:6px_6px]" />
            </div>

            {/* Kokonut UI Signature: Subtle gradient border on hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-accent/25 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />

            {/* Content Top */}
            <div className="relative z-10">
              {/* Card Header: Icon + Number + Title + Status Badge */}
              <div className="flex items-start justify-between gap-4 border-b border-line/60 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="size-10 rounded-xl flex items-center justify-center border border-line bg-bg/80 text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-xs font-mono text-muted/80">
                        {item.categoryNumber}
                      </span>
                      <h3 className="font-serif text-xl md:text-2xl font-normal text-fg tracking-tight group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted font-mono mt-0.5">
                      {item.meta}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full border border-line/80 bg-bg px-2.5 py-1 text-[11px] font-medium font-mono text-muted group-hover:border-accent/30 group-hover:text-fg transition-colors">
                  {item.badge}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-muted leading-relaxed">
                {item.description}
              </p>

              {/* Skills Badges / Chips Grid */}
              <div
                className={`mt-5 ${
                  isWide
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5'
                    : 'flex flex-col gap-2.5'
                }`}
              >
                {item.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group/skill flex items-center justify-between gap-3 rounded-xl border border-line/70 bg-bg/70 px-3.5 py-2.5 text-sm text-fg transition-all duration-200 hover:border-accent/60 hover:bg-surface hover:scale-[1.01] hover:shadow-[0_0_12px_rgba(243,200,121,0.1)]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {skill.icon && (
                        <div className="shrink-0 size-4 flex items-center justify-center">
                          {skill.icon}
                        </div>
                      )}
                      <span className="font-medium truncate text-fg/95">
                        {skill.name}
                      </span>
                    </div>

                    {skill.tag && (
                      <span className="shrink-0 text-[11px] font-mono text-muted/70 group-hover/skill:text-accent transition-colors">
                        {skill.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Kokonut UI Signature: Card Footer with Tags & Hover Action */}
            <div className="relative z-10 mt-6 pt-4 border-t border-line/50 flex items-center justify-between text-xs text-muted">
              <div className="flex items-center flex-wrap gap-1.5">
                {item.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-bg/60 border border-line/40 text-[10px] font-mono text-muted/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-[11px] font-mono text-muted/70 group-hover:text-accent transition-colors flex items-center gap-1">
                {item.cta || 'Active Skills'}
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
