import { HeroCanvas } from './HeroCanvas'
import { HeroCard } from './HeroCard'
import { TechTicker } from './TechTicker'

function Avatar() {
  return (
    // Replace the initials div with an <img> when a real photo is available.
    <div className="bg-accent text-accent-fg ring-accent/20 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ring-4 select-none">
      LP
    </div>
  )
}

const DELAY = (n: number) => ({ style: { animationDelay: `${n * 80}ms` } })

export function Hero() {
  return (
    <section id="hero" className="border-border relative overflow-hidden border-b">
      {/* background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(color-mix(in oklab, var(--border) 60%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in oklab, var(--border) 60%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* glow blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-0 sm:pt-32">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* ── Left column ── */}
          <div className="flex flex-1 flex-col gap-6">
            <div
              className="opacity-0"
              style={{ animation: 'var(--animate-fade-in-up)', ...DELAY(0).style }}
            >
              <Avatar />
            </div>

            <div
              className="opacity-0"
              style={{ animation: 'var(--animate-fade-in-up)', ...DELAY(1).style }}
            >
              <h1 className="text-fg text-4xl font-bold tracking-tight sm:text-5xl">Lex Polaris</h1>
              <p className="text-accent mt-1 text-lg font-medium">Full-Stack Engineer</p>
            </div>

            <p
              className="text-muted max-w-md text-base leading-relaxed opacity-0"
              style={{ animation: 'var(--animate-fade-in-up)', ...DELAY(2).style }}
            >
              Ten years shipping calm, fast web products in tight teams — TypeScript on both sides
              of the wire. Bias toward boring technology, small PRs, and tools that feel inevitable.
            </p>

            <div
              className="flex flex-wrap gap-3 opacity-0"
              style={{ animation: 'var(--animate-fade-in-up)', ...DELAY(3).style }}
            >
              <a
                href="#projects"
                className="bg-accent text-accent-fg rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-95"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="border-border text-fg hover:bg-surface rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors active:scale-95"
              >
                Contact Me
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border-border text-muted hover:bg-surface hover:text-fg rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors active:scale-95"
              >
                GitHub ↗
              </a>
            </div>
          </div>

          {/* ── Right column ── */}
          <div
            className="flex flex-1 flex-col items-center gap-6 opacity-0 lg:items-end"
            style={{ animation: 'var(--animate-fade-in-up)', ...DELAY(4).style }}
          >
            <div className="w-full max-w-md">
              <HeroCanvas />
            </div>
            <div className="flex w-full max-w-md justify-start lg:justify-start">
              <HeroCard />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tech ticker ── */}
      <div
        className="mt-12 opacity-0"
        style={{ animation: 'var(--animate-fade-in-up)', ...DELAY(5).style }}
      >
        <TechTicker />
      </div>
    </section>
  )
}
