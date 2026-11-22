import { Reveal } from './Reveal.jsx'
import { WordType } from './WordType.jsx'

// About me — first person, no name anywhere. Only verified facts.
const built = [
  'Kaizen',
  'NorthForm',
  'LearnMate',
  'JARVIS',
  'SpotifyMini',
  'Anti-sleep driver glasses',
  'BREAKOUT',
]

const blocks = [
  {
    label: 'What I do',
    text: "I'm 14, from India, and I build startups in public under xforge.git. Kaizen is a browser for founders that gives answers instead of links. NorthForm is my business, built with my co-founder. LearnMate is a learning platform. JARVIS is a voice assistant for my PC. SpotifyMini is a Minecraft Spotify player mod. Anti-sleep driver glasses are hardware that watches a driver's eyes. BREAKOUT is a Roblox open-world game.",
  },
  {
    label: 'Why I do it',
    text: 'I want to build a company this big from the city I live in, and I believe in shipping in public, 1% better every day. I am inspired by builders who ship in public.',
  },
  {
    label: 'Hobbies',
    text: 'Films — James Bond most of all, crime thrillers — and building things.',
  },
  {
    label: "What's next",
    text: 'Kaizen first as a Chrome extension, the guidance feature, then a new SaaS.',
  },
  {
    label: 'My goal',
    text: 'Build a brand that becomes huge from where I live, and for anything I ship, see real users in the first month or fail fast and start again.',
  },
]

export default function About() {
  return (
    <section id="about" className="section">
      <Reveal delay={0}>
        <p className="section-kicker">About</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="section-title">A bit about me.</h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="section-sub">
          Where I&apos;m from, what I build, and where I&apos;m headed.
        </p>
      </Reveal>

      <div className="about-chips">
        {built.map((name) => (
          <span key={name} className="about-chip">
            {name}
          </span>
        ))}
      </div>

      <div className="about-blocks">
        {blocks.map((block) => (
          <div key={block.label} className="about-block">
            <p className="about-label">{block.label}</p>
            <p className="about-text">
              <WordType text={block.text} stagger={0.015} />
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
