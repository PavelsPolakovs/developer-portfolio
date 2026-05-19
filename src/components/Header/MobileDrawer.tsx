import { useEffect } from 'react'
import { tv } from '../../lib/tv'
import type { Section, SectionId } from './sections'

const drawer = tv({
  slots: {
    backdrop:
      'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
    panel:
      'fixed top-0 right-0 z-50 flex h-[100dvh] w-72 max-w-[85vw] flex-col gap-1 border-l border-border bg-surface p-6 pt-20 shadow-2xl transition-transform duration-300 md:hidden',
    link: 'rounded-md px-3 py-3 text-base font-medium text-fg transition-colors hover:bg-bg/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    linkActive: 'text-accent',
    linkMark: 'ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle',
  },
  variants: {
    open: {
      true: {
        backdrop: 'pointer-events-auto opacity-100',
        panel: 'translate-x-0',
      },
      false: {
        backdrop: 'pointer-events-none opacity-0',
        panel: 'translate-x-full',
      },
    },
  },
  defaultVariants: { open: false },
})

export type MobileDrawerProps = {
  id?: string
  open: boolean
  onClose: () => void
  sections: readonly Section[]
  activeId: SectionId
  onSelect: (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => void
  lockBodyScroll?: boolean
}

export function MobileDrawer({
  id,
  open,
  onClose,
  sections,
  activeId,
  onSelect,
  lockBodyScroll = true,
}: MobileDrawerProps) {
  const styles = drawer({ open })

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open || !lockBodyScroll) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open, lockBodyScroll])

  return (
    <>
      <div
        className={styles.backdrop()}
        aria-hidden="true"
        onClick={onClose}
        data-state={open ? 'open' : 'closed'}
      />
      <aside
        id={id}
        className={styles.panel()}
        aria-label="Mobile navigation"
        aria-hidden={!open}
        data-state={open ? 'open' : 'closed'}
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile primary">
          {sections.map((s) => {
            const isActive = s.id === activeId
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                tabIndex={open ? 0 : -1}
                onClick={(e) => onSelect(e, s.id)}
                aria-current={isActive ? 'true' : undefined}
                className={styles.link({ class: isActive ? styles.linkActive() : undefined })}
              >
                {s.label}
                {isActive && <span aria-hidden="true" className={styles.linkMark()} />}
              </a>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default MobileDrawer
