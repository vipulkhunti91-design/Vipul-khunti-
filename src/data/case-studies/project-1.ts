import type { CaseStudyData } from '../projects'
import { shot } from '../figma'

const s = (key: string) => shot('project-1', key)

// Source: Figma file "Kid app study", frame "Cast" (print queue app). Working title until Vipul confirms the name.
export const printApp: CaseStudyData = {
  overview: {
    role: 'UI/UX Designer',
    platform: 'Mobile app',
    discipline: ['User Research', 'Information Architecture', 'Branding', 'UI Design', 'Usability Testing'],
  },
  sections: [
    {
      id: 'problem',
      title: 'The problem',
      blocks: [
        {
          type: 'p',
          text: 'At Indus University, students go to Siddhi Store for printing. During exams and on assignment submission days the lines are so long that a single printout can take a long time, and students sometimes miss class or deadlines. Shopkeepers struggle too: files arrive over WhatsApp and they have to keep asking for print settings.',
        },
        {
          type: 'quote',
          label: 'Problem statement',
          text: 'Students at Indus University need a convenient way to get their documents printed at Siddhi Store, because long queues, especially during peak academic periods, make it difficult to get printing done on time.',
        },
      ],
    },
    {
      id: 'research',
      title: 'Research',
      blocks: [
        {
          type: 'p',
          text: 'I ran a Google Form survey with 25 students and reviewed four research papers on campus and mobile printing systems.',
        },
        {
          type: 'list',
          title: 'What the survey asked',
          items: [
            'How long do students wait?',
            'What do they print?',
            'Where do they print?',
            'What did they do when they noticed a mistake in a print?',
          ],
        },
        {
          type: 'list',
          title: 'Themes that came up',
          items: [
            'Most students use the college print shop',
            'Print shops are overcrowded',
            'Waits of 10+ minutes for a single print',
            'The shop is sometimes closed',
            'Prints with mistakes, and paying extra for another print',
          ],
        },
        {
          type: 'list',
          title: 'What students did when a print had a mistake',
          items: [
            'Asked the shopkeeper for a reprint',
            'Pointed out the incorrect print and waited in the queue again',
            'Checked the pages to spot the issue, or asked a friend',
            'Went to another shop, or printed early and came back',
            'Missed class to wait',
          ],
        },
        {
          type: 'cards',
          title: 'Secondary research',
          cols: 3,
          items: [
            {
              title: 'Queues cost class time',
              text: 'Students waste time in long queues near the end of the semester and can miss classes or attendance. One paper proposes an Android app to find nearby shops, check per-page prices, upload PDFs, see the expected ready time, pay online and collect or get delivery.',
            },
            {
              title: 'Online campus printing',
              text: 'Campus printing can be slow and inefficient. An online printing system can manage users, uploaded files, orders, copies, colour settings, payments and bills, and help shops manage their work.',
            },
            {
              title: 'Common print errors',
              text: 'Frequent mistakes are colours that differ from the screen, blurry images, wrong margins, file-preparation errors, missing fonts and not checking the final proof.',
            },
          ],
        },
      ],
    },
    {
      id: 'insights',
      title: 'Insights and how might we',
      blocks: [
        {
          type: 'cards',
          title: 'Key insights',
          items: [
            { title: 'Dependence on the college shop', text: 'Most students rely on the college print shop, so shop availability and service speed matter a lot.' },
            { title: 'Long queues waste time', text: "During busy academic periods, crowded shops and long waits can disrupt students' schedules and even make them miss classes." },
            { title: 'Files should arrive in advance', text: 'Students should be able to upload documents and choose print settings before reaching the shop, which cuts counter waiting and repeated questions.' },
            { title: 'Mistakes create extra work', text: 'Incorrect printing leads to reprints, wasted paper and extra cost. Common causes are blurry images, wrong margins, colour differences and missing fonts.' },
            { title: 'Students need clear order information', text: 'Prices, shop availability, expected completion time and order status should be visible instead of asked at the counter.' },
          ],
        },
        {
          type: 'list',
          title: 'How might we…',
          items: [
            'Help students get their files and print details ready before visiting the shop?',
            'Reduce the time students spend waiting during busy hours?',
            'Help students know whether the shop is open and how busy it is before visiting?',
            'Make it easier for students to share their documents with the shop before they arrive?',
            'Help students understand printing options, settings and costs before placing an order?',
          ],
        },
      ],
    },
    {
      id: 'people',
      title: 'Personas',
      blocks: [
        {
          type: 'cards',
          cols: 2,
          items: [
            {
              title: 'Mehul Gohel, student',
              text: '20 years, Ahmedabad. ₹0–5,000 a month. Uses a smartphone, laptop and UPI. Interests: gaming, YouTube, music and friends.',
            },
            {
              title: 'Tenmay Kalal, print shop owner',
              text: "35 years, Ahmedabad. Bachelor's degree, ₹25,000–40,000 a month. Uses a smartphone, WhatsApp, UPI and a basic computer.",
            },
          ],
        },
      ],
    },
    {
      id: 'ideation',
      title: 'Ideation and structure',
      blocks: [
        {
          type: 'list',
          title: 'Feature ideas',
          items: [
            'Token system and live token',
            'Single-side and double-side printing',
            'Multiple paper sizes and paper types',
            'Save print settings',
            'Pickup time selection',
            'Payment options and total amount',
            'Order history and printing status',
            'Shop open or closed and order delay',
            'Estimated print-ready time',
            'Language settings',
          ],
        },
        {
          type: 'cards',
          title: 'Information architecture',
          cols: 2,
          items: [
            { title: 'Home', text: 'Start printing · Active order and pickup token · Queue status and now serving · Shop open or closed' },
            { title: 'Upload and settings', text: 'Upload documents · Documents and page count · Default print settings' },
            { title: 'Notifications', text: 'Printing started · Ready for pickup · Payment done · Payment failure' },
            { title: 'History and profile', text: 'Previous orders · Order details · Payment history · Language: English, Hindi, Gujarati · Help and FAQs' },
          ],
        },
      ],
    },
    {
      id: 'identity',
      title: 'Visual identity',
      blocks: [
        {
          type: 'p',
          text: 'The brand uses a printer-inspired wordmark, with the printer built into the letter “t”. The interface is dark with Butter Gold used only where it matters, set in Manrope.',
        },
        {
          type: 'palette',
          colors: [
            { name: 'Primary accent', hex: '#F4D779' },
            { name: 'Background', hex: '#0A0A0A' },
            { name: 'Cards and inputs', hex: '#171717' },
            { name: 'Headings and text', hex: '#F2F3F7' },
          ],
        },
        {
          type: 'list',
          title: 'Brand guidelines',
          items: [
            'Use Butter Gold only for important actions and selected states',
            'Keep text contrast high and readable',
            'Use dark surfaces for cards and input fields',
            'Keep a consistent 12px corner radius',
            'Keep touch targets at least 44×44px',
            'Avoid unnecessary gradients, neon effects and clutter',
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
          items: [s('home'), s('settings'), s('paper'), s('layout'), s('bill'), s('upi'), s('tracker'), s('qr'), s('notifications'), s('history')],
          captions: ['Home', 'Print settings: essentials', 'Paper stock', 'Layout and finishing', 'Bill review', 'UPI payment', 'Live token tracker', 'Counter QR', 'Notifications', 'History'],
        },
        {
          type: 'links',
          items: [
            { label: 'Open the live prototype', href: 'https://print-app-kohl.vercel.app/' },
            { label: 'Earlier version', href: 'https://phtopy.vercel.app/' },
          ],
        },
      ],
    },
    {
      id: 'testing',
      title: 'Usability testing',
      blocks: [
        { type: 'p', text: 'I tested the first version with 5 students using usability testing. Their feedback shaped what to improve next.' },
        {
          type: 'cards',
          title: 'Key findings',
          items: [
            { title: 'UI design', text: 'The interface looked too plain and needed a more attractive, engaging design.' },
            { title: 'Colour scheme', text: 'The colours did not feel suitable. Students suggested a more balanced combination.' },
            { title: 'Home screen layout', text: 'Too many options made it hard to know where to start.' },
            { title: 'Navigation', text: 'Options were not clearly organised, which made navigation confusing.' },
            { title: 'Order token placement', text: 'The token was not well positioned and needed better presentation.' },
            { title: 'Visual hierarchy', text: 'Important information and actions did not stand out, so the next step was unclear.' },
          ],
        },
      ],
    },
    {
      id: 'next',
      title: 'Next steps',
      blocks: [
        {
          type: 'list',
          items: [
            'Refine the interface based on the testing feedback',
            'Simplify navigation so the next step is always clear',
            'Test all screens and interactions for usability issues',
            'Add sign-in and registration so each user sees only their own orders and tokens',
            'Connect the app to Firebase for real-time order tracking, file management and payments',
            'Fix identified issues and prepare for final development and handoff',
          ],
        },
      ],
    },
  ],
}
