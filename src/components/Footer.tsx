import { scrollToHash } from '../lib/lenis'
import { useLang } from '../i18n'
import { CONTACTS } from '../data'
import Logo from './Logo'
import Logo3D from './Logo3D'

export default function Footer() {
  const { t } = useLang()

  const columns = [
    {
      title: t.footer.routes,
      links: [
        { label: t.tours.items.kilimanjaro.name, href: '#tours' },
        { label: t.tours.items.kazbek.name, href: '#tours' },
        { label: t.tours.items.montblanc.name, href: '#tours' },
        { label: t.footer.himalaya, href: '#tours' },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.nav.approach, href: '#approach' },
        { label: t.nav.process, href: '#process' },
        { label: t.nav.contact, href: '#contact' },
      ],
    },
    {
      title: t.footer.social,
      links: [
        { label: 'Telegram', href: 'https://t.me/' },
        { label: 'Instagram', href: 'https://instagram.com/' },
        { label: 'YouTube', href: 'https://youtube.com/' },
      ],
    },
  ]

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    scrollToHash(href)
  }

  return (
    <footer className="relative mt-16 border-t border-white/10 bg-ink/55 backdrop-blur-2xl">
      <div className="mx-auto max-w-[1440px] px-5 pt-20 pb-8 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm leading-relaxed text-mist/60">{t.footer.tagline}</p>
            <div className="mt-8 space-y-2 text-mist/80">
              <a href={CONTACTS.phoneHref} className="link-underline block w-fit">
                {CONTACTS.phone}
              </a>
              <a href={`mailto:${CONTACTS.email}`} className="link-underline block w-fit">
                {CONTACTS.email}
              </a>
              <p className="max-w-xs text-sm leading-relaxed text-mist/50">{t.contact.address}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs tracking-[0.2em] text-mist/45 uppercase">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        onClick={(e) => onClick(e, l.href)}
                        {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className="link-underline text-mist/80 hover:text-ember"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Logo3D />

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-mist/45 md:flex-row">
          <p>{t.footer.rights}</p>
          <a href="#top" onClick={(e) => onClick(e, '#top')} className="link-underline w-fit hover:text-mist">
            {t.footer.top}
          </a>
        </div>
      </div>
    </footer>
  )
}
