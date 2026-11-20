import type { Shot } from '../data/projects'
import { ShotImg } from './Shot'

// Thin wrapper so existing call sites (hero preview, project cards) don't need to change.
export function Cover({ cover, className = '' }: { cover?: Shot; className?: string }) {
  if (!cover) return <div className={`rounded-sm border border-line bg-fg/5 ${className}`} />
  return <ShotImg shot={cover} className={className} />
}
