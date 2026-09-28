import { OFFER } from '../content.js'
import { useLang } from '../i18n.jsx'
import SectionHead from './SectionHead.jsx'
import ContactLinks from './ContactLinks.jsx'

/** The price and the payment split - placed under the listings. */
export default function Offer() {
  const { t, other } = useLang()

  return (
    <section className="section offer" id="offer">
      <div className="container offer-card">
        <SectionHead eyebrow={OFFER.eyebrow} heading={OFFER.heading} body={OFFER.body} center />

        <dl className="offer-stats">
          {OFFER.stats.map((stat) => (
            <div className="offer-stat" key={stat.value}>
              <dt>{stat.value}</dt>
              <dd>
                {t(stat.label)}
                <span>{other(stat.label)}</span>
              </dd>
            </div>
          ))}
        </dl>

        <ContactLinks />
      </div>
    </section>
  )
}
