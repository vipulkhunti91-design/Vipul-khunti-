import type { BentoItem } from '../components/BentoGrid'

export const bentoSkillItems: BentoItem[] = [
  {
    id: 'ui-ux',
    categoryNumber: '01',
    title: 'UI/UX Design',
    meta: '7 Core Disciplines',
    badge: 'Core Competency',
    description:
      'Human-centered user interfaces, behavioral user research, scalable design systems, and rapid interactive prototyping.',
    colSpan: 2,
    icon: (
      <svg
        className="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    tags: ['DesignSystems', 'Prototyping', 'UXResearch'],
    cta: 'Core Focus',
    skills: [
      {
        name: 'UI Design',
        tag: 'Visual Craft',
        icon: (
          <svg
            className="size-4 shrink-0 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        ),
      },
      {
        name: 'UX Research',
        tag: 'User Insights',
        icon: (
          <svg
            className="size-4 shrink-0 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="M11 8v6" />
            <path d="M8 11h6" />
          </svg>
        ),
      },
      {
        name: 'Wireframing',
        tag: 'Low & Mid-Fi',
        icon: (
          <svg
            className="size-4 shrink-0 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" strokeDasharray="2 2" />
            <path d="M9 21V9" strokeDasharray="2 2" />
          </svg>
        ),
      },
      {
        name: 'Prototyping',
        tag: 'Interactive',
        icon: (
          <svg
            className="size-4 shrink-0 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        ),
      },
      {
        name: 'User Flows',
        tag: 'Information Flow',
        icon: (
          <svg
            className="size-4 shrink-0 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="18" r="3" />
            <path d="M6 9v3a3 3 0 0 0 3 3h6" />
            <path d="m15 12 3 3-3 3" />
          </svg>
        ),
      },
      {
        name: 'Usability Testing',
        tag: 'Validation',
        icon: (
          <svg
            className="size-4 shrink-0 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
          </svg>
        ),
      },
      {
        name: 'Design Systems',
        tag: 'Tokens & Components',
        icon: (
          <svg
            className="size-4 shrink-0 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="m2 17 10 5 10-5" />
            <path d="m2 12 10 5 10-5" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'coding',
    categoryNumber: '02',
    title: 'Coding',
    meta: '2 Web Standards',
    badge: 'Frontend',
    description:
      'Semantic markup, accessible web foundations, and responsive interface stylesheet engineering.',
    colSpan: 1,
    icon: (
      <svg
        className="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    tags: ['HTML5', 'CSS3'],
    cta: 'Web Stack',
    skills: [
      {
        name: 'HTML',
        tag: 'Semantic Markup',
        icon: (
          <svg className="size-4 shrink-0 fill-[#E34F26]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm16.5 5.5H6l.4 4.5h11.2l-.4 4.5-5.2 1.5-5.2-1.5-.2-2.2H4.2l.4 4.5 7.4 2.1 7.4-2.1 1-10.8z" />
          </svg>
        ),
      },
      {
        name: 'CSS',
        tag: 'Layout & Styling',
        icon: (
          <svg className="size-4 shrink-0 fill-[#1572B6]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0zm16.4 5.5H6.1l.3 3.5h11.4l-.4 4.5-5.4 1.5-5.4-1.5-.3-3H4.3l.5 5.3 7.2 2 7.2-2 1-11.8z" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'tools',
    categoryNumber: '03',
    title: 'Tools & Software',
    meta: '3 Production Suites',
    badge: 'Production',
    description:
      'Industry-standard design applications, code editing environments, and visual media production.',
    colSpan: 1,
    icon: (
      <svg
        className="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
    tags: ['Figma', 'VSCode', 'Canva'],
    cta: 'Design Tools',
    skills: [
      {
        name: 'Figma',
        tag: 'Primary Design Tool',
        icon: (
          <svg className="size-4 shrink-0" viewBox="0 0 38 57" fill="none" aria-hidden="true">
            <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
            <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
            <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
            <path d="M0 9.5a9.5 9.5 0 0 0 9.5 9.5H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
            <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
          </svg>
        ),
      },
      {
        name: 'VS Code',
        tag: 'Code Editor',
        icon: (
          <svg className="size-4 shrink-0 fill-[#007ACC]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .32 8.704l3.523 3.284-3.523 3.284a1 1 0 0 0 .007 1.443l1.322 1.202c.38.346.953.37 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.93a1.5 1.5 0 0 0-.85-1.343zM18 17.202l-6.19-4.87L18 7.462v9.74z" />
          </svg>
        ),
      },
      {
        name: 'Canva',
        tag: 'Visual Media',
        icon: (
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#00C4CC" />
            <path
              d="M15.5 10.5c-.8-1.5-2.2-2-3.5-2-2.8 0-4.5 2-4.5 4.5 0 2.8 2 4.5 4.5 4.5 1.5 0 2.8-.7 3.5-1.8"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'ai-tools',
    categoryNumber: '04',
    title: 'AI Tools',
    meta: '4 Intelligent Workflows',
    badge: 'AI & Automation',
    description:
      'AI-assisted design iteration, user insight synthesis, agentic orchestration, and code acceleration.',
    colSpan: 2,
    icon: (
      <svg
        className="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </svg>
    ),
    tags: ['Claude', 'Antigravity', 'ChatGPT', 'Codex'],
    cta: 'AI Workflows',
    skills: [
      {
        name: 'ChatGPT',
        tag: 'Ideation & Prompting',
        icon: (
          <svg className="size-4 shrink-0 fill-[#10A37F]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.28 9.82a5.98 5.98 0 0 0-.51-4.91 6.05 6.05 0 0 0-6.51-2.9A6.06 6.06 0 0 0 10.43 0a5.98 5.98 0 0 0-5.45 3.52 6.05 6.05 0 0 0-3.99 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A6.06 6.06 0 0 0 13.57 24a5.98 5.98 0 0 0 5.45-3.52 6.05 6.05 0 0 0 3.99-2.9 6.05 6.05 0 0 0-.73-7.76zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.79.79 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.59a4.5 4.5 0 0 1-4.49 4.49zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.85-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.48 4.48 0 0 1 2.37-1.98v5.68a.77.77 0 0 0 .38.68l5.82 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.9zm16.6 3.85L13.1 8.36l2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.49 4.49 0 0 1-.68 8.1v-5.67a.79.79 0 0 0-.4-.67zm2.01-3.02l-.14-.09-4.78-2.78a.78.78 0 0 0-.78 0L9.4 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.14l-2.02-1.17a.08.08 0 0 1-.04-.05V6.07a4.5 4.5 0 0 1 7.37-3.45l-.14.08-4.78 2.76a.79.79 0 0 0-.39.68zm1.1-2.37l2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z" />
          </svg>
        ),
      },
      {
        name: 'Claude',
        tag: 'Analysis & Synthesis',
        icon: (
          <svg className="size-4 shrink-0 fill-[#D97757]" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.8 3.5c-.3 0-.6.2-.7.4L8.4 14.2l-3.2-6.5c-.2-.4-.6-.6-1-.5-.4.1-.7.4-.7.8l-1.5 12c-.1.5.2 1 .7 1.1.5.1 1-.2 1.1-.7l1.1-8.7 3.3 6.7c.2.4.6.6 1 .5.4-.1.7-.4.7-.8l4.7-10.3 1.1 8.7c.1.5.5.9 1 .9.5 0 .9-.4.9-.9l1.5-12c.1-.5-.2-1-.7-1.1-.1 0-.2-.1-.3-.1z" />
          </svg>
        ),
      },
      {
        name: 'Google Antigravity',
        tag: 'Agentic Workflows',
        icon: (
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="#4285F4" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" fill="#FBBC05" />
            <path d="M12 2v10" stroke="#EA4335" strokeWidth="1.5" />
            <path d="M12 12l9-5" stroke="#34A853" strokeWidth="1.5" />
            <path d="M12 12l-9 5" stroke="#4285F4" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        name: 'OpenAI Codex',
        tag: 'Code Assistance',
        icon: (
          <svg className="size-4 shrink-0 text-accent fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.28 9.82a5.98 5.98 0 0 0-.51-4.91 6.05 6.05 0 0 0-6.51-2.9A6.06 6.06 0 0 0 10.43 0a5.98 5.98 0 0 0-5.45 3.52 6.05 6.05 0 0 0-3.99 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9A6.06 6.06 0 0 0 13.57 24a5.98 5.98 0 0 0 5.45-3.52 6.05 6.05 0 0 0 3.99-2.9 6.05 6.05 0 0 0-.73-7.76zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.79.79 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.59a4.5 4.5 0 0 1-4.49 4.49zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.85-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.48 4.48 0 0 1 2.37-1.98v5.68a.77.77 0 0 0 .38.68l5.82 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.9zm16.6 3.85L13.1 8.36l2.02-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.49 4.49 0 0 1-.68 8.1v-5.67a.79.79 0 0 0-.4-.67zm2.01-3.02l-.14-.09-4.78-2.78a.78.78 0 0 0-.78 0L9.4 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.14l-2.02-1.17a.08.08 0 0 1-.04-.05V6.07a4.5 4.5 0 0 1 7.37-3.45l-.14.08-4.78 2.76a.79.79 0 0 0-.39.68zm1.1-2.37l2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z" />
          </svg>
        ),
      },
    ],
  },
]
