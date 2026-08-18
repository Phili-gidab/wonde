import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Two-language support: English and Amharic.
 *
 * Every translatable string in src/content.js is a `{ en, am }` pair. `t()`
 * resolves one against the active language; `other()` resolves the opposite
 * one, which is what drives the accent line under each heading. That is the
 * whole trick behind the bilingual typography: whichever language you are
 * reading, the other one sits under it in amber as a display accent, so the
 * page never looks like a translation of itself.
 *
 * The choice is persisted, because someone who switches to Amharic once should
 * not have to do it again on every visit.
 */

const STORAGE_KEY = 'wonde:lang'
export const LANGUAGES = ['en', 'am']

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (value) => value,
  other: (value) => value,
})

function initialLanguage() {
  if (typeof window === 'undefined') return 'en'

  const stored = window.localStorage?.getItem(STORAGE_KEY)
  if (LANGUAGES.includes(stored)) return stored

  // Amharic speakers arriving with an `am` browser locale get Amharic first.
  return navigator.language?.toLowerCase().startsWith('am') ? 'am' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLanguage)

  useEffect(() => {
    // `lang` on <html> matters for more than tidiness: it drives font
    // fallback, hyphenation and screen-reader pronunciation.
    document.documentElement.lang = lang
    document.documentElement.dataset.lang = lang
    try {
      window.localStorage?.setItem(STORAGE_KEY, lang)
    } catch {
      // Private-mode Safari throws on setItem. The site still works, the
      // choice just will not survive a reload.
    }
  }, [lang])

  const setLang = useCallback((next) => {
    if (LANGUAGES.includes(next)) setLangState(next)
  }, [])

  const value = useMemo(() => {
    const pick = (field, which) => {
      if (field == null) return field
      if (typeof field === 'string') return field
      return field[which] ?? field.en ?? ''
    }

    return {
      lang,
      setLang,
      /** Resolve a `{ en, am }` pair in the active language. */
      t: (field) => pick(field, lang),
      /** Resolve it in the *other* language - used for the accent line. */
      other: (field) => pick(field, lang === 'en' ? 'am' : 'en'),
    }
  }, [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  return useContext(LanguageContext)
}
