import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
} from 'motion/react'
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import clsx from 'clsx'
import { Typewriter } from './Typewriter.jsx'
import { WordType } from './WordType.jsx'
import { projects } from './projects.js'

// Slide variants — transform + opacity ONLY. The v5 variants animated
// `filter: brightness(2)` on the whole panel, which forces a full
// backdrop re-raster every frame on a glass panel over a video. That,
// plus the title re-typing and the per-word blur staggers on every
// slide, is what made slides take ~1.6–1.9s to settle. Exit is a fast
// 0.12s fade so the whole slide stays well under 500ms.
//
// The panel is its own component with its own drag tilt value: in v5 the
// drag value lived in the parent and was shared by the exiting and the
// entering panel, so the enter animation tilted the new card and the two
// panels fought over one value. The tilt now comes only from the user's
// drag (onDrag), never from the slide animation.
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 110 : -110,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -110 : 110,
    opacity: 0,
    scale: 0.97,
    zIndex: 0,
    transition: { duration: 0.12, ease: 'easeIn' },
  }),
}

function ModalPanel({
  project,
  index,
  direction,
  firstMount,
  hasNavigated,
  onNavigate,
  onClose,
}) {
  // Tilt follows the finger only — never the slide animation.
  const dragTilt = useMotionValue(0)

  const handleDragEnd = (_, info) => {
    dragTilt.set(0)
    if (info.offset.x < -120) onNavigate(index + 1)
    else if (info.offset.x > 120) onNavigate(index - 1)
  }

  return (
    <motion.div
      className="modal-panel"
      data-lenis-prevent
      custom={direction}
      variants={slideVariants}
      initial={
        firstMount ? { opacity: 0, scale: 0.96, y: 12 } : 'enter'
      }
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 600, damping: 38 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.25 },
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ rotate: dragTilt }}
      onDrag={(_, info) =>
        dragTilt.set(Math.max(-12, Math.min(12, info.offset.x * 0.06)))
      }
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
          <Typewriter
            text={project.name}
            delay={120}
            speed={45}
            animate={!hasNavigated}
          />
        </h3>
        <p className="modal-status">{project.status}</p>

        {project.sections.map((section) => (
          <div key={section.heading} className="modal-section">
            <p className="modal-section-label">{section.heading}</p>
            <p className="modal-section-text">
              <WordType
                text={section.text}
                stagger={0.015}
                animate={!hasNavigated}
              />
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
          onClick={() => onNavigate(index - 1)}
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
              onClick={() => onNavigate(i)}
              aria-label={p.name}
              className={clsx('nav-dot', i === index && 'nav-dot-active')}
            />
          ))}
        </div>

        <motion.button
          type="button"
          className="nav-arrow"
          onClick={() => onNavigate(index + 1)}
          disabled={index === projects.length - 1}
          whileTap={{ scale: 0.9 }}
          aria-label="Next project"
        >
          <ChevronRight size={22} strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function ProjectModal({ index, onIndexChange, onClose }) {
  const lenis = useLenis()
  const [direction, setDirection] = useState(1)
  // Once the user navigates to another slide, the title and bios stop
  // re-typing / re-staggering and just appear with the slide fade — the
  // typewriter and word-blur run only on the first slide of a session.
  const [hasNavigated, setHasNavigated] = useState(false)
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
    setHasNavigated(true)
    onIndexChange(next)
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
        <ModalPanel
          key={index}
          project={project}
          index={index}
          direction={direction}
          firstMount={firstMountRef.current}
          hasNavigated={hasNavigated}
          onNavigate={goTo}
          onClose={onClose}
        />
      </AnimatePresence>
    </motion.div>
  )
}
