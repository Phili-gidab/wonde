import { PHONE, PHONE_TEL, WHATSAPP, TELEGRAM } from '../contact.js'
import { UI } from '../content.js'
import { useLang } from '../i18n.jsx'
import { PhoneIcon, WhatsAppIcon, TelegramIcon } from './icons.jsx'

/**
 * Phone, WhatsApp and Telegram, always together and always in that order.
 *
 * `variant` only changes the styling hook: `solid` for page sections,
 * `compact` for the header (messaging links drop to icons), and `bar` for the
 * fixed call bar on phones.
 */
export default function ContactLinks({ variant = 'solid', showNumber = true }) {
  const { t } = useLang()
  const compact = variant === 'compact'
  const iconSize = compact ? 18 : 20

  return (
    <div className={`contact-links contact-links-${variant}`}>
      <a className="cl cl-phone" href={PHONE_TEL}>
        <PhoneIcon size={iconSize} />
        <span className="cl-label">{showNumber ? PHONE : t(UI.callNow)}</span>
      </a>
      <a
        className="cl cl-whatsapp"
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={compact ? `WhatsApp ${t(UI.newTab)}` : undefined}
      >
        <WhatsAppIcon size={iconSize} />
        {!compact && <span className="cl-label">WhatsApp</span>}
        {!compact && <span className="sr-only"> {t(UI.newTab)}</span>}
      </a>
      <a
        className="cl cl-telegram"
        href={TELEGRAM}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={compact ? `Telegram ${t(UI.newTab)}` : undefined}
      >
        <TelegramIcon size={iconSize} />
        {!compact && <span className="cl-label">Telegram</span>}
        {!compact && <span className="sr-only"> {t(UI.newTab)}</span>}
      </a>
    </div>
  )
}
