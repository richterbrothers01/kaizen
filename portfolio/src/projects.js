// The three projects. Verified facts only — nothing invented, no numbers
// made up. Accents: NorthForm cyan, LearnMate mint, Coming soon violet.
// Images live as base64 text in public/ (snapshot push rejects binaries)
// and are decoded to Blob URLs at runtime — see loadB64.js.
export const projects = [
  {
    id: 'northform',
    name: 'NorthForm',
    tag: 'Business',
    status: 'In progress',
    desc: 'My business. Built from scratch, growing in public.',
    link: 'https://northhform.vercel.app',
    linkLabel: 'northhform.vercel.app',
    accent: '#38e1ff',
    accent2: '#38bdf8',
    accent3: '#818cf8',
    glow: 'rgba(56, 225, 255, 0.15)',
    soft: 'rgba(56, 225, 255, 0.12)',
    images: [
      {
        file: 'northform-ig.jpg.b64',
        alt: 'NorthForm Instagram profile (@northform_hq)',
      },
      {
        file: 'northform-site.jpg.b64',
        alt: 'NorthForm website homepage',
      },
    ],
    sections: [
      {
        heading: 'How it was made',
        text: 'Built from scratch with my co-founder, growing in public. It started as an idea between the two of us and has been shaped in the open ever since, one step at a time, with no shortcuts and no outside money.',
      },
      {
        heading: 'Why it was made',
        text: 'To build a real business and brand, not just a project. NorthForm is the long game — something that grows slowly and compounds, built properly from the ground up rather than chased for fast money.',
      },
      {
        heading: 'Where it stands',
        text: 'In progress. No customers yet. The site is live at northhform.vercel.app, and the work is happening in public.',
      },
    ],
  },
  {
    id: 'learnmate',
    name: 'LearnMate',
    tag: 'Learning platform',
    status: 'In progress',
    desc: 'A learning platform with courses, tests, quizzes and milestones.',
    link: 'https://learnmateit.vercel.app',
    linkLabel: 'learnmateit.vercel.app',
    accent: '#3dffa8',
    accent2: '#2dd4bf',
    accent3: '#22d3ee',
    glow: 'rgba(61, 255, 168, 0.15)',
    soft: 'rgba(61, 255, 168, 0.12)',
    images: [
      {
        file: 'learnmate-dashboard.jpg.b64',
        alt: 'LearnMate dashboard',
      },
    ],
    sections: [
      {
        heading: 'How it was made',
        text: 'Built as a learning platform with a dashboard for courses, an AI Doubt Clearer for questions, and a milestone path in the Duolingo style. It runs on Supabase, and the curriculum comes from shared templates covering classes 1 to 12, with an NCERT question bank behind the tests and quizzes.',
      },
      {
        heading: 'Why it was made',
        text: 'Because studying is scattered — notes in one place, tests in another, and no clear sense of progress. LearnMate puts courses, milestones, tests and quizzes in one dashboard, so progress is something you can actually see.',
      },
      {
        heading: 'Where it stands',
        text: 'In progress. The dashboard with courses and the AI Doubt Clearer is built, and the tests, quizzes and milestone path are the current work, built on the shared question bank. Live at learnmateit.vercel.app.',
      },
    ],
  },
  {
    id: 'comingsoon',
    name: 'Coming soon',
    tag: 'Next up',
    status: 'Still deciding',
    desc: "A SaaS I'm still deciding on.",
    link: null,
    linkLabel: null,
    accent: '#c084fc',
    accent2: '#a78bfa',
    accent3: '#f0abfc',
    glow: 'rgba(192, 132, 252, 0.15)',
    soft: 'rgba(192, 132, 252, 0.12)',
    images: [],
    sections: [
      {
        heading: 'Where it stands',
        text: "I'm building a SaaS right now. I haven't decided what it is yet, or how I'm going to build it.",
      },
    ],
  },
]
