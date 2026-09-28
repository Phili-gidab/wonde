import { BRAND, NAV, UI } from '../content.js'
import { AGENT, AGENT_EN } from '../contact.js'
import { useLang } from '../i18n.jsx'
import Logo from './Logo.jsx'
import ContactLinks from './ContactLinks.jsx'

export default function Footer() {
  const { t, other, lang } = useLang()

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo size={46} />
          <div>
            <p className="footer-name">{t(BRAND.name)}</p>
            <p className="footer-alt">{other(BRAND.name)}</p>
          </div>
        </div>

        <nav className="footer-links" aria-label={t(UI.footerNav)}>
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {t(item.label)}
            </a>
          ))}
        </nav>

        <div className="footer-contact">
          <p className="footer-agent">
            {lang === 'am' ? AGENT : AGENT_EN} - {t(UI.salesConsultant)}
          </p>
          <ContactLinks />
        </div>
      </div>

      <p className="container footer-legal">
        © {new Date().getFullYear()} {t(BRAND.name)}. {t(UI.rightsReserved)}
      </p>
    </footer>
  )
}
