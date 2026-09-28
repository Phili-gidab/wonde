import ContactLinks from './ContactLinks.jsx'

/** Persistent contact bar on phones: call, WhatsApp and Telegram. */
export default function CallBar() {
  return (
    <div className="call-bar">
      <ContactLinks variant="bar" showNumber={false} />
    </div>
  )
}
