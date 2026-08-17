import { PHONE, PHONE_TEL } from '../contact.js'
import PhoneIcon from './PhoneIcon.jsx'

/** Persistent call affordance on small screens, where the rail is hidden. */
export default function CallBar() {
  return (
    <a className="call-bar" href={PHONE_TEL}>
      <PhoneIcon size={18} />
      <span className="call-bar-label">Call Wonde</span>
      <span className="call-bar-num">{PHONE}</span>
    </a>
  )
}
