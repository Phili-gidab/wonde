import { PHONE, PHONE_TEL } from '../contact.js'
import { UI } from '../content.js'
import { useLang } from '../i18n.jsx'
import PhoneIcon from './PhoneIcon.jsx'

/** Persistent call affordance on small screens, where the rail is hidden. */
export default function CallBar() {
  const { t } = useLang()

  return (
    <a className="call-bar" href={PHONE_TEL}>
      <PhoneIcon size={18} />
      <span className="call-bar-label">{t(UI.callWonde)}</span>
      <span className="call-bar-num">{PHONE}</span>
    </a>
  )
}
