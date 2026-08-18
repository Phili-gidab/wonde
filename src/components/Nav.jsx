import { BRAND, CHAPTERS, UI } from '../content.js'
import { PHONE_TEL } from '../contact.js'
import { useLang } from '../i18n.jsx'

/**
 * Fixed chrome: brand and language switch at the top, chapter index at the
 * right. The index doubles as navigation - clicking scrolls to that chapter.
 */
export default function Nav({ chapter }) {
  const { t, other, lang, setLang } = useLang()

  const goTo = (id) => (event) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header className="nav">
        <a className="nav-brand" href="#arrival" onClick={goTo('arrival')}>
          <span className="nav-mark">{BRAND.mark}</span>
          <span className="nav-brand-am">{t(BRAND.name)}</span>
        </a>

        <div className="nav-right">
          {/*
            A two-state switch rather than a dropdown: there are exactly two
            languages, and each is labelled in its own script so it is legible
            to someone who cannot read the other.
          */}
          <div className="lang" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === 'en' ? 'is-active' : ''}
              aria-pressed={lang === 'en'}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <span className="lang-sep" aria-hidden="true" />
            <button
              type="button"
              className={lang === 'am' ? 'is-active' : ''}
              aria-pressed={lang === 'am'}
              onClick={() => setLang('am')}
              lang="am"
            >
              አማ
            </button>
          </div>

          <a className="nav-call" href={PHONE_TEL}>
            <span className="nav-call-dot" />
            {t(UI.callWonde)}
          </a>
        </div>
      </header>

      <nav className="rail" aria-label={t(UI.chapters)}>
        <ol>
          {CHAPTERS.map((item, index) => (
            <li key={item.id} className={index === chapter ? 'is-active' : ''}>
              <a href={`#${item.id}`} onClick={goTo(item.id)}>
                <span className="rail-no">{item.no}</span>
                <span className="rail-label">{t(item.label)}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="scroll-hint" aria-hidden="true">
        <span>{t(UI.scroll)}</span>
        <span className="scroll-hint-line" />
      </div>
    </>
  )
}
