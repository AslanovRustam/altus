import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { scrollToHash } from '../lib/lenis'
import { useLang } from '../i18n'
import Arrow from './Arrow'
import SplitChars from './SplitChars'
import { CHAR_FROM, CHAR_TO } from './RevealHeading'

export default function Hero({ revealed }: { revealed: boolean }) {
  const root = useRef<HTMLElement>(null)
  const { t, lang, fmt } = useLang()

  useGSAP(
    () => {
      const chars = gsap.utils.toArray<HTMLElement>('[data-hero-title] [data-char]')
      const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]')

      if (!revealed) {
        gsap.set(chars, { ...CHAR_FROM, transformPerspective: 700, transformOrigin: '50% 100%' })
        gsap.set(fades, { autoAlpha: 0, y: 28, filter: 'blur(8px)' })
      } else {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .fromTo(
            chars,
            { ...CHAR_FROM, transformPerspective: 700, transformOrigin: '50% 100%' },
            { ...CHAR_TO, duration: 1.5, stagger: 0.028 },
            0.1,
          )
          .fromTo(
            fades,
            { autoAlpha: 0, y: 28, filter: 'blur(8px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.3, stagger: 0.09 },
            0.45,
          )
      }

      // Content holds while the section is pinned (sticky), then drifts up and fades
      gsap.to('[data-hero-content]', {
        yPercent: -14,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: () => `top top-=${window.innerHeight * 0.45}`,
          end: () => `+=${window.innerHeight * 0.75}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    },
    { scope: root, dependencies: [revealed, lang], revertOnUpdate: true },
  )

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToHash(href)
  }

  return (
    <section ref={root} id="top" className="relative h-[175vh] font-display">
      <div className="sticky top-0 flex h-dvh flex-col justify-end overflow-hidden">
        <div data-hero-content className="mx-auto w-full max-w-[1440px] px-5 pt-28 pb-8 md:px-10 md:pb-12">
          <div>
            <p
              data-hero-fade
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs tracking-wider text-mist/85 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
              </span>
              {t.hero.badge}
            </p>

            <h1
              data-hero-title
              aria-label={`${t.hero.line1} ${t.hero.line2}`}
              className="text-[clamp(2.6rem,7.4vw,7.6rem)] leading-[0.95] tracking-[-0.01em]"
            >
              <span aria-hidden className="block">
                <SplitChars text={t.hero.line1} />
              </span>
              <span aria-hidden className="mt-1 block text-[0.62em] text-mist/70">
                <SplitChars text={t.hero.line2} />
              </span>
            </h1>
          </div>

          <div className="mt-10 grid items-end gap-10 md:mt-12 lg:grid-cols-[1fr_auto]">
            <div className="max-w-xl">
              <p data-hero-fade className="text-base leading-relaxed text-mist/80 md:text-lg">
                {t.hero.lead}
              </p>

              <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#tours"
                  onClick={(e) => go(e, '#tours')}
                  className="group inline-flex items-center gap-3 rounded-full bg-ember py-2 pr-2 pl-7 text-base text-ink transition-[transform,background-color] duration-300 hover:bg-[#ecc283] active:scale-[0.98]"
                >
                  {t.hero.cta}
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-mist transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-rotate-45">
                    <Arrow />
                  </span>
                </a>
                <a
                  href="#approach"
                  onClick={(e) => go(e, '#approach')}
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-7 py-[1.15rem] text-base text-mist backdrop-blur-md transition-colors duration-300 hover:bg-white/12"
                >
                  {t.hero.secondary}
                </a>
              </div>
            </div>

            <aside data-hero-fade className="glass w-full max-w-sm rounded-3xl p-6">
              <div className="flex items-center justify-between gap-4 text-xs tracking-wider text-mist/60 uppercase">
                <span>{t.hero.card.label}</span>
                <span className="text-ember">{t.hero.card.spots}</span>
              </div>
              <div className="mt-5 flex items-end justify-between gap-6">
                <div>
                  <p className="text-2xl">{t.hero.card.peak}</p>
                  <p className="mt-1 text-sm text-mist/60">{t.hero.card.dates}</p>
                </div>
                <p className="text-3xl text-mist/90">
                  {fmt(5895)}
                  <span className="ml-1 text-sm text-mist/50">{t.units.m}</span>
                </p>
              </div>
              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-moss to-ember" />
              </div>
              <p className="mt-2 text-xs text-mist/55">{t.hero.card.booked}</p>
            </aside>
          </div>

          <div
            data-hero-fade
            className="mt-12 flex items-center justify-between border-t border-white/10 pt-6 text-xs tracking-wider text-mist/55 uppercase"
          >
            <span className="flex items-center gap-3">
              <span className="relative h-8 w-px overflow-hidden bg-white/15">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-mist" />
              </span>
              {t.hero.scroll}
            </span>
            <span className="hidden md:block">42.6977° N · 44.5185° E</span>
          </div>
        </div>
      </div>
    </section>
  )
}
