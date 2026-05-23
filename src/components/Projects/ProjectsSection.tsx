import { ProjectCard } from './ProjectCard'
import type { ProjectCardProps } from './ProjectCard'

const PROJECTS: ProjectCardProps[] = [
  {
    title: 'NovaDash',
    description: 'Analytics platform for tracking product metrics in real time.',
    tech: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Recharts'],
    repoUrl: 'https://github.com/example/novadash',
  },
  {
    title: 'Stellar Notes',
    description: 'Markdown-first knowledge base with end-to-end encryption and offline sync.',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    repoUrl: 'https://github.com/example/stellar-notes',
  },
  {
    title: 'Aurora Metrics',
    description: 'Tiny self-hosted analytics with privacy-first defaults and a 14 kB script.',
    tech: ['TypeScript', 'Node.js', 'SQLite', 'Vite'],
    repoUrl: 'https://github.com/example/aurora-metrics',
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" data-testid="projects-section" className="border-border border-t">
      <div className="mx-auto max-w-5xl px-6 pt-16">
        <h2 className="text-fg text-3xl font-bold tracking-tight sm:text-4xl">Projects</h2>
        <p className="text-muted mt-2 text-sm">Hover a card to explore — tap on mobile.</p>
      </div>

      <div
        className="mx-auto mt-8 grid max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-2 sm:pb-32"
        data-testid="projects-grid"
      >
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  )
}
