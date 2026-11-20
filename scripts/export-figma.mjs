// Downloads the real screens listed in src/data/figma-assets.json from Figma into public/projects/<slug>/<key>.png.
// No dependencies (Node 18+).
//   FIGMA_TOKEN=xxxx npm run figma:export            # every project
//   FIGMA_TOKEN=xxxx npm run figma:export -- parkora # one project
// Token: Figma > Settings > Security > Personal access tokens (File content: read-only).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const token = process.env.FIGMA_TOKEN
if (!token) {
  console.error('Set FIGMA_TOKEN first. Figma > Settings > Security > Personal access tokens.')
  process.exit(1)
}

const { fileKey, projects } = JSON.parse(readFileSync(new URL('../src/data/figma-assets.json', import.meta.url), 'utf8'))
const only = process.argv[2]
const slugs = Object.keys(projects).filter((s) => !only || s === only)
if (only && slugs.length === 0) {
  console.error(`Unknown project "${only}". Use one of: ${Object.keys(projects).join(', ')}`)
  process.exit(1)
}

let failed = 0
for (const slug of slugs) {
  const entries = Object.entries(projects[slug]).filter(([, value]) => value.node !== 'PENDING')
  const pending = Object.entries(projects[slug]).filter(([, value]) => value.node === 'PENDING')
  for (const [key] of pending) {
    console.warn(`${slug}/${key}: skipped because its Figma node ID has not been supplied`)
  }
  if (entries.length === 0) {
    console.warn(`${slug}: skipped because it has no configured Figma node IDs`)
    continue
  }
  const ids = entries.map(([, v]) => v.node).join(',')
  const res = await fetch(`https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=png&scale=2`, {
    headers: { 'X-Figma-Token': token },
  })
  if (!res.ok) {
    console.error(`${slug}: Figma API ${res.status} ${await res.text()}`)
    failed++
    continue
  }
  const { images } = await res.json()
  const dir = new URL(`../public/projects/${slug}/`, import.meta.url)
  mkdirSync(dir, { recursive: true })
  for (const [key, { node }] of entries) {
    const url = images[node]
    if (!url) {
      console.error(`${slug}/${key}: Figma returned no image for node ${node}`)
      failed++
      continue
    }
    const img = await fetch(url)
    if (!img.ok) {
      console.error(`${slug}/${key}: download failed (${img.status})`)
      failed++
      continue
    }
    writeFileSync(new URL(`${key}.png`, dir), Buffer.from(await img.arrayBuffer()))
    console.log(`ok  ${slug}/${key}.png`)
  }
}
process.exit(failed ? 1 : 0)
