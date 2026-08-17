import { BRAND, MODEL_CREDIT } from '../content.js'
import { PHONE, PHONE_TEL, WHATSAPP, TELEGRAM, AGENT_EN } from '../contact.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">{BRAND.en}</p>
          <p className="footer-brand-am">{BRAND.am}</p>
        </div>

        <div className="footer-contact">
          <a href={PHONE_TEL}>{PHONE}</a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          <span className="footer-agent">{AGENT_EN} - Sales consultant</span>
        </div>
      </div>

      <div className="footer-legal">
        <span>© {new Date().getFullYear()} {BRAND.en}. All rights reserved.</span>

        {/*
          CC-BY requires attribution for commercial use of the 3D model.
          This credit is a licence condition - do not remove it.
        */}
        <span className="credit">
          3D model{' '}
          <a href={MODEL_CREDIT.authorUrl} target="_blank" rel="noopener noreferrer">
            &ldquo;{MODEL_CREDIT.title}&rdquo;
          </a>{' '}
          by {MODEL_CREDIT.author}, licensed under{' '}
          <a href={MODEL_CREDIT.licenceUrl} target="_blank" rel="noopener noreferrer">
            {MODEL_CREDIT.licence}
          </a>
          .
        </span>
      </div>
    </footer>
  )
}
