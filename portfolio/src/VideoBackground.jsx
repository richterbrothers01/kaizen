import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { loadB64Asset } from './loadB64.js'

// Two background videos, one per page:
// - Home ("/"): the new 10s video — 1280x720, 60fps, ~9.93s, 596 frames.
// - Contact ("/contact"): the original 5s video — 60fps, ~3.93s, 236 frames.
// Both live as base64 text in public/ (snapshot push rejects binaries)
// and are decoded to Blob URLs at runtime, same as the poster.
// Each page also has its own poster frame so the photo matches the video
// underneath while the decoder primes.
const VIDEO_FILES = {
  home: 'hero-bg-home.mp4.b64',
  contact: 'hero-bg.mp4.b64',
}
const POSTER_FILES = {
  home: 'hero-poster-home.webp.b64',
  contact: 'hero-poster.webp.b64',
}

// The videos are 60fps. Total frames are computed from the loaded
// metadata. Scroll maps to frames in steps of 5: at the very bottom it
// wraps to frame 0 and replays.
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
//
// Route switching: the video and poster swap when the route changes
// (home <-> contact). The old blob URLs stay alive until the new ones are
// ready, so there is no black flash mid-swap; proof state resets per
// video, and each prime is tagged with a session id so a prime started
// for the old video can never mark the new one as proven.
export default function VideoBackground() {
  const { pathname } = useLocation()
  const isContact = pathname === '/contact'
  const videoFile = isContact ? VIDEO_FILES.contact : VIDEO_FILES.home
  const posterFile = isContact ? POSTER_FILES.contact : POSTER_FILES.home

  const videoRef = useRef(null)
  const durationRef = useRef(0)
  const totalFramesRef = useRef(0)
  const provenRef = useRef(false)
  const primingRef = useRef(0)
  const sessionRef = useRef(0)
  const videoUrlRef = useRef(null)
  const posterUrlRef = useRef(null)
  const [posterGone, setPosterGone] = useState(false)
  const [posterUrl, setPosterUrl] = useState(null)

  // Load the poster photo for the current route from its base64 text
  // asset. Until it arrives the previous poster's URL stays live, so the
  // layer never goes blank mid-swap. The poster layer only renders once
  // a URL exists.
  useEffect(() => {
    let cancelled = false
    setPosterGone(false)
    loadB64Asset(posterFile, 'image/webp')
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url)
          return
        }
        if (posterUrlRef.current) URL.revokeObjectURL(posterUrlRef.current)
        posterUrlRef.current = url
        setPosterUrl(url)
      })
      .catch(() => {
        // Poster stays missing — the video still works without it.
      })
    return () => {
      cancelled = true
    }
  }, [posterFile])

  // Revoke the live poster URL on unmount.
  useEffect(() => {
    return () => {
      if (posterUrlRef.current) URL.revokeObjectURL(posterUrlRef.current)
    }
  }, [])

  // Load the base64 asset for the current route, decode it to a Blob,
  // and hand the video an object URL. The base64 string never goes into
  // a JS bundle. The previous blob URL is revoked only after the new
  // source is set, so the video never sits on a dead URL.
  useEffect(() => {
    let cancelled = false

    // New video, new session: proof state resets and any prime still
    // running for the old video is abandoned (session checks below).
    sessionRef.current += 1
    provenRef.current = false
    durationRef.current = 0
    totalFramesRef.current = 0
    setPosterGone(false)

    fetch(`${import.meta.env.BASE_URL}${videoFile}`)
      .then((res) => {
        if (!res.ok) throw new Error('video asset failed to load')
        return res.text()
      })
      .then((b64) => {
        const clean = b64.replace(/\s/g, '')
        const bin = atob(clean)
        const bytes = new Uint8Array(bin.length)
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
        const objectUrl = URL.createObjectURL(
          new Blob([bytes], { type: 'video/mp4' }),
        )
        if (cancelled) {
          URL.revokeObjectURL(objectUrl)
          return
        }
        const video = videoRef.current
        if (video) {
          video.src = objectUrl
          if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
          videoUrlRef.current = objectUrl
        } else {
          URL.revokeObjectURL(objectUrl)
        }
      })
      .catch(() => {
        // Poster stays — the page still looks right without the video.
      })

    return () => {
      cancelled = true
    }
  }, [videoFile])

  // Revoke the live video URL on unmount.
  useEffect(() => {
    return () => {
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current)
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
  // once a real frame is proven on screen. Tagged with the current
  // session so a stale prime (from the previous route's video) bails out
  // instead of proving or pausing the new video.
  const primeVideo = async () => {
    const video = videoRef.current
    const session = sessionRef.current
    if (!video || provenRef.current || primingRef.current === session) return
    primingRef.current = session
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
          // Stale callback from the previous video — ignore it.
          if (session !== sessionRef.current) {
            finish(false)
            return
          }
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

      if (session !== sessionRef.current) return

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
        if (session !== sessionRef.current) return
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
      if (primingRef.current === session) primingRef.current = 0
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
          // Home: 596 -> 595. Contact: 236 -> 235.
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
