import { useEffect, useState } from 'react'
import { BRAND, NAV, UI } from '../content.js'
import { useLang } from '../i18n.jsx'
import Logo from './Logo.jsx'
import ContactLinks from './ContactLinks.jsx'

/**
 * Sticky header. Transparent over the hero photo, solid white once the page
 * scrolls - the same behaviour as temerpropertiessales.com. On phones the
 * links fold into a menu; the contact buttons live in the bottom call bar.
 */
function LangSwitch() {
  const { lang, setLang } = useLang()

  return (
    <div className="lang" role="group" aria-label="Language">
      <button
        type="button"
        className={lang === 'en' ? 'is-active' : ''}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        EN
      </button>
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
  )
}

export default function Nav() {
  const { t } = useLang()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.classList.add('menu-open')

    // Close on Escape, and when the window grows past the menu breakpoint -
    // otherwise the hamburger hides while the page stays scroll-locked.
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    const wide = window.matchMedia('(min-width: 1181px)')
    const onWide = (event) => event.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)

    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className={`nav${solid || open ? ' is-solid' : ''}`}>
        <div className="nav-inner">
          <a className="nav-brand" href="#top" onClick={close}>
            <Logo size={36} />
            <span className="nav-mark">{BRAND.mark}</span>
          </a>

          <nav className="nav-links" aria-label={t(UI.mainNav)}>
            {NAV.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {t(item.label)}
              </a>
            ))}
          </nav>

          <div className="nav-right">
            <LangSwitch />
            <div className="nav-contact">
              <ContactLinks variant="compact" />
            </div>
            <button
              type="button"
              className={`nav-toggle${open ? ' is-open' : ''}`}
              aria-expanded={open}
              aria-controls="nav-menu"
              aria-label={t(UI.menu)}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header> on purpose: the header's backdrop-filter would
          otherwise become the containing block for this fixed panel. */}
      <nav id="nav-menu" className={`nav-menu${open ? ' is-open' : ''}`} aria-label={t(UI.menu)}>
        {NAV.map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={close}>
            {t(item.label)}
          </a>
        ))}
      </nav>
    </>
  )
}
