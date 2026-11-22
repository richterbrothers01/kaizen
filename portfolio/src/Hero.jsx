import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown } from 'lucide-react'

const HERO_BG = 'https://kaizenbrowser.vercel.app/xforge-hero-bg.webp'

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.08,
    },
  },
}

// Nav slides in from the left with a crisp spring
const navVariants = {
  hidden: { opacity: 0, x: -28, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 24, mass: 0.85 },
  },
}

// Background scales up from slightly below with a slow, cinematic settle
const imageVariants = {
  hidden: { opacity: 0, scale: 1.12, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 55, damping: 18, mass: 1.4 },
  },
}

// Copy reveals with a 3D perspective tilt (rotateX) — card-flipping feel
const copyVariants = {
  hidden: { opacity: 0, y: 28, rotateX: 14, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 210, damping: 30, mass: 0.9 },
  },
}

const buttonRowVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.04,
    },
  },
}

// Buttons pop in with an elastic overshoot
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.82, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 350, damping: 22, mass: 0.75 },
  },
}

// Footer drifts up with a gentle, light bounce
const footerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 180, damping: 24, mass: 1 },
  },
}

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

  // Court floodlights: flicker OFF and ON in bands as the user keeps scrolling.
  // Driven by scroll progress only — nothing here animates on load.
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.86, 1],
    [1, 0.08, 0.95, 0.05, 1, 0.15, 0.9, 0.1],
  )
  const veilOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.86, 1],
    [0, 0.55, 0.04, 0.62, 0, 0.5, 0.06, 0.58],
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
      <motion.div
        className="hero-inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.34 }}
        variants={sectionVariants}
      >
        <motion.img
          variants={imageVariants}
          src={HERO_BG}
          alt="Night basketball court under floodlights in a dark forest"
          className="hero-bg"
        />

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

        <motion.nav variants={navVariants} className="hero-nav">
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
            <motion.h1 variants={copyVariants} className="hero-title">
              <span className="hero-title-line">Forged,</span>
              <span className="hero-title-line">
                <span className="hero-title-highlight">not found.</span>
              </span>
            </motion.h1>

            <motion.p variants={copyVariants} className="hero-desc">
              Every startup I build, in one place. Kaizen, NorthForm, and
              whatever I forge next.
            </motion.p>

            <motion.div variants={buttonRowVariants} className="hero-ctas">
              <motion.a
                variants={buttonVariants}
                href="#work"
                className="btn-gold"
              >
                See my work
              </motion.a>
              <motion.a
                variants={buttonVariants}
                href="#links"
                className="btn-outline btn-outline-lg"
              >
                All my links
              </motion.a>
            </motion.div>
          </div>
        </div>

        <motion.blockquote variants={footerVariants} className="hero-quote">
          <p>&ldquo;Built in public. Forged in private.&rdquo;</p>
          <footer>-XFORGE.GIT</footer>
        </motion.blockquote>

        <motion.a
          variants={footerVariants}
          href="#work"
          className="hero-scroll"
        >
          Scroll to Discover
          <ArrowDown className="hero-scroll-icon" />
        </motion.a>
      </motion.div>
    </section>
  )
}
