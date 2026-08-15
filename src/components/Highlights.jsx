const HIGHLIGHTS = [
  {
    icon: '🏠',
    title: '40% ቅድመ ክፍያ ብቻ',
    body: (
      <>
        የቤቱን <strong>40% ብቻ</strong> ከፍለው ቀሪውን <strong>60%</strong> ቤትዎን ሲረከቡ መክፈል
        ይችላሉ።
      </>
    ),
  },
  {
    icon: '🏷️',
    title: 'እስከ 35% ቅናሽ',
    body: (
      <>
        እስከ <strong>35% ቅናሽ</strong> አግኝተው <strong>gated compound (ግቢ ቤት)</strong>{' '}
        መግዛት ይችላሉ።
      </>
    ),
  },
  {
    icon: '📍',
    title: 'ምርጥ ሎኬሽኖች',
    body: (
      <>
        በ<strong>ሳር ቤት አደባባይ</strong> እና በ<strong>መገናኛ ዲያስፖራ አደባባይ</strong> — ከ
        <strong>ስቱዲኦ (Studio)</strong> እስከ <strong>ባለ ሶስት መኝታ</strong>።
      </>
    ),
  },
  {
    icon: '📈',
    title: 'የዋጋ ጭማሪ የለም',
    body: (
      <>
        በቀሪ ክፍያ ላይ <strong>ምንም አይነት የዋጋ ጭማሪ የለም</strong> — ዋጋው እንደተስማማነው ይቆያል።
      </>
    ),
  },
  {
    icon: '✈️',
    title: 'ለዲያስፖራ ደንበኞች',
    body: (
      <>
        ከሀገር ውጭ ላላችሁ ደንበኞቻችን ሰነዶችን እዛው ባላችሁበት <strong>በ DHL</strong> እንልካለን።
      </>
    ),
  },
  {
    icon: '🏬',
    title: 'ዘመናዊ የንግድ ሱቆች (G+5 Mall)',
    body: (
      <>
        በ<strong>ሳር ቤት</strong>፣ <strong>አፍሪካ ህብረት</strong> እና <strong>ፒያሳ አደባባይ</strong>{' '}
        — ከ<strong>1,400,000 ብር</strong> ቅድመ ክፍያ ጀምሮ።
      </>
    ),
  },
]

export default function Highlights() {
  return (
    <>
      <h2 className="section-title">ለምን ከእኛ ይግዙ?</h2>
      <p className="section-sub">ቴምር ሪል እስቴት — በ10 ዓመት 11 ፕሮጀክት ጥንቅቅ አድርገን አስረክበናል።</p>
      <div className="grid">
        {HIGHLIGHTS.map((item) => (
          <div className="card" key={item.title}>
            <span className="icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    </>
  )
}
