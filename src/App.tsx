import { Header } from './components/Header'
import { Hero } from './components/Hero'

const SKILLS = [
  'TypeScript',
  'React',
  'Node.js',
  'Tailwind CSS',
  'Vite',
  'Playwright',
  'PostgreSQL',
  'Docker',
]

const PROJECTS = [
  {
    title: 'Stellar Notes',
    blurb: 'Markdown-first knowledge base with end-to-end encryption and offline sync.',
  },
  {
    title: 'Orbital UI Kit',
    blurb: 'Open-source design system built on Tailwind v4 with light, dark and Nord themes.',
  },
  {
    title: 'Aurora Metrics',
    blurb: 'Tiny self-hosted analytics with privacy-first defaults and a 14 kB script.',
  },
]

function App() {
  return (
    <>
      <Header />
      <main className="bg-bg text-fg">
        <Hero />

        <section id="about" className="border-border bg-surface/40 border-t px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight">About</h2>
            <p className="text-muted mt-6 text-base leading-relaxed">
              Ten years of shipping in tight teams, mostly TypeScript on both sides of the wire.
              Comfortable in the design tool and the terminal. Bias toward boring technology, fast
              feedback loops and writing the smallest thing that could possibly work.
            </p>
          </div>
        </section>

        <section id="skills" className="border-border border-t px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight">Skills</h2>
            <ul className="mt-8 flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <li
                  key={s}
                  className="bg-surface text-fg ring-border rounded-full px-3 py-1 text-sm ring-1"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="projects" className="border-border bg-surface/40 border-t px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-semibold tracking-tight">Projects</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((p) => (
                <article
                  key={p.title}
                  className="bg-bg ring-border rounded-xl p-6 shadow-sm ring-1"
                >
                  <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">{p.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-border text-muted border-t px-6 py-8 text-center text-sm">
          © {new Date().getFullYear()} Lex Polaris — built with React, Vite and Tailwind.
        </footer>
      </main>
    </>
  )
}

export default App
