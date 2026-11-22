import { Reveal } from './Reveal.jsx'
import { WordType } from './WordType.jsx'

// About me — one big paragraph, first person, human-written. No name
// anywhere. Only verified facts.
const text =
  "I'm 14, from India, and I build startups in public under xforge.git. Kaizen is a browser for founders that gives answers instead of links. NorthForm is my business, built with my co-founder. LearnMate is a learning platform. JARVIS is a voice assistant for my PC. Anti-sleep driver glasses are hardware that watches a driver's eyes and wakes them up before they drift off. I do this because I want to build a company this big from the city I live in, and I believe in shipping in public, 1% better every day — I'm inspired by builders who ship in public and let the work speak for itself. When I'm not building, I'm usually watching films, James Bond most of all, and crime thrillers. What's next is Kaizen first as a Chrome extension, the guidance feature, and then a new SaaS. My goal is to build a brand that becomes huge from where I live, and for anything I ship, to see real users in the first month or fail fast and start again."

export default function About() {
  return (
    <section id="about" className="section">
      <Reveal delay={0}>
        <p className="section-kicker">About</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="section-title">A bit about me.</h2>
      </Reveal>

      <p className="about-single">
        <WordType text={text} stagger={0.008} />
      </p>
    </section>
  )
}
