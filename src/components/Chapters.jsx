import { CHAPTERS, ASSURANCES, COMMERCIAL } from '../content.js'
import { PHONE, PHONE_TEL, WHATSAPP, TELEGRAM, AGENT, AGENT_EN } from '../contact.js'
import PhoneIcon from './PhoneIcon.jsx'

/**
 * The scroll track. Each chapter is one viewport tall; the fixed WebGL canvas
 * behind it re-frames the building as these pass. Text is revealed per line so
 * a heading resolves rather than simply appearing.
 */
function Heading({ text }) {
  return (
    <h2 className="ch-heading">
      {text.split('\n').map((line, index) => (
        <span className="ch-line" key={line} style={{ '--i': index }}>
          <span>{line}</span>
        </span>
      ))}
    </h2>
  )
}

function ContactBlock() {
  return (
    <div className="ch-contact">
      <a className="phone-plate" href={PHONE_TEL}>
        <span className="phone-plate-ring">
          <PhoneIcon size={22} />
        </span>
        <span className="phone-plate-body">
          <span className="phone-plate-label">Call now</span>
          <span className="phone-plate-num">{PHONE}</span>
        </span>
      </a>

      <p className="agent">
        <span className="agent-name">{AGENT_EN}</span>
        <span className="agent-am">{AGENT}</span>
        <span className="agent-role">Sales consultant</span>
      </p>

      <div className="actions">
        <a className="btn" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <a className="btn" href={TELEGRAM} target="_blank" rel="noopener noreferrer">
          Telegram
        </a>
      </div>
    </div>
  )
}

function Chapter({ data, active }) {
  const { no, label, labelAm, heading, am, body, stats, sites, delivered } = data

  return (
    <section id={data.id} className={`ch${active ? ' is-active' : ''}`} aria-label={label}>
      <div className="ch-inner">
        <p className="ch-tag">
          <span className="ch-no">CH.{no}</span>
          <span className="ch-rule" />
          <span className="ch-label">{label}</span>
          <span className="ch-label-am">{labelAm}</span>
        </p>

        <Heading text={heading} />
        <p className="ch-am">{am}</p>
        <p className="ch-body">{body}</p>

        {stats && (
          <div className="ch-stats">
            {stats.map((stat) => (
              <div className="ch-stat" key={stat.label}>
                <span className="ch-stat-value">{stat.value}</span>
                <span className="ch-stat-label">{stat.label}</span>
                <span className="ch-stat-am">{stat.am}</span>
              </div>
            ))}
          </div>
        )}

        {sites && (
          <ul className="ch-sites">
            {sites.map((site) => (
              <li key={site.name}>
                <span className="site-name">{site.name}</span>
                <span className="site-am">{site.am}</span>
                <span className="site-size">{site.size}</span>
                <span className="site-note">{site.note}</span>
              </li>
            ))}
          </ul>
        )}

        {delivered && (
          <ul className="ch-delivered">
            {delivered.map((project) => (
              <li key={project.name}>
                <span className="delivered-name">{project.name}</span>
                <span className="delivered-place">{project.place}</span>
                <span className="delivered-detail">
                  {project.detail} <span className="sep">/</span> {project.area}
                </span>
              </li>
            ))}
          </ul>
        )}

        {data.id === 'contact' && <ContactBlock />}
      </div>
    </section>
  )
}

/** Per-unit price table for the Kaliti mall. */
function UnitTable({ units }) {
  return (
    <div className="unit-table-wrap">
      <table className="unit-table">
        <thead>
          <tr>
            <th scope="col">Floor</th>
            <th scope="col">Size</th>
            <th scope="col">Total price</th>
            <th scope="col">Down payment</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit, index) => (
            <tr key={`${unit.floor}-${unit.size}-${index}`}>
              <td>{unit.floor}</td>
              <td>{unit.size}</td>
              <td className="num">{unit.price}</td>
              <td className="num">{unit.down}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="unit-table-note">All figures in birr.</p>
    </div>
  )
}

function CommercialProject({ project }) {
  return (
    <article className="project">
      <header className="project-head">
        <h3>{project.name}</h3>
        <p className="project-am">{project.am}</p>
      </header>

      <p className="project-summary">{project.summary}</p>

      {project.facts && (
        <dl className="project-facts">
          {project.facts.map((fact) => (
            <div key={fact.k}>
              <dt>{fact.k}</dt>
              <dd>{fact.v}</dd>
            </div>
          ))}
        </dl>
      )}

      {project.features && (
        <ul className="project-features">
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      )}

      {project.units && <UnitTable units={project.units} />}
    </article>
  )
}

export default function Chapters({ chapter }) {
  return (
    <main className="chapters">
      {/*
        The camera path is measured against this element specifically - see
        useScrollProgress. Keep the assurances, commercial section and footer
        OUTSIDE it, or the path stretches across content that has no keyframes.
      */}
      <div className="chapter-track" id="chapter-track">
        {CHAPTERS.map((data, index) => (
          <Chapter key={data.id} data={data} active={index === chapter} />
        ))}
      </div>

      <div className="assurances" aria-label="What you get">
        <ul>
          {ASSURANCES.map((item) => (
            <li key={item.en}>
              <span className="assurance-en">{item.en}</span>
              <span className="assurance-am">{item.am}</span>
            </li>
          ))}
        </ul>
      </div>

      <section className="commercial" id="commercial" aria-label="Commercial units">
        <div className="commercial-head">
          <p className="eyebrow">
            {COMMERCIAL.eyebrow}
            <span className="eyebrow-am">{COMMERCIAL.eyebrowAm}</span>
          </p>
          <h2>{COMMERCIAL.heading}</h2>
          <p className="commercial-am">{COMMERCIAL.am}</p>
          <p className="commercial-body">{COMMERCIAL.body}</p>
        </div>

        <div className="projects">
          {COMMERCIAL.projects.map((project) => (
            <CommercialProject key={project.id} project={project} />
          ))}
        </div>

        <a className="commercial-call" href={PHONE_TEL}>
          <PhoneIcon size={18} />
          Ask Wonde about a unit
          <span className="commercial-call-num">{PHONE}</span>
        </a>
      </section>
    </main>
  )
}
