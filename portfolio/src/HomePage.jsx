import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import Hero from './Hero.jsx'
import About from './About.jsx'
import WorkCards from './WorkCards.jsx'
import ProjectModal from './ProjectModal.jsx'
import LinkSelector from './LinkSelector.jsx'
import { Reveal } from './Reveal.jsx'

// The home page: hero, About, Work, Links, Contact, footer, project modal.
export default function HomePage() {
  const [modalIndex, setModalIndex] = useState(null)

  return (
    <main className="page">
      <Hero />

      <About />

      <section id="work" className="section">
        <Reveal delay={0}>
          <p className="section-kicker">Work</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="section-title">Everything I&apos;ve forged so far.</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="section-sub">
            Startups, built in public. Each one is a bet on a problem worth
            solving. Tap a card to read its story.
          </p>
        </Reveal>

        <WorkCards onOpen={setModalIndex} />
      </section>

      <section id="links" className="section">
        <Reveal delay={0}>
          <p className="section-kicker">Links</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="section-title">Find me everywhere.</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="section-sub">Pick a category, then find me there.</p>
        </Reveal>

        <LinkSelector />
      </section>

      <section id="contact" className="section">
        <Reveal delay={0}>
          <p className="section-kicker">Contact</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="section-title">Ask the founder.</h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="section-sub">
            Questions, ideas, or just want to say hi — ask me directly.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="contact-cta">
            <Link to="/contact" className="btn-gold">
              Ask the founder
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="site-footer">
        <Reveal delay={0}>
          <p className="footer-brand">xforge.git</p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="footer-tag">Forged, not found.</p>
        </Reveal>
      </footer>

      <AnimatePresence>
        {modalIndex !== null && (
          <ProjectModal
            index={modalIndex}
            onIndexChange={setModalIndex}
            onClose={() => setModalIndex(null)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
