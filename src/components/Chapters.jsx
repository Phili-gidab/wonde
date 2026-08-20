import { CHAPTERS, COMMERCIAL, UI } from '../content.js'
import { PHONE, PHONE_TEL, WHATSAPP, TELEGRAM, AGENT, AGENT_EN } from '../contact.js'
import { useLang } from '../i18n.jsx'
import PhoneIcon from './PhoneIcon.jsx'
import Feed from './Feed.jsx'
import Pillars from './Pillars.jsx'
import Delivered from './Delivered.jsx'
import Why from './Why.jsx'

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
  const { t, lang } = useLang()

  return (
    <div className="ch-contact">
      <a className="phone-plate" href={PHONE_TEL}>
        <span className="phone-plate-ring">
          <PhoneIcon size={22} />
        </span>
        <span className="phone-plate-body">
          <span className="phone-plate-label">{t(UI.callNow)}</span>
          <span className="phone-plate-num">{PHONE}</span>
        </span>
      </a>

      <p className="agent">
        {/* The agent's name leads in whichever script the reader is using. */}
        <span className="agent-name">{lang === 'am' ? AGENT : AGENT_EN}</span>
        <span className="agent-am">{lang === 'am' ? AGENT_EN : AGENT}</span>
        <span className="agent-role">{t(UI.salesConsultant)}</span>
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
  const { t, other } = useLang()
  const { no, label, heading, body, stats, sites } = data

  return (
    <section id={data.id} style={data.feed ? { position: "relative" } : undefined} className={`ch${active ? ' is-active' : ''}${data.feed ? ' ch-wide' : ''}`} aria-label={t(label)}>
      <div className="ch-inner">
        <p className="ch-tag">
          <span className="ch-no">CH.{no}</span>
          <span className="ch-rule" />
          <span className="ch-label">{t(label)}</span>
          <span className="ch-label-am">{other(label)}</span>
        </p>

        {/* The listings chapter opens straight onto the carousel - the posts
            carry their own titles, prices and copy, so the display heading
            and intro would just be a wall of type in front of them. */}
        {!data.feed && (
          <>
          <Heading text={t(heading)} />

          {/*
            The accent line is always the heading in the *other* language, so the
            page stays visibly bilingual whichever way it is being read.
          */}
          <p className="ch-am">{other(heading).replace('\n', ' ')}</p>
          <p className="ch-body">{t(body)}</p>
          </>
        )}

        {stats && (
          <div className="ch-stats">
            {stats.map((stat) => (
              <div className="ch-stat" key={stat.value}>
                <span className="ch-stat-value">{stat.value}</span>
                <span className="ch-stat-label">{t(stat.label)}</span>
                <span className="ch-stat-am">{other(stat.label)}</span>
              </div>
            ))}
          </div>
        )}

        {sites && (
          <ul className="ch-sites">
            {sites.map((site) => (
              <li key={site.size}>
                <span className="site-name">{t(site.name)}</span>
                <span className="site-am">{other(site.name)}</span>
                <span className="site-size">{site.size}</span>
                <span className="site-note">{t(site.note)}</span>
              </li>
            ))}
          </ul>
        )}

        {data.feed && <Feed />}
        {data.id === 'contact' && <ContactBlock />}
      </div>
    </section>
  )
}

/** Per-unit price table for the Kaliti mall. */
function UnitTable({ units }) {
  const { t } = useLang()

  return (
    <div className="unit-table-wrap">
      <table className="unit-table">
        <thead>
          <tr>
            <th scope="col">{t(UI.unitTable.floor)}</th>
            <th scope="col">{t(UI.unitTable.size)}</th>
            <th scope="col">{t(UI.unitTable.price)}</th>
            <th scope="col">{t(UI.unitTable.down)}</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit, index) => (
            <tr key={`${unit.size}-${index}`}>
              {/* Repeated as a data-label so the table can restack on phones. */}
              <td data-label={t(UI.unitTable.floor)}>{t(unit.floor)}</td>
              <td data-label={t(UI.unitTable.size)}>{unit.size}</td>
              <td className="num" data-label={t(UI.unitTable.price)}>
                {unit.price}
              </td>
              <td className="num" data-label={t(UI.unitTable.down)}>
                {unit.down}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="unit-table-note">{t(UI.allFiguresBirr)}</p>
    </div>
  )
}

function CommercialProject({ project }) {
  const { t, other } = useLang()

  return (
    <article className="project">
      <header className="project-head">
        <h3>{t(project.name)}</h3>
        <p className="project-am">{other(project.name)}</p>
      </header>

      <p className="project-summary">{t(project.summary)}</p>

      {/* The pitch in Wonde's own words, from the Telegram post. The facts
          and unit table below carry the same terms as structured data. */}
      {project.pitch && (
        <ul className="project-pitch">
          {project.pitch.map((line) => (
            <li key={line.en}>{t(line)}</li>
          ))}
        </ul>
      )}

      {project.facts && (
        <dl className="project-facts">
          {project.facts.map((fact) => (
            <div key={fact.k.en}>
              <dt>{t(fact.k)}</dt>
              <dd>{t(fact.v)}</dd>
            </div>
          ))}
        </dl>
      )}

      {project.features && (
        <ul className="project-features">
          {project.features.map((feature) => (
            <li key={feature.en}>{t(feature)}</li>
          ))}
        </ul>
      )}

      {project.units && <UnitTable units={project.units} />}
    </article>
  )
}

export default function Chapters({ chapter }) {
  const { t, other } = useLang()

  return (
    <main className="chapters">
      {/*
        The camera path is measured against this element specifically - see
        useScrollProgress. Keep everything below - Pillars, Why, Delivered,
        the commercial section and the footer - OUTSIDE it, or the path
        stretches across content that has no camera keyframes.
      */}
      <div className="chapter-track" id="chapter-track">
        {CHAPTERS.map((data, index) => (
          <Chapter key={data.id} data={data} active={index === chapter} />
        ))}
      </div>

      <Pillars />

      {/* What is for sale, then why you would buy it here, then the proof.
          Why sits above Delivered deliberately: it is the argument, and the
          gallery under it is the evidence for the argument. */}
      <Why />

      <Delivered />

      <section className="commercial" id="commercial" aria-label={t(COMMERCIAL.eyebrow)}>
        <div className="commercial-head">
          <p className="eyebrow">
            {t(COMMERCIAL.eyebrow)}
            <span className="eyebrow-am">{other(COMMERCIAL.eyebrow)}</span>
          </p>
          <h2>{t(COMMERCIAL.heading)}</h2>
          <p className="commercial-am">{other(COMMERCIAL.heading)}</p>
          <p className="commercial-body">{t(COMMERCIAL.body)}</p>
        </div>

        <div className="projects">
          {COMMERCIAL.projects.map((project) => (
            <CommercialProject key={project.id} project={project} />
          ))}
        </div>

        <a className="commercial-call" href={PHONE_TEL}>
          <PhoneIcon size={18} />
          {t(UI.askAboutUnit)}
          <span className="commercial-call-num">{PHONE}</span>
        </a>
      </section>
    </main>
  )
}
