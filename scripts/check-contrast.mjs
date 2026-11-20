// Checks every text/background token pair in src/index.css against WCAG AA.
// No dependencies. Exits 1 on any failure or missing token.
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles/index.css', import.meta.url), 'utf8')

const hexTokens = (body) =>
  Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2]]))
const block = (re) => {
  const m = css.match(re)
  if (!m) throw new Error(`CSS block not found: ${re}`)
  return hexTokens(m[1])
}

const shared = block(/^:root\s*\{([^}]*)\}/m)
const themes = {
  dark: { ...shared, ...block(/\[data-theme="dark"\]\s*\{([^}]*)\}/) },
  light: { ...shared, ...block(/\[data-theme="light"\]\s*\{([^}]*)\}/) },
}

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
// The empty project-cover frame is bg-fg/5: fg blended 5% over bg.
const tint = (t) => toHex(rgb(t.bg).map((v, i) => v * 0.95 + rgb(t.fg)[i] * 0.05))
// Hero beam (up to 12% behind text after masking) and mouse spotlight (10%) can stack: about 21% yellow over the background.
const glow = (t) => toHex(rgb(t.bg).map((v, i) => v * 0.79 + rgb(t.accent)[i] * 0.21))

const TEXT = 4.5 // normal text
const UI = 3 // focus rings and control borders
const pairs = [
  ['fg', 'bg', TEXT],
  ['fg', 'surface', TEXT],
  ['muted', 'bg', TEXT],
  ['muted', 'surface', TEXT],
  ['muted', 'tint', TEXT],
  ['muted', 'glow', TEXT, 'dark'], // hero text over the light beam
  ['fg', 'glow', TEXT, 'dark'],
  ['accent-text', 'bg', TEXT],
  ['accent-text', 'surface', TEXT],
  ['on-accent', 'accent', TEXT],
  ['control', 'bg', UI],
  ['control', 'surface', UI],
  ['focus', 'bg', UI],
  ['focus', 'surface', UI],

  // Button system contrast checks
  ['btn-primary-fg', 'btn-primary-bg', TEXT],       // Primary button default text on Champagne Gold
  ['btn-primary-fg', 'btn-primary-hover', TEXT],    // Primary button hover text on #FFDA91
  ['btn-primary-fg', 'btn-primary-active', TEXT],   // Primary button active text on #DDAA55
  ['btn-secondary-fg', 'bg', TEXT],                 // Secondary text on section background
  ['btn-secondary-hover', 'bg', TEXT],              // Secondary hover text on section background
  ['btn-secondary-active', 'bg', TEXT],             // Secondary active text on section background
  ['btn-disabled-fg', 'btn-disabled-bg', UI],       // Disabled button text on disabled background
  ['btn-success-fg', 'bg', TEXT],                   // Success state text on section background
  ['btn-success-on-gold', 'btn-primary-bg', TEXT],  // Success text on primary gold button
]

let failed = false
for (const [name, t] of Object.entries(themes)) {
  const colors = { ...t, tint: tint(t), glow: glow(t) }
  console.log(`\n${name} theme`)
  for (const [fg, bg, min, only] of pairs) {
    if (only && only !== name) continue
    if (!colors[fg] || !colors[bg]) {
      console.log(`  FAIL  ${fg} on ${bg}: token missing`)
      failed = true
      continue
    }
    const r = ratio(colors[fg], colors[bg])
    const ok = r >= min
    if (!ok) failed = true
    console.log(`  ${ok ? 'pass' : 'FAIL'}  ${fg.padEnd(11)} on ${bg.padEnd(7)} ${r.toFixed(2)}:1  (needs ${min}:1)`)
  }
}

// Guard for the "no yellow text on white" rule.
if (themes.light['accent-text'].toLowerCase() === themes.light.accent.toLowerCase()) {
  console.log('\nFAIL  light accent-text is yellow')
  failed = true
}

console.log(failed ? '\nContrast check FAILED' : '\nContrast check passed')
process.exit(failed ? 1 : 0)
