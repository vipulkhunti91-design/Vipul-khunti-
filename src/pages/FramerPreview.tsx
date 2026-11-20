/**
 * FramerPreview – Light single-page version of the Vipul Khunti portfolio,
 * matching the design reference at vipulkhunti27.framer.website.
 * All design tokens (colors, radii, shadows, spacing, fonts) are measured
 * directly from that live page and embedded below.
 *
 * Route: /preview  (added in App.tsx)
 * Data pulled from: src/data/site.ts & src/data/projects.ts
 */

import { site } from '../data/site'
import { projects } from '../data/projects'
import { Link } from 'react-router-dom'

/* ── Framer-reference design tokens ───────────────────────────────── */
const tk = {
  bg:        '#f9f8f5',
  fg:        '#000000',
  surface1:  '#d1eafa',
  surface2:  '#000000bf',
  surface3:  '#ffffff',
  accent1:   '#0000ee',
  accent2:   '#3f6c88',
  accent3:   '#d1eafa',
  muted1:    '#00000080',
  orange:    '#ff7b00',
  radius:    '8px',
  shadow1:   '#2F2B431A 0px -1px 0px 0px inset, #2F2B431A 0px 1px 3px 0px',
  shadow2:   '#000000 0px 0px 0px 1px inset, #0000002B 0px 0.6px 1.6px -1.5px, #00000024 0px 2.3px 6px -3px, #00000005 0px 10px 26px -4.5px',
} as const

/* ── Helper: image from framerusercontent via the reference page ──── */
const img = {
  hero:    'https://framerusercontent.com/images/pYgLOUOqdS1BvvbDEHUGlsi2ja4.jpg?scale-down-to=512',
  work1:   'https://framerusercontent.com/images/DQEarjO4IMpKlwTZV4pNMblBt5M.jpg?scale-down-to=512',
  work2:   'https://framerusercontent.com/images/j6D08APmFfHsbNe9z2t81ZfwZ0k.png?scale-down-to=512',
  work3:   'https://framerusercontent.com/images/DTVC31D3DmZ8h5rmVQ5BMpqQo2A.jpg?scale-down-to=512',
  about:   'https://framerusercontent.com/images/RKuW0O7XE2iAkuIK0MXuX1ua6M.jpg?scale-down-to=1024',
}

/* ── Shared style blocks ─────────────────────────────────────────── */
const btnPrimary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'linear-gradient(#271B1B 0%, #1E1515 100%)',
  color: tk.accent1,
  borderRadius: 37,
  padding: '12px 20px',
  fontSize: 12,
  fontWeight: 400,
  boxShadow: tk.shadow1,
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap',
}

const tagStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  color: tk.accent2,
  background: tk.surface1,
  borderRadius: 98,
  padding: '4px 10px',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
}

const cardStyle: React.CSSProperties = {
  background: tk.surface3,
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: tk.shadow2,
  display: 'flex',
  flexDirection: 'column',
}

/* ── Component ───────────────────────────────────────────────────── */
export function FramerPreview() {
  const featured = projects.filter(p => p.featured)

  return (
    <div
      style={{
        fontFamily: '"Satoshi", "Atkinson Hyperlegible", ui-sans-serif, system-ui, sans-serif',
        background: tk.bg,
        color: tk.fg,
        fontSize: 12,
        lineHeight: 'normal',
        fontWeight: 400,
        minHeight: '100vh',
      }}
    >
      {/* ── Google fonts (Satoshi via CDN; Atkinson Hyperlegible via Google) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap');

        .fp-link { color: #0000ee; text-decoration: none; }
        .fp-link:hover { text-decoration: underline; }
        .fp-btn-hover:hover { opacity: 0.88; }

        @media (max-width: 768px) {
          .fp-hero-grid { flex-direction: column !important; }
          .fp-work-grid  { grid-template-columns: 1fr !important; }
          .fp-about-grid { flex-direction: column !important; }
          .fp-nav-links  { display: none !important; }
          .fp-hero-name  { font-size: 56px !important; }
        }
        @media (max-width: 480px) {
          .fp-hero-name  { font-size: 36px !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          NAV
      ═══════════════════════════════════════ */}
      <nav style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: tk.fg, letterSpacing: '-0.01em' }}>
          {site.name}
        </span>
        <div className="fp-nav-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {['Work', 'About', 'Skills', 'Contact'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="fp-link"
              style={{ fontSize: 12, color: tk.muted1 }}
            >
              {label}
            </a>
          ))}
        </div>
        <Link to="/" style={{ ...btnPrimary } as React.CSSProperties} className="fp-btn-hover">
          ← Midnight Fireflies
        </Link>
      </nav>

      {/* ═══════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════ */}
      <main
        id="hero"
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '24px 32px 48px',
        }}
      >
        {/* Giant name + badge row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <h1
            className="fp-hero-name"
            style={{
              fontSize: 128,
              fontWeight: 400,
              color: tk.surface2,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              margin: 0,
              flex: '1 1 auto',
            }}
          >
            {site.name.toUpperCase()}
          </h1>

          {/* Availability badge */}
          <div style={{
            alignSelf: 'flex-start',
            marginTop: 8,
            background: tk.surface1,
            borderRadius: 98,
            padding: '8px 16px',
            fontSize: 11,
            color: tk.accent2,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            ● {site.status}
          </div>
        </div>

        {/* Hero layout: text + image */}
        <div
          className="fp-hero-grid"
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 32,
            alignItems: 'flex-start',
          }}
        >
          {/* Left text column */}
          <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p style={{ fontSize: 16, color: tk.muted1, lineHeight: 1.6, margin: 0, maxWidth: 280 }}>
              {site.role} passionate about creating simple, user-friendly experiences.
              Interested in design, research, and exploring new ideas.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {site.skills.map(g => (
                <span key={g.category} style={tagStyle}>{g.category}</span>
              ))}
            </div>

            <a href="#work" style={btnPrimary} className="fp-btn-hover">
              View Case Studies ↓
            </a>
          </div>

          {/* Hero image */}
          <div style={{ flex: '1 1 auto', borderRadius: 20, overflow: 'hidden', boxShadow: tk.shadow2, maxHeight: 400 }}>
            <img
              src={img.hero}
              alt="UI/UX Design work overview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════
          SECTION 2 — SELECTED WORK
      ═══════════════════════════════════════ */}
      <section
        id="work"
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '48px 32px',
        }}
      >
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
          <h2 style={{ fontSize: 38, fontWeight: 400, color: tk.surface2, margin: 0, letterSpacing: '-0.02em' }}>
            Selected Work
          </h2>
          <span style={{ fontSize: 11, color: tk.muted1 }}>
            {featured.length} case studies
          </span>
        </div>

        {/* Two-column project grid */}
        <div
          className="fp-work-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
          }}
        >
          {featured.map((project, i) => {
            /* Rotate through the reference images for visual variety */
            const refImages = [img.work1, img.work2, img.work3, img.hero]
            const refImg = refImages[i % refImages.length]

            return (
              <article key={project.slug} style={cardStyle}>
                {/* Cover image */}
                <div style={{ aspectRatio: '16/9', background: tk.surface1, overflow: 'hidden' }}>
                  <img
                    src={refImg}
                    alt={`${project.name} preview`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>

                {/* Card body */}
                <div style={{ padding: '20px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={tagStyle}>{project.category}</span>
                    <span style={{ fontSize: 10, color: tk.muted1 }}>{project.previewLabel}</span>
                  </div>

                  <h3 style={{ fontSize: 24, fontWeight: 400, color: tk.surface2, margin: 0, letterSpacing: '-0.015em', lineHeight: 1.1 }}>
                    {project.name}
                    {project.namePending && (
                      <span style={{ fontSize: 10, color: tk.muted1, marginLeft: 8, fontWeight: 400 }}>
                        (name pending)
                      </span>
                    )}
                  </h3>

                  <p style={{ fontSize: 13, color: tk.muted1, lineHeight: 1.55, margin: 0 }}>
                    {project.summary}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {project.tags.map(t => (
                      <span key={t} style={{ ...tagStyle, background: '#f0f0eb', color: '#444' }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #e8e7e3' }}>
                    <Link
                      to={`/work/${project.slug}`}
                      style={btnPrimary}
                      className="fp-btn-hover"
                    >
                      View Case Study →
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3 — MY STORY / ABOUT
      ═══════════════════════════════════════ */}
      <section
        id="about"
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '48px 32px',
        }}
      >
        <div
          className="fp-about-grid"
          style={{
            display: 'flex',
            gap: 48,
            alignItems: 'flex-start',
          }}
        >
          {/* Text column */}
          <div style={{ flex: '1 1 440px' }}>
            <span style={{ fontSize: 11, color: tk.muted1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              About me
            </span>
            <h2 style={{ fontSize: 38, fontWeight: 400, color: tk.surface2, margin: '12px 0 20px', letterSpacing: '-0.02em', lineHeight: 1.08 }}>
              My Story
            </h2>
            <p style={{ fontSize: 16, color: tk.muted1, lineHeight: 1.65, margin: '0 0 20px' }}>
              {site.story}
            </p>
            <p style={{ fontSize: 14, color: tk.muted1, lineHeight: 1.6, margin: '0 0 28px' }}>
              {site.journey.philosophy}
            </p>

            {/* Education chip */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: tk.surface3,
              borderRadius: 98,
              padding: '10px 18px',
              boxShadow: tk.shadow2,
              fontSize: 12,
            }}>
              <span style={{ color: tk.accent2 }}>🎓</span>
              <div>
                <div style={{ fontWeight: 500, color: tk.fg }}>{site.education.degree}</div>
                <div style={{ color: tk.muted1, fontSize: 11 }}>{site.education.focus}</div>
              </div>
            </div>
          </div>

          {/* Photo + skills sidebar */}
          <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: tk.shadow2 }}>
              <img
                src={img.about}
                alt="Vipul Khunti"
                style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }}
                onError={e => { (e.target as HTMLImageElement).parentElement!.style.background = tk.surface1 }}
              />
            </div>

            {/* Skills quick-view */}
            <div style={{
              background: tk.surface3,
              borderRadius: 20,
              padding: '20px 24px',
              boxShadow: tk.shadow2,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              <span style={{ fontSize: 11, color: tk.muted1, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Core Skills
              </span>
              {site.skills.map(g => (
                <div key={g.category}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: tk.fg, marginBottom: 6 }}>{g.category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {g.items.map(item => (
                      <span key={item} style={tagStyle}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 — DESIGN APPROACH
      ═══════════════════════════════════════ */}
      <section
        id="skills"
        style={{
          background: tk.surface3,
          borderRadius: 32,
          maxWidth: 1080,
          margin: '0 auto 0',
          padding: '48px 32px',
          boxShadow: tk.shadow2,
        }}
      >
        <span style={{ fontSize: 11, color: tk.muted1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Process
        </span>
        <h2 style={{ fontSize: 38, fontWeight: 400, color: tk.surface2, margin: '12px 0 32px', letterSpacing: '-0.02em' }}>
          Design Approach
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {site.designApproach.map(step => (
            <div
              key={step.number}
              style={{
                background: tk.bg,
                borderRadius: 20,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 400, color: tk.accent1, lineHeight: 1 }}>
                {step.number}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 400, color: tk.fg, margin: 0, letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 12, color: tk.muted1, lineHeight: 1.55, margin: 0 }}>
                {step.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
                {step.deliverables.map(d => (
                  <span key={d} style={{ ...tagStyle, background: tk.surface1 }}>{d}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 — INTERESTS STRIP
      ═══════════════════════════════════════ */}
      <section style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '32px 32px',
      }}>
        <div style={{
          background: tk.surface1,
          borderRadius: 20,
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: tk.accent2, flexShrink: 0 }}>
            Interests &amp; Focus Areas →
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {site.interests.map(interest => (
              <span key={interest} style={tagStyle}>{interest}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 6 — CONTACT
      ═══════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '48px 32px 80px',
          textAlign: 'center',
        }}
      >
        <div style={{
          background: `linear-gradient(135deg, ${tk.surface1} 0%, #e8f5fd 60%, #f9f8f5 100%)`,
          borderRadius: 32,
          padding: '56px 40px',
          boxShadow: tk.shadow2,
        }}>
          <span style={{ fontSize: 11, color: tk.accent2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Get in touch
          </span>
          <h2 style={{ fontSize: 48, fontWeight: 400, color: tk.surface2, margin: '16px 0 20px', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Let&apos;s Connect
          </h2>
          <p style={{ fontSize: 16, color: tk.muted1, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 32px' }}>
            I&apos;m actively seeking UI/UX design internship opportunities. If you&apos;d like to collaborate
            or just chat about design, reach out anytime.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {site.email ? (
              <a href={`mailto:${site.email}`} style={btnPrimary} className="fp-btn-hover">
                Send Email →
              </a>
            ) : (
              <span style={{ ...btnPrimary, opacity: 0.5, cursor: 'default' }}>
                Email — Coming Soon
              </span>
            )}
            <Link to="/" style={{
              ...btnPrimary,
              background: 'transparent',
              border: `1px solid ${tk.surface2}`,
              color: tk.fg,
            } as React.CSSProperties} className="fp-btn-hover">
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer style={{
        maxWidth: 1080,
        margin: '0 auto',
        padding: '20px 32px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #e4e3de',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <span style={{ fontSize: 12, color: tk.muted1 }}>
          © 2025 {site.name} · UI/UX Designer
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Work', 'About', 'Contact'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="fp-link"
              style={{ fontSize: 11, color: tk.muted1 }}
            >
              {label}
            </a>
          ))}
          <Link to="/" className="fp-link" style={{ fontSize: 11, color: tk.accent1 }}>
            Midnight Fireflies ↗
          </Link>
        </div>
      </footer>
    </div>
  )
}
