# AGENTS.md: Vipul Khunti portfolio

Personal UI/UX Designer portfolio for **Vipul Khunti**, a UI/UX Design Student open to UI/UX internships.
The brand is Vipul Khunti only. It is not a product or company site. Never use PrintQ or Phopy as the site name.

## Stack and commands
React 19, TypeScript, Vite, Tailwind v4, react-router-dom, Instrument Serif + Inter Variable (fontsource).
Add no dependency without a clear technical reason.

    npm run dev              # http://localhost:5173
    npm run check:contrast   # WCAG AA check of every theme token pair (runs before build)
    npm run lint
    npm run build

## Design (approved, do not change)
- Mixed dark and light. Dark: nav, hero, about, contact, footer. Light: Selected Projects, case studies, skills.
- Tokens live in `src/styles/index.css`. Components use semantic tokens (bg, fg, muted, control, line, accent-text, focus). No hard-coded colours.
- Butter yellow `#F4D777` is a fill, line or particle. Never yellow text on a light background (use `accent-text`).
- Premium, minimal, editorial. No gradients except the hero light beam and spotlight (kept at 10% so text stays AA), no 3D, no loud effects.
- Signature: "Midnight Fireflies" (golden ambient particles, desktop cursor firefly with trail). One cursor system only: `FireflyCursor`.

## Content rules (strict)
- Never invent experience, projects, research, outcomes, metrics, testimonials, screenshots or UI mock-ups.
- Unknown content uses the `Pending` component or an empty "Screenshot pending" frame.
- Resume appears only when `site.resume` is set to a real PDF in `public/`.
- Project 1's name is pending: keep "Campus Print Queue" (`namePending: true`), slug `project-1`, until Vipul confirms.
- Data is central: `src/data/site.ts`, `src/data/projects.ts` (the project list), `src/data/case-studies/<slug>.ts` (each project's real content, pulled verbatim from Vipul's Figma file), `src/data/figma-assets.json` (which Figma node is which screen).
- Only `projects` with `featured: true` show on the homepage. All four current projects are featured; set `featured: false` to hold one back without deleting it.
- Real screens come from Figma via `npm run figma:export` (see README). Until that has been run with a real token, `ShotImg`/`Cover` show "Screenshot pending" instead of a broken image — never a placeholder mock-up.

## Accessibility and motion
- WCAG AA contrast, visible focus (`--focus`), semantic HTML, one h1 per page, 44px touch targets.
- Decorative layers: `aria-hidden`, `pointer-events: none`.
- Respect `prefers-reduced-motion`. Disable cursor effects on touch. Keep the system cursor visible.
- Never hide content while waiting for an animation. Animate transform and opacity only.

## Ponytail coding rules
- Smallest complete change. Reuse before writing new code. No abstraction nobody asked for.
- Never cut accessibility, validation or error handling.
- Non-trivial logic gets a small check. Known shortcuts get a comment: `shortcut: <limit>, <when to upgrade>`.
- End each report with what was skipped or not checked.

## Roadmap status
1. Foundation and hero: done (this file, tokens, nav, hero, fireflies, cursor companion, spotlight).
2. Homepage experience: done (project cards, About, Skills, Contact).
3. Gaming-inspired features, Playground: done.
4. Case studies: done. Four projects (Campus Print Queue, Red Bus Kids, Park Oraa, Sanjivni) each have their own
   page built from `src/data/case-studies/<slug>.ts` — real problem statements, research numbers, personas,
   journeys and screens from Vipul's Figma file, not a fixed template. `npm run figma:export` still needs to be
   run with a real Figma token to pull the actual PNGs into `public/projects/`.
5. Firefly character: redesigned (`FireflyCharacter.tsx`) as a top-down firefly with a head, antennae, a dark
   pronotum shield, segmented abdomen, thin jointed legs and two translucent wings, with the glow confined to
   the last two abdomen segments.
6. QA: next. Test in a real browser after every phase, not only the build.
