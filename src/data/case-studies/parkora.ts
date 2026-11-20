import type { CaseStudyData } from '../projects'
import { shot } from '../figma'

const s = (key: string) => shot('parkora', key)

// Source: Figma file "Kid app study", frame "Slide 16:9 - 5" (Park Oraa).
export const parkora: CaseStudyData = {
  overview: {
    role: 'UI/UX Designer',
    platform: 'Mobile app',
    discipline: ['User Research', 'Competitive Analysis', 'Information Architecture', 'Wireframing'],
  },
  sections: [
    {
      id: 'story',
      title: 'The story',
      blocks: [
        {
          type: 'p',
          text: 'We were given an assignment to look at a real-life problem and design a solution. While visiting Ahmedabad, I observed that near the riverfront, even where parking spaces were available, many people still parked their vehicles on the roadside. That made the parking problem visible.',
        },
        {
          type: 'p',
          text: 'Ahmedabad is facing a serious parking problem due to the rapid growth of private vehicles. This leads to illegal parking, traffic congestion and accidents.',
        },
        {
          type: 'quote',
          label: 'Problem statement',
          text: 'Despite the availability of suitable parking spaces, many people park their vehicles on the street. This causes traffic congestion, safety issues and inconvenience for pedestrians and other road users.',
        },
        { type: 'list', title: 'Target audience', items: ['Primary: car and two-wheeler users', 'Secondary: parking owners and city visitors', 'Tertiary: parking workers and traffic police'] },
      ],
    },
    {
      id: 'research',
      title: 'Research',
      blocks: [
        { type: 'p', text: 'I surveyed 43 people with a Google Form, then followed up with open-ended interviews.' },
        {
          type: 'cards',
          cols: 2,
          title: 'What the survey found',
          items: [
            { title: 'How often do people face parking problems?', text: 'Sometimes 41%, Often 23%, Always 17%, Rarely 19%.' },
            { title: 'Where do people usually park?', text: 'Legal parking 37%, private or commercial 34%, roadside 9%, wherever they can 18%.' },
            { title: 'Biggest problem while parking', text: 'No space available 41%, no signs or directions 18%, always full 14%, fear of a fine or towing 9%, too far 7%.' },
            { title: 'Have people used a parking app?', text: '57% said no, and most don’t remember using one — people want an app to easily find parking.' },
          ],
        },
        {
          type: 'list',
          title: 'What interviews surfaced',
          items: [
            'Biggest problems cluster around Gandhi Road, Sindhu Bhavan and Lal Darwaja, worst in the evening and at night, and worse on weekends',
            'Most people prefer private parking because it feels safer and more secure for long stays, sometimes 10+ hours',
          ],
        },
        {
          type: 'cards',
          title: 'Secondary research',
          cols: 3,
          items: [
            { title: 'Rapid vehicle growth', text: 'Two-wheelers in Ahmedabad grew from 1.24 lakh (2015) to 1.8 lakh (2023); cars grew from 30,788 to 67,317. Public transport ridership (AMTS/BRTS) fell from 7 lakh to 6 lakh.' },
            { title: 'Slow traffic', text: 'During peak hours it takes an average of 29 minutes to travel 10 km, making Ahmedabad the 7th slowest city in India. Main traffic areas: Vastrapur, Juhapura, Lal Darwaza and Kalupur.' },
            { title: 'A city pilot project', text: 'The AMC is piloting a night-time pay-and-park system on Sindhu Bhavan Road, Rajpath-Rangoli Road and ISKCON-Ambli Road, using vacant spaces at banks, schools and commercial complexes.' },
          ],
        },
      ],
    },
    {
      id: 'people',
      title: 'Personas and empathy',
      blocks: [
        {
          type: 'persona',
          name: 'Rajesh Patel',
          role: 'Office worker, 34, Navrangpura',
          facts: ['Drives a Skoda daily and struggles to find proper parking near his office, especially during peak hours.'],
          frustrations: ['Cannot find parking near the office during peak hours', 'Gets fined for roadside or illegal parking', 'Wastes 10–20 minutes daily searching', 'Feels stressed about car safety in open, unsecured areas'],
          goals: ['Easy directions to the nearest parking spots', 'Affordable, convenient parking options', 'A safe, monitored area to park in'],
        },
        {
          type: 'persona',
          name: 'Rahul Shah',
          role: 'Gym trainer, 30, Maninagar',
          facts: ['Drives a Swift and faces regular parking problems from unclear signage and limited secure spaces nearby.'],
          frustrations: ['Unclear or missing parking signs', 'Limited secure parking spaces', 'Wasted time searching', 'Parking far from the destination'],
          goals: ['Find nearby parking quickly', 'Clear directions to parking spots', 'A safe, secure place to park', 'Save time during daily travel'],
        },
      ],
    },
    {
      id: 'competitors',
      title: 'Competitive analysis',
      blocks: [
        { type: 'p', text: 'Compared against SpotHero, ParkMobile and AmdaPark on availability, advance booking, easy payments and local parking management.' },
        {
          type: 'cards',
          cols: 2,
          title: 'Park Oraa vs. AmdaPark',
          items: [
            { title: 'Layout and navigation', text: 'Park Oraa: clean, well spaced, easy and guided. AmdaPark: basic and a bit crowded.' },
            { title: 'Map experience', text: 'Park Oraa: mini map plus a direct full map. AmdaPark: direct full map only.' },
            { title: 'Information', text: 'Park Oraa: clear price, time and safety details. AmdaPark: not very clear.' },
            { title: 'Feedback and language', text: 'Park Oraa: proper ratings, feedback and multiple languages. AmdaPark: basic feedback, limited language support.' },
          ],
        },
      ],
    },
    {
      id: 'journey',
      title: 'User journey',
      blocks: [
        { type: 'steps', title: 'Stages', items: [{ title: 'Arrival' }, { title: 'Search' }, { title: 'Park' }, { title: 'Payment' }, { title: 'Out' }] },
        {
          type: 'cards',
          cols: 2,
          items: [
            { title: 'Pain points', text: 'Long queue and cash-only payment · time wasted · tight space and congestion' },
            { title: 'Opportunities', text: 'QR or digital payment with online booking · organised parking space · separate exit lanes for better traffic flow' },
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
          title: 'Features chosen after card sorting',
          items: [
            'View parking image and safety features',
            'Multi-language support',
            'Map navigation and nearby parking',
            'Search and input by location',
            'Easy digital and offline payments',
            'Extend parking time',
            'Smart notifications and security features',
            'List and map view',
            'Verified and rated parking and app',
          ],
        },
        {
          type: 'cards',
          title: 'Information architecture',
          cols: 2,
          items: [
            { title: 'Home', text: 'Search and input · map view with parking, price and time · nearby parking list, view, slots and navigation' },
            { title: 'Booking and pay', text: 'Parking types (two-wheeler, four-wheeler) · easy digital and offline payments · renting parking space' },
            { title: 'History', text: 'Last 7 days · last month' },
            { title: 'Profile', text: 'Verified and renting of app · smart notification · multi-language support' },
          ],
        },
      ],
    },
    {
      id: 'system',
      title: 'Design system',
      blocks: [
        { type: 'p', text: 'Headings in Space Grotesk, body text in Manrope, with a blue-and-white palette and a simple icon set.' },
        { type: 'palette', colors: [{ name: 'Blue', hex: '#2E6BE6' }, { name: 'White', hex: '#FFFFFF' }] },
      ],
    },
    {
      id: 'wireframes',
      title: 'Low-fidelity wireframes',
      blocks: [
        {
          type: 'p',
          text: 'The project reached low-fidelity wireframes covering duration and distance details, a mini map for nearby parking, a nearby parking list, safety features and staff counts, smart notifications and extending parking time. High-fidelity screens and a design system are the next step.',
        },
        {
          type: 'screens',
          label: 'Low-fidelity wireframes',
          items: [
            s('home'),
            s('list'),
            s('wire3'),
            s('wire4'),
            s('wire5'),
            s('wire6'),
            { src: '/projects/parkora/wire-slots.png', alt: 'Parking slot selection wireframe' },
            { src: '/projects/parkora/wire-filters.jpg', alt: 'Filters and parking category wireframe' },
          ],
        },
      ],
    },
    {
      id: 'final-ui',
      title: 'Final UI',
      blocks: [
        {
          type: 'p',
          text: 'High-fidelity mobile UI designed for rapid parking spot discovery, live navigation, advance slot reservation, and real-time receipt tracking in Ahmedabad.',
        },
        {
          type: 'screens',
          label: 'High-fidelity UI screens',
          items: [
            { src: '/projects/parkora/final-nearby.png', alt: 'Nearby Parking search & available spots' },
            { src: '/projects/parkora/final-details.png', alt: 'Parking location details, operating hours & amenities' },
            { src: '/projects/parkora/final-booking.png', alt: 'Booking details: vehicle type, time slot & price' },
            { src: '/projects/parkora/final-profile.png', alt: 'User profile and account settings' },
            { src: '/projects/parkora/final-profile-edit.png', alt: 'Profile edit and vehicle information' },
            { src: '/projects/parkora/final-history.png', alt: 'Parking booking history and receipts' },
          ],
          captions: [
            'Nearby Parking List',
            'Spot & Safety Details',
            'Reservation & Pricing',
            'User Profile',
            'Profile Management',
            'Booking History',
          ],
        },
        {
          type: 'links',
          items: [
            {
              label: 'Explore Live Interactive Prototype',
              href: 'https://parkora-beige.vercel.app/',
            },
          ],
        },
      ],
    },
  ],
}
