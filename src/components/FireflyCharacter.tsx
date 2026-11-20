import type { CSSProperties } from 'react'

type FireflyCharacterProps = {
  isFlying?: boolean
  isGlowing?: boolean
  size?: number
  className?: string
  style?: CSSProperties
  theme?: 'dark' | 'light'
}

/**
 * FireflyCharacter (Jugnu)
 * A recognisable firefly: rounded head with antennae, a dark pronotum shield,
 * a segmented body, thin jointed legs, two translucent wings laid over the
 * back, and a glowing golden lantern across the last two abdomen segments.
 * Drawn top-down (head up, lantern down) so it reads clearly even at rest.
 * Adapts wing contrast, halo, and drop shadow dynamically to light and dark themes.
 */
export function FireflyCharacter({
  isFlying = false,
  isGlowing = true,
  size = 28,
  className = '',
  style,
  theme = 'dark',
}: FireflyCharacterProps) {
  const isLight = theme === 'light'

  return (
    <div
      aria-hidden
      className={`firefly-character relative inline-block select-none pointer-events-none ${className}`}
      style={{ width: size, height: size * 1.25, ...style }}
    >
      {/* Soft bioluminescent halo behind the lantern */}
      <div
        className={`firefly-glow-halo absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-500 ${
          isGlowing ? 'opacity-90 scale-110' : 'opacity-40 scale-90'
        }`}
        style={{
          width: size * 1.3,
          height: size * 1.3,
          background: isLight
            ? 'radial-gradient(circle, rgba(184, 130, 38, 0.4) 0%, rgba(184, 130, 38, 0.12) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(244, 215, 119, 0.6) 0%, rgba(244, 215, 119, 0.2) 45%, transparent 70%)',
          filter: 'blur(3px)',
        }}
      />

      <svg
        viewBox="0 0 32 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full relative z-10 transition-all duration-500 ${
          isLight
            ? 'drop-shadow-[0_1px_4px_rgba(140,95,20,0.45)]'
            : 'drop-shadow-[0_0_6px_rgba(244,215,119,0.8)]'
        }`}
      >
        <defs>
          <radialGradient id="fireflyAbdomenGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFBEA" />
            <stop offset="40%" stopColor="#F4D777" />
            <stop offset="80%" stopColor="#D9A93A" />
            <stop offset="100%" stopColor="#8A5E12" />
          </radialGradient>
        </defs>

        {/* Thin jointed legs, three per side */}
        <g stroke={isLight ? '#1C1814' : '#2A2520'} strokeWidth="0.6" strokeLinecap="round" opacity="0.85">
          <path d="M13 16.5C9 17.5 6.5 19 6.5 21" />
          <path d="M13 18.5C8.5 19.5 6 23 6 25" />
          <path d="M13 20.5C9 22 6.5 25 6.5 28" />
          <path d="M19 16.5C23 17.5 25.5 19 25.5 21" />
          <path d="M19 18.5C23.5 19.5 26 23 26 25" />
          <path d="M19 20.5C23 22 25.5 25 25.5 28" />
        </g>

        {/* Left wing */}
        <g
          className={`origin-[14px_16px] transition-transform duration-150 ${isFlying ? 'animate-wing-left' : 'rotate-[-2deg]'}`}
          opacity={isLight ? '0.75' : '0.5'}
        >
          <path
            d="M15 13.5C9.5 11 5.5 15.5 7.5 22C9 26.5 12.5 24 14.5 18.5Z"
            fill={isLight ? '#E5DDC7' : '#EFE7D2'}
            stroke={isLight ? '#8A7755' : '#C9BE9E'}
            strokeWidth={isLight ? '0.45' : '0.3'}
          />
          <path
            d="M9.5 16C9 19 9.5 22 11.5 23.5"
            stroke={isLight ? '#8A7755' : '#C9BE9E'}
            strokeWidth={isLight ? '0.45' : '0.3'}
            fill="none"
          />
        </g>

        {/* Right wing */}
        <g
          className={`origin-[18px_16px] transition-transform duration-150 ${isFlying ? 'animate-wing-right' : 'rotate-[2deg]'}`}
          opacity={isLight ? '0.75' : '0.5'}
        >
          <path
            d="M17 13.5C22.5 11 26.5 15.5 24.5 22C23 26.5 19.5 24 17.5 18.5Z"
            fill={isLight ? '#E5DDC7' : '#EFE7D2'}
            stroke={isLight ? '#8A7755' : '#C9BE9E'}
            strokeWidth={isLight ? '0.45' : '0.3'}
          />
          <path
            d="M22.5 16C23 19 22.5 22 20.5 23.5"
            stroke={isLight ? '#8A7755' : '#C9BE9E'}
            strokeWidth={isLight ? '0.45' : '0.3'}
            fill="none"
          />
        </g>

        {/* Antennae */}
        <path d="M14.8 5.2C13 2.5 11 2 9.5 2.6" stroke={isLight ? '#15120E' : '#201C16'} strokeWidth="0.55" strokeLinecap="round" />
        <path d="M17.2 5.2C19 2.5 21 2 22.5 2.6" stroke={isLight ? '#15120E' : '#201C16'} strokeWidth="0.55" strokeLinecap="round" />

        {/* Head with two small eye-glints */}
        <circle cx="16" cy="7" r="2.6" fill={isLight ? '#15120E' : '#201C16'} />
        <circle cx="14.9" cy="6.5" r="0.5" fill={isLight ? '#C5933A' : '#F4D777'} />
        <circle cx="17.1" cy="6.5" r="0.5" fill={isLight ? '#C5933A' : '#F4D777'} />

        {/* Pronotum (the shield behind the head, distinctive of real fireflies) */}
        <path
          d="M11.5 9.5C13.5 8 18.5 8 20.5 9.5C20.5 13.5 18 14.5 16 14.5C14 14.5 11.5 13.5 11.5 9.5Z"
          fill="#2E2A22"
          stroke="#453F33"
          strokeWidth="0.3"
        />

        {/* Upper abdomen segments (dark) */}
        <path d="M12 14C14.5 13 17.5 13 20 14L19.3 19C17.5 19.7 14.5 19.7 12.7 19Z" fill="#241F19" />

        {/* Glowing lantern: last two abdomen segments */}
        <path
          d="M12.7 19C14.5 19.7 17.5 19.7 19.3 19L18.6 24C17.2 24.7 14.8 24.7 13.4 24Z"
          fill="url(#fireflyAbdomenGrad)"
          className={`transition-all duration-500 ${isGlowing ? 'brightness-125' : 'brightness-90'}`}
        />
        <ellipse
          cx="16"
          cy="27.5"
          rx="3.1"
          ry="3.4"
          fill="url(#fireflyAbdomenGrad)"
          className={`transition-all duration-500 ${isGlowing ? 'brightness-125' : 'brightness-90'}`}
        />
        <circle cx="16" cy="27.5" r="1.3" fill="#FFF6D6" opacity="0.9" />
      </svg>
    </div>
  )
}
