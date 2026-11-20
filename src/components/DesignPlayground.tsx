import { useEffect, useRef, useState } from 'react'

const playgroundTabs = [
  { id: 'button', label: 'Buttons' },
  { id: 'tab', label: 'Navigation' },
  { id: 'card', label: 'Selection Cards' },
  { id: 'input', label: 'Form Inputs' },
  { id: 'mobile', label: 'Mobile Flow' },
] as const

type PlaygroundTab = (typeof playgroundTabs)[number]['id']

export function DesignPlayground() {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('button')
  const [buttonVariant, setButtonVariant] = useState<'primary' | 'secondary' | 'disabled'>('primary')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonPressed, setButtonPressed] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // SplitText animation on "Design Playground & Experiments"
  useEffect(() => {
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
        if (!headingRef.current) return
        const split = new SplitText(headingRef.current, { type: 'words,chars' })
        gsap.from(split.chars, {
          opacity: 0,
          y: 10,
          stagger: 0.02,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            once: true,
          },
        })
      })
    })

    return () => {
      if (ctx) ctx.revert()
    }
  }, [])

  // Card interactive state
  const [cardSelected, setCardSelected] = useState<string>('standard')

  // Form input state
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState(false)

  // Mobile preview state
  const [mobileStep, setMobileStep] = useState(1)

  const handleSimulateClick = () => {
    setButtonLoading(true)
    setTimeout(() => {
      setButtonLoading(false)
      setButtonPressed(true)
      setTimeout(() => setButtonPressed(false), 2000)
    }, 700)
  }

  const moveTabFocus = (current: PlaygroundTab, direction: 1 | -1) => {
    const currentIndex = playgroundTabs.findIndex((tab) => tab.id === current)
    const next = playgroundTabs[(currentIndex + direction + playgroundTabs.length) % playgroundTabs.length]
    setActiveTab(next.id)
    requestAnimationFrame(() => document.getElementById(`${next.id}-tab`)?.focus())
  }

  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-6 md:p-8 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h3
            ref={headingRef}
            aria-label="Design Playground & Experiments"
            className="font-serif text-h3 font-normal"
          >
            Design Playground &amp; Experiments
          </h3>
          <p className="mt-1 text-sm text-muted">
            Inspect live UI states, focus rings, tactile feedback, and micro-interactions.
          </p>
        </div>

        {/* Tab switcher */}
        <div
          role="tablist"
          aria-label="Component Sandbox Tabs"
          className="flex flex-wrap items-center gap-1.5 rounded-lg border border-line bg-bg/70 p-1"
        >
          {playgroundTabs.map((t) => (
            <button
              key={t.id}
              id={`${t.id}-tab`}
              role="tab"
              aria-selected={activeTab === t.id}
              aria-controls="playground-panel"
              tabIndex={activeTab === t.id ? 0 : -1}
              onClick={() => setActiveTab(t.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault()
                  moveTabFocus(t.id, 1)
                }
                if (event.key === 'ArrowLeft') {
                  event.preventDefault()
                  moveTabFocus(t.id, -1)
                }
              }}
              className={`min-h-11 rounded-md px-3 text-xs font-medium transition-colors ${
                activeTab === t.id
                  ? 'bg-fg text-bg shadow-sm'
                  : 'text-muted hover:text-fg hover:bg-fg/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div id="playground-panel" role="tabpanel" aria-labelledby={`${activeTab}-tab`} className="mt-8 min-h-[300px] flex items-center justify-center">
        {/* BUTTONS SANDBOX */}
        {activeTab === 'button' && (
          <div className="w-full max-w-lg space-y-6 text-center">
            <div className="flex flex-wrap justify-center gap-2">
              {(['primary', 'secondary', 'disabled'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setButtonVariant(v)}
                  className={`min-h-11 rounded-full px-3 py-1 text-xs capitalize ${
                    buttonVariant === v
                      ? 'border border-[#F3C879] bg-[#F3C879]/15 font-medium text-[#F3C879]'
                      : 'text-muted hover:text-fg'
                  }`}
                >
                  {v === 'secondary' ? 'Secondary (Text Style)' : v}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-line rounded-xl bg-bg/40">
              {buttonVariant === 'primary' ? (
                <button
                  type="button"
                  disabled={buttonLoading}
                  onClick={handleSimulateClick}
                  className={`btn-primary ${buttonPressed ? 'btn-success-state' : ''}`}
                >
                  {buttonLoading ? (
                    <>
                      <span
                        aria-hidden
                        className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                      />
                      <span>Simulating action...</span>
                    </>
                  ) : buttonPressed ? (
                    <>
                      <span aria-hidden className="font-bold text-[#1F5E3C]">✓</span>
                      <span>Action Completed</span>
                    </>
                  ) : (
                    <>
                      <span>Explore Projects</span>
                      <span aria-hidden>&rarr;</span>
                    </>
                  )}
                </button>
              ) : buttonVariant === 'secondary' ? (
                <button
                  type="button"
                  disabled={buttonLoading}
                  onClick={handleSimulateClick}
                  className={`btn-secondary ${buttonPressed ? 'btn-success-state' : ''}`}
                >
                  {buttonLoading ? (
                    <span>Processing...</span>
                  ) : buttonPressed ? (
                    <>
                      <span>Action Completed</span>
                      <span aria-hidden className="btn-arrow text-xs">✓</span>
                    </>
                  ) : (
                    <>
                      <span>About Me</span>
                      <span aria-hidden className="btn-arrow text-xs">&nearr;</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="btn-primary"
                >
                  <span>Disabled State (#354056)</span>
                </button>
              )}

              <p className="mt-4 text-xs text-muted">
                {buttonVariant === 'primary'
                  ? 'Primary Champagne Gold (#F3C879) with hover brightness, elevation and click compression.'
                  : buttonVariant === 'secondary'
                  ? 'Secondary minimal text style: Moonlight Silver (#DCE5F2) smoothly transitions to Gold (#F3C879) with arrow movement.'
                  : 'Disabled state with #354056 background and #8995A9 text, clearly inactive.'}
              </p>
            </div>
          </div>
        )}

        {/* NAVIGATION TABS SANDBOX */}
        {activeTab === 'tab' && (
          <div className="w-full max-w-md space-y-6">
            <div className="rounded-xl border border-line bg-bg/50 p-4">
              <p className="text-xs uppercase tracking-wider text-muted mb-3">Segmented Control</p>
              <div className="grid grid-cols-3 gap-1 rounded-lg border border-line bg-bg p-1 text-center">
                {['Overview', 'Metrics', 'Audit Log'].map((tab, idx) => (
                  <button
                    key={tab}
                    className={`min-h-10 rounded-md text-xs font-medium transition-all ${
                      idx === 0
                        ? 'bg-fg text-bg shadow'
                        : 'text-muted hover:text-fg hover:bg-fg/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-bg/50 p-4">
              <p className="text-xs uppercase tracking-wider text-muted mb-3">Underline Pill Tabs</p>
              <div className="flex border-b border-line">
                {['Recent Work', 'Archived', 'Drafts'].map((tab, idx) => (
                  <button
                    key={tab}
                    className={`min-h-11 border-b-2 px-4 text-sm font-medium transition-colors ${
                      idx === 0
                        ? 'border-accent text-fg font-semibold'
                        : 'border-transparent text-muted hover:text-fg'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SELECTION CARDS */}
        {activeTab === 'card' && (
          <div className="w-full max-w-xl grid gap-4 sm:grid-cols-2">
            {[
              {
                id: 'standard',
                title: 'Standard UI Flow',
                desc: 'Optimized for quick scanning and streamlined linear checkout.',
                badge: 'Recommended',
              },
              {
                id: 'pro',
                title: 'Custom Exploratory UI',
                desc: 'Tailored for power users with fine-grained granular filters and states.',
                badge: 'Advanced',
              },
            ].map((card) => {
              const isSelected = cardSelected === card.id
              return (
                <div
                  key={card.id}
                  onClick={() => setCardSelected(card.id)}
                  tabIndex={0}
                  role="radio"
                  aria-checked={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault()
                      setCardSelected(card.id)
                    }
                  }}
                  className={`playground-item cursor-pointer rounded-xl border p-5 transition-all outline-none ${
                    isSelected
                      ? 'border-accent bg-accent/5 ring-1 ring-accent'
                      : 'border-line bg-bg/40 hover:bg-bg/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {card.badge}
                    </span>
                    <span
                      aria-hidden
                      className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-accent bg-accent text-on-accent text-[10px] font-bold'
                          : 'border-control'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                  <h4 className="mt-3 font-serif text-lg font-normal">{card.title}</h4>
                  <p className="mt-2 text-xs text-muted leading-relaxed">{card.desc}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* FORM INPUTS */}
        {activeTab === 'input' && (
          <div className="w-full max-w-md space-y-4">
            <div>
              <label htmlFor="sample-input" className="block text-xs uppercase tracking-wider text-muted">
                User Feedback Field
              </label>
              <div className="mt-2 relative">
                <input
                  id="sample-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    if (inputError) setInputError(false)
                  }}
                  placeholder="Type to test input feedback states..."
                  className={`w-full min-h-12 rounded-lg border bg-bg/80 px-4 text-sm text-fg transition-all placeholder:text-muted/60 focus:outline-none ${
                    inputError
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-line focus:border-accent focus:ring-1 focus:ring-accent'
                  }`}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setInputError(!inputError)}
                  className="text-muted hover:text-fg underline underline-offset-2"
                >
                  Toggle Error State
                </button>
                <span className="text-muted">{inputValue.length} characters</span>
              </div>
            </div>

            {inputError && (
              <p className="text-xs text-red-400">
                Please enter valid text (demonstrating accessible inline validation error feedback).
              </p>
            )}
          </div>
        )}

        {/* MOBILE PREVIEW FLOW */}
        {activeTab === 'mobile' && (
          <div className="flex flex-col items-center">
            {/* Mock phone frame */}
            <div className="w-[280px] rounded-[2.5rem] border-4 border-line bg-bg p-4 shadow-xl">
              {/* Phone notch */}
              <div className="mx-auto h-4 w-28 rounded-full bg-surface" />

              <div className="mt-4 px-2 py-4">
                <p className="text-xs text-muted uppercase tracking-wider">Step {mobileStep} of 3</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${(mobileStep / 3) * 100}%` }}
                  />
                </div>

                <div className="mt-6 space-y-3">
                  {mobileStep === 1 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Select Target Service</p>
                      <div className="rounded-lg border border-line p-2.5 text-xs text-muted">
                        Emergency Medical Assistance
                      </div>
                      <div className="rounded-lg border border-accent/40 bg-accent/5 p-2.5 text-xs font-medium text-fg">
                        Direct Ambulance Dispatch
                      </div>
                    </div>
                  )}

                  {mobileStep === 2 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Confirm Location</p>
                      <div className="rounded-lg border border-line bg-surface/40 p-3 text-center text-xs text-muted">
                        [GPS Coordinates Verified]
                      </div>
                    </div>
                  )}

                  {mobileStep === 3 && (
                    <div className="space-y-2 text-center py-2">
                      <div className="size-8 mx-auto rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
                        ✓
                      </div>
                      <p className="text-sm font-semibold">Dispatch En Route</p>
                      <p className="text-[11px] text-muted">Estimated arrival in 4 mins.</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between gap-2">
                  <button
                    disabled={mobileStep === 1}
                    onClick={() => setMobileStep((s) => Math.max(1, s - 1))}
                    className="min-h-9 px-3 rounded-md border border-line text-xs text-muted disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setMobileStep((s) => (s >= 3 ? 1 : s + 1))}
                    className="min-h-9 px-4 rounded-md bg-accent text-on-accent text-xs font-medium"
                  >
                    {mobileStep === 3 ? 'Reset Flow' : 'Continue'}
                  </button>
                </div>
              </div>

              {/* Home indicator bar */}
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-line" />
            </div>
            <p className="mt-4 text-xs text-muted">Simulated responsive mobile stepper prototype</p>
          </div>
        )}
      </div>
    </div>
  )
}
