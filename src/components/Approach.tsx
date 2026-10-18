import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { STATS } from '../data'
import { useLang } from '../i18n'
import SectionLabel from './SectionLabel'
import { blur } from '../lib/motion'

/** Feed the cursor position to the card's glow (CSS vars, no re-render) */
function trackGlow(e: React.PointerEvent<HTMLElement>) {
  const card = e.currentTarget
  const r = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${e.clientX - r.left}px`)
  card.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function Approach() {
  const root = useRef<HTMLElement>(null)
  const { t, lang, fmt } = useLang()

  // Sticky statement: words sharpen out of the fog as you scroll
  useGSAP(
    () => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.12, ...blur(6) },
        {
          opacity: 1,
          ...blur(0),
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-statement-wrap]',
            start: 'top 30%',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  // Counters
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count)
        const counter = { v: 0 }
        gsap.to(counter, {
          v: target,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = fmt(Math.round(counter.v))
          },
          onComplete: () => {
            el.dataset.done = '1'
          },
        })
      })
    },
    { scope: root },
  )

  // Re-format finished counters when the language (number format) changes
  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>('[data-count][data-done]').forEach((el) => {
      el.textContent = fmt(Number(el.dataset.count))
    })
  }, [fmt])

  return (
    <section ref={root} id="approach" className="relative pt-16 pb-32 md:pb-48">
      <div data-statement-wrap className="relative h-[170vh]">
        <div className="sticky top-0 flex h-svh items-center">
          <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
            <SectionLabel index="01">{t.approach.label}</SectionLabel>
            <p className="max-w-[24ch] text-[clamp(2rem,5vw,4.6rem)] leading-[1.06] font-light tracking-[-0.03em] text-balance">
              {t.approach.statement.split(' ').map((word, i) => (
                <span key={`${lang}-${i}`} data-word className="inline-block whitespace-pre">
                  {word}{' '}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.approach.features.map((f, i) => (
            <article
              key={i}
              data-reveal
              onPointerMove={trackGlow}
              className="glass-dark glow-card group relative flex min-h-[280px] flex-col gap-14 rounded-3xl p-7 transition-transform duration-700 ease-out-expo hover:-translate-y-1.5"
            >
              <span className="text-5xl font-extralight text-mist/30 italic">0{i + 1}</span>
              <div>
                <h3 className="text-xl font-medium tracking-tight">{f.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mist/65">{f.text}</p>
              </div>
            </article>
          ))}
        </div>

        <dl className="mt-24 grid grid-cols-2 gap-y-12 border-t border-white/10 pt-12 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} data-reveal className="flex flex-col-reverse pr-6">
              <dt className="mt-3 text-sm text-mist/60">{t.approach.stats[i]}</dt>
              <dd className="text-[clamp(2.75rem,6vw,5.5rem)] leading-none font-light tracking-[-0.04em]">
                <span data-count={s.value}>0</span>
                <span className="text-ember">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
