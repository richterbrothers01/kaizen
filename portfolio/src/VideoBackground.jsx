import { useEffect, useRef } from 'react'
import { useMotionValueEvent, useScroll, useSpring } from 'motion/react'

// Poster stays until the decoded video is ready to show.
const POSTER = 'https://kaizenbrowser.vercel.app/xforge-hero-bg.webp'
const B64_URL = `${import.meta.env.BASE_URL}hero-bg.mp4.b64`

// The video is a FIXED full-screen background for the entire page. It never
// scrolls away and never plays on a timer — scrolling scrubs it frame by
// frame, smoothed by a spring so it feels buttery instead of jumpy.
export default function VideoBackground() {
  const videoRef = useRef(null)
  const durationRef = useRef(0)

  // Load the base64 asset, decode it to a Blob, and hand the video an
  // object URL. The base64 string never goes into a JS bundle.
  useEffect(() => {
    let cancelled = false
    let objectUrl = null

    fetch(B64_URL)
      .then((res) => {
        if (!res.ok) throw new Error('video asset failed to load')
        return res.text()
      })
      .then((b64) => {
        const clean = b64.replace(/\s/g, '')
        const bin = atob(clean)
        const bytes = new Uint8Array(bin.length)
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
        objectUrl = URL.createObjectURL(
          new Blob([bytes], { type: 'video/mp4' }),
        )
        if (!cancelled) {
          const video = videoRef.current
          if (video) video.src = objectUrl
        }
      })
      .catch(() => {
        // Poster stays — the page still looks right without the video.
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  // Page scroll progress, spring-smoothed for buttery scrubbing.
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  })

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    const video = videoRef.current
    if (!video || !durationRef.current || video.readyState < 1) return
    const target =
      Math.min(Math.max(v, 0), 1) * durationRef.current
    if (Math.abs(video.currentTime - target) > 0.04) {
      try {
        video.currentTime = target
      } catch {
        // Seeking can throw while the video is still settling — ignore it.
      }
    }
  })

  return (
    <div className="video-bg-wrap" aria-hidden="true">
      <video
        ref={videoRef}
        className="video-bg"
        poster={POSTER}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        onLoadedMetadata={(e) => {
          const duration = e.currentTarget.duration || 0
          durationRef.current = duration
          // Seek to the current scroll position as soon as the video can
          // be scrubbed, so the first paint already shows the right frame.
          if (duration > 0) {
            try {
              e.currentTarget.currentTime =
                Math.min(Math.max(scrollYProgress.get(), 0), 1) * duration
            } catch {
              // Ignore — the scrub handler below will pick it up.
            }
          }
        }}
      />
      {/* Uniform dim so text stays readable over the video everywhere */}
      <div className="video-bg-dim" />
    </div>
  )
}
