import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n'
import SectionLabel from './SectionLabel'
import RevealHeading from './RevealHeading'

export default function Process() {
  const root = useRef<HTMLElement>(null)
  const { t } = useLang()

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-rope]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 60%', scrub: true },
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
        gsap.fromTo(
          step.querySelector('[data-dot]'),
          { scale: 0.4, backgroundColor: 'rgba(233,236,230,0.2)' },
          {
            scale: 1,
            backgroundColor: '#e3b46c',
            duration: 0.6,
            ease: 'back.out(3)',
            scrollTrigger: { trigger: step, start: 'top 62%', toggleActions: 'play none none reverse' },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="process" className="relative py-32 md:py-44">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel index="03">{t.process.label}</SectionLabel>
          <RevealHeading
            text={t.process.title}
            className="text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.98] font-light tracking-[-0.04em]"
          />
          <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-mist/65">
            {t.process.lead}
          </p>
        </div>

        <ol data-steps className="relative">
          <span className="absolute top-2 bottom-2 left-[7px] w-px bg-white/10" aria-hidden />
          <span
            data-rope
            className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-ember via-ember to-moss"
            aria-hidden
          />
          {t.process.steps.map((s, i) => (
            <li key={i} data-step className="relative pb-16 pl-12 last:pb-0 md:pl-16">
              <span data-dot className="absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full ring-4 ring-ink/60" />
              <div data-reveal className="glass-dark rounded-3xl p-7 md:p-9">
                <div className="flex items-center justify-between text-xs tracking-[0.2em] text-mist/50 uppercase">
                  <span>
                    {t.process.stage} {i + 1}
                  </span>
                  <span className="text-ember">{s.mark}</span>
                </div>
                <h3 className="mt-5 text-2xl font-light tracking-tight md:text-3xl">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-mist/65">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
