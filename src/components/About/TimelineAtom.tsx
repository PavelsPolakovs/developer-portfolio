interface TimelineAtomProps {
  active: boolean
}

export function TimelineAtom({ active }: TimelineAtomProps) {
  return (
    <div
      data-testid="timeline-atom"
      data-active={active}
      className="relative h-16 w-16 shrink-0"
      style={{ overflow: 'visible' }}
    >
      {active && (
        <div
          data-testid="atom-wave"
          className="border-accent pointer-events-none absolute top-1/2 left-1/2 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-0"
          style={{ animation: 'var(--animate-wave-expand)' }}
        />
      )}

      <div
        data-testid="atom-nucleus"
        className="absolute top-1/2 left-1/2 z-[2] h-[9px] w-[9px] rounded-full"
        style={
          active
            ? { animation: 'var(--animate-nucleus-dim)' }
            : {
                transform: 'translate(-50%, -50%)',
                background: 'color-mix(in oklab, var(--accent) 33%, transparent)',
              }
        }
      />

      <div
        data-testid="atom-orbit"
        className="absolute inset-[6px] rounded-full border-[1.5px]"
        style={
          active
            ? {
                borderColor: 'color-mix(in oklab, var(--accent) 20%, transparent)',
                animation: 'var(--animate-orbit-fast), var(--animate-orbit-flash)',
              }
            : {
                borderColor: 'color-mix(in oklab, var(--accent) 13%, transparent)',
                animation: 'var(--animate-orbit-slow)',
              }
        }
      >
        <div
          data-testid="atom-electron"
          className="absolute top-[-4px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full"
          style={
            active
              ? {
                  background: 'color-mix(in oklab, var(--accent) 60%, transparent)',
                  animation: 'var(--animate-electron-flash)',
                }
              : {
                  background: 'color-mix(in oklab, var(--accent) 27%, transparent)',
                }
          }
        />
      </div>
    </div>
  )
}
