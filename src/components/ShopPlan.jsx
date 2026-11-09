import { SHOP_PLAN } from '../content.js'
import { useLang } from '../i18n.jsx'

/** A labelled list of share + description rows: the payment steps, or the discounts. */
function Shares({ title, rows, className }) {
  const { t } = useLang()

  return (
    <div className={`plan-shares ${className}`}>
      <h4 className="plan-shares-title">{t(title)}</h4>
      <ol>
        {rows.map((row) => (
          <li key={row.share}>
            <span className="plan-share">{row.share}</span>
            <span>{t(row.text)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** The 1%-a-month shop payment plan, opening the shops section. */
export default function ShopPlan() {
  const { t, other } = useLang()

  return (
    <article className="shop-plan">
      <p className="eyebrow">{t(SHOP_PLAN.eyebrow)}</p>
      <h3 className="shop-plan-title">{t(SHOP_PLAN.title)}</h3>
      <p className="project-alt">{other(SHOP_PLAN.title)}</p>
      <p className="project-summary">{t(SHOP_PLAN.lead)}</p>

      <ul className="project-features">
        {SHOP_PLAN.sites.map((site) => (
          <li key={site.en}>{t(site)}</li>
        ))}
      </ul>

      <p className="shop-plan-headline">{t(SHOP_PLAN.headline)}</p>

      <div className="shop-plan-grid">
        <Shares title={SHOP_PLAN.stepsTitle} rows={SHOP_PLAN.steps} className="is-steps" />
        <Shares title={SHOP_PLAN.discountsTitle} rows={SHOP_PLAN.discounts} className="is-discounts" />
      </div>

      <p className="shop-plan-close">{t(SHOP_PLAN.close)}</p>
    </article>
  )
}
