const ITEMS = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Tailwind Variants',
  'Vite',
  'Storybook',
  'Claude Code',
]

const SEP = '·'

function TickerList() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-4 whitespace-nowrap">
          <span className="text-muted text-sm font-medium">{item}</span>
          <span className="text-muted/40 text-xs">{SEP}</span>
        </span>
      ))}
    </>
  )
}

export function TechTicker() {
  return (
    <div className="border-border overflow-hidden border-t [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] py-3">
      <div className="flex w-max gap-4" style={{ animation: 'var(--animate-ticker)' }}>
        <TickerList />
        <TickerList />
      </div>
    </div>
  )
}
