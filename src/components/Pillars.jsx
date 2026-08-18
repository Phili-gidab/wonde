import { PILLARS, UI } from '../content.js'
import { useLang } from '../i18n.jsx'

/**
 * The two things Temer sells, given equal weight.
 *
 * Homes previously carried the entire page and the shops were a single block
 * near the footer, which read as an afterthought. Presenting them as a pair
 * makes the second offer discoverable without burying the first.
 */
function Pillar({ item }) {
  const { t } = useLang()
  const cta = item.id === 'homes' ? UI.viewHomes : UI.viewShops

  return (
    <article className={`pillar pillar-${item.id}`}>
      <h3 className="pillar-kind">{t(item.kind)}</h3>
      <p className="pillar-lead">{t(item.lead)}</p>

      <dl className="pillar-figures">
        {item.figures.map((figure) => (
          <div key={t(figure.k)}>
            <dt>{t(figure.k)}</dt>
            <dd>{typeof figure.v === 'string' ? figure.v : t(figure.v)}</dd>
          </div>
        ))}
      </dl>

      <ul className="pillar-sites">
        {item.sites.map((site) => (
          <li key={t(site.name)}>
            <span className="pillar-site-name">{t(site.name)}</span>
            <span className="pillar-site-size">{site.size}</span>
            <span className="pillar-site-note">{t(site.note)}</span>
          </li>
        ))}
      </ul>

      <a className="pillar-cta" href={item.href}>
        {t(cta)}
      </a>
    </article>
  )
}

export default function Pillars() {
  const { t } = useLang()

  return (
    <section className="pillars" id="pillars" aria-label={t(PILLARS.heading)}>
      <div className="pillars-head">
        <p className="eyebrow">{t(PILLARS.eyebrow)}</p>
        <h2>{t(PILLARS.heading)}</h2>
      </div>

      <div className="pillars-grid">
        {PILLARS.items.map((item) => (
          <Pillar key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
