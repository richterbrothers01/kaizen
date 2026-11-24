import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { Typewriter } from './Typewriter.jsx'

// The hero background is the fixed scroll-scrubbed video in
// VideoBackground.jsx. No light flicker here — the video does the talking.

// Entrance: blur-to-sharp + fade, staggered on load.
const loadIn = (delay) => ({
  initial: { opacity: 0, filter: 'blur(12px)', y: 18 },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
})

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <motion.nav {...loadIn(0.15)} className="hero-nav">
          <a href="#" className="hero-brand">
            xforge.git
          </a>

          <div className="hero-nav-links">
            <a href="#work" className="hero-nav-link">
              Work
            </a>
            <a href="#about" className="hero-nav-link">
              About
            </a>
            <a href="#links" className="hero-nav-link">
              Links
            </a>
          </div>
        </motion.nav>

        <div className="hero-copy">
          <div className="hero-copy-inner">
            <h1 className="hero-title">
              <span className="hero-title-line">
                <Typewriter text="Forged," delay={300} speed={55} />
              </span>
              <span className="hero-title-line">
                <Typewriter
                  text="not found."
                  className="hero-title-highlight"
                  delay={800}
                  speed={55}
                />
              </span>
            </h1>

            <p className="hero-desc">
              <Typewriter
                text="Every startup I build, in one place. NorthForm, LearnMate, and whatever I forge next."
                delay={1450}
                speed={16}
              />
            </p>

            <motion.div {...loadIn(1.7)} className="hero-ctas">
              <a href="#work" className="btn-gold">
                See my work
              </a>
              <a href="#links" className="btn-outline btn-outline-lg">
                All my links
              </a>
            </motion.div>
          </div>
        </div>

        <motion.blockquote {...loadIn(2.1)} className="hero-quote">
          <p>&ldquo;Built in public. Forged in private.&rdquo;</p>
          <footer>-XFORGE.GIT</footer>
        </motion.blockquote>

        <motion.a {...loadIn(2.3)} href="#work" className="hero-scroll">
          Scroll to Discover
          <ArrowDown className="hero-scroll-icon" />
        </motion.a>
      </div>
    </section>
  )
}
