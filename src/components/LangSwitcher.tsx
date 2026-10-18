import { useLang, type Lang } from '../i18n'

const OPTIONS: { id: Lang; label: string; full: string }[] = [
  { id: 'en', label: 'EN', full: 'English' },
  { id: 'uk', label: 'UA', full: 'Українська' },
]

export default function LangSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLang()
  const index = OPTIONS.findIndex((o) => o.id === lang)

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={`relative flex rounded-full border border-white/15 bg-white/[0.06] p-1 backdrop-blur-md ${className}`}
    >
      <span
        aria-hidden
        className="absolute top-1 bottom-1 left-1 w-11 rounded-full bg-mist shadow-[0_4px_14px_-4px_rgb(0_0_0/0.5)] transition-transform duration-500 ease-out-expo"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          lang={o.id}
          title={o.full}
          aria-label={o.full}
          aria-pressed={lang === o.id}
          onClick={() => setLang(o.id)}
          className={`relative z-10 w-11 py-1.5 text-xs font-semibold tracking-[0.12em] transition-colors duration-500 ${
            lang === o.id ? 'text-ink' : 'text-mist/70 hover:text-mist'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
