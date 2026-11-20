import assets from './figma-assets.json'
import type { Shot } from './projects'

type Manifest = Record<string, Record<string, { node: string; alt: string }>>
const manifest = assets.projects as Manifest

// Path of a real screen exported from Figma (npm run figma:export). Throws on a typo so a broken key never ships.
export function shot(slug: string, key: string): Shot {
  const entry = manifest[slug]?.[key]
  if (!entry) throw new Error(`figma-assets.json has no "${key}" for project "${slug}"`)
  return { src: `/projects/${slug}/${key}.png`, alt: entry.alt }
}
