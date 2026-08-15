import Hero from './components/Hero.jsx'
import Details from './components/Details.jsx'
import PhoneIcon from './components/PhoneIcon.jsx'
import { PHONE, PHONE_TEL } from './contact.js'

export default function App() {
  return (
    <>
      <div className="hazard" aria-hidden="true" />
      <Hero />
      <div className="hazard hazard-thin" aria-hidden="true" />
      <Details />

      <a className="call-bar" href={PHONE_TEL}>
        <PhoneIcon size={18} />
        <span className="call-bar-label">ደውሉ</span>
        <span className="call-bar-num">{PHONE}</span>
      </a>
    </>
  )
}
