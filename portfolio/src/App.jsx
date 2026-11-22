import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import Hero from './Hero.jsx'
import VideoBackground from './VideoBackground.jsx'
import About from './About.jsx'
import WorkCards from './WorkCards.jsx'
import ProjectModal from './ProjectModal.jsx'
import { Reveal } from './Reveal.jsx'
import {
  ArrowUpRight,
  Camera,
  Compass,
  GitBranch,
  Play,
} from 'lucide-react'

const links = [
  {
    icon: Camera,
    label: 'Instagram',
    handle: '@xforge.git',
    href: 'https://instagram.com/xforge.git',
  },
  {
    icon: Camera,
    label: 'Instagram',
    handle: '@kaizenbrowser',
    href: 'https://instagram.com/kaizenbrowser',
  },
  {
    icon: Play,
    label: 'YouTube',
    handle: '@kaizenbrowser',
    href: 'https://www.youtube.com/@kaizenbrowser',
  },
  {
    icon: GitBranch,
    label: 'GitHub',
    handle: 'richterbrothers01',
    href: 'https://github.com/richterbrothers01',
  },
  {
    icon: Compass,
    label: 'Kaizen',
    handle: 'kaizenbrowser.vercel.app',
    href: 'https://kaizenbrowser.vercel.app',
  },
  {
    icon: Camera,
    label: 'Instagram',
    handle: '@northform_hq',
    href: 'https://instagram.com/northform_hq',
  },
  {
    icon: Play,
    label: 'YouTube',
    handle: 'NorthForm',
    href: 'https://www.youtube.com/channel/UCDjKwSw7avXo4Ow2cU6KsqA',
  },
  {
    icon: Compass,
    label: 'Website',
    handle: 'northform.vercel.app',
    href: 'https://northform.vercel.app',
  },
  {
    icon: Compass,
    label: 'Website',
    handle: 'learnmateit.vercel.app',
    href: 'https://learnmateit.vercel.app',
  },
]

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
              Every place my work lives, in one list.
            </p>
          </Reveal>

          <div className="links-list">
            {links.map((link, i) => (
              <Reveal key={link.handle} className="reveal" delay={i * 0.06}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-row"
                >
                  <span className="link-left">
                    <link.icon size={20} strokeWidth={1.75} className="link-icon" />
                    <span className="link-label">{link.label}</span>
                    <span className="link-handle">{link.handle}</span>
                  </span>
                  <ArrowUpRight size={18} className="link-arrow" />
                </a>
              </Reveal>
            ))}
          </div>
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
