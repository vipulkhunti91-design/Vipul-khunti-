import { useMemo } from 'react'
import type { CSSProperties } from 'react'

// Deterministic pseudo-random in [0, 1): same dots on every render, no Math.random.
const rand = (i: number, k: number) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
  return v - Math.floor(v)
}

// Decorative ambient layer. Pure CSS animation, so no JS runs after mount.
// peak: 0-1 brightness cap (high on dark sections, very low on light ones).
export function Fireflies({ count, peak }: { count: number; peak: number }) {
  const dots = useMemo(
    () =>
      Array.from(
        { length: count },
        (_, i) =>
          ({
            '--x': `${rand(i, 1) * 100}%`,
            '--y': `${rand(i, 2) * 100}%`,
            '--s': `${2 + rand(i, 3) * 3}px`,
            '--t': `${8 + rand(i, 4) * 8}s`,
            '--d': `-${rand(i, 5) * 16}s`,
            '--dx': `${(rand(i, 6) - 0.5) * 120}px`,
            '--dy': `${(rand(i, 7) - 0.65) * 110}px`,
          }) as CSSProperties,
      ),
    [count],
  )
  return (
    <div
      aria-hidden
      className="firefly-layer pointer-events-none absolute inset-0 overflow-hidden"
      style={{ '--ff-peak': peak } as CSSProperties}
    >
      {dots.map((style, i) => (
        // Half the dots are dropped on small screens to keep phones light.
        <span key={i} className={`firefly ${i % 2 ? 'max-md:hidden' : ''}`} style={style} />
      ))}
    </div>
  )
}
