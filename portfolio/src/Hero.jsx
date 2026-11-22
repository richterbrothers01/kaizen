import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { Typewriter } from './Typewriter.jsx'

// The hero background image is gone — the fixed scroll-scrubbed video in
// VideoBackground.jsx is the background now. The glow, veil and leaves
// stay as subtle overlays on top of it.

// Entrance: blur-to-sharp + fade, staggered on load.
const loadIn = (delay) => ({
  initial: { opacity: 0, filter: 'blur(12px)', y: 18 },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
})

// A hanging branch of dark leaves, drawn as inline SVG — no image files.
function LeafCluster({ className }) {
  return (
    <svg className={className} viewBox="0 0 420 280" fill="none" aria-hidden="true">
      <path
        d="M8 6 C 90 44 168 96 238 196 C 268 234 300 256 332 264"
        stroke="#0e1a10"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M238 196 C 268 190 300 176 322 152"
        stroke="#0e1a10"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M120 62 C 142 28 184 26 200 54 C 178 82 136 84 120 62 Z"
        fill="#0c160e"
      />
      <path
        d="M168 108 C 196 82 232 86 242 112 C 216 134 182 132 168 108 Z"
        fill="#0e1a10"
      />
      <path
        d="M84 118 C 104 88 142 88 156 114 C 134 140 100 140 84 118 Z"
        fill="#0a120b"
      />
      <path
        d="M214 168 C 240 142 274 146 284 172 C 260 194 228 192 214 168 Z"
        fill="#0c160e"
      />
      <path
        d="M262 226 C 286 202 318 206 328 230 C 306 250 276 248 262 226 Z"
        fill="#0e1a10"
      />
      <path
        d="M56 44 C 74 18 108 18 120 42 C 100 64 70 64 56 44 Z"
        fill="#0e1a10"
      />
      <path
        d="M300 150 C 322 128 352 132 362 154 C 342 174 314 172 300 150 Z"
        fill="#0a120b"
      />
      <path
        d="M150 178 C 168 152 200 152 212 176 C 192 198 164 198 150 178 Z"
        fill="#0c160e"
      />
    </svg>
  )
}

// One loose leaf, for the drifting foreground layer.
function LooseLeaf({ className }) {
  return (
    <svg className={className} viewBox="0 0 60 44" fill="none" aria-hidden="true">
      <path d="M4 22 C 16 4 40 2 56 18 C 42 38 16 40 4 22 Z" fill="#0c160e" />
    </svg>
  )
}

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

  // Foreground leaves: parallax drift on scroll, slower than the page.
  const leavesY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const leavesX = useTransform(scrollYProgress, [0, 1], [0, -36])
  const leavesRotate = useTransform(scrollYProgress, [0, 1], [0, 5])
  const looseY1 = useTransform(scrollYProgress, [0, 1], [0, 260])
  const looseY2 = useTransform(scrollYProgress, [0, 1], [0, 190])
  const looseY3 = useTransform(scrollYProgress, [0, 1], [0, 320])

  return (
    <section ref={heroRef} className="hero">
      <div className="hero-inner">
        {/* Floodlight glow — brightens and dies with the scroll */}
        <motion.div className="hero-glow" style={{ opacity: glowOpacity }} />
        {/* Dark veil — the court goes dark when the lights cut out */}
        <motion.div className="hero-veil" style={{ opacity: veilOpacity }} />

        {/* Foreground leaves — parallax drift on scroll + gentle idle sway */}
        <motion.div
          className="hero-leaves hero-leaves-left"
          style={{ y: leavesY, x: leavesX, rotate: leavesRotate }}
        >
          <motion.div
            animate={{ rotate: [0, 1.6, 0, -1.6, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LeafCluster className="hero-leaf-svg" />
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-leaves hero-leaves-right"
          style={{ y: leavesY, x: leavesX, rotate: leavesRotate }}
        >
          <motion.div
            animate={{ rotate: [0, -1.4, 0, 1.4, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LeafCluster className="hero-leaf-svg hero-leaf-flip" />
          </motion.div>
        </motion.div>
        <motion.div className="hero-loose-leaf hero-loose-1" style={{ y: looseY1 }}>
          <motion.div
            animate={{ rotate: [0, 14, 0, -10, 0], x: [0, 8, 0, -8, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LooseLeaf className="hero-loose-svg" />
          </motion.div>
        </motion.div>
        <motion.div className="hero-loose-leaf hero-loose-2" style={{ y: looseY2 }}>
          <motion.div
            animate={{ rotate: [0, -12, 0, 10, 0], x: [0, -10, 0, 8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LooseLeaf className="hero-loose-svg" />
          </motion.div>
        </motion.div>
        <motion.div className="hero-loose-leaf hero-loose-3" style={{ y: looseY3 }}>
          <motion.div
            animate={{ rotate: [0, 10, 0, -14, 0], x: [0, 6, 0, -6, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LooseLeaf className="hero-loose-svg" />
          </motion.div>
        </motion.div>

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
            <a
              href="https://instagram.com/xforge.git"
              target="_blank"
              rel="noreferrer"
              className="hero-nav-link"
            >
              Instagram
            </a>
          </div>

          <a
            href="https://instagram.com/xforge.git"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Instagram
          </a>
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
