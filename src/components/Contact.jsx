export default function Contact() {
  return (
    <section className="contact">
      <h2 className="section-title">ለበለጠ መረጃ ያግኙን</h2>
      <p className="section-sub">ወንደሰን — የሽያጭ አማካሪ</p>
      <div className="contact-buttons">
        <a className="btn btn-phone" href="tel:+251941255153">
          📞 +251 94 125 5153
        </a>
        <a
          className="btn btn-wa"
          href="https://wa.me/251941255153"
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 WhatsApp ያዋሩን
        </a>
        <a
          className="btn btn-tg"
          href="https://t.me/wendii02"
          target="_blank"
          rel="noopener noreferrer"
        >
          ✈️ Telegram — @wendii02
        </a>
      </div>
      <p className="agent-note">
        ሙሉ ድረ-ገጻችን በግንባታ ላይ ነው — እስከዚያው በስልክ፣ በ WhatsApp ወይም በ Telegram ያግኙን።
      </p>
    </section>
  )
}
