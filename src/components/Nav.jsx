import { BRAND, CHAPTERS } from '../content.js'
import { PHONE_TEL } from '../contact.js'

/**
 * Fixed chrome: brand at top-left, chapter index at right. The index doubles
 * as navigation - clicking scrolls to that chapter.
 */
export default function Nav({ chapter }) {
  const goTo = (id) => (event) => {
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header className="nav">
        <a className="nav-brand" href="#arrival" onClick={goTo('arrival')}>
          <span className="nav-mark">{BRAND.mark}</span>
          <span className="nav-brand-am">{BRAND.am}</span>
        </a>

        <a className="nav-call" href={PHONE_TEL}>
          <span className="nav-call-dot" />
          Call Wonde
        </a>
      </header>

      <nav className="rail" aria-label="Chapters">
        <ol>
          {CHAPTERS.map((item, index) => (
            <li key={item.id} className={index === chapter ? 'is-active' : ''}>
              <a href={`#${item.id}`} onClick={goTo(item.id)}>
                <span className="rail-no">{item.no}</span>
                <span className="rail-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <span className="scroll-hint-line" />
      </div>
    </>
  )
}
