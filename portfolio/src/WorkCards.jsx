import { Reveal } from './Reveal.jsx'
import { projects } from './projects.js'

// Stats2-style cards, plain CSS. The project NAME is the big metric text
// (no numbers invented). Clicking a card opens the project modal.
export default function WorkCards({ onOpen }) {
  return (
    <div className="work-grid">
      {projects.map((project, i) => {
        const Icon = project.icon
        return (
          <Reveal
            key={project.id}
            className="reveal reveal-card"
            delay={i * 0.1}
          >
            <button
              type="button"
              className="stat-card"
              onClick={() => onOpen(i)}
              style={{
                '--accent': project.accent,
                '--accent2': project.accent2,
                '--accent3': project.accent3,
                '--glow': project.glow,
                '--soft': project.soft,
              }}
            >
              <span
                className="card-glow"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(600px circle at 50% 0%, ${project.glow}, transparent 60%)`,
                }}
              />
              <span
                className="accent-bar"
                aria-hidden="true"
                style={{
                  background: `linear-gradient(to bottom, ${project.accent}, ${project.accent2}, ${project.accent3})`,
                }}
              />

              <span className="stat-card-body">
                <span className="stat-pill-row">
                  <span className="pill-badge">
                    <Icon className="stat-icon" size={12} />
                    {project.tag}
                  </span>
                </span>

                <span className="metric-value">{project.name}</span>

                <span className="stat-status-row">
                  <span
                    className="shimmer-line"
                    aria-hidden="true"
                    style={{
                      background: `linear-gradient(90deg, ${project.accent}, ${project.accent2}, ${project.accent3})`,
                    }}
                  />
                  <span className="stat-status">{project.status}</span>
                </span>

                <span className="desc-text">{project.desc}</span>
              </span>
            </button>
          </Reveal>
        )
      })}
    </div>
  )
}
