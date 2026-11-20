import type { CaseStudyData } from '../projects'
import { shot } from '../figma'

const s = (key: string) => shot('sanjivni', key)

// Source: Figma file "Kid app study", frame "Slide 16:9 - 11" / "Design thinking" (Sanjivni).
export const sanjivni: CaseStudyData = {
  overview: {
    role: 'UI/UX Designer',
    platform: 'Mobile app',
    discipline: ['User Research', 'Stakeholder Mapping', 'Information Architecture', 'Wireframing'],
  },
  sections: [
    {
      id: 'problem',
      title: 'The problem',
      blocks: [
        {
          type: 'p',
          text: 'Sanjivni focuses on medicine availability in rural and small towns around Ahmedabad. Rural patients often travel to the city to find essential medicines, losing time, money and energy. The app shows whether a medicine is available at a nearby store, and can have it ordered and delivered home if it is not.',
        },
        {
          type: 'quote',
          label: 'Problem statement',
          text: 'Patients in rural areas have trouble getting certain medicines because they are available only at a few hospitals or pharmacies in the main cities. This makes them travel multiple times, losing time, money and effort, with no easy way to know if a medicine is available nearby or to get it delivered from another city.',
        },
        {
          type: 'p',
          text: "A family member was prescribed a specific medicine. The local pharmacy didn't have it, nor did two or three more nearby stores, so someone finally had to travel to the main city to get it — costing both time and money, and leaning on whoever could make the trip.",
        },
      ],
    },
    {
      id: 'stakeholders',
      title: 'Target audience and stakeholders',
      blocks: [
        { type: 'list', title: 'Target audience', items: ['Rural patients', 'Family members', 'Local pharmacy stores', 'Healthcare workers and doctors'] },
        { type: 'list', title: 'Primary stakeholders', items: ['Patients', 'Pharmacists and store owners', 'Doctors and healthcare workers'] },
        { type: 'list', title: 'Secondary stakeholders', items: ['Delivery agents and courier services', 'Local health departments', 'Pharmaceutical distributors and wholesalers'] },
      ],
    },
    {
      id: 'research',
      title: 'Research',
      blocks: [
        {
          type: 'p',
          text: 'I surveyed 59 people with a Google Form and referenced the State of Healthcare in Rural India 2023 report (6,478 respondents).',
        },
        {
          type: 'stats',
          title: 'From the survey',
          items: [
            { value: '53.3%', label: 'buy medicine at more than one shop (only "mostly" available at one)' },
            { value: '54.2%', label: 'say high cost is their biggest problem' },
            { value: '89.8%', label: 'think home delivery would save time and energy' },
            { value: '69.5%', label: 'would use an app for medicine delivery' },
          ],
        },
        {
          type: 'cards',
          title: 'From the national report',
          cols: 2,
          items: [
            { title: 'Where people get care', text: 'Only 10% of rural people use primary government healthcare; 60% depend on secondary government facilities, 22% private hospitals, 5% private practitioners.' },
            { title: 'Travelling for treatment', text: '63% of rural patients travel outside their state for major illness treatment, and 90% prefer to shift districts within their state, mainly for better facilities and referrals.' },
            { title: 'Staffing shortages', text: 'Community health centres face a shortage of 1,206 specialists (only 32 surgeons where 320 are needed); PHCs and sub-centres need 9,310 staff but have 6,938, and 247 sub-centres run with no health workers.' },
            { title: 'Medicine supply', text: 'National medicine availability is only 17%–51%, with stock-outs lasting 4–14 weeks.' },
          ],
        },
        {
          type: 'list',
          title: 'What interviews surfaced',
          items: [
            'Essential medicines are often unavailable at the nearest store, so people ask friends or family, or travel to another city',
            'Calling around every store wastes time, especially when the phone isn’t answered',
            'Awareness of online medicine apps is low in rural and semi-urban areas',
            'Apps like PharmEasy work, but delivery delays make them of little use in an emergency',
            'Stores usually just say a medicine is unavailable, rarely saying where to find it',
          ],
        },
      ],
    },
    {
      id: 'people',
      title: 'Personas',
      blocks: [
        {
          type: 'persona',
          name: 'Rahul Bhai Solanki',
          role: 'Retired teacher, 60, Vadnagar, Gujarat',
          facts: ['Heart and blood pressure patient on daily medication. Moderate smartphone use (WhatsApp, calls). Lives with his wife; children work in another city.'],
          frustrations: ['Medicines are often unavailable at local pharmacies', 'Difficulty travelling due to age and no personal vehicle', 'Depends on relatives or neighbours to buy medication', 'Constantly worries about missing doses'],
          goals: ['Hassle-free home delivery of medication', 'Reliable, advance information on stock availability', 'Freedom in managing his own medication', 'Peace of mind from a consistent supply'],
        },
        {
          type: 'persona',
          name: 'Arjun Parmar',
          role: 'College student, 25, hostel resident, Dholera',
          facts: ['Takes care of his own health; occasionally needs medication for allergies or minor illness. High technology comfort, uses digital payments.'],
          frustrations: ['Fewer medicine options nearby', 'Inconvenient to buy some medicines in person', 'Travelling wastes study time', 'Medicines often unavailable during exams or travel'],
          goals: ['A simple app to check real-time availability', 'Confidential, secure ordering of sensitive medicines', 'Delivery to the hostel gate', 'Maximum convenience and time savings'],
        },
      ],
    },
    {
      id: 'competitors',
      title: 'Competitive analysis',
      blocks: [
        {
          type: 'p',
          text: 'Compared against Tata 1mg, NetMeds and PharmEasy on medicine discounts, lab test network, village and small-city delivery, customer trust, user experience and service range.',
        },
      ],
    },
    {
      id: 'ideation',
      title: 'Ideation and structure',
      blocks: [
        {
          type: 'cards',
          title: 'Feature ideas',
          cols: 2,
          items: [
            { title: 'Medicine search', text: 'Search by brand name, smart auto-suggestions, voice search, upload prescription, monthly auto-reminders, multi-language support.' },
            { title: 'Delivery', text: 'Real-time map tracking, OTP delivery confirmation, delivery area check by PIN code, step updates (packed, out for delivery, delivered), rate or review delivery.' },
            { title: 'Nearby medical stores', text: 'Map view of nearby pharmacies, distance filter (2 km and 5 km), open and closed status, call the store, compare prices across pharmacies.' },
            { title: 'Payment and trust', text: 'UPI, debit or credit card, or cash on delivery; ratings and reviews by users; discounts and combo offers; reward points; easy returns.' },
          ],
        },
        {
          type: 'cards',
          title: 'Information architecture',
          cols: 2,
          items: [
            { title: 'Login and home', text: 'Sign up with OTP · search by name with suggestions and voice search · upload prescription' },
            { title: 'Nearby medical stores', text: 'Distance filter · open/closed status · call the store · compare prices across pharmacies' },
            { title: 'Delivery', text: 'Map tracking updates · OTP delivery confirmation · delivery area check by PIN code · step updates' },
            { title: 'Payment and trust', text: 'UPI, card payment · ratings and reviews by user · discounts and offers · easy returns' },
          ],
        },
      ],
    },
    {
      id: 'wireframes',
      title: 'Wireframes',
      blocks: [
        {
          type: 'p',
          text: 'The project reached black-and-white, low-fidelity wireframes for login/sign-up, home, nearby medical stores and delivery. High-fidelity screens and a design system are the next step.',
        },
        { type: 'screens', label: 'Low-fidelity wireframes', items: [s('login'), s('home'), s('stores'), s('delivery')] },
      ],
    },
  ],
}
