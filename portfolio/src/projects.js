import { FaBolt, FaRocket, FaShieldAlt } from 'react-icons/fa'

// The three projects. Verified facts only — nothing invented, no numbers
// made up. Accents: Kaizen gold, NorthForm cyan, Next forge mint.
export const projects = [
  {
    id: 'kaizen',
    name: 'Kaizen',
    tag: 'Live project',
    status: 'Pre-launch · waitlist open',
    desc: 'A browser for founders that gives answers instead of links. The answer, the pros and cons, and the exact next step.',
    link: 'https://kaizenbrowser.vercel.app',
    linkLabel: 'kaizenbrowser.vercel.app',
    icon: FaBolt,
    accent: '#f2b33d',
    accent2: '#fb923c',
    accent3: '#fb7185',
    glow: 'rgba(242, 179, 61, 0.15)',
    soft: 'rgba(242, 179, 61, 0.12)',
    sections: [
      {
        heading: 'How it was made',
        text: 'First built as a React and Vite clickable demo with motion animations. The real product is a Chromium-based browser for founders, built by restyling Chrome black-and-grey minimal. The guidance feature comes first as a Chrome extension with hardcoded routes.',
      },
      {
        heading: 'Why it was made',
        text: 'I drown in 30 tabs a day and wanted a browser that gives the answer, the pros and cons, and the exact next step instead of links.',
      },
      {
        heading: 'Where it stands',
        text: 'Pre-launch, waitlist open. Three reels a day since 10 November. The React demo is private. The browser build is on hold while I pick the next SaaS — the extension comes first.',
      },
    ],
  },
  {
    id: 'northform',
    name: 'NorthForm',
    tag: 'Business',
    status: 'In progress',
    desc: 'My business. Built from scratch, growing in public.',
    link: null,
    linkLabel: 'Link coming soon',
    icon: FaRocket,
    accent: '#38e1ff',
    accent2: '#38bdf8',
    accent3: '#818cf8',
    glow: 'rgba(56, 225, 255, 0.15)',
    soft: 'rgba(56, 225, 255, 0.12)',
    sections: [
      {
        heading: 'How it was made',
        text: 'Built from scratch with my co-founder, growing in public.',
      },
      {
        heading: 'Why it was made',
        text: 'To build a real business and brand, not just a project.',
      },
      {
        heading: 'Where it stands',
        text: 'In progress. No customers yet. Link coming soon.',
      },
    ],
  },
  {
    id: 'next-forge',
    name: 'Coming soon',
    tag: 'Next forge',
    status: 'In the forge',
    desc: 'The next thing is already on the anvil. Watch this space.',
    link: null,
    linkLabel: 'Not forged yet',
    icon: FaShieldAlt,
    accent: '#3dffa8',
    accent2: '#2dd4bf',
    accent3: '#22d3ee',
    glow: 'rgba(61, 255, 168, 0.15)',
    soft: 'rgba(61, 255, 168, 0.12)',
    sections: [
      {
        heading: 'Where it stands',
        text: 'The next thing is already on the anvil. Not forged yet. Watch this space.',
      },
    ],
  },
]
