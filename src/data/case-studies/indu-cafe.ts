import type { CaseStudyData } from '../projects'
import { shot } from '../figma'

const s = (key: string) => shot('indu-cafe', key)

export const induCafe: CaseStudyData = {
  overview: {
    role: 'UI/UX Designer',
    timeline: '2026',
    platform: 'Mobile app (Customer + Staff)',
    discipline: ['User Research', 'Information Architecture', 'Wireframing', 'UI Design', 'Usability Testing'],
  },
  sections: [
    {
      id: 'overview',
      title: 'Project overview',
      blocks: [
        {
          type: 'p',
          text: 'Indu Cafe is a digital food ordering and cafe management system designed to make ordering food on campus easier for students and managing daily orders more convenient for cafe staff.',
        },
        {
          type: 'p',
          text: 'During busy lunch hours, students face long queues, confusion while placing orders, and uncertainty about when their food will be ready. Cafe staff manage multiple orders, check food availability, and handle payments simultaneously.',
        },
        {
          type: 'quote',
          label: 'Problem statement',
          text: 'During peak lunch hours, students experience long queues, unclear menu information, and delays in receiving their orders. Cafe staff also struggle to manage multiple orders and track their progress manually.',
        },
      ],
    },
    {
      id: 'research',
      title: 'Research',
      blocks: [
        {
          type: 'p',
          text: 'I explored customer and cafe staff experiences through surveys and observations during busy lunch hours.',
        },
        {
          type: 'list',
          title: 'Research focus areas',
          items: [
            'Problems faced during peak lunch hours',
            'Menu visibility and food availability',
            'Waiting time and order tracking',
            'Challenges faced by cafe staff',
            'Opportunities to improve daily order management',
          ],
        },
        {
          type: 'stats',
          title: 'Key findings',
          note: 'From customer survey',
          items: [
            { value: '85%', label: 'of customers felt unsure about when their orders would be ready' },
            { value: '70%', label: 'found it difficult to view the menu clearly during rush hours' },
          ],
        },
      ],
    },
    {
      id: 'insights',
      title: 'Key insights',
      blocks: [
        {
          type: 'cards',
          items: [
            { title: 'Order completion uncertainty', text: 'Customers need to know when their food will be ready. Uncertainty causes frustration during busy periods.' },
            { title: 'Menu visibility', text: 'The menu should be easy to view and understand, even during peak hours when the cafe is crowded.' },
            { title: 'Manual order management', text: 'Staff need a better system to track multiple orders and manage their daily cafe operations efficiently.' },
          ],
        },
      ],
    },
    {
      id: 'design-approach',
      title: 'Design approach',
      blocks: [
        {
          type: 'p',
          text: 'I designed two connected experiences: a customer app for browsing, ordering, and tracking; and a staff app for order management, inventory, and sales.',
        },
        {
          type: 'cards',
          cols: 2,
          title: 'Two connected apps',
          items: [
            {
              title: 'Customer app',
              text: 'Digital food menu · food availability · advance ordering · table ordering · payment options · live order tracking.',
            },
            {
              title: 'Cafe staff app',
              text: 'Incoming orders · active order management · order status updates · food inventory · daily sales management.',
            },
          ],
        },
      ],
    },
    {
      id: 'process',
      title: 'Design process',
      blocks: [
        {
          type: 'steps',
          items: [
            { title: 'Research & Analysis', text: 'Studied customer and cafe staff experiences to understand problems caused by queues, unclear food availability, and delays.' },
            { title: 'Information Architecture', text: 'Organised features for both applications — customer app focuses on browsing and ordering; staff app focuses on order management and inventory.' },
            { title: 'Wireframing & Prototyping', text: 'Created user flows and wireframes to establish the structure and navigation of both applications.' },
            { title: 'Visual Design', text: 'Developed a consistent visual direction using a yellow-based colour palette, clean layouts, and Poppins typography.' },
            { title: 'Usability Testing', text: 'Included usability testing and user feedback to identify opportunities to improve the experience.' },
          ],
        },
      ],
    },
    {
      id: 'system',
      title: 'Visual design',
      blocks: [
        {
          type: 'p',
          text: 'The interface uses a warm yellow-based colour palette with clean, readable layouts set in Poppins, designed to feel approachable and efficient for a campus cafe environment.',
        },
        {
          type: 'palette',
          colors: [
            { name: 'Primary Yellow', hex: '#F5C518' },
            { name: 'Background', hex: '#FFFFFF' },
            { name: 'Text', hex: '#1A1A1A' },
          ],
        },
      ],
    },
    {
      id: 'final-ui',
      title: 'Final UI',
      blocks: [
        {
          type: 'screens',
          label: 'Final UI',
          items: [s('home'), s('menu'), s('track'), s('staff')],
          captions: ['Home', 'Digital menu', 'Order tracking', 'Staff dashboard'],
        },
      ],
    },
    {
      id: 'outcome',
      title: 'Design outcome',
      blocks: [
        {
          type: 'p',
          text: 'Indu Cafe connects customer ordering and cafe operations into one digital concept. The solution focuses on improving menu discovery, order placement, order visibility, and daily order management.',
        },
      ],
    },
  ],
}
