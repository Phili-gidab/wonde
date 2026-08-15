const STATS = [
  { value: '40%', label: 'ቅድመ ክፍያ' },
  { value: '60%', label: 'ቤትዎን ሲረከቡ' },
  { value: '35%', label: 'እስከዚህ ድረስ ቅናሽ' },
]

export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <p className="brand">ቴምር ሪል እስቴት</p>

        <h1>
          በ <em>4.6 ሚልዮን ብር</em> ጠቅላላ ክፍያ ብቻ
          <br />
          የቤት ባለቤት ይሁኑ።
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
      </div>
    </header>
  )
}
