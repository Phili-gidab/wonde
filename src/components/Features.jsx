const FEATURES = [
  {
    title: 'ተመቻችቶ የተዘጋጀ ክፍያ',
    body: 'የቤቱን 40% ብቻ ከፍለው፣ ቀሪውን 60% ቤትዎን ሲረከቡ ይክፈሉ።',
  },
  {
    title: 'ግቢ ቤት በቅናሽ',
    body: 'እስከ 35% ቅናሽ አግኝተው gated compound መግዛት ይችላሉ።',
  },
  {
    title: 'ቋሚ ዋጋ',
    body: 'በቀሪ ክፍያ ላይ ምንም አይነት የዋጋ ጭማሪ አይደረግም።',
  },
  {
    title: 'ለዲያስፖራ ደንበኞች',
    body: 'ከሀገር ውጭ ላላችሁ ደንበኞቻችን ሰነዶቹን ባላችሁበት በ DHL እንልካለን።',
  },
]

export default function Features() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="features">
          {FEATURES.map((f) => (
            <article className="feature" key={f.title}>
              <h2>{f.title}</h2>
              <p>{f.body}</p>
            </article>
          ))}
        </div>

        <p className="track-record">
          በ10 ዓመት ውስጥ 11 ፕሮጀክቶችን ጥንቅቅ አድርገን አስረክበናል።
        </p>
      </div>
    </section>
  )
}
