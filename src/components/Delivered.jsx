import { useRef, useState } from 'react'
import { DELIVERED, UI } from '../content.js'
import { useLang } from '../i18n.jsx'
import Chevron from './Chevron.jsx'

/**
 * The delivery gallery - buildings already finished and handed over.
 *
 * The proof section. Everything above it is a promise - a price, a payment
 * split, a poster for a site that is still going up - and this is the part a
 * buyer can check by driving past. So the photographs run large and in full
 * colour, and clicking one opens it full size with its floors, built-up area
 * and location beside it.
 *
 * The lightbox is the same native <dialog> and the same `lb-*` classes as the
 * listings carousel. That is deliberate: two galleries on one page that open
 * two different-looking overlays reads as two different websites, and reusing
 * the markup means the focus trapping, Escape handling and backdrop are
 * already solved in one place.
 *
 * The images are Wonde's own, each with a green badge burned into its lower
 * left carrying the name, location and built-up area. They arrive in three
 * different aspect ratios, so nothing is cropped: each card keeps its own
 * ratio and the grid is start-aligned. Cropping to a uniform box sliced those
 * badges in half, which reads as a mistake rather than as a design.
 */
function Site({ site, onOpen }) {
  const { t, other } = useLang()

  return (
    <figure className="built">
      <button type="button" className="built-open" onClick={onOpen}>
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
      </button>
    </figure>
  )
}

export default function Delivered() {
  const { t, other } = useLang()
  const dialog = useRef(null)
  const [current, setCurrent] = useState(null)

  const sites = DELIVERED.sites

  const openAt = (index) => {
    setCurrent(index)
    dialog.current?.showModal()
  }

  const step = (direction) =>
    setCurrent((c) => (c === null ? c : (c + direction + sites.length) % sites.length))

  const site = current !== null ? sites[current] : null

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
        {sites.map((item, index) => (
          <Site key={item.id} site={item} onOpen={() => openAt(index)} />
        ))}
      </div>

      <dialog
        className="lightbox"
        ref={dialog}
        onClose={() => setCurrent(null)}
        onClick={(event) => event.target === dialog.current && dialog.current.close()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1)
          if (event.key === 'ArrowLeft') step(-1)
        }}
        aria-label={site ? `${site.name} - ${t(site.place)}` : undefined}
      >
        {site && (
          <div className="lb-in">
            <div className="lb-img">
              <img src={`/posts/${site.id}.webp`} alt={`${site.name} - ${t(site.place)}`} />
              <button
                type="button"
                className="lb-close"
                onClick={() => dialog.current?.close()}
                aria-label={t(UI.close)}
              >
                &#10005;
              </button>
            </div>

            <div className="lb-meta">
              <p className="lb-kind">{t(UI.handedOver)}</p>
              <h3 className="lb-title">{site.name}</h3>
              <p className="lb-place">{t(site.place)}</p>

              <ul className="lb-lines">
                <li>{site.spec}</li>
                <li>{site.area}</li>
                <li>{t(site.note)}</li>
              </ul>

              <div className="lb-foot">
                <span className="lb-count">
                  {String(current + 1).padStart(2, '0')} / {String(sites.length).padStart(2, '0')}
                </span>
                <div className="lb-nav">
                  <button type="button" onClick={() => step(-1)} aria-label={t(UI.prev)}>
                    <Chevron back />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label={t(UI.next)}>
                    <Chevron />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
