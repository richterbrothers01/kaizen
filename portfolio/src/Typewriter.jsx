import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

// Typewriter: letters type themselves one by one, each fading in from a
// blur (blur-to-sharp), with a blinking gold caret while typing.
// `animate={false}` renders the full text at once — used for modal slides
// after the first, so changing slides never re-types the title.
export function Typewriter({ text, className, delay = 0, speed = 45, animate = true }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!animate) return
    let interval
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval)
            return c
          }
          return c + 1
        })
      }, speed)
    }, delay)
    return () => {
      clearTimeout(start)
      if (interval) clearInterval(interval)
    }
  }, [text, delay, speed, animate])

  if (!animate) {
    return (
      <span className={className} aria-label={text}>
        <span aria-hidden="true">{text}</span>
      </span>
    )
  }

  const done = count >= text.length

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">
        {text
          .slice(0, count)
          .split('')
          .map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        {!done && <span className="type-caret" />}
      </span>
    </span>
  )
}
