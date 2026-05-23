import { AboutSection } from './components/About'
import { CustomCursor } from './components/CustomCursor'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProjectsSection } from './components/Projects'
import { SkillsSection } from './components/Skills'

function App() {
  return (
    <>
      <CustomCursor />
      <Header />
      <main className="bg-bg text-fg">
        <Hero />

        <AboutSection />

        <SkillsSection />

        <ProjectsSection />

        <footer className="border-border text-muted border-t px-6 py-8 text-center text-sm">
          © {new Date().getFullYear()} Lex Polaris — built with React, Vite and Tailwind.
        </footer>
      </main>
    </>
  )
}

export default App
