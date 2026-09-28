import { COMMERCIAL, UI } from '../content.js'
import { useLang } from '../i18n.jsx'
import SectionHead from './SectionHead.jsx'
import ContactLinks from './ContactLinks.jsx'

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

function Project({ project }) {
  const { t, other } = useLang()

  return (
    <article className="project">
      <h3 className="project-name">{t(project.name)}</h3>
      <p className="project-alt">{other(project.name)}</p>
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

export default function Commercial() {
  const { t } = useLang()

  return (
    <section className="section commercial" id="commercial">
      <div className="container">
        <SectionHead eyebrow={COMMERCIAL.eyebrow} heading={COMMERCIAL.heading} body={COMMERCIAL.body} />

        <div className="projects">
          {COMMERCIAL.projects.map((project) => (
            <Project key={project.id} project={project} />
          ))}
        </div>

        <div className="commercial-cta">
          <p>{t(UI.askAboutUnit)}</p>
          <ContactLinks />
        </div>
      </div>
    </section>
  )
}
