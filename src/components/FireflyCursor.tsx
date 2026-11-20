import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FireflyCharacter } from './FireflyCharacter'

const IDLE_MS = 3200 // Lingers then gently settles
const MAX_PARTICLES = 24
const EMIT_INTERVAL_MS = 28
const EMIT_DIST_PX = 8

// Warm golden-yellow and soft amber palette matching Midnight Fireflies (Dark Theme)
const FIREFLY_COLORS_DARK = [
  { r: 244, g: 215, b: 119 }, // Signature Butter Gold #F4D777
  { r: 245, g: 165, b: 42 },  // Soft Amber #F5A52A
  { r: 255, g: 232, b: 150 }, // Soft Golden Glow
  { r: 243, g: 200, b: 121 }, // Champagne Gold #F3C879
] as const

// Rich antique amber gold palette on light sections with high definition and no washing out
const FIREFLY_COLORS_LIGHT = [
  { r: 168, g: 115, b: 24 },  // Antique Gold #A87318
  { r: 184, g: 130, b: 38 },  // Warm Amber #B88226
  { r: 152, g: 100, b: 18 },  // Deep Bronze Gold #986412
  { r: 196, g: 142, b: 48 },  // Muted Golden Amber
] as const

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  phase: number
  phaseSpeed: number
  baseAlpha: number
  colorIndex: number
}

/**
 * FireflyCursor
 * The signature desktop firefly companion (Jugnu) and interactive mouse particle trail.
 * Features:
 * 1. Stylized SVG Firefly Character with natural lag, wandering drift, and wing flutter.
 * 2. Canvas-driven interactive glowing firefly particle trail around and behind the cursor.
 * 3. 3.1: View Case Study Hover Reaction (attracted toward hovered link).
 * 4. 3.2: Case Study Welcome Animation (lands near project title on entry).
 * 5. 3.3: Smooth fade and instant cleanup when visual effects are toggled.
 * 6. 3.4: Contact Guidance (gently drifts toward contact once per session).
 * 7. 5-click intentional Easter egg spark interaction.
 * 8. Strict accessibility and reduced-motion compliance; 0 DOM churn.
 */
export function FireflyCursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isFlying, setIsFlying] = useState(false)
  const [isGlowing, setIsGlowing] = useState(true)
  const [characterTheme, setCharacterTheme] = useState<'dark' | 'light'>('dark')
  const isFlyingRef = useRef(false)
  const isGlowingRef = useRef(true)
  const characterThemeRef = useRef<'dark' | 'light'>('dark')
  const [easterEggToast, setEasterEggToast] = useState(false)
  const countRef = useRef(0)
  const toastTimeoutRef = useRef<number | undefined>(undefined)

  const location = useLocation()

  // Trigger intentional 5-activation Easter egg
  const handleFireflyActivation = () => {
    countRef.current += 1
    if (countRef.current >= 5) {
      setEasterEggToast(true)
      countRef.current = 0
      window.clearTimeout(toastTimeoutRef.current)
      toastTimeoutRef.current = window.setTimeout(() => setEasterEggToast(false), 4500)
    }
  }

  useEffect(() => {
    // Only run on desktop fine pointers
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const calm = matchMedia('(prefers-reduced-motion: reduce)')

    const checkDisabled = () =>
      document.documentElement.getAttribute('data-visual-effects') === 'disabled'

    const canvas = canvasRef.current
    if (!canvas) return
    let ctx = canvas.getContext('2d')

    let width = window.innerWidth
    let height = window.innerHeight

    const resizeCanvas = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas, { passive: true })

    const particles: Particle[] = []

    let tx = width / 2
    let ty = height / 2
    let lastSpawnX = tx
    let lastSpawnY = ty
    let lastSpawnTime = 0
    let lastJugnuSpawnTime = 0

    let cx = tx
    let cy = ty
    let lastMove = performance.now()
    let fade = 1
    let raf = 0
    let wanderAmp = 4
    let speed = 0

    // Attractor state for interactive reactions (hover, welcome, guidance)
    let attractor: { x: number; y: number; expireAt: number } | null = null

    const spawnParticle = (
      originX: number,
      originY: number,
      dirX: number,
      dirY: number,
      dist: number,
    ) => {
      if (particles.length >= MAX_PARTICLES) return

      const ux = dist > 0.001 ? dirX / dist : 0
      const uy = dist > 0.001 ? dirY / dist : 0
      const perpX = -uy
      const perpY = ux

      // Scatter slightly behind movement direction + random lateral spread
      const lag = 6 + Math.random() * 14
      const spread = (Math.random() - 0.5) * 16
      const px = originX - ux * lag + perpX * spread
      const py = originY - uy * lag + perpY * spread

      // Natural gentle drift: slow initial backward push + random lateral drift
      const driftSpeed = 0.18 + Math.random() * 0.35
      const vx = -ux * driftSpeed + (Math.random() - 0.5) * 0.32
      const vy = -uy * driftSpeed + (Math.random() - 0.5) * 0.32 - 0.1 // slight upward thermal float

      const colorIndex = Math.floor(Math.random() * FIREFLY_COLORS_DARK.length)

      particles.push({
        x: px,
        y: py,
        vx,
        vy,
        size: 1.5 + Math.random() * 2.1,
        life: 0,
        maxLife: 45 + Math.floor(Math.random() * 38), // ~0.75s to ~1.4s
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.035 + Math.random() * 0.045,
        baseAlpha: 0.38 + Math.random() * 0.42,
        colorIndex,
      })
    }

    let themeFactor = 0 // 0 = dark, 1 = light (smoothly interpolated)

    const frame = (now: number) => {
      if (calm.matches || checkDisabled()) {
        if (characterRef.current) characterRef.current.style.opacity = '0'
        if (ctx) ctx.clearRect(0, 0, width, height)
        particles.length = 0
        const spot = document.querySelector<HTMLElement>('[data-spotlight]')
        if (spot) spot.style.opacity = '0'
        raf = 0
        return
      }

      // Check if attractor is active
      const hasAttractor = attractor !== null && now < attractor.expireAt
      if (attractor && now >= attractor.expireAt) {
        attractor = null
      }

      const isMouseActive = now - lastMove < IDLE_MS
      const hasActiveParticles = particles.length > 0
      const active = hasAttractor || isMouseActive || hasActiveParticles

      fade += ((hasAttractor || isMouseActive ? 1 : 0) - fade) * 0.08

      // Determine target coordinates (attractor or mouse)
      const currentTargetX = hasAttractor ? attractor!.x : tx
      const currentTargetY = hasAttractor ? attractor!.y : ty

      // Natural wandering drift
      wanderAmp += ((now - lastMove > 400 && !hasAttractor ? 18 : 4) - wanderAmp) * 0.04
      const targetX = currentTargetX + Math.sin(now * 0.0016) * wanderAmp
      const targetY = currentTargetY + Math.cos(now * 0.0021) * wanderAmp * 0.8

      // Ease main firefly toward target
      const prevX = cx
      const prevY = cy
      const easeSpeed = hasAttractor ? 0.12 : 0.16
      cx += (targetX - cx) * easeSpeed
      cy += (targetY - cy) * easeSpeed

      // Calculate velocity for wing flutter state
      const dx = cx - prevX
      const dy = cy - prevY
      speed = Math.sqrt(dx * dx + dy * dy)
      const nextIsFlying = speed > 0.35 || hasAttractor
      if (nextIsFlying !== isFlyingRef.current) {
        isFlyingRef.current = nextIsFlying
        setIsFlying(nextIsFlying)
      }

      // Smoothly detect background section theme under firefly (dark vs light)
      let isOverLight = false
      try {
        const el = document.elementFromPoint(cx, cy)
        const themedSection = el?.closest('[data-theme]')
        if (themedSection) {
          isOverLight = themedSection.getAttribute('data-theme') === 'light'
        }
      } catch {
        // fallback
      }

      // Smooth 0 -> 1 transition factor (avoids sudden color jumps when crossing boundaries)
      themeFactor += ((isOverLight ? 1 : 0) - themeFactor) * 0.08
      const nextTheme = themeFactor > 0.5 ? 'light' : 'dark'
      if (nextTheme !== characterThemeRef.current) {
        characterThemeRef.current = nextTheme
        setCharacterTheme(nextTheme)
      }

      // Slight natural tilt facing movement direction
      const angle = Math.max(-25, Math.min(25, dx * 3.5))

      if (characterRef.current) {
        characterRef.current.style.transform = `translate3d(${cx - 14}px, ${cy - 14}px, 0) rotate(${angle}deg)`
        characterRef.current.style.opacity = String(fade)
      }

      // Occasional gentle particle shed from Jugnu's bioluminescent tail when flying swiftly
      if (speed > 1.8 && now - lastJugnuSpawnTime > 120 && particles.length < MAX_PARTICLES) {
        lastJugnuSpawnTime = now
        spawnParticle(cx, cy + 6, dx, dy, speed)
      }

      // -------------------------------------------------------------
      // Canvas rendering: interactive firefly particles
      // -------------------------------------------------------------
      if (ctx) {
        ctx.clearRect(0, 0, width, height)

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]
          p.life += 1

          if (p.life >= p.maxLife) {
            particles.splice(i, 1)
            continue
          }

          p.phase += p.phaseSpeed

          // Living, organic floating drift (sinusoidal wander + buoyant upward drift)
          p.x += p.vx + Math.sin(p.phase) * 0.52
          p.y += p.vy + Math.cos(p.phase * 0.85) * 0.44 - 0.08
          p.vx *= 0.96
          p.vy *= 0.96

          // Soft emerge -> living glow pulse -> gradual fade
          const progress = p.life / p.maxLife
          let alpha = 0
          if (progress < 0.18) {
            // Soft emergence
            alpha = (progress / 0.18) * p.baseAlpha
          } else if (progress < 0.65) {
            // Gentle bioluminescent breathing pulse
            const pulse = 1 + Math.sin(p.phase * 2) * 0.15
            alpha = p.baseAlpha * pulse
          } else {
            // Smooth gradual fade away
            alpha = p.baseAlpha * (1 - (progress - 0.65) / 0.35)
          }

          if (alpha <= 0.01) continue

          // Interpolate colors between dark (champagne/butter gold) and light (antique bronze gold)
          const darkColor = FIREFLY_COLORS_DARK[p.colorIndex]
          const lightColor = FIREFLY_COLORS_LIGHT[p.colorIndex]

          const pR = Math.round(darkColor.r + (lightColor.r - darkColor.r) * themeFactor)
          const pG = Math.round(darkColor.g + (lightColor.g - darkColor.g) * themeFactor)
          const pB = Math.round(darkColor.b + (lightColor.b - darkColor.b) * themeFactor)

          // Center spark: bright ivory spark on dark, warm amber-gold core on light (never washes out on white)
          const coreR = Math.round(255 + (190 - 255) * themeFactor)
          const coreG = Math.round(252 + (140 - 252) * themeFactor)
          const coreB = Math.round(235 + (35 - 235) * themeFactor)

          // Tighter, crisper glow radius on light backgrounds to prevent blurry pale washes
          const glowRadius = p.size * (3.4 - themeFactor * 0.8)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius)

          grad.addColorStop(0, `rgba(${coreR}, ${coreG}, ${coreB}, ${Math.min(1, alpha * (1.1 - themeFactor * 0.15))})`)
          grad.addColorStop(0.26, `rgba(${pR}, ${pG}, ${pB}, ${alpha * (0.88 + themeFactor * 0.12)})`)
          grad.addColorStop(0.70, `rgba(${pR}, ${pG}, ${pB}, ${alpha * (0.24 - themeFactor * 0.06)})`)
          grad.addColorStop(1, `rgba(${pR}, ${pG}, ${pB}, 0)`)

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Update ambient spotlight behind firefly
      const spot = document.querySelector<HTMLElement>('[data-spotlight]')
      if (spot) {
        spot.style.setProperty('--sx', `${cx}px`)
        spot.style.setProperty('--sy', `${cy}px`)
        spot.style.opacity = String(fade * 0.85)
      }

      // Bioluminescent pulse intervals (forced glowing when reacting)
      const nextIsGlowing = hasAttractor || Math.sin(now * 0.0035) > -0.2
      if (nextIsGlowing !== isGlowingRef.current) {
        isGlowingRef.current = nextIsGlowing
        setIsGlowing(nextIsGlowing)
      }

      if (!active && fade < 0.01) {
        raf = 0
        if (characterRef.current) characterRef.current.style.opacity = '0'
        if (ctx) ctx.clearRect(0, 0, width, height)
        if (spot) spot.style.opacity = '0'
      } else {
        raf = requestAnimationFrame(frame)
      }
    }

    const startRafIfNeeded = () => {
      if (!raf) {
        lastMove = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || calm.matches || checkDisabled()) return

      const moveX = e.clientX
      const moveY = e.clientY
      const now = performance.now()

      const dist = Math.hypot(moveX - lastSpawnX, moveY - lastSpawnY)

      // Emit new firefly particle when cursor moves significantly
      if (dist >= EMIT_DIST_PX && now - lastSpawnTime >= EMIT_INTERVAL_MS) {
        spawnParticle(moveX, moveY, moveX - lastSpawnX, moveY - lastSpawnY, dist)
        lastSpawnX = moveX
        lastSpawnY = moveY
        lastSpawnTime = now
      }

      tx = moveX
      ty = moveY
      lastMove = now
      startRafIfNeeded()
    }

    const onLeave = () => {
      lastMove = 0
    }

    // 3.1: View Case Study Hover Reaction listener
    const onJugnuTarget = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number }>
      if (!customEvent.detail || calm.matches || checkDisabled()) return
      attractor = {
        x: customEvent.detail.x,
        y: customEvent.detail.y - 18,
        expireAt: performance.now() + 1000,
      }
      startRafIfNeeded()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('jugnu:hover-target', onJugnuTarget)

    // Initial frame start
    startRafIfNeeded()

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('jugnu:hover-target', onJugnuTarget)
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(raf)
    }
  }, [])

  // 3.2: Case Study Welcome Animation (lands near project title on entry)
  useEffect(() => {
    if (!location.pathname.startsWith('/work/')) return
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const slug = location.pathname.replace('/work/', '')
    const sessionKey = `jugnu_welcome_${slug}`
    if (sessionStorage.getItem(sessionKey)) return

    sessionStorage.setItem(sessionKey, '1')

    const timer = setTimeout(() => {
      const titleEl = document.querySelector('#case-study-hero h1')
      if (titleEl) {
        const rect = titleEl.getBoundingClientRect()
        window.dispatchEvent(
          new CustomEvent('jugnu:hover-target', {
            detail: { x: rect.left + 50, y: rect.top + 16 },
          })
        )
      }
    }, 450)

    return () => clearTimeout(timer)
  }, [location.pathname])

  // 3.4: Contact Guidance (gently drifts toward contact button once per session)
  useEffect(() => {
    if (location.pathname !== '/') return
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (sessionStorage.getItem('jugnu_contact_guided')) return

    const contactEl = document.getElementById('contact')
    if (!contactEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sessionStorage.setItem('jugnu_contact_guided', '1')
            const btn = document.querySelector('#contact a[href^="mailto:"]')
            if (btn) {
              const rect = btn.getBoundingClientRect()
              window.dispatchEvent(
                new CustomEvent('jugnu:hover-target', {
                  detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
                })
              )
            }
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(contactEl)
    return () => observer.disconnect()
  }, [location.pathname])

  return (
    <>
      <div
        ref={containerRef}
        aria-hidden
        className="firefly-cursor pointer-events-none fixed inset-0 z-[60] overflow-hidden max-md:hidden"
      >
        {/* Interactive mouse firefly trail canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 block h-full w-full"
        />

        {/* Main Stylized Firefly Character (Jugnu) */}
        <div
          ref={characterRef}
          className="pointer-events-none absolute left-0 top-0 transition-opacity duration-300 will-change-transform"
          style={{ opacity: 0 }}
        >
          <FireflyCharacter
            isFlying={isFlying}
            isGlowing={isGlowing}
            theme={characterTheme}
            size={30}
          />
        </div>
      </div>

      {/* Accessible Easter Egg Trigger for Firefly Companion */}
      <button
        type="button"
        onClick={handleFireflyActivation}
        aria-label="Interact with the firefly companion"
        className="fixed bottom-3 left-3 z-50 size-8 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-focus bg-surface/30 text-[10px] text-muted grid place-items-center transition-opacity"
        title="Interact with the firefly companion (5 clicks reveals a spark)"
      >
        ✨
      </button>

      {/* Easter Egg Spark Toast */}
      {easterEggToast && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl border border-accent/60 bg-surface/95 px-5 py-3.5 text-sm text-fg shadow-2xl backdrop-blur-md animate-fade-in"
        >
          <span className="text-xl">✨</span>
          <div>
            <p className="font-serif text-base font-normal text-accent-text">
              You found a little spark of creativity! ✨
            </p>
            <p className="text-xs text-muted">A subtle companion to guide your exploration.</p>
          </div>
          <button
            type="button"
            onClick={() => setEasterEggToast(false)}
            aria-label="Dismiss message"
            className="ml-2 text-xs text-muted hover:text-fg p-1 rounded"
          >
            ✕
          </button>
        </aside>
      )}
    </>
  )
}
