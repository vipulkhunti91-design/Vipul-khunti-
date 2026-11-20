import { phtopy } from './case-studies/phtopy'
import { induCafe } from './case-studies/indu-cafe'
import { redBusKids } from './case-studies/red-bus-kids'
import { parkora } from './case-studies/parkora'
import { sanjivni } from './case-studies/sanjivni'
import { shot } from './figma'

// A real screen exported from Figma. Missing files fall back to an honest empty frame, never a mock-up.
export type Shot = { src: string; alt: string }

// Case studies are a list of sections; each section is a list of simple blocks (see CaseStudyBlocks).
export type Block =
  | { type: 'p'; text: string }
  | { type: 'quote'; label?: string; text: string }
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'stats'; title?: string; items: { value: string; label: string }[]; note?: string }
  | { type: 'cards'; title?: string; cols?: 2 | 3; items: { title: string; text: string }[] }
  | { type: 'steps'; title?: string; items: { title: string; text?: string }[] }
  | { type: 'persona'; name: string; role: string; facts: string[]; frustrations: string[]; goals: string[] }
  | { type: 'screens'; title?: string; label?: string; items: Shot[]; captions?: string[] }
  | { type: 'palette'; title?: string; note?: string; colors: { name: string; hex: string }[] }
  | { type: 'links'; items: { label: string; href: string }[] }

export type CaseSection = { id: string; title: string; blocks: Block[] }

export type CaseStudyData = {
  overview: { role: string; timeline?: string; platform: string; discipline: string[] }
  sections: CaseSection[]
}

export type Project = {
  slug: string
  name: string
  namePending?: boolean // working title: Vipul has not confirmed the final name
  featured: boolean // only featured projects appear on the homepage
  category: string
  semester: string
  summary: string // one or two short sentences for the homepage card
  tags: string[]
  cover?: Shot // single screen for the hero preview frames
  previews: Shot[] // three screens for the homepage card
  previewLabel: string // honest label for what the screens are ("Final UI" or "Low-fidelity wireframes")
  caseStudy: CaseStudyData
}

const projectRecords: Project[] = [
  {
    slug: 'phtopy',
    name: 'Phtopy',
    featured: true,
    category: 'Campus Services UX',
    semester: '3rd semester',
    summary:
      'A campus printing solution that lets students upload documents, choose printing preferences, review estimated costs, and track orders using a digital pickup token — cutting queue time at Siddhi Store.',
    tags: ['Mobile App', 'User Research', 'Usability Testing'],
    cover: { src: '/projects/phtopy/cover.jpg', alt: 'Phtopy - Print without the queue Case study' },
    previews: [shot('phtopy', 'home'), shot('phtopy', 'tracker'), shot('phtopy', 'upi')],
    previewLabel: 'Case Study',
    caseStudy: phtopy,
  },
  {
    slug: 'red-bus-kids',
    name: 'RedBus Kids',
    featured: true,
    category: "Kids' Mobile App UX",
    semester: '2nd semester',
    summary:
      'A child-friendly bus booking experience with visual guidance, voice instructions, step-by-step booking, parent approval, live tracking, and SOS support.',
    tags: ['Child-centred UX', 'Mobile App', 'Visual Design'],
    cover: { src: '/projects/red-bus-kids/cover.jpg', alt: 'RedBus Kids Case study' },
    previews: [shot('red-bus-kids', 'book'), shot('red-bus-kids', 'home'), shot('red-bus-kids', 'track')],
    previewLabel: 'Case Study',
    caseStudy: redBusKids,
  },
  {
    slug: 'parkora',
    name: 'Parkora',
    featured: true,
    category: 'Smart Parking UX',
    semester: '1st & 2nd semester',
    summary:
      'A mobile parking app concept to help drivers discover nearby parking spaces, compare options, check availability, and book a spot before reaching their destination.',
    tags: ['Mobile UX', 'User Research', 'Wireframing'],
    cover: { src: '/projects/parkora/cover.jpg', alt: 'Parkora Case study' },
    previews: [
      { src: '/projects/parkora/final-nearby.png', alt: 'Nearby Parking search & available spots' },
      { src: '/projects/parkora/final-details.png', alt: 'Parking location details' },
      { src: '/projects/parkora/final-booking.png', alt: 'Booking details & pricing' },
    ],
    previewLabel: 'Case Study',
    caseStudy: parkora,
  },
  {
    slug: 'indu-cafe',
    name: 'Indu Cafe',
    featured: true,
    category: 'Campus Dining UX',
    semester: '2nd semester',
    summary:
      'A digital cafe management system with digital menus, pre-ordering, live order tracking, and a staff management experience designed for campus food service.',
    tags: ['Mobile App', 'User Research', 'Dual-App System'],
    cover: { src: '/projects/indu-cafe/cover.jpg', alt: 'Indu Cafe Case study' },
    previews: [shot('indu-cafe', 'menu'), shot('indu-cafe', 'home'), shot('indu-cafe', 'track')],
    previewLabel: 'Case Study',
    caseStudy: induCafe,
  },
  {
    slug: 'sanjivni',
    name: 'Sanjivni',
    featured: true,
    category: 'Healthcare Access UX',
    semester: '2nd semester',
    summary:
      'A healthcare app concept to help people in rural and small-town areas find essential medicines, check pharmacy availability, compare prices, and access home delivery.',
    tags: ['Healthcare UX', 'User Research', 'Wireframing'],
    cover: { src: '/projects/sanjivni/cover.jpg', alt: 'Sanjivni Case study' },
    previews: [shot('sanjivni', 'stores'), shot('sanjivni', 'home'), shot('sanjivni', 'delivery')],
    previewLabel: 'Case Study',
    caseStudy: sanjivni,
  },
]

const projectBySlug = new Map(projectRecords.map((project) => [project.slug, project]))
const projectOrder = ['parkora', 'sanjivni', 'indu-cafe', 'red-bus-kids', 'phtopy'] as const

// A single order drives the homepage, project navigation and every case-study lookup.
export const projects: Project[] = projectOrder.map((slug) => {
  const project = projectBySlug.get(slug)
  if (!project) throw new Error(`Missing project data for ${slug}`)
  return project
})

export const featuredProjects = projects.filter((p) => p.featured)

export const getProject = (slug: string | undefined) => projects.find((p) => p.slug === slug)

export const getNextProject = (currentSlug: string | undefined) => {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug)
  if (currentIndex === -1) return projects[0]
  const nextIndex = (currentIndex + 1) % projects.length
  return projects[nextIndex]
}
