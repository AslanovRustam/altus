import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type HlsType from 'hls.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Props = {
  src: string
  poster?: string
  className?: string
  loadingLabel?: string
  /** false → only the raw first frame is shown; true → grading layers fade in */
  revealed?: boolean
  onReady?: () => void
}

const isHls = (src: string) => /\.m3u8($|\?)/i.test(src)

/**
 * Progressive MP4 is downloaded into memory first: a fully-buffered blob
 * makes every seek instant, which is what scroll-scrubbing needs.
 */
async function loadAsBlob(url: string, signal: AbortSignal, onProgress: (p: number) => void) {
  const res = await fetch(url, { signal })
  if (!res.ok || !res.body) throw new Error(`Video request failed: ${res.status}`)

  const total = Number(res.headers.get('content-length')) || 0
  const reader = res.body.getReader()
  const chunks: BlobPart[] = []
  let loaded = 0

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value as BlobPart)
    loaded += value.byteLength
    if (total) onProgress(Math.min(99, Math.round((loaded / total) * 100)))
  }

  return URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }))
}

export default function ScrollVideo({
  src,
  poster,
  className = '',
  loadingLabel = 'Loading…',
  revealed = false,
  onReady,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const dimRef = useRef<HTMLDivElement>(null)
  const gradeRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  const [progress, setProgress] = useState(0)
  const [canPlay, setCanPlay] = useState(false)
  const [overlayGone, setOverlayGone] = useState(false)

  // ---- Loading: HLS (hls.js / Safari native) or progressive MP4 ----
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const controller = new AbortController()
    let hls: HlsType | null = null
    let objectUrl: string | null = null
    let cancelled = false

    const trackBuffered = () => {
      const { buffered, duration } = video
      if (!duration || !buffered.length) return
      const bufferedEnd = buffered.end(buffered.length - 1)
      setProgress(Math.round((bufferedEnd / duration) * 100))
    }

    const handleCanPlay = () => {
      setProgress(100)
      setCanPlay(true)
    }

    video.addEventListener('canplay', handleCanPlay)

    if (isHls(src)) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari: native HLS
        video.src = src
        video.addEventListener('progress', trackBuffered)
      } else {
        import('hls.js').then(({ default: Hls }) => {
          if (cancelled) return
          if (!Hls.isSupported()) {
            video.src = src
            return
          }
          hls = new Hls({
            maxBufferLength: 120,
            maxMaxBufferLength: 600,
            maxBufferSize: 200 * 1024 * 1024,
            startPosition: 0,
            capLevelToPlayerSize: false,
            startLevel: -1,
            autoStartLoad: true,
          })
          const instance = hls
          instance.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
            const maxLevel = data.levels.length - 1
            instance.currentLevel = maxLevel
            instance.startLevel = maxLevel
          })
          instance.on(Hls.Events.FRAG_BUFFERED, trackBuffered)
          instance.loadSource(src)
          instance.attachMedia(video)
        })
      }
    } else {
      loadAsBlob(src, controller.signal, setProgress)
        .then((url) => {
          if (cancelled) return URL.revokeObjectURL(url)
          objectUrl = url
          video.src = url
        })
        .catch(() => {
          if (cancelled) return
          // Fallback: let the browser stream it
          video.src = src
          video.addEventListener('progress', trackBuffered)
        })
    }

    return () => {
      cancelled = true
      controller.abort()
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('progress', trackBuffered)
      hls?.destroy()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src])

  // ---- Hide loading overlay once the video can play ----
  useGSAP(
    () => {
      if (!canPlay) return
      gsap
        .timeline({
          onComplete: () => {
            setOverlayGone(true)
            onReadyRef.current?.()
          },
        })
        .to('[data-loader-inner]', { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in' }, 0.2)
        .to(overlayRef.current, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0.45)
    },
    { dependencies: [canPlay], scope: overlayRef },
  )

  // ---- Scroll-to-seek with throttling ----
  useGSAP(
    () => {
      const video = videoRef.current
      if (!canPlay || !video) return

      // iOS needs a play() gesture before paused seeks paint frames
      video.play().then(() => video.pause()).catch(() => {})

      const duration = video.duration
      let currentTarget = 0
      let seekPending = false

      // Ask the decoder for a new frame ONLY once it has finished the previous one.
      const doSeek = () => {
        if (video.seeking) {
          seekPending = true
          return
        }
        if (Math.abs(video.currentTime - currentTarget) < 0.005) return
        video.currentTime = currentTarget
      }

      const onSeeked = () => {
        if (!seekPending) return
        seekPending = false
        doSeek()
      }
      video.addEventListener('seeked', onSeeked)

      const st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          // stop a hair before the end to avoid a black last frame
          currentTarget = self.progress * Math.max(0, duration - 0.05)
          doSeek()
        },
      })

      currentTarget = st.progress * Math.max(0, duration - 0.05)
      doSeek()

      // Darken the footage once the hero has scrolled away so content stays readable
      gsap.fromTo(
        dimRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            start: () => window.innerHeight * 0.5,
            end: () => window.innerHeight * 1.5,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )

      return () => video.removeEventListener('seeked', onSeeked)
    },
    { dependencies: [canPlay] },
  )

  // ---- Grading layers stay hidden until the visitor starts scrolling ----
  useGSAP(
    () => {
      if (!revealed) {
        gsap.set(gradeRef.current, { autoAlpha: 0 })
        return
      }
      gsap.to(gradeRef.current, { autoAlpha: 1, duration: 1.8, ease: 'power2.out' })
    },
    { dependencies: [revealed] },
  )

  return (
    <>
      <div className="fixed top-0 left-0 z-0 h-full w-full" aria-hidden>
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${className}`}
          poster={poster}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          disablePictureInPicture
        />
      </div>

      {/* Static grading layers (not affected by parallax) */}
      <div ref={gradeRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_10%,transparent_30%,rgb(11_13_12/0.75)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-ink/70 via-ink/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
        <div ref={dimRef} className="absolute inset-0 bg-ink/45 opacity-0" />
        <div className="grain" />
      </div>

      {!overlayGone && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          role="status"
          aria-live="polite"
        >
          <div data-loader-inner className="flex w-64 flex-col items-center gap-5 text-white">
            <svg viewBox="0 0 32 32" className="h-8 w-8 opacity-80" aria-hidden>
              <path d="M2 27 13 8l5 8 3-5 9 16Z" fill="currentColor" />
            </svg>
            <p className="font-sans text-2xl tabular-nums">
              {loadingLabel} {progress}%
            </p>
            <div className="h-px w-full overflow-hidden bg-white/15">
              <div
                className="h-full bg-white transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
