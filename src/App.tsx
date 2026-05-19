import { ThemeSwitcher } from './components/ThemeSwitcher'

function App() {
  return (
    <main className="bg-bg text-fg flex min-h-svh items-center justify-center">
      <div className="fixed top-6 right-6 z-50">
        <ThemeSwitcher />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Developer Portfolio</h1>
    </main>
  )
}

export default App
