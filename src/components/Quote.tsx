import { useLang } from '../i18n'

export default function Quote() {
  const { t } = useLang()

  return (
    <section className="relative py-32 md:py-44">
      <figure className="mx-auto max-w-[1100px] px-5 text-center md:px-10">
        <span data-reveal className="block text-8xl leading-none font-extralight text-ember/80 italic" aria-hidden>
          “
        </span>
        <blockquote
          data-reveal
          className="mt-2 text-[clamp(1.8rem,4vw,3.4rem)] leading-[1.15] font-light tracking-[-0.02em] text-mist/95 italic text-balance"
        >
          {t.quote.text}
        </blockquote>
        <figcaption data-reveal className="mt-10 flex items-center justify-center gap-4 text-sm text-mist/60">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 font-medium text-mist">
            {t.quote.initials}
          </span>
          <span className="text-left">
            <span className="block text-mist">{t.quote.name}</span>
            {t.quote.meta}
          </span>
        </figcaption>
      </figure>
    </section>
  )
}
