export function HeroCard() {
  return (
    <div
      className="border-border bg-surface relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border px-5 py-3 shadow-lg"
      style={{ animation: 'var(--animate-float)' }}
    >
      {/* shimmer glare streak */}
      <div
        className="pointer-events-none absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ animation: 'var(--animate-shimmer-glare)' }}
      />

      {/* pulsing dot */}
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
        <span className="bg-accent relative inline-flex h-3 w-3 rounded-full" />
      </span>

      <div className="flex flex-col leading-tight">
        <span className="text-fg text-sm font-semibold">Open to work</span>
        <span className="text-muted text-xs">Full-Stack · Remote</span>
      </div>
    </div>
  )
}
