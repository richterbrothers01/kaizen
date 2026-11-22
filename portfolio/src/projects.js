// The three projects. Verified facts only — nothing invented, no numbers
// made up. Accents: Kaizen gold, NorthForm cyan, LearnMate mint.
export const projects = [
  {
    id: 'kaizen',
    name: 'Kaizen',
    tag: 'Live project',
    status: 'Pre-launch · waitlist open',
    desc: 'A browser for founders that gives answers instead of links.',
    link: 'https://kaizenbrowser.vercel.app',
    linkLabel: 'kaizenbrowser.vercel.app',
    accent: '#f2b33d',
    accent2: '#fb923c',
    accent3: '#fb7185',
    glow: 'rgba(242, 179, 61, 0.15)',
    soft: 'rgba(242, 179, 61, 0.12)',
    sections: [
      {
        heading: 'How it was made',
        text: 'First built as a React and Vite clickable demo with motion animations — the tab bar, the address bar, the sidebar, the new tab page with its ask bar, and the answer screen. The real product is a Chromium-based browser for founders, built by restyling Chrome black-and-grey minimal, with the Kaizen logo and name. The guidance feature comes first as a Chrome extension with hardcoded routes: on a task page, everything except the task greys out, and a side panel shows what to click next, what not to click, what happens after, and the next step. No Kaizen AI in the first version — the answer engine comes later.',
      },
      {
        heading: 'Why it was made',
        text: 'I drown in 30 tabs a day and wanted a browser that gives the answer, the pros and cons, and the exact next step instead of links. Every search ends in a pile of tabs and zero steps taken, so Kaizen is built around one idea: the search ends, the route begins. It is for founders, entrepreneurs and traders who would rather build than browse.',
      },
      {
        heading: 'Where it stands',
        text: 'Pre-launch, waitlist open. Three reels a day since 10 November, building in public on Instagram, YouTube, X and Indie Hackers. The React demo is private. The browser build is on hold while I pick the next SaaS — the extension comes first, and the kill test is simple: give it to ten real founders, and if nobody uses it a second time, it gets dropped.',
      },
    ],
  },
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
]
