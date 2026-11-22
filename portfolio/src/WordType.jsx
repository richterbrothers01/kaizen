import { Fragment } from 'react'
import { motion } from 'motion/react'

// Word-by-word typewriter + blur reveal. Each word fades in from a blur
// and rises slightly, staggered. whileInView with once: false means
// scrolling up re-animates, and scrolling for more text triggers the
// reveal for each new paragraph as it enters view.
// `animate={false}` renders plain text — used for modal slides after the
// first, so changing slides never re-runs hundreds of blur animations.
export function WordType({ text, className, stagger = 0.02, delay = 0, animate = true }) {
  if (!animate) return <span className={className}>{text}</span>
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            className="word-type-word"
            initial={{ opacity: 0, filter: 'blur(8px)', y: 6 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{
              duration: 0.35,
              delay: delay + i * stagger,
              ease: 'easeOut',
            }}
          >
            {word}
          </motion.span>{' '}
        </Fragment>
      ))}
    </span>
  )
}
