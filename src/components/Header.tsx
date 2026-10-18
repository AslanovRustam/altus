import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { scrollToHash, setScrollLocked } from '../lib/lenis'
import { useLang } from '../i18n'
import { CONTACTS } from '../data'
import Logo from './Logo'
import LangSwitcher from './LangSwitcher'

const GLASS_AFTER = 160

export default function Header({ revealed }: { revealed: boolean }) {
  const { t } = useLang()
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const nav = [
    { href: '#approach', label: t.nav.approach },
    { href: '#tours', label: t.nav.tours },
    { href: '#process', label: t.nav.process },
    { href: '#contact', label: t.nav.contact },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > GLASS_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!revealed) return
    setScrollLocked(open)
  }, [open, revealed])

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-header-item]', headerRef.current)
      if (!revealed) {
        gsap.set(headerRef.current, { autoAlpha: 0 })
        gsap.set(items, { autoAlpha: 0, y: -18 })
        return
      }
      gsap.set(headerRef.current, { autoAlpha: 1 })
      gsap.to(items, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, delay: 0.15 })
    },
    { dependencies: [revealed] },
  )

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setOpen(false)
    // wait a frame so the scroll lock is released before scrolling
    requestAnimationFrame(() => scrollToHash(href))
  }

  return (
    <>
      <header
        ref={headerRef}
        className={[
          'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter,box-shadow] duration-700 ease-out-expo',
          scrolled || open
            ? 'border-white/10 bg-ink/35 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.6)] backdrop-blur-2xl backdrop-saturate-150'
            : 'border-transparent bg-transparent',
        ].join(' ')}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-[height] duration-700 ease-out-expo md:px-10 ${
            scrolled ? 'h-16' : 'h-20 md:h-24'
          }`}
        >
          <a
            data-header-item
            href="#top"
            onClick={(e) => go(e, '#top')}
            className="relative z-10"
            aria-label={t.nav.home}
          >
            <Logo />
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={t.nav.main}>
            {nav.map((item) => (
              <a
                key={item.href}
                data-header-item
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className="group relative rounded-full px-4 py-2 text-[15px] text-mist/80 transition-colors hover:text-mist"
              >
                {item.label}
                <span className="absolute inset-x-4 bottom-1 h-px origin-right scale-x-0 bg-mist/70 transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              data-header-item
              href={CONTACTS.phoneHref}
              className="hidden text-sm text-mist/70 transition-colors hover:text-mist 2xl:block"
            >
              {CONTACTS.phone}
            </a>
            <div data-header-item className="relative z-10">
              <LangSwitcher />
            </div>
            <a
              data-header-item
              href="#contact"
              onClick={(e) => go(e, '#contact')}
              className="hidden rounded-full bg-mist px-5 py-2.5 text-sm font-medium text-ink transition-[background-color,transform] duration-300 hover:bg-white active:scale-[0.97] sm:inline-flex"
            >
              {t.nav.book}
            </a>
            <button
              data-header-item
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.open}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-px w-full bg-mist transition-transform duration-500 ease-out-expo ${
                    open ? 'top-1/2 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-mist transition-transform duration-500 ease-out-expo ${
                    open ? 'top-1/2 -rotate-45' : 'top-full'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — sibling of <header>: backdrop-filter there would trap position:fixed */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-30 h-dvh bg-ink/80 backdrop-blur-2xl transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav className="flex h-full flex-col justify-center gap-2 px-6" aria-label={t.nav.mobile}>
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className={`border-b border-white/10 py-4 text-4xl font-light tracking-tight transition-[opacity,transform] duration-700 ease-out-expo ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => go(e, '#contact')}
            className="mt-8 inline-flex w-fit rounded-full bg-ember px-7 py-4 font-medium text-ink"
          >
            {t.nav.bookMobile}
          </a>
          <a href={CONTACTS.phoneHref} className="mt-6 text-mist/60">
            {CONTACTS.phone}
          </a>
        </nav>
      </div>
    </>
  )
}
