import { WHY } from '../content.js'
import { useLang } from '../i18n.jsx'

/**
 * Why choose Temer - the six advantages, as a card grid.
 *
 * The most-requested section on the page, and the one doing the persuading:
 * everything above it is inventory and everything below it is detail. Six
 * cards, three across on a desktop and one on a phone, each a green glyph in a
 * tinted chip over a heading and two lines.
 *
 * Icons are inline SVG rather than a font or a sprite. Six glyphs is well
 * under the weight of any icon package, they inherit `currentColor` so the
 * chip and the glyph stay in step through every theme change, and they cost no
 * extra request on a connection where that matters.
 *
 * They are drawn on the same 24-unit grid at the same 1.7 stroke as
 * PhoneIcon, which is what stops six hand-drawn glyphs from looking like six
 * different sets.
 *
 * The dollar sign the client's reference used is deliberately not here. Prices
 * on this page are in birr, and a $ against "4.6 million birr" reads as a
 * currency, not as an icon - so `price` is a tag.
 */
const ICONS = {
  pin: (
    <>
      <path d="M12 21.2c-.6-.5-6.6-5.8-6.6-10.2a6.6 6.6 0 1 1 13.2 0c0 4.4-6 9.7-6.6 10.2Z" />
      <circle cx="12" cy="10.8" r="2.5" />
    </>
  ),
  price: (
    <>
      <path d="M3.7 12.6 12.6 3.7h6.2a1.5 1.5 0 0 1 1.5 1.5v6.2l-8.9 8.9a1.5 1.5 0 0 1-2.1 0l-5.6-5.6a1.5 1.5 0 0 1 0-2.1Z" />
      <circle cx="16.4" cy="7.6" r="1.4" />
    </>
  ),
  quality: (
    <path d="m12 3.7 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z" />
  ),
  customer: (
    <path d="M12 20.4c-5-3.4-7.8-6.3-7.8-9.6a4.2 4.2 0 0 1 7.8-2.2 4.2 4.2 0 0 1 7.8 2.2c0 3.3-2.8 6.2-7.8 9.6Z" />
  ),
  investment: (
    <>
      <path d="M3.6 16.6 9.5 10.7l3.4 3.4 7-7" />
      <path d="M16.3 7.1h3.6v3.6" />
    </>
  ),
  security: (
    <>
      <path d="M12 3.2 19 6v5.3c0 4.3-2.9 7.7-7 9.5-4.1-1.8-7-5.2-7-9.5V6Z" />
      <path d="m8.9 11.9 2.2 2.2 4.1-4.1" />
    </>
  ),
}

function Icon({ name }) {
  const glyph = ICONS[name]
  if (!glyph) return null

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph}
    </svg>
  )
}

export default function Why() {
  const { t, other } = useLang()

  return (
    <section className="why" id="why" aria-label={t(WHY.heading)}>
      <div className="why-head">
        <p className="eyebrow">
          {t(WHY.eyebrow)}
          <span className="eyebrow-am">{other(WHY.eyebrow)}</span>
        </p>

        <h2>{t(WHY.heading)}</h2>
        <p className="why-am">{other(WHY.heading)}</p>
        <p className="why-body">{t(WHY.body)}</p>
      </div>

      <ul className="why-grid">
        {WHY.items.map((item) => (
          <li className="why-card" key={item.id}>
            <span className="why-chip">
              <Icon name={item.icon} />
            </span>

            <h3 className="why-title">{t(item.title)}</h3>
            {/* Same trick as every heading on the page: whichever language you
                are reading, the other one sits under it. */}
            <p className="why-title-am">{other(item.title)}</p>
            <p className="why-text">{t(item.body)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
