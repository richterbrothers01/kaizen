// Demo content for the Kaizen browser prototype.
// The CRM answer is the real one from the 22 Nov 2026 answer-screen reel.
// IMPORTANT: the answer is HubSpot Free, the $0 plan for up to 2 users.
// The paid plan must NEVER appear as the answer anywhere in this app.

export const ANSWERS = {
  crm: {
    id: "crm",
    question: "How to choose a CRM for a small team",
    articleSource: "blog.hubspot.com  ·  8 min read",
    heroWord: "CRM",
    articleLead:
      "A CRM is the shared memory of a small team. The wrong one costs you deals you never hear about — the right one just quietly keeps every customer, every follow-up and every promise in one place.",
    demo: false,
    answerBold: "HubSpot Free.",
    answerText:
      "$0 for up to 2 users, email built in, and the least setup of the three.",
    pros: ["Free for 2 users", "Email built in"],
    cons: ["Reports are basic", "Pricey past 5 seats"],
    steps: [
      "Open hubspot.com/pricing",
      "Pick Free, no card needed",
      "Connect your inbox",
    ],
    next: "Create the free workspace today.",
    nextSub: "Takes about 4 minutes.",
    cta: "Do it now",
    ctaBusy: "Opening hubspot.com/pricing…",
    sources: "hubspot.com, g2.com, capterra.com",
  },
  invoice: {
    id: "invoice",
    question: "Best free invoicing tool for a solo founder?",
    articleSource: "waveapps.com  ·  6 min read",
    heroWord: "WAVE",
    articleLead:
      "Getting paid should not cost you money first. For a solo founder the best invoicing tool is the one that lets you send a clean invoice in two minutes and get out of the way.",
    demo: true,
    answerBold: "Wave.",
    answerText:
      "$0 for unlimited invoicing, payments built in, and the least setup of the three.",
    pros: ["Free invoicing", "Payments built in"],
    cons: ["Reports are basic", "No time tracking"],
    steps: [
      "Open waveapps.com",
      "Pick Free, no card needed",
      "Send your first invoice",
    ],
    next: "Send your first invoice today.",
    nextSub: "Takes about 5 minutes.",
    cta: "Do it now",
    ctaBusy: "Opening waveapps.com…",
    sources: "waveapps.com, g2.com, capterra.com",
  },
  startup: {
    id: "startup",
    question: "How do I register a startup in India?",
    articleSource: "mca.gov.in  ·  9 min read",
    heroWord: "MCA",
    articleLead:
      "Most Indian founders start with a Private Limited Company. It takes one government form, a name, and two directors — and it keeps your personal money separate from the company's.",
    demo: true,
    answerBold: "Private Limited via SPICe+.",
    answerText:
      "The MCA form that registers your company, directors and tax numbers in one go — the fastest route for most founders.",
    pros: ["Limited liability", "Easy to raise money"],
    cons: ["More paperwork", "Yearly filings"],
    steps: [
      "Open mca.gov.in",
      "File SPICe+ (name + directors)",
      "Get your Certificate of Incorporation",
    ],
    next: "Reserve your company name today.",
    nextSub: "Takes about 10 minutes.",
    cta: "Do it now",
    ctaBusy: "Opening mca.gov.in…",
    sources: "mca.gov.in, startupindia.gov.in",
  },
};

export const SUGGESTED_QUESTIONS = [
  { id: "crm", label: "How to choose a CRM for a small team" },
  { id: "invoice", label: "Best free invoicing tool for a solo founder?" },
  { id: "startup", label: "How do I register a startup in India?" },
];

export const GUIDE_STEPS = [
  { id: 1, text: "Type your username in the login box", detail: "The top field, under LOGIN." },
  { id: 2, text: "Type your password", detail: "The second field. It hides as dots." },
  { id: 3, text: "Enter the captcha shown", detail: "Copy the letters from the blue box." },
  { id: 4, text: "Click the Login button", detail: "The blue button at the bottom of the card." },
];

export const GUIDE_DONT = [
  { id: 1, text: "“Forgot Password?” — you will lose everything you just typed." },
  { id: 2, text: "The promo banners — they are ads, not the login." },
  { id: 3, text: "“Register” — you already have an account." },
];

export const YOUTUBE_VIDEOS = [
  { id: 1, title: "I built a browser in my bedroom (14 y/o founder)", channel: "Kaizen", views: "12K views · 2 days ago", dur: "8:24", grad: "linear-gradient(135deg,#3a2a00,#8a6a1d)" },
  { id: 2, title: "30 tabs open. Zero steps taken.", channel: "Kaizen", views: "8.1K views · 5 days ago", dur: "0:34", grad: "linear-gradient(135deg,#00283a,#0d6a8a)" },
  { id: 3, title: "Why founders drown in browser tabs", channel: "Build in Public", views: "44K views · 1 week ago", dur: "11:02", grad: "linear-gradient(135deg,#2a003a,#7a1d8a)" },
  { id: 4, title: "The 1% better rule, explained", channel: "Kaizen", views: "3.2K views · 1 week ago", dur: "6:41", grad: "linear-gradient(135deg,#003a1d,#1d8a4a)" },
  { id: 5, title: "My morning routine as a student founder", channel: "Kaizen", views: "5.7K views · 2 weeks ago", dur: "9:18", grad: "linear-gradient(135deg,#3a1a00,#a85a10)" },
  { id: 6, title: "Chrome vs the browser I actually want", channel: "Kaizen", views: "9.9K views · 3 weeks ago", dur: "7:55", grad: "linear-gradient(135deg,#1a1a2e,#3a3a6a)" },
];

export const GITHUB_REPOS = [
  { name: "kaizen", desc: "The browser for entrepreneurs. Chromium core, Kaizen soul.", lang: "TypeScript", color: "#3178c6", stars: 128, updated: "today" },
  { name: "learnmate", desc: "Study app that turns your syllabus into a daily route.", lang: "TypeScript", color: "#3178c6", stars: 86, updated: "yesterday" },
  { name: "northform", desc: "North-facing forms for architecture studios.", lang: "HTML", color: "#e34c26", stars: 41, updated: "3 days ago" },
  { name: "asg", desc: "Anti-sleep driver glasses — Arduino Nano + IR eye sensors.", lang: "C++", color: "#f34b7d", stars: 23, updated: "last week" },
];
