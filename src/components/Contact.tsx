import { useState } from 'react'
import { CONTACTS, TOURS, type TourId } from '../data'
import { useLang, usd } from '../i18n'
import SectionLabel from './SectionLabel'
import RevealHeading from './RevealHeading'
import Arrow from './Arrow'

type Props = {
  tour: TourId | ''
  onTourChange: (tour: TourId | '') => void
}

type ErrorKey = 'name' | 'contact' | 'consent'

const inputCls =
  'w-full rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-4 text-mist placeholder:text-mist/35 outline-none transition-[border-color,background-color] duration-300 focus:border-ember/70 focus:bg-white/[0.07]'

function validate(data: FormData): ErrorKey[] {
  const errors: ErrorKey[] = []
  const name = String(data.get('name') ?? '').trim()
  const contact = String(data.get('contact') ?? '').trim()
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
  const isPhone = contact.replace(/\D/g, '').length >= 10

  if (name.length < 2) errors.push('name')
  if (!isEmail && !isPhone) errors.push('contact')
  if (!data.get('consent')) errors.push('consent')
  return errors
}

export default function Contact({ tour, onTourChange }: Props) {
  const { t, fmt } = useLang()
  const f = t.contact.form
  const [experience, setExperience] = useState(0)
  const [errors, setErrors] = useState<ErrorKey[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const err = (key: ErrorKey) => (errors.includes(key) ? f.errors[key] : undefined)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const found = validate(data)
    setErrors(found)
    if (found.length) return

    setStatus('sending')
    // TODO: connect a real endpoint (CRM / Telegram bot / email)
    window.setTimeout(() => setStatus('sent'), 1200)
  }

  return (
    <section id="contact" className="relative py-32 md:py-44">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 md:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionLabel index="04">{t.contact.label}</SectionLabel>
          <RevealHeading
            text={t.contact.title}
            className="text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.98] font-light tracking-[-0.04em]"
          />
          <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-mist/65">
            {t.contact.lead}
          </p>

          <ul data-reveal className="mt-14 space-y-6 text-mist/80">
            <li>
              <p className="text-xs tracking-[0.2em] text-mist/45 uppercase">{t.contact.phone}</p>
              <a href={CONTACTS.phoneHref} className="link-underline mt-1 inline-block text-xl">
                {CONTACTS.phone}
              </a>
            </li>
            <li>
              <p className="text-xs tracking-[0.2em] text-mist/45 uppercase">{t.contact.email}</p>
              <a href={`mailto:${CONTACTS.email}`} className="link-underline mt-1 inline-block text-xl">
                {CONTACTS.email}
              </a>
            </li>
            <li>
              <p className="text-xs tracking-[0.2em] text-mist/45 uppercase">{t.contact.office}</p>
              <a
                href="https://maps.google.com/?q=Французький+бульвар+66/2,+Одеса"
                target="_blank"
                rel="noreferrer"
                className="link-underline mt-1 inline-block max-w-md text-xl leading-snug"
              >
                {t.contact.address}
              </a>
            </li>
          </ul>
        </div>

        <div data-reveal className="glass-dark rounded-[32px] p-6 md:p-10">
          {status === 'sent' ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center text-center" role="status">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ember text-ink">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
                  <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="mt-8 text-3xl font-light tracking-tight">{f.success.title}</h3>
              <p className="mt-3 max-w-sm text-mist/65">{f.success.text}</p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-8 rounded-full border border-white/20 px-6 py-3 text-sm transition-colors hover:bg-white/10"
              >
                {f.success.again}
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label={f.name} error={err('name')} htmlFor="f-name">
                  <input
                    id="f-name"
                    name="name"
                    aria-invalid={!!err('name')}
                    autoComplete="name"
                    placeholder={f.namePh}
                    className={inputCls}
                  />
                </Field>
                <Field label={f.contact} error={err('contact')} htmlFor="f-contact">
                  <input
                    id="f-contact"
                    name="contact"
                    aria-invalid={!!err('contact')}
                    autoComplete="tel"
                    placeholder={f.contactPh}
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label={f.route} htmlFor="f-tour">
                <div className="relative">
                  <select
                    id="f-tour"
                    name="tour"
                    value={tour}
                    onChange={(e) => onTourChange(e.target.value as TourId | '')}
                    className={`${inputCls} appearance-none pr-12 [&>option]:bg-ink`}
                  >
                    <option value="">{f.routeNone}</option>
                    {TOURS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {t.tours.items[item.id].name} · {fmt(item.altitude)} {t.units.m} · {t.tours.from}{' '}
                        {usd(item.priceUsd)}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 16 16"
                    className="pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 text-mist/50"
                    fill="none"
                    aria-hidden
                  >
                    <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </Field>

              <fieldset>
                <legend className="mb-2.5 text-sm text-mist/60">{f.exp}</legend>
                <div className="flex flex-wrap gap-2">
                  {f.expOptions.map((x, i) => (
                    <label
                      key={i}
                      className={`rounded-full border px-5 py-2.5 text-sm transition-[background-color,color,border-color] duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ember ${
                        experience === i
                          ? 'border-mist bg-mist text-ink'
                          : 'border-white/15 text-mist/75 hover:border-white/35'
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={i}
                        checked={experience === i}
                        onChange={() => setExperience(i)}
                        className="sr-only"
                      />
                      {x}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field label={f.comment} htmlFor="f-msg">
                <textarea
                  id="f-msg"
                  name="message"
                  rows={4}
                  placeholder={f.commentPh}
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <div>
                <label className="flex items-start gap-3 text-sm text-mist/60">
                  <input type="checkbox" name="consent" className="peer sr-only" />
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/25 transition-colors peer-checked:border-ember peer-checked:bg-ember peer-focus-visible:ring-2 peer-focus-visible:ring-ember [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                    <svg viewBox="0 0 16 16" className="h-3 w-3 text-ink" fill="none" aria-hidden>
                      <path d="m3 8.5 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  {f.consent}
                </label>
                {err('consent') && <p className="mt-2 text-sm text-[#f0a08a]">{err('consent')}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="group mt-2 inline-flex items-center justify-between gap-3 rounded-full bg-ember py-2 pr-2 pl-7 text-base font-medium text-ink transition-[transform,background-color,opacity] duration-300 hover:bg-[#ecc283] active:scale-[0.99] disabled:opacity-70"
              >
                {status === 'sending' ? f.sending : f.submit}
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-mist transition-transform duration-500 ease-out-expo group-hover:-rotate-45">
                  {status === 'sending' ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-mist/30 border-t-mist" />
                  ) : (
                    <Arrow />
                  )}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string
  error?: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2.5 block text-sm text-mist/60">
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-sm text-[#f0a08a]">{error}</p>}
    </div>
  )
}
