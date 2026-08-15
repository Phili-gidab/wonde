import PhoneIcon from './PhoneIcon.jsx'
import { PHONE, PHONE_TEL, WHATSAPP, TELEGRAM, AGENT } from '../contact.js'

const FEATURES = [
  {
    no: '01',
    title: 'ተመቻችቶ የተዘጋጀ ክፍያ',
    body: 'የቤቱን 40% ብቻ ከፍለው፣ ቀሪውን 60% ቤትዎን ሲረከቡ ይክፈሉ።',
  },
  {
    no: '02',
    title: 'ግቢ ቤት በቅናሽ',
    body: 'እስከ 35% ቅናሽ አግኝተው gated compound መግዛት ይችላሉ።',
  },
  {
    no: '03',
    title: 'ቋሚ ዋጋ',
    body: 'በቀሪ ክፍያ ላይ ምንም አይነት የዋጋ ጭማሪ አይደረግም።',
  },
  {
    no: '04',
    title: 'ለዲያስፖራ ደንበኞች',
    body: 'ከሀገር ውጭ ላላችሁ ደንበኞቻችን ሰነዶቹን ባላችሁበት በ DHL እንልካለን።',
  },
]

export default function Details() {
  return (
    <main>
      <section className="section wrap">
        <div className="features">
          {FEATURES.map((f) => (
            <article className="feature" key={f.no}>
              <span className="feature-no">{f.no}</span>
              <h2>{f.title}</h2>
              <p>{f.body}</p>
            </article>
          ))}
        </div>

        <p className="record">
          <span className="record-num">11</span>
          ፕሮጀክቶችን በ10 ዓመት ውስጥ ጥንቅቅ አድርገን አስረክበናል።
        </p>
      </section>

      <section className="commercial">
        <div className="wrap">
          <p className="eyebrow">ዘመናዊ የንግድ ሱቆች</p>
          <h2>
            G+5 Mall <span className="sep">/</span> ከ 1,400,000 ብር ቅድመ ክፍያ ጀምሮ
          </h2>
          <p className="places">
            ሳር ቤት <span className="sep">·</span> አፍሪካ ህብረት <span className="sep">·</span> ፒያሳ አደባባይ
          </p>
        </div>
      </section>

      <section className="contact wrap">
        <p className="eyebrow">ለበለጠ መረጃ ያግኙን</p>

        <a className="phone-hero" href={PHONE_TEL}>
          <span className="phone-hero-top">
            <PhoneIcon size={26} />
            ደውለው ያናግሩን
          </span>
          <span className="phone-hero-num">{PHONE}</span>
        </a>

        <p className="agent">
          {AGENT} <span className="sep">·</span> <span className="role">የሽያጭ አማካሪ</span>
        </p>

        <div className="actions">
          <a className="btn" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a className="btn" href={TELEGRAM} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </div>
      </section>

      <div className="hazard hazard-thin" aria-hidden="true" />

      <footer className="wrap">
        <span>ቴምር ሪል እስቴት</span>
        <span className="muted">© 2026 ሁሉም መብቶች የተጠበቁ ናቸው።</span>
      </footer>
    </main>
  )
}
