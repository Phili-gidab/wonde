import { useLang } from '../i18n.jsx'

/**
 * Eyebrow, heading, the heading again in the other language, and an intro.
 * Every section on the page opens with this, so they all line up.
 */
export default function SectionHead({ eyebrow, heading, body, center = false, children }) {
  const { t, other } = useLang()

  return (
    <div className={`section-head${center ? ' is-center' : ''}`}>
      {eyebrow && <p className="eyebrow">{t(eyebrow)}</p>}
      <h2 className="section-title">{t(heading).replace('\n', ' ')}</h2>
      <p className="section-accent">{other(heading).replace('\n', ' ')}</p>
      {body && <p className="section-body">{t(body)}</p>}
      {children}
    </div>
  )
}
