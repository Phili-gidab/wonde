import { HERO } from '../content.js'
import { useLang } from '../i18n.jsx'
import ContactLinks from './ContactLinks.jsx'

/**
 * Full-bleed photo hero with a dark gradient, as on temerpropertiessales.com.
 * The photograph is a finished Temer building (Mohammed.S, Lafto), cropped
 * above the badge burned into the original post - see public/hero.webp.
 */
export default function Hero() {
  const { t, other } = useLang()

  return (
    <section className="hero" id="top">
      <img className="hero-img" src="/hero.webp" alt="" width="1000" height="620" />
      <div className="hero-shade" />

      <div className="hero-inner on-dark">
        <p className="hero-badge">{t(HERO.badge)}</p>
        <h1 className="hero-title">{t(HERO.heading)}</h1>
        <p className="hero-accent">{other(HERO.heading).replace('\n', ' ')}</p>
        <p className="hero-body">{t(HERO.body)}</p>

        <ContactLinks />

        <a className="hero-more" href="#listings">
          {t(HERO.cta)} ↓
        </a>
      </div>
    </section>
  )
}
