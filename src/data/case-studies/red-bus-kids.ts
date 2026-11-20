import type { CaseStudyData } from '../projects'
import { shot } from '../figma'

const s = (key: string) => shot('red-bus-kids', key)

// Source: Figma file "Kid app study", frame "Slide 16:9 - 4" and the Android Compact screens on Page 2.
export const redBusKids: CaseStudyData = {
  overview: {
    role: 'UI/UX Designer',
    platform: 'Android',
    discipline: ['Observation', 'User Research', 'Personas', 'Journey Mapping', 'UI Design', 'Design System'],
  },
  sections: [
    {
      id: 'problem',
      title: 'The problem',
      blocks: [
        {
          type: 'p',
          text: 'Children could not use the RedBus app properly. It has too much text and too many options, so children tap randomly, get stuck during booking or close the app, and cannot book without help from their parents.',
        },
        {
          type: 'quote',
          label: 'Problem statement',
          text: 'RedBus is made for adults, with many steps and a lot of text, which makes it hard and uninteresting for children to use on their own. Children find it difficult to understand and complete the booking process without help.',
        },
        { type: 'list', title: 'Target audience', items: ['Primary: children', 'Secondary: parents'] },
        {
          type: 'steps',
          title: 'Design process',
          items: [{ title: 'Observation' }, { title: 'Empathize' }, { title: 'Define' }, { title: 'Ideate' }, { title: 'Design' }],
        },
      ],
    },
    {
      id: 'research',
      title: 'Research',
      blocks: [
        {
          type: 'p',
          text: 'Primary research reached 14 children and 13 parents.',
        },
        {
          type: 'stats',
          items: [
            { value: '14', label: 'children surveyed' },
            { value: '13', label: 'parents surveyed' },
            { value: '100%', label: 'of children like apps with pictures and icons' },
          ],
        },
        {
          type: 'cards',
          cols: 2,
          title: 'What I asked',
          items: [
            { title: 'Children', text: 'What is difficult for you? Is booking a bus ticket easy? Do you like apps with pictures and icons? Do you want your parents to check before booking? What do you like more: a simple UI or voice guidance?' },
            { title: 'Parents', text: 'How easy are these apps to use? How important is safety when children travel alone? Can children use these apps on their own? What problems do children face? How important is parent approval before booking or payment?' },
          ],
        },
        {
          type: 'list',
          title: 'Problems parents named',
          items: ['Payment issues', 'Safety concerns', 'Hard language', 'Too many options', 'Confusing interface'],
        },
        {
          type: 'cards',
          title: 'Secondary research',
          cols: 2,
          items: [
            {
              title: 'Motion and attention',
              text: 'An eye-tracking study of animated storybooks found that children pay more attention to moving visuals than still images, and understand stories better when visuals and narration match. Animation guided attention to important details instead of distracting.',
            },
            {
              title: 'Privacy-friendly apps for children',
              text: 'Many children’s apps include data tracking and targeted advertising. Developers want simple design guidelines and easy tools to build safer apps, but worry that stronger privacy could hurt growth.',
            },
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
          name: 'Jay Patel',
          role: 'Child, 14 years',
          facts: [
            'Goals: wants tasks to be quick and easy to understand, prefers very little reading and enjoys fun interactions.',
            'Behaviour: uses icons and visuals more than text, learns by tapping and swiping, leaves the app if it feels slow or confusing, taps randomly when stuck.',
            'Context: phones are mostly for learning apps, videos, games or transport booking.',
          ],
          frustrations: ['Too much text can confuse him', 'Too many choices feel overwhelming', 'Long steps reduce attention quickly', 'Small buttons cause wrong taps'],
          goals: ['Big buttons with clear spacing', 'Short and simple flows', 'Instant feedback after actions', 'Back or undo options for safety', 'Visual instructions instead of heavy text'],
        },
        {
          type: 'persona',
          name: 'Meet Patel',
          role: 'Parent booking travel for a 10-year-old',
          facts: [
            'Goals: wants safe and correct bookings, clear details before confirming and a simple, predictable process.',
            'Behaviour: checks options carefully, prefers a professional and clear UI, double-checks seat and payment details.',
            'Context: needs safety, clarity and control when a child travels.',
          ],
          frustrations: ['Seat selection confusion causes stress', 'Unclear pricing', 'Fear of booking mistakes for child travel'],
          goals: ['Step-by-step flow with a progress indicator', 'Structured layout with clear labels', 'Visible confirmation of important details'],
        },
        {
          type: 'cards',
          title: 'Empathy map (child)',
          cols: 2,
          items: [
            { title: 'Thinks', text: 'Is this app easy to use? Did I choose the correct bus? Where should I tap next? I need clear guidance and updates.' },
            { title: 'Feels', text: 'Confused during booking, worried about safety, frustrated when stuck, comfortable with a simple UI.' },
            { title: 'Does', text: 'Tracks bus location, checks details carefully, swipes and explores, follows a step-by-step flow.' },
            { title: 'Pain points', text: 'Too much text, too many options, long booking steps, small buttons and an unclear layout.' },
          ],
        },
      ],
    },
    {
      id: 'competitors',
      title: 'Competitive analysis',
      blocks: [
        {
          type: 'p',
          text: 'I compared three children’s apps (Khan Academy Kids, YouTube Kids and Duolingo ABC) on touch targets, visual design, reading load, full-screen focus, navigation, voice instructions and progress tracking. I then compared RedBus and AMTS on booking, seat selection, payment, live tracking, route information, ease for kids and safety.',
        },
      ],
    },
    {
      id: 'journey',
      title: 'User journey',
      blocks: [
        {
          type: 'steps',
          title: 'Stages',
          items: [{ title: 'Open app' }, { title: 'Book ride' }, { title: 'Seat and payment' }, { title: 'Track journey' }, { title: 'Reach destination' }],
        },
        {
          type: 'cards',
          cols: 2,
          items: [
            { title: 'Pain points', text: 'No confirmation system · Hard navigation · Payment confusion · Too many options · Lack of updates' },
            { title: 'Opportunities', text: 'Simple home screen · Step-by-step booking · Parent approval · Live tracking and SOS · Safe arrival notification' },
          ],
        },
        {
          type: 'list',
          title: 'Features that came out of it',
          items: [
            'Bus number and driver photo',
            'Voice guidance',
            'Saved places',
            'Safety tips screen',
            'Parent approval',
            'Trip progress bar',
            'Live bus tracking',
            'Bus stop notifications',
            'Reward system',
            'SOS emergency button',
          ],
        },
      ],
    },
    {
      id: 'system',
      title: 'Design system',
      blocks: [
        {
          type: 'p',
          text: 'Nunito (Medium and Bold) keeps the interface friendly and readable for children, with an icon set and reusable components such as the bus arrival time card.',
        },
        {
          type: 'palette',
          colors: [
            { name: 'Red', hex: '#E85D5D' },
            { name: 'Blue', hex: '#6EA2FB' },
            { name: 'Green', hex: '#40D878' },
            { name: 'Amber', hex: '#F5A52A' },
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
          text: 'Booking runs as a seven-step flow with a progress counter. Parent approval is requested before a ride is confirmed, and the live tracker keeps an SOS button within reach.',
        },
        {
          type: 'screens',
          label: 'Final UI',
          items: [
            s('screen-01'), s('screen-03'), s('screen-04'), s('screen-05'), s('screen-06'), s('screen-07'), s('screen-08'),
            s('screen-09'), s('screen-10'), s('screen-11'), s('screen-12'), s('screen-13'), s('screen-14'), s('screen-15'),
            s('screen-16'), s('screen-17'), s('screen-18'), s('screen-19'), s('screen-20'), s('screen-22'), s('screen-23'),
            s('screen-24'), s('screen-25'), s('screen-26'), s('screen-27'), s('screen-28'), s('screen-29'), s('screen-30'),
          ],
          captions: [
            'Screen 1', 'Screen 3', 'Screen 4', 'Screen 5', 'Screen 6', 'Screen 7', 'Screen 8', 'Screen 9', 'Screen 10',
            'Screen 11', 'Screen 12', 'Screen 13', 'Screen 14', 'Screen 15', 'Screen 16', 'Screen 17', 'Screen 18', 'Screen 19',
            'Screen 20', 'Screen 22', 'Screen 23', 'Screen 24', 'Screen 25', 'Screen 26', 'Screen 27', 'Screen 28', 'Screen 29', 'Screen 30',
          ],
        },
      ],
    },
  ],
}
