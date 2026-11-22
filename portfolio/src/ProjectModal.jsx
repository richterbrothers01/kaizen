import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react'
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import clsx from 'clsx'
import { Typewriter } from './Typewriter.jsx'
import { WordType } from './WordType.jsx'
import { projects } from './projects.js'

// Carousel slide variants (from the pasted carousel style): the whole
// card slides in with a tilt and a brightness flash, drags sideways, and
// the centre state sits straight so the bio reads cleanly. The variants
// live on the OUTER panel now, so the entire card swipes — not just the
// text inside it.
const carouselVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 200 : -200,
    filter: 'brightness(2)',
    scale: 0.75,
    opacity: 0,
    rotate: direction > 0 ? 30 : -30,
  }),
  center: {
    x: 0,
    filter: 'brightness(1)',
    scale: 1,
    opacity: 1,
    rotate: 0,
    zIndex: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -200 : 200,
    filter: 'brightness(2)',
    scale: 0.75,
    opacity: 0,
    rotate: direction > 0 ? -30 : 30,
    zIndex: 0,
  }),
}

export default function ProjectModal({ index, onIndexChange, onClose }) {
  const lenis = useLenis()
  const [direction, setDirection] = useState(1)
  const dragX = useMotionValue(0)
  const rotate = useTransform(dragX, [-200, 200], [-18, 18])
  const firstMountRef = useRef(true)

  // Escape closes. While open, Lenis and body scroll stop; the panel
  // itself scrolls via data-lenis-prevent.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    firstMountRef.current = false
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [lenis, onClose])

  const project = projects[index]

  // Clamped navigation — no wrap-around. At the first project you cannot
  // go left, at the last you cannot go right.
  const goTo = (next) => {
    if (next < 0 || next >= projects.length || next === index) return
    setDirection(next > index ? 1 : -1)
    onIndexChange(next)
  }

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -120) goTo(index + 1)
    else if (info.offset.x > 120) goTo(index - 1)
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={onClose}
    >
      <AnimatePresence custom={direction} mode="wait" initial={false}>
        <motion.div
          key={index}
          className="modal-panel"
          data-lenis-prevent
          custom={direction}
          variants={carouselVariants}
          initial={
            firstMountRef.current
              ? { opacity: 0, scale: 0.96, y: 12 }
              : 'enter'
          }
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', bounce: 0.2, duration: 0.5 },
            scale: { duration: 0.35 },
            opacity: { duration: 0.25 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ rotate, x: dragX }}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={project.name}
        >
          <div className="modal-close-wrap">
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal-content">
            <span
              className="modal-pill"
              style={{ '--accent': project.accent, '--soft': project.soft }}
            >
              {project.tag}
            </span>

            <h3 className="modal-title">
              <Typewriter text={project.name} delay={120} speed={45} />
            </h3>
            <p className="modal-status">{project.status}</p>

            {project.sections.map((section) => (
              <div key={section.heading} className="modal-section">
                <p className="modal-section-label">{section.heading}</p>
                <p className="modal-section-text">
                  <WordType text={section.text} stagger={0.015} />
                </p>
              </div>
            ))}

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="modal-link"
              >
                {project.linkLabel}
                <ArrowUpRight size={15} />
              </a>
            )}
          </div>

          <div className="modal-navigator">
            <motion.button
              type="button"
              className="nav-arrow"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous project"
            >
              <ChevronLeft size={22} strokeWidth={3} />
            </motion.button>

            <div className="nav-dots">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={p.name}
                  className={clsx(
                    'nav-dot',
                    i === index && 'nav-dot-active',
                  )}
                />
              ))}
            </div>

            <motion.button
              type="button"
              className="nav-arrow"
              onClick={() => goTo(index + 1)}
              disabled={index === projects.length - 1}
              whileTap={{ scale: 0.9 }}
              aria-label="Next project"
            >
              <ChevronRight size={22} strokeWidth={3} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
