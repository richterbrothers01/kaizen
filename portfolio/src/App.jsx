import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Hero from './Hero.jsx'
import VideoBackground from './VideoBackground.jsx'
import About from './About.jsx'
import WorkCards from './WorkCards.jsx'
import ProjectModal from './ProjectModal.jsx'
import LinkSelector from './LinkSelector.jsx'
import { Reveal } from './Reveal.jsx'

export default function App() {
  const [modalIndex, setModalIndex] = useState(null)

  return (
    <>
      {/* Fixed, scroll-scrubbed video behind the whole page */}
      <VideoBackground />

      <main className="page">
        <Hero />

        <About />

        <section id="work" className="section">
          <Reveal delay={0}>
            <p className="section-kicker">Work</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="section-title">
              Everything I&apos;ve forged so far.
            </h2>
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
            <p className="section-sub">
              Pick a category, then find me there.
            </p>
          </Reveal>

          <LinkSelector />
        </section>

        <footer className="site-footer">
          <Reveal delay={0}>
            <p className="footer-brand">xforge.git</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="footer-tag">Forged, not found.</p>
          </Reveal>
        </footer>
      </main>

      <AnimatePresence>
        {modalIndex !== null && (
          <ProjectModal
            index={modalIndex}
            onIndexChange={setModalIndex}
            onClose={() => setModalIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
