import type { ReactNode } from 'react'
import { Container } from './Container'
import { Fireflies } from './Fireflies'

type Props = {
  id: string
  theme: 'dark' | 'light'
  title?: string // renders the h2; without it, pass a label for the landmark name
  label?: string
  size?: 'default' | 'hero'
  overlap?: boolean // rounded top edge that rises over the section above it
  fireflies?: { count: number; peak: number }
  spotlight?: boolean // soft mouse-following light, driven by FireflyCursor
  beam?: boolean // soft vertical golden light beam
  reveal?: boolean // allow opting out of scroll-driven entry animation
  children: ReactNode
}

export function Section({
  id,
  theme,
  title,
  label,
  size = 'default',
  overlap,
  fireflies,
  spotlight,
  beam,
  reveal: allowReveal = true,
  children,
}: Props) {
  const padding = size === 'hero' ? 'pt-24 pb-28 md:pt-36 md:pb-44' : 'py-20 md:py-28'
  const reveal = size !== 'hero' && allowReveal ? 'reveal' : ''
  const edge = overlap
    ? `-mt-8 rounded-t-[2rem] md:-mt-12 md:rounded-t-[3rem] ${theme === 'dark' ? 'edge-glow' : ''}`
    : ''
  return (
    <section
      id={id}
      data-theme={theme}
      aria-labelledby={title ? `${id}-title` : undefined}
      aria-label={title ? undefined : label}
      className={`relative overflow-hidden bg-bg text-fg ${edge}`}
    >
      {beam && <div aria-hidden className="beam pointer-events-none absolute inset-y-0" />}
      {fireflies && <Fireflies {...fireflies} />}
      {spotlight && <div aria-hidden data-spotlight className="spotlight pointer-events-none absolute inset-0" />}
      <Container className={`relative ${padding}`}>
        {title && (
          <h2 id={`${id}-title`} className={`${reveal} font-serif text-h2 font-normal`}>
            {title}
          </h2>
        )}
        <div className={`${reveal} ${title ? 'mt-10 md:mt-14' : ''}`}>{children}</div>
      </Container>
    </section>
  )
}
