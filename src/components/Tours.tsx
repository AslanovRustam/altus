import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { TOURS, type TourId } from '../data'
import { useLang, usd } from '../i18n'
import { scrollToHash } from '../lib/lenis'
import SectionLabel from './SectionLabel'
import RevealHeading from './RevealHeading'
import Arrow from './Arrow'
import { blur } from '../lib/motion'

const MAX_ALT = Math.max(...TOURS.map((t) => t.altitude))

export default function Tours({ onBook }: { onBook: (tour: TourId) => void }) {
  const root = useRef<HTMLElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const { t, lang, fmt } = useLang()
  const total = TOURS.length + 1

  // Pinned horizontal scroll: vertical scroll distance = how far the track must travel
  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>('[data-track]')!
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            gsap.set('[data-progress]', { scaleX: self.progress })
            const index = Math.min(total, Math.floor(self.progress * total) + 1)
            if (counterRef.current) counterRef.current.textContent = String(index).padStart(2, '0')
          },
        },
      })

      // Cards rise and sharpen as they slide in from the right. The effect completes once the
      // card's right edge is inside the viewport — the last card always gets there.
      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.35, scale: 0.9, rotate: 2.5, ...blur(4) },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            ...blur(0),
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: 'left 100%',
              end: 'right 100%',
              scrub: true,
            },
          },
        )
      })
    },
    { scope: root },
  )

  // Card widths change with the language → recompute the travel distance
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang])

  return (
    <section ref={root} id="tours" className="relative flex h-svh flex-col justify-center overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-6 px-5 pt-20 md:flex-row md:items-end md:px-10">
        <div>
          <SectionLabel index="02">{t.tours.label}</SectionLabel>
          <RevealHeading
            text={t.tours.title}
            className="max-w-[26ch] text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1] font-light tracking-[-0.035em]"
          />
        </div>
        <div data-reveal className="hidden w-64 shrink-0 md:block">
          <p className="text-sm leading-relaxed text-mist/60">{t.tours.lead}</p>
          <div className="mt-5 flex items-center gap-4 text-xs tracking-[0.2em] text-mist/60 tabular-nums">
            <span ref={counterRef} className="text-mist">
              01
            </span>
            <span className="relative h-px flex-1 bg-white/15">
              <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-ember" />
            </span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      <div
        data-track
        className="mt-8 flex w-max gap-4 pr-5 pl-5 will-change-transform md:mt-10 md:gap-5 md:pr-10 md:pl-[max(2.5rem,calc((100vw_-_1440px)/2_+_2.5rem))]"
      >
        {TOURS.map((tour) => {
          const text = t.tours.items[tour.id]
          return (
            <article
              key={tour.id}
              data-card
              className="glass-dark group relative flex w-[82vw] shrink-0 flex-col rounded-[28px] p-6 transition-[border-color] duration-500 hover:border-white/25 sm:w-[380px] md:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.2em] text-mist/50 uppercase">{text.country}</p>
                  <h3 className="mt-2 text-3xl font-light tracking-tight">{text.name}</h3>
                </div>
                <span className="shrink-0 rounded-full border border-white/12 px-3 py-1 text-xs text-mist/70">
                  {t.days(tour.days)}
                </span>
              </div>

              <p className="mt-6 text-[clamp(3rem,5vw,4.25rem)] leading-none font-extralight tracking-[-0.05em]">
                {fmt(tour.altitude)}
                <span className="ml-2 align-top text-base font-normal tracking-normal text-mist/45">{t.units.m}</span>
              </p>

              {/* altitude ridge: bar heights hint at relative height */}
              <div className="mt-4 flex h-7 items-end gap-[3px]" aria-hidden>
                {Array.from({ length: 28 }).map((_, i) => {
                  const peak = 1 - Math.abs(i - 17) / 17
                  const h = 15 + peak * (tour.altitude / MAX_ALT) * 85
                  return (
                    <span
                      key={i}
                      className="flex-1 rounded-sm bg-mist/15 transition-colors duration-500 group-hover:bg-ember/50"
                      style={{ height: `${h}%`, transitionDelay: `${i * 12}ms` }}
                    />
                  )
                })}
              </div>

              <p className="mt-5 min-h-[3em] text-[15px] leading-relaxed text-mist/65">{text.note}</p>

              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm">
                <div>
                  <dt className="text-mist/45">{t.tours.difficulty}</dt>
                  <dd className="mt-2 flex gap-1" aria-label={`${tour.difficulty} / 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-5 rounded-full ${i < tour.difficulty ? 'bg-ember' : 'bg-white/12'}`}
                      />
                    ))}
                  </dd>
                  <dd className="mt-2 text-xs text-mist/50">{t.tours.levels[tour.level]}</dd>
                </div>
                <div>
                  <dt className="text-mist/45">{t.tours.season}</dt>
                  <dd className="mt-1 text-mist/85">{text.season}</dd>
                </div>
              </dl>

              <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                <p className="text-lg">
                  <span className="text-sm text-mist/50">{t.tours.from} </span>
                  <span className="font-medium">{usd(tour.priceUsd)}</span>
                </p>
                <button
                  type="button"
                  onClick={() => onBook(tour.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-mist/10 px-5 py-3 text-sm text-mist transition-[background-color,color] duration-300 group-hover:bg-mist group-hover:text-ink"
                >
                  {t.tours.book}
                  <Arrow />
                </button>
              </div>
            </article>
          )
        })}

        <article
          data-card
          className="glass-dark relative flex w-[82vw] shrink-0 flex-col justify-between overflow-hidden rounded-[28px] border-ember/30 p-7 sm:w-[380px]"
        >
          <span className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-ember/20 blur-3xl" />
          <svg viewBox="0 0 32 32" className="h-10 w-10 text-mist/80" aria-hidden>
            <path d="M2 27 13 8l5 8 3-5 9 16Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <div className="relative">
            <h3 className="text-3xl leading-tight font-light tracking-tight">{t.tours.custom.title}</h3>
            <p className="mt-4 leading-relaxed text-mist/80">{t.tours.custom.text}</p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollToHash('#contact')
              }}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ember py-2 pr-2 pl-6 text-ink transition-colors hover:bg-[#ecc283]"
            >
              {t.tours.custom.cta}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-mist transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                <Arrow />
              </span>
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}
