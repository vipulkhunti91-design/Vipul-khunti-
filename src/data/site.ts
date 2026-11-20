export type SiteLink = { label: string; href: string }

export type SocialLink = { label: string; href: string; platform: 'linkedin' | 'instagram' | 'whatsapp' }

export type DesignApproachStep = {
  number: string
  title: string
  description: string
  deliverables: string[]
}

// null / empty means "not provided yet": the UI shows a Pending note or hides the item.
export const site: {
  name: string
  role: string
  status: string
  headline: string
  headlineAccent: string
  intro: string
  story: string
  aboutParagraphs?: string[]
  journey: {
    origin: string
    transition: string
    philosophy: string
  }
  educationHistory: {
    number: string
    degree: string
    focus: string
    institution: string
    location: string
    period: string
  }[]
  education: {
    degree: string
    focus: string
    note?: string
  }
  designApproach: DesignApproachStep[]
  skills: {
    category: string
    description: string
    items: string[]
  }[]
  skillCategories: {
    title: string
    badge: string
    skills: {
      name: string
      tag?: string
    }[]
  }[]
  skillItems: {
    name: string
    description: string
  }[]
  interests: string[]
  learningGoals: string[]
  email: string | null
  links: SiteLink[]
  resume: string | null
  // social: placeholder URLs — replace with real profile links
  social: SocialLink[]
} = {
  name: 'Vipul Khunti',
  role: 'UI/UX Design Student',
  status: 'Open to UI/UX Internships',
  headline: "Hi, I'm Vipul Khunti.",
  headlineAccent: '',
  intro:
    "I'm a UI/UX Design student passionate about creating simple, thoughtful, and user-friendly digital experiences. I enjoy understanding user problems, exploring creative ideas, and turning them into meaningful design solutions.",
  story:
    "I'm a UI/UX design student with a background in Computer Applications and a growing interest in creating meaningful digital experiences. My interest in design started during my BCA, when I discovered that I enjoyed working on layouts, visual elements, and understanding how people interact with digital products. Originally from Porbandar, Gujarat, I moved to Ahmedabad to pursue my Master's in Design at Indus University.",
  aboutParagraphs: [
    "I'm a UI/UX design student with a background in Computer Applications and a growing interest in creating meaningful digital experiences.",
    "My interest in design started during my BCA, when I discovered that I enjoyed working on layouts, visual elements, and understanding how people interact with digital products. This motivated me to explore UI/UX design and turn my interest in creativity and technology into a career.",
    "Originally from Porbandar, Gujarat, I moved to Ahmedabad to pursue my Master's in Design at Indus University. I'm currently learning and improving my skills through hands-on projects, exploring user research, wireframing, prototyping, and visual design.",
    "I enjoy understanding problems, exploring ideas, and turning them into simple, useful, and thoughtful experiences. I'm always curious to learn, experiment, and grow as a designer.",
  ],
  journey: {
    origin: 'BCA (Bachelor of Computer Applications) background from Porbandar, Gujarat, providing a solid computational foundation.',
    transition:
      'Discovered a stronger interest in creativity, visual design, and understanding how people interact with digital products — which led me to UI/UX design.',
    philosophy: "My goal is to design products that not only look good but also make people's everyday lives easier.",
  },
  educationHistory: [
    {
      number: '01',
      degree: 'Higher Secondary Education (12th)',
      focus: 'Commerce',
      institution: 'Suruchi School',
      location: 'Porbandar, Gujarat',
      period: '2020 – 2021',
    },
    {
      number: '02',
      degree: 'Bachelor of Computer Applications (BCA)',
      focus: '',
      institution: 'Dr. V. R. Godhania College of Engineering & Technology',
      location: 'Porbandar, Gujarat',
      period: '2021 – 2025',
    },
    {
      number: '03',
      degree: 'Master of Design (M.Des)',
      focus: 'UI/UX Design',
      institution: 'Indus University',
      location: 'Ahmedabad, Gujarat',
      period: '2025 – Present',
    },
  ],
  education: {
    degree: 'Master of Design (M.Des)',
    focus: 'UI/UX Design',
    note: 'Indus University, Ahmedabad, Gujarat · 2025 – Present',
  },
  designApproach: [
    {
      number: '01',
      title: 'Empathize',
      description: 'Understand the user — observe, listen, and research to discover real needs and challenges through empathy.',
      deliverables: ['User Observations', 'Stakeholder Interviews', 'Empathy Maps'],
    },
    {
      number: '02',
      title: 'Research',
      description: 'Gather qualitative and quantitative insights through surveys, interviews, and secondary research to inform design decisions.',
      deliverables: ['User Surveys', 'Research Findings', 'Competitive Analysis'],
    },
    {
      number: '03',
      title: 'Define',
      description: 'Synthesize research into clear problem statements, user personas, and actionable "How Might We" challenges.',
      deliverables: ['Problem Statement', 'User Personas', 'HMW Statements'],
    },
    {
      number: '04',
      title: 'Ideate',
      description: 'Explore solutions through ideation, map out user journeys, define information architecture, and create wireframes.',
      deliverables: ['User Flows', 'Information Architecture', 'Wireframes'],
    },
    {
      number: '05',
      title: 'Design',
      description: 'Craft high-fidelity UI with consistent visual systems, interactive prototypes, and usability testing to validate the solution.',
      deliverables: ['High-Fidelity UI', 'Interactive Prototypes', 'Usability Testing'],
    },
  ],
  skills: [
    {
      category: 'UI/UX Design',
      description: 'Human-centered interfaces, user research & design architectures',
      items: [
        'UI Design',
        'UX Research',
        'Wireframing',
        'Prototyping',
        'User Flows',
        'Usability Testing',
        'Design Systems',
      ],
    },
    {
      category: 'Coding',
      description: 'Web structure, semantics & interface styling',
      items: ['HTML', 'CSS'],
    },
    {
      category: 'Tools & Software',
      description: 'Design production, editing & development environments',
      items: ['Figma', 'VS Code', 'Canva'],
    },
    {
      category: 'AI Tools',
      description: 'AI-assisted design iteration, research & code acceleration',
      items: ['ChatGPT', 'Claude', 'Google Antigravity', 'OpenAI Codex'],
    },
  ],
  skillCategories: [
    {
      title: 'UI/UX Design',
      badge: 'Core Competency',
      skills: [
        { name: 'UI Design', tag: 'Visual Craft' },
        { name: 'UX Research', tag: 'User Insights' },
        { name: 'Wireframing', tag: 'Low & Mid-Fi' },
        { name: 'Prototyping', tag: 'Interactive' },
        { name: 'User Flows', tag: 'Information Flow' },
        { name: 'Usability Testing', tag: 'Validation' },
        { name: 'Design Systems', tag: 'Components & Tokens' },
      ],
    },
    {
      title: 'Coding',
      badge: 'Frontend',
      skills: [
        { name: 'HTML', tag: 'Semantic Markup' },
        { name: 'CSS', tag: 'Layout & Styling' },
      ],
    },
    {
      title: 'Tools & Software',
      badge: 'Production',
      skills: [
        { name: 'Figma', tag: 'Primary Design Tool' },
        { name: 'VS Code', tag: 'Code Editor' },
        { name: 'Canva', tag: 'Visual Media' },
      ],
    },
    {
      title: 'AI Tools',
      badge: 'AI & Automation',
      skills: [
        { name: 'ChatGPT', tag: 'Ideation & Prompting' },
        { name: 'Claude', tag: 'Analysis & Synthesis' },
        { name: 'Google Antigravity', tag: 'Agentic Workflows' },
        { name: 'OpenAI Codex', tag: 'Code Assistance' },
      ],
    },
  ],
  skillItems: [
    { name: 'UX / UI Design', description: 'User interface & interaction craftsmanship' },
    { name: 'Product Design', description: 'End-to-end digital product workflows' },
    { name: 'Design Systems', description: 'Component libraries, design tokens & scalability' },
    { name: 'Front-End Development', description: 'Web fundamentals & interface engineering' },
    { name: 'User Testing', description: 'Concept validation & user feedback' },
    { name: 'Usability Testing', description: 'Task flows, friction analysis & ergonomics' },
    { name: 'Wireframing', description: 'Low & mid-fidelity layout architecture' },
    { name: 'Prototyping', description: 'Interactive flows & micro-interactions' },
  ],
  interests: ['User Research', 'Interaction Design', 'Mobile UX', 'Accessible UI', 'Design Systems'],
  learningGoals: [],
  email: 'vipulkhunti91@gmail.com',
  links: [],
  resume: 'https://drive.google.com/file/d/1dJBmaQ8AflIQK2qcL2_SE-G15fHNtz4B/view?usp=sharing',
  social: [
    { label: 'WhatsApp', href: 'https://wa.me/917096447726', platform: 'whatsapp' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vipul-khunti-2464313a3/', platform: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com/mr__vipul__khunti/', platform: 'instagram' },
  ],
}
