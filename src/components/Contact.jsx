import { CONTACT, UI } from '../content.js'
import { AGENT, AGENT_EN } from '../contact.js'
import { useLang } from '../i18n.jsx'
import SectionHead from './SectionHead.jsx'
import ContactLinks from './ContactLinks.jsx'

export default function Contact() {
  const { t, lang } = useLang()

  return (
    <section className="section contact" id="contact">
      <div className="container contact-card on-dark">
        <SectionHead eyebrow={CONTACT.eyebrow} heading={CONTACT.heading} body={CONTACT.body} center />

        <p className="agent">
          {/* The agent's name leads in whichever script the reader is using. */}
          <span className="agent-name">{lang === 'am' ? AGENT : AGENT_EN}</span>
          <span className="agent-alt">{lang === 'am' ? AGENT_EN : AGENT}</span>
          <span className="agent-role">{t(UI.salesConsultant)}</span>
        </p>

        <ContactLinks />
      </div>
    </section>
  )
}
