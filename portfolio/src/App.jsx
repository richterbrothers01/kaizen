import Hero from './Hero.jsx'
import {
  Anvil,
  ArrowUpRight,
  Briefcase,
  Camera,
  Compass,
  GitBranch,
  Play,
} from 'lucide-react'

const workCards = [
  {
    icon: Compass,
    tag: 'Live project',
    title: 'Kaizen',
    desc: 'A browser for founders that gives answers instead of links. The answer, the pros and cons, and the exact next step.',
    link: 'https://kaizenbrowser.vercel.app',
    linkLabel: 'kaizenbrowser.vercel.app',
    status: 'Pre-launch · waitlist open',
  },
  {
    icon: Briefcase,
    tag: 'Business',
    title: 'NorthForm',
    desc: 'My business. Built from scratch, growing in public.',
    link: null,
    linkLabel: 'Link coming soon',
    status: 'In progress',
  },
  {
    icon: Anvil,
    tag: 'Next forge',
    title: 'Coming soon',
    desc: 'The next thing is already on the anvil. Watch this space.',
    link: null,
    linkLabel: 'Not forged yet',
    status: 'In the forge',
  },
]

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
]

export default function App() {
  return (
    <main className="page">
      <Hero />

      <section id="work" className="section">
        <p className="section-kicker">Work</p>
        <h2 className="section-title">Everything I&apos;ve forged so far.</h2>
        <p className="section-sub">
          Startups, built in public. Each one is a bet on a problem worth
          solving.
        </p>

        <div className="work-grid">
          {workCards.map((card) => (
            <article key={card.title} className="work-card">
              <div className="work-icon">
                <card.icon size={20} strokeWidth={1.75} />
              </div>
              <p className="work-tag">{card.tag}</p>
              <h3 className="work-title">{card.title}</h3>
              <p className="work-desc">{card.desc}</p>
              {card.link ? (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noreferrer"
                  className="work-link"
                >
                  {card.linkLabel}
                  <ArrowUpRight size={15} />
                </a>
              ) : (
                <span className="work-soon">{card.linkLabel}</span>
              )}
              <p className="work-status">{card.status}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="links" className="section">
        <p className="section-kicker">Links</p>
        <h2 className="section-title">Find me everywhere.</h2>
        <p className="section-sub">
          Every place my work lives, in one list.
        </p>

        <div className="links-list">
          {links.map((link) => (
            <a
              key={link.handle}
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
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p className="footer-brand">xforge.git</p>
        <p className="footer-tag">Forged, not found.</p>
      </footer>
    </main>
  )
}
