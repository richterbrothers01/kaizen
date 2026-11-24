import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { loadB64Asset } from './loadB64.js'

// Poster stays until the decoded video is ready to show. It lives as
// base64 text in public/hero-poster.webp.b64 (snapshot push rejects
// binaries) and is decoded to a Blob URL at runtime, same as the video.
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
// Mobile reality: phones will not render a frame of a video that has never
// played — a scrubbed-only video stays black, and once the video loads the
// poster is replaced by that black frame. Worse, play() followed by an
// immediate pause() can finish before the phone presents even one frame,
// so the video still has nothing to show and seeks stay black. So we
// (1) prime the decoder by playing muted until the compositor has genuinely
// presented a frame (requestVideoFrameCallback), only then pausing, (2) keep
// the poster photo layered over the video until a real frame is proven
// visible, and (3) retry the prime on the user's first touch — a real tap
// lifts autoplay blocks (low-power mode, data saver) that reject play()
// on load. If the video never renders, the photo stays — never a black page.
export default function VideoBackground() {
  const videoRef = useRef(null)
  const durationRef = useRef(0)
  const totalFramesRef = useRef(0)
  const provenRef = useRef(false)
  const primingRef = useRef(false)
  const [posterGone, setPosterGone] = useState(false)
  const [posterUrl, setPosterUrl] = useState(null)

  // Load the poster photo from its base64 text asset, same pattern as
  // the video below. Until it arrives the video shows its own first
  // frame once decoded — the poster layer only renders once it exists.
  useEffect(() => {
    let cancelled = false
    let objectUrl = null
    loadB64Asset('hero-poster.webp.b64', 'image/webp')
      .then((url) => {
        if (!cancelled) {
          objectUrl = url
          setPosterUrl(url)
        } else {
          URL.revokeObjectURL(url)
        }
      })
      .catch(() => {
        // Poster stays missing — the video still works without it.
      })
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

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

  // Prime the decoder: play muted until one frame is genuinely presented,
  // then pause and seek to the scroll target. Hides the poster photo only
  // once a real frame is proven on screen.
  const primeVideo = async () => {
    const video = videoRef.current
    if (!video || provenRef.current || primingRef.current) return
    primingRef.current = true
    try {
      const presented = await new Promise((resolve) => {
        let done = false
        const finish = (ok) => {
          if (!done) {
            done = true
            resolve(ok)
          }
        }
        const onFrame = () => {
          try {
            video.pause()
          } catch {
            // Ignore.
          }
          finish(true)
        }
        if ('requestVideoFrameCallback' in video) {
          try {
            video.requestVideoFrameCallback(onFrame)
          } catch {
            // Fall through to the timeupdate listener.
          }
        }
        video.addEventListener('timeupdate', onFrame, { once: true })
        setTimeout(() => finish(false), 1200)
        video.play().catch(() => finish(false))
      })

      try {
        video.currentTime = steppedTime(
          scrollYProgress.get(),
          totalFramesRef.current,
        )
      } catch {
        // Ignore — the scrub handler will pick it up.
      }

      // requestVideoFrameCallback firing means the compositor presented a
      // frame: the video is showing picture, so the poster can go at once.
      if (presented) {
        provenRef.current = true
        setPosterGone(true)
        return
      }
      // Otherwise keep checking the pixels — seeks may still render.
      for (let i = 0; i < 10; i++) {
        if (frameIsVisible(video)) {
          provenRef.current = true
          setPosterGone(true)
          return
        }
        await new Promise((r) => setTimeout(r, 150))
        try {
          video.currentTime = steppedTime(
            scrollYProgress.get(),
            totalFramesRef.current,
          )
        } catch {
          // Ignore.
        }
      }
      // Still no proof after ~1.5s: leave the poster photo up. Never black.
    } finally {
      primingRef.current = false
    }
  }

  // A real touch lifts autoplay blocks that reject play() on load (low
  // power mode, data saver). Retry the prime on the first touch if the
  // video still has not proven a frame.
  useEffect(() => {
    const retry = () => {
      if (!provenRef.current) primeVideo()
    }
    window.addEventListener('pointerdown', retry)
    return () => window.removeEventListener('pointerdown', retry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        poster={posterUrl || undefined}
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
      {posterUrl && (
        <img
          className={posterGone ? 'video-bg-poster gone' : 'video-bg-poster'}
          src={posterUrl}
          alt=""
          aria-hidden="true"
        />
      )}
      {/* Uniform dim so text stays readable over the video everywhere */}
      <div className="video-bg-dim" />
    </motion.div>
  )
}
