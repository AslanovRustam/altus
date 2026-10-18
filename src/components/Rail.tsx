import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { TOURS } from '../data'
import { useLang } from '../i18n'

/** Endless marquee that speeds up and flips direction with the scroll — à la ethnocare "rail". */
export default function Rail() {
  const root = useRef<HTMLDivElement>(null)
  const { t, fmt } = useLang()

  useGSAP(
    () => {
      const loop = gsap.to('[data-rail-track]', { xPercent: -50, ease: 'none', duration: 40, repeat: -1 })
      // plenty of room to play backwards
      loop.totalTime(loop.duration() * 100)

      let direction = 1
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity()
          if (velocity) direction = velocity > 0 ? 1 : -1
          const boost = Math.min(Math.abs(velocity) / 120, 14)
          gsap.killTweensOf(loop)
          loop.timeScale(direction * (1 + boost))
          gsap.to(loop, { timeScale: direction, duration: 1.2, ease: 'power2.out', delay: 0.05 })
        },
      })
    },
    { scope: root },
  )

  const items = TOURS.map((tour) => ({ name: t.tours.items[tour.id].name, alt: fmt(tour.altitude) }))
  const row = (copy: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0}>
      {items.map((item) => (
        <span key={`${copy}-${item.name}`} className="flex items-center">
          <span className="px-6 text-[clamp(3rem,9vw,8.5rem)] leading-none font-extrabold tracking-[-0.03em] text-transparent uppercase [-webkit-text-stroke:1.5px_rgb(233_236_230/0.55)]">
            {item.name}
          </span>
          <span className="px-2 text-sm tracking-[0.2em] text-ember uppercase">
            {item.alt} {t.units.m}
          </span>
          <svg viewBox="0 0 32 32" className="mx-8 h-6 w-6 text-mist/40" aria-hidden>
            <path d="M2 27 13 8l5 8 3-5 9 16Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  )

  return (
    <div ref={root} className="relative overflow-hidden border-y border-white/10 py-10 md:py-14">
      <p className="sr-only">{t.rail}</p>
      <div data-rail-track className="flex w-max will-change-transform">
        {row(0)}
        {row(1)}
      </div>
    </div>
  )
}
