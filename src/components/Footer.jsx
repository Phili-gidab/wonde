import { BRAND, UI } from '../content.js'
import { PHONE, PHONE_TEL, WHATSAPP, TELEGRAM, AGENT, AGENT_EN } from '../contact.js'
import { useLang } from '../i18n.jsx'
import Logo from './Logo.jsx'

export default function Footer() {
  const { t, other, lang } = useLang()

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand-block">
          <Logo size={46} />
          <div>
            <p className="footer-brand">{t(BRAND.name)}</p>
            <p className="footer-brand-am">{other(BRAND.name)}</p>
          </div>
        </div>

        <div className="footer-contact">
          <a href={PHONE_TEL}>{PHONE}</a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          <span className="footer-agent">
            {lang === 'am' ? AGENT : AGENT_EN} - {t(UI.salesConsultant)}
          </span>
        </div>
      </div>

      {/*
        The CC BY credit for the 3D model used to sit here. Removed at the
        client's instruction - they attribute on social media instead. The
        licence terms and what that trades off are in the README; the model is
        still CC BY 4.0 and the obligation has not gone anywhere.
      */}
      <div className="footer-legal">
        <span>
          © {new Date().getFullYear()} {t(BRAND.name)}. {t(UI.rightsReserved)}
        </span>
      </div>
    </footer>
  )
}
