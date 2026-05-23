import { TimelineAtom } from './TimelineAtom'

export interface TimelineItemData {
  year: string
  title: string
  description: string
  modalText: string
}

interface TimelineItemProps extends TimelineItemData {
  active: boolean
  onClick: () => void
}

export function TimelineItem({ year, title, description, active, onClick }: TimelineItemProps) {
  return (
    <button
      type="button"
      data-testid="timeline-item"
      data-active={active}
      onClick={onClick}
      className="flex cursor-pointer items-center gap-7 text-left"
    >
      <TimelineAtom active={active} />

      <div className="flex flex-col">
        <span
          data-testid="timeline-year"
          className="font-mono text-[11px] tracking-[0.12em] transition-colors duration-300"
          style={{
            color: active ? 'var(--accent)' : 'color-mix(in oklab, var(--accent) 27%, transparent)',
          }}
        >
          {year}
        </span>
        <span
          data-testid="timeline-title"
          className="text-[15px] font-bold tracking-tight transition-colors duration-300"
          style={{
            color: active ? 'var(--fg)' : 'color-mix(in oklab, var(--fg) 30%, transparent)',
          }}
        >
          {title}
        </span>
        <span
          data-testid="timeline-desc"
          className="font-mono text-[11px] transition-colors duration-300"
          style={{
            color: active ? 'var(--muted)' : 'color-mix(in oklab, var(--muted) 40%, transparent)',
          }}
        >
          {description}
        </span>
      </div>
    </button>
  )
}
