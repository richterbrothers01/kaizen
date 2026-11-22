import { useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'

// Lenis smooth scroll, mounted once at the root. Respects
// prefers-reduced-motion: with reduced motion on, the children render
// with no smooth-scroll wrapper at all.
export function LenisRoot({ children }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (reducedMotion) return children

  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
      {children}
    </ReactLenis>
  )
}
