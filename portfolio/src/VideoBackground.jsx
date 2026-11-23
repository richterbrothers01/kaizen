import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'

// Poster stays until the decoded video is ready to show.
const POSTER = 'https://kaizenbrowser.vercel.app/xforge-hero-bg.webp'
const B64_URL = `${import.meta.env.BASE_URL}hero-bg.mp4.b64`

// The video is 60fps (trimmed to start at the rain, ~3.93s, 236 frames).
// Total frames are computed from the loaded metadata. Scroll maps to
// frames in steps of 5: at the very bottom it wraps to frame 0 and replays.
const FPS = 60
const FRAME_STEP = 5

function steppedTime(progress, totalFrames) {
  if (!totalFrames) return 0
  const clamped = Math.min(Math.max(progress, 0), 1)
  const frame =
    (Math.floor(clamped * (totalFrames / FRAME_STEP)) * FRAME_STEP) %
    totalFrames
  return frame / FPS
}

// True when the video is actually showing a picture (not a black frame).
// Same-origin blob, so drawing it to a canvas is allowed.
function frameIsVisible(video) {
  try {
    if (video.readyState < 2) return false
    const c = document.createElement('canvas')
    c.width = 32
    c.height = 18
    const g = c.getContext('2d')
    g.drawImage(video, 0, 0, 32, 18)
    const d = g.getImageData(0, 0, 32, 18).data
    let sum = 0
    for (let i = 0; i < d.length; i += 4) sum += (d[i] + d[i + 1] + d[i + 2]) / 3
    return sum / (d.length / 4) > 5
  } catch {
    return false
  }
}

// The video is a FIXED full-screen background for the entire page. It never
// scrolls away and never plays on a timer — scrolling scrubs it frame by
// frame, smoothed by a spring so it feels buttery instead of jumpy.
//
// Mobile fix: phones will not render a frame of a video that has never
// played — a scrubbed-only video stays black, and once the video loads the
// poster is replaced by that black frame. So we (1) prime the decoder by
// playing muted for a moment and pausing, which is allowed without a tap
// because the video is muted + playsInline, and (2) keep the poster photo
// layered over the video until a real frame is proven visible. If the video
// never renders, the photo stays — the page is never a black screen.
export default function VideoBackground() {
  const videoRef = useRef(null)
  const durationRef = useRef(0)
  const totalFramesRef = useRef(0)
  const primedRef = useRef(false)
  const [posterGone, setPosterGone] = useState(false)

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
    const target = steppedTime(v, totalFramesRef.current)
    if (Math.abs(video.currentTime - target) > 0.04) {
      try {
        video.currentTime = target
      } catch {
        // Seeking can throw while the video is still settling — ignore it.
      }
    }
  })

  // Prime the decoder once the video has data, then hide the poster photo
  // only after a real frame is proven on screen.
  const primeVideo = async () => {
    const video = videoRef.current
    if (!video || primedRef.current) return
    primedRef.current = true
    try {
      await video.play()
    } catch {
      // Play blocked — the poster photo stays as the fallback.
    }
    try {
      video.pause()
    } catch {
      // Ignore.
    }
    try {
      video.currentTime = steppedTime(
        scrollYProgress.get(),
        totalFramesRef.current,
      )
    } catch {
      // Ignore — the scrub handler will pick it up.
    }
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 150))
      if (frameIsVisible(video)) {
        setPosterGone(true)
        return
      }
      try {
        video.currentTime = steppedTime(
          scrollYProgress.get(),
          totalFramesRef.current,
        )
      } catch {
        // Ignore.
      }
    }
    // Still black after ~2s: leave the poster photo up. Never a black page.
  }

  return (
    <motion.div
      className="video-bg-wrap"
      aria-hidden="true"
      initial={{ opacity: 0, filter: 'blur(14px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.1, ease: 'easeOut' }}
    >
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
          // Round the frame count DOWN to a multiple of the step, so
          // progress 1 maps exactly back to frame 0 (replay).
          totalFramesRef.current =
            Math.floor((duration * FPS) / FRAME_STEP) * FRAME_STEP
          // Seek to the current scroll position as soon as the video can
          // be scrubbed, so the first paint already shows the right frame.
          if (duration > 0) {
            try {
              e.currentTarget.currentTime = steppedTime(
                scrollYProgress.get(),
                totalFramesRef.current,
              )
            } catch {
              // Ignore — the scrub handler below will pick it up.
            }
          }
        }}
        onLoadedData={primeVideo}
      />
      {/* Poster photo over the video until a real frame is proven visible.
          On phones the video stays black until it has played once — this
          layer is what stops the page ever being a black screen. */}
      <img
        className={posterGone ? 'video-bg-poster gone' : 'video-bg-poster'}
        src={POSTER}
        alt=""
        aria-hidden="true"
      />
      {/* Uniform dim so text stays readable over the video everywhere */}
      <div className="video-bg-dim" />
    </motion.div>
  )
}
