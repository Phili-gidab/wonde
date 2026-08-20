import { DELIVERED, UI } from '../content.js'
import { useLang } from '../i18n.jsx'

/**
 * Buildings already finished and handed over.
 *
 * The proof section. Everything above it is a promise - a price, a payment
 * split, a poster for a site that is still going up - and this is the part a
 * buyer can verify by driving past. So the photographs run at full size and in
 * full colour, unlike the listings carousel, which grades its posters down to
 * sit inside the page.
 *
 * The images are Wonde's own, each with a green badge burned into the artwork
 * carrying the name, location and built-up area. They arrive in three
 * different aspect ratios, so nothing is cropped: each card keeps its own
 * ratio and the grid is start-aligned. Cropping to a uniform box sliced the
 * badges in half, which looked like a mistake rather than a design.
 */
function Site({ site }) {
  const { t, other } = useLang()

  return (
    <figure className="built">
      <span className="built-media">
        <img
          src={`/posts/${site.id}.webp`}
          width={site.w}
          height={site.h}
          loading="lazy"
          decoding="async"
          alt={`${site.name} - ${t(site.place)}`}
        />
        <span className="built-kind">{t(UI.handedOver)}</span>
      </span>

      <figcaption className="built-meta">
        <h3 className="built-name">{site.name}</h3>

        <p className="built-place">
          {t(site.place)}
          <span className="built-place-am">{other(site.place)}</span>
        </p>

        <p className="built-spec">
          <span>{site.spec}</span>
          <span className="built-area">{site.area}</span>
        </p>

        <p className="built-note">{t(site.note)}</p>
      </figcaption>
    </figure>
  )
}

export default function Delivered() {
  const { t, other } = useLang()

  return (
    <section className="delivered" id="delivered" aria-label={t(DELIVERED.eyebrow)}>
      <div className="delivered-head">
        <p className="eyebrow">
          {t(DELIVERED.eyebrow)}
          <span className="eyebrow-am">{other(DELIVERED.eyebrow)}</span>
        </p>

        <h2>{t(DELIVERED.heading)}</h2>
        <p className="delivered-am">{other(DELIVERED.heading).replace('\n', ' ')}</p>
        <p className="delivered-body">{t(DELIVERED.body)}</p>

        <dl className="delivered-stats">
          {DELIVERED.stats.map((stat) => (
            <div key={stat.value}>
              <dt>{stat.value}</dt>
              <dd>{t(stat.label)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="delivered-grid">
        {DELIVERED.sites.map((site) => (
          <Site key={site.id} site={site} />
        ))}
      </div>
    </section>
  )
}
