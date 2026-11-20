# Vipul Khunti: portfolio

React 19 + TypeScript + Vite + Tailwind v4. Deploys to Vercel as a static site.

## Commands

    npm install
    npm run dev              # http://localhost:5173
    npm run check:contrast   # WCAG AA check of every theme token pair
    npm run figma:export     # pulls real screens from Figma into public/projects/ (see below)
    npm run build            # runs the contrast check, type-checks, builds to dist/
    npm run preview          # serves the production build

## Pulling real screens from Figma

The four case studies reference real screens from the Figma file "Kid app study" by their node IDs,
listed in `src/data/figma-assets.json`. This sandbox can't reach Figma's asset servers, so the PNGs
haven't been downloaded yet — pages show "Screenshot pending" until you run the export locally:

1. In Figma, go to Settings → Security → Personal access tokens, and create one with File content: read-only.
2. Run `FIGMA_TOKEN=your_token npm run figma:export` (or just one project: `... -- parkora`).
3. The script writes PNGs to `public/projects/<slug>/<key>.png`. Commit them like any other asset.

If a screen's node ID ever changes in Figma (an element gets deleted and redrawn), update the matching
entry in `figma-assets.json` and re-run the export.

## Where things live

- `src/styles/index.css`: dark and light theme tokens (the contrast script reads this file).
- `src/data/site.ts`: name, role, email, links, resume. `email: null` and `resume: null` mean "not provided yet".
- `src/data/projects.ts`: the project list and its `Block`/`CaseStudyData` types. Only `featured: true`
  projects show on the homepage.
- `src/data/case-studies/<slug>.ts`: each project's real case-study content (problem, research, personas,
  journey, final UI, etc.), taken from Vipul's Figma file. Sections are a flexible list of blocks, so a
  project with wireframes but no final UI yet simply has fewer sections — no invented filler.
- `src/data/figma-assets.json` + `src/data/figma.ts`: maps a short key (e.g. `"tracker"`) to a Figma node ID,
  for `npm run figma:export` and for referencing screens in the case-study files.
- `src/components/`: Section (sets the theme), Pending, ButtonLink, Tag, ProjectCard, CaseStudyBlocks (renders
  a case study's sections), Shot/Cover (a real screen, or an honest "Screenshot pending" frame), Nav, Footer, Layout.

## Rules

- Yellow `#F4D777` is a fill on light sections, never text. Use the `accent-text` token for text.
- Missing content shows a `Pending` note. Do not fill it with made-up material.
- Resume: put the real PDF in `public/` and set `site.resume`. The Resume link and download appear automatically.
