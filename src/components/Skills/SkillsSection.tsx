import { ConstellationCanvas } from './ConstellationCanvas'

export function SkillsSection() {
  return (
    <section id="skills" data-testid="skills-section" className="border-border border-t">
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <h2 className="text-fg text-3xl font-bold tracking-tight sm:text-4xl">Skills</h2>
        <p className="text-muted mt-2 text-sm">
          Click a star to explore — click outside to dismiss.
        </p>
      </div>

      <div className="mt-4 h-[560px] w-full sm:h-[600px]" data-testid="skills-canvas-wrapper">
        <ConstellationCanvas />
      </div>
    </section>
  )
}
