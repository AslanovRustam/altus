import { useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import ScrollVideo from './components/ScrollVideo'
import Header from './components/Header'
import Hero from './components/Hero'
import Approach from './components/Approach'
import Rail from './components/Rail'
import Tours from './components/Tours'
import Process from './components/Process'
import Quote from './components/Quote'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { initLenis, scrollToHash, setScrollLocked } from './lib/lenis'
import { useLang } from './i18n'
import type { TourId } from './data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const VIDEO_SRC =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
    ? '/video/mountains-720.mp4'
    : '/video/mountains-1080.mp4'

const INTRO_HOLD_MS = 2000

export default function App() {
  const { t, lang } = useLang()
  /** video is buffered and the loader is gone */
  const [ready, setReady] = useState(false)
  /** intro hold is over (or the visitor scrolled) → the interface fades in over the footage */
  const [revealed, setRevealed] = useState(false)
  const [tour, setTour] = useState<TourId | ''>('')

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const destroy = initLenis()
    setScrollLocked(true)
    return destroy
  }, [])

  useEffect(() => {
    if (!ready) return
    setScrollLocked(false)
    ScrollTrigger.refresh()
  }, [ready])

  // Hold the bare first frame for a moment, then reveal the interface (scrolling skips the wait)
  useEffect(() => {
    if (!ready || revealed) return
    const reveal = () => setRevealed(true)
    const timer = window.setTimeout(reveal, INTRO_HOLD_MS)
    const onScroll = () => {
      if (window.scrollY > 2) reveal()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ready, revealed])

  // New language → new text metrics (and possibly new fonts) → re-measure triggers
  useEffect(() => {
    if (!ready) return
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [lang, ready])

  // Generic reveal for everything marked with data-reveal
  useGSAP(() => {
    gsap.set('[data-reveal]', { autoAlpha: 0, y: 48, filter: 'blur(6px)' })
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.3,
          stagger: 0.09,
          ease: 'expo.out',
          overwrite: true,
        }),
    })
  })

  const handleReady = useCallback(() => setReady(true), [])

  const book = useCallback((id: TourId) => {
    setTour(id)
    scrollToHash('#contact')
  }, [])

  return (
    <>
      <ScrollVideo
        src={VIDEO_SRC}
        poster="/video/poster.jpg"
        loadingLabel={t.loader}
        revealed={revealed}
        onReady={handleReady}
      />
      <Header revealed={revealed} />
      <main className="relative z-10">
        <Hero revealed={revealed} />
        <Approach />
        <Rail />
        <Tours onBook={book} />
        <Process />
        <Quote />
        <Contact tour={tour} onTourChange={setTour} />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  )
}
