import { BRAND, MODEL_CREDIT, UI } from '../content.js'
import { PHONE, PHONE_TEL, WHATSAPP, TELEGRAM, AGENT, AGENT_EN } from '../contact.js'
import { useLang } from '../i18n.jsx'

export default function Footer() {
  const { t, other, lang } = useLang()

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">{t(BRAND.name)}</p>
          <p className="footer-brand-am">{other(BRAND.name)}</p>
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

      <div className="footer-legal">
        <span>
          © {new Date().getFullYear()} {t(BRAND.name)}. {t(UI.rightsReserved)}
        </span>

        {/*
          CC-BY requires attribution for commercial use of the 3D model.
          This credit is a licence condition - do not remove it. The model
          title and author are proper nouns and stay untranslated.
        */}
        <span className="credit">
          {t(UI.modelCredit.prefix)}{' '}
          <a href={MODEL_CREDIT.authorUrl} target="_blank" rel="noopener noreferrer">
            &ldquo;{MODEL_CREDIT.title}&rdquo;
          </a>{' '}
          {t(UI.modelCredit.by)} {MODEL_CREDIT.author}, {t(UI.modelCredit.licensed)}{' '}
          <a href={MODEL_CREDIT.licenceUrl} target="_blank" rel="noopener noreferrer">
            {MODEL_CREDIT.licence}
          </a>
          .
        </span>
      </div>
    </footer>
  )
}
