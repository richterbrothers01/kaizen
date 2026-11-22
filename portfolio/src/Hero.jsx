import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { Typewriter } from './Typewriter.jsx'

// The hero background image is gone — the fixed scroll-scrubbed video in
// VideoBackground.jsx is the background now. The glow and veil stay as
// subtle overlays on top of it.

// Entrance: blur-to-sharp + fade, staggered on load.
const loadIn = (delay) => ({
  initial: { opacity: 0, filter: 'blur(12px)', y: 18 },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
})

export default function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Court floodlights: flicker OFF and ON in bands as the user keeps
  // scrolling. Driven by scroll progress only — nothing here animates on
  // load. Kept subtle now so it does not fight the video behind it.
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.86, 1],
    [0.7, 0.05, 0.65, 0.03, 0.7, 0.1, 0.6, 0.08],
  )
  const veilOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.86, 1],
    [0, 0.38, 0.02, 0.42, 0, 0.34, 0.03, 0.4],
  )

  return (
    <section ref={heroRef} className="hero">
      <div className="hero-inner">
        {/* Floodlight glow — brightens and dies with the scroll */}
        <motion.div className="hero-glow" style={{ opacity: glowOpacity }} />
        {/* Dark veil — the court goes dark when the lights cut out */}
        <motion.div className="hero-veil" style={{ opacity: veilOpacity }} />

        <motion.nav {...loadIn(0.15)} className="hero-nav">
          <a href="#" className="hero-brand">
            xforge.git
          </a>

          <div className="hero-nav-links">
            <a href="#work" className="hero-nav-link">
              Work
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
                text="Every startup I build, in one place. Kaizen, NorthForm, and whatever I forge next."
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
