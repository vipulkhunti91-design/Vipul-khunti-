import { useState } from 'react'
import type { Shot as ShotType } from '../data/projects'

export function ShotImg({ shot, className = '' }: { shot: ShotType; className?: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <div
      className={`group/shot relative overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-md ${className}`}
    >
      <img
        src={shot.src}
        alt={shot.alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />

      {status !== 'loaded' && (
        <div
          role="img"
          aria-label={shot.alt}
          className="absolute inset-0 flex flex-col justify-between p-3.5 sm:p-4 bg-surface text-fg"
        >
          {/* Mock Mobile Status Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-fg/70 pb-2 border-b border-line/60">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="text-[10px] uppercase tracking-wider font-sans font-semibold text-fg/80">UI Screen</span>
            </div>
          </div>

          {/* Center Graphic & Descriptive Label */}
          <div className="my-auto text-center px-1 py-2">
            <div className="mx-auto mb-2.5 flex size-10 items-center justify-center rounded-xl border border-line bg-surface/80 shadow-sm text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
                aria-hidden="true"
              >
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-fg line-clamp-3 leading-snug">
              {shot.alt}
            </p>
          </div>

          {/* Bottom Device Indicator */}
          <div className="pt-2 border-t border-line/50 flex justify-center">
            <span className="h-1 w-12 rounded-full bg-fg/20" />
          </div>
        </div>
      )}
    </div>
  )
}
