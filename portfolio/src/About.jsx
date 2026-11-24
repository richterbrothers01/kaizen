import { Reveal } from './Reveal.jsx'
import { WordType } from './WordType.jsx'

// About me — one big paragraph, first person, human-written. No name
// anywhere. Only verified facts.
const text =
  "I'm 14, from India, and I build startups in public under xforge.git. NorthForm is my business, built with my co-founder. LearnMate is a learning platform with courses, tests, quizzes and milestones. JARVIS is a voice assistant for my PC. The anti-sleep driver glasses are hardware that watches a driver's eyes and wakes them up before they drift off. Right now I'm building a SaaS, but I haven't decided what it is yet, or how I'm going to build it. I do this because I want to build a company this big from the city I live in. My goal is simple: for anything I ship, to see real users in the first month or fail fast and start again. When I'm not building, I'm usually watching films, James Bond most of all."

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
