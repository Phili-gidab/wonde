import ConstructionScene from './ConstructionScene.jsx'
import PhoneIcon from './PhoneIcon.jsx'
import { PHONE, PHONE_TEL } from '../contact.js'

const STATS = [
  { value: '40%', label: 'ቅድመ ክፍያ' },
  { value: '60%', label: 'ቤትዎን ሲረከቡ' },
  { value: '35%', label: 'እስከዚህ ቅናሽ' },
]

export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <p className="tag">
            <span className="tag-dot" />
            ድረ-ገጹ በግንባታ ላይ ነው
            <span className="tag-en">under construction</span>
          </p>

          <p className="brand">ቴምር ሪል እስቴት</p>

          <h1>
            በ <em>4.6 ሚልዮን ብር</em> ጠቅላላ ክፍያ ብቻ የቤት ባለቤት ይሁኑ።
          </h1>

          <p className="lede">
            በሳር ቤት አደባባይ እና በመገናኛ ዲያስፖራ አደባባይ፤ ከስቱዲኦ እስከ ባለ ሶስት መኝታ።
          </p>

          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <a className="call-plate" href={PHONE_TEL}>
            <span className="call-ring">
              <PhoneIcon size={22} />
            </span>
            <span className="call-body">
              <span className="call-label">አሁኑኑ ይደውሉ</span>
              <span className="call-num">{PHONE}</span>
            </span>
          </a>

          <div className="progress">
            <div className="progress-head">
              <span>ሙሉ ድረ-ገጻችን በቅርቡ ይመጣል</span>
              <span className="progress-pct">65%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" />
            </div>
          </div>
        </div>

        <ConstructionScene />
      </div>
    </header>
  )
}
