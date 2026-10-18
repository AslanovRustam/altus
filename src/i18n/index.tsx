import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { en, type Dict } from './en'
import { uk } from './uk'

export type Lang = 'en' | 'uk'

const DICTS: Record<Lang, Dict> = { en, uk }
const STORAGE_KEY = 'altus-lang'

type LangContextValue = {
  lang: Lang
  t: Dict
  setLang: (lang: Lang) => void
  fmt: (n: number) => string
}

const LangContext = createContext<LangContextValue | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'uk') return saved
  } catch {
    /* storage unavailable */
  }
  return 'en'
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    const t = DICTS[lang]
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  const value = useMemo<LangContextValue>(() => {
    const t = DICTS[lang]
    const nf = new Intl.NumberFormat(t.locale)
    return { lang, t, setLang, fmt: (n) => nf.format(n) }
  }, [lang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

/** Prices are always shown in USD */
export const usd = (n: number) => `$${new Intl.NumberFormat('en-US').format(n)}`
