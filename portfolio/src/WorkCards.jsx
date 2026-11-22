import { Reveal } from './Reveal.jsx'
import { projects } from './projects.js'

// Stats1-style cards, plain CSS: rounded card, dark base plus the
// repeating diagonal stripe gradient in the project accent colour.
// Content is only the business name as the big title and one short
// description line — no badge, no metric, no stars. Clicking a card
// opens the project modal.
export default function WorkCards({ onOpen }) {
  return (
    <div className="work-grid">
      {projects.map((project, i) => (
        <Reveal
          key={project.id}
          className="reveal reveal-card"
          delay={i * 0.1}
        >
          <button
            type="button"
            className="stat1-card"
            onClick={() => onOpen(i)}
            style={{ '--accent': project.accent }}
          >
            <span className="stat1-card-body">
              <span className="stat1-title">{project.name}</span>
              <span className="stat1-desc">{project.desc}</span>
            </span>
          </button>
        </Reveal>
      ))}
    </div>
  )
}
