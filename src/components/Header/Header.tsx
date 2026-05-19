import { useEffect, useId, useState } from 'react'
import { tv } from '../../lib/tv'
import { ThemeSwitcher } from '../ThemeSwitcher'
import { SECTIONS, type SectionId } from './sections'
import { useActiveSection } from './useActiveSection'
import { useHeaderScroll } from './useHeaderScroll'

const header = tv({
  slots: {
    root: 'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300',
    inner:
      'mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6',
    brand: 'flex items-center gap-2 text-fg',
    monogram:
      'grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-fg text-sm font-bold shadow-md ring-1 ring-border',
    name: 'hidden text-base font-semibold tracking-tight sm:inline',
    nav: 'hidden items-center gap-1 md:flex',
    navLink:
      'relative rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    navLinkActive: 'text-accent',
    activeMark:
      'pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]',
    rightCluster: 'flex items-center gap-2',
    hamburger:
      'relative inline-grid h-10 w-10 place-items-center rounded-md text-fg transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden',
    burgerBar:
      'absolute left-1/2 h-[3px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-all duration-300',
  },
  variants: {
    scrolled: {
      true: {
        root: 'bg-bg/80 shadow-md backdrop-blur-md',
        inner: 'h-16',
      },
      false: {
        root: 'bg-transparent',
        inner: 'h-24',
      },
    },
  },
  defaultVariants: { scrolled: false },
})

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

const SECTION_IDS = SECTIONS.map((s) => s.id) as readonly SectionId[]

export type HeaderProps = {
  className?: string
  brandName?: string
  brandMonogram?: string
}

export function Header({
  className,
  brandName = 'Lex Polaris',
  brandMonogram = 'LP',
}: HeaderProps) {
  const scrolled = useHeaderScroll()
  const active = useActiveSection(SECTION_IDS)
  const [open, setOpen] = useState(false)
  const drawerId = useId()

  const h = header({ scrolled })
  const d = drawer({ open })

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  return (
    <>
      <header className={h.root({ class: className })} data-scrolled={scrolled ? 'true' : 'false'}>
        <div className={h.inner()}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={h.hamburger()}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls={drawerId}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                aria-hidden="true"
                className={h.burgerBar({
                  class: open ? 'top-1/2 rotate-45' : 'top-[14px]',
                })}
              />
              <span
                aria-hidden="true"
                className={h.burgerBar({
                  class: open ? 'top-1/2 opacity-0' : 'top-1/2',
                })}
              />
              <span
                aria-hidden="true"
                className={h.burgerBar({
                  class: open ? 'top-1/2 -rotate-45' : 'top-[26px]',
                })}
              />
            </button>

            <a href="#hero" className={h.brand()} onClick={(e) => handleNavClick(e, 'hero')}>
              <span className={h.monogram()} aria-hidden="true">
                {brandMonogram}
              </span>
              <span className={h.name()}>{brandName}</span>
            </a>
          </div>

          <nav className={h.nav()} aria-label="Primary">
            {SECTIONS.map((s) => {
              const isActive = s.id === active
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => handleNavClick(e, s.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={h.navLink({ class: isActive ? h.navLinkActive() : undefined })}
                >
                  {s.label}
                  {isActive && <span aria-hidden="true" className={h.activeMark()} />}
                </a>
              )
            })}
          </nav>

          <div className={h.rightCluster()}>
            <ThemeSwitcher size="xs" />
          </div>
        </div>
      </header>

      <div
        className={d.backdrop()}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        data-state={open ? 'open' : 'closed'}
      />
      <aside
        id={drawerId}
        className={d.panel()}
        aria-label="Mobile navigation"
        aria-hidden={!open}
        data-state={open ? 'open' : 'closed'}
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile primary">
          {SECTIONS.map((s) => {
            const isActive = s.id === active
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                tabIndex={open ? 0 : -1}
                onClick={(e) => handleNavClick(e, s.id)}
                aria-current={isActive ? 'true' : undefined}
                className={d.link({ class: isActive ? d.linkActive() : undefined })}
              >
                {s.label}
                {isActive && <span aria-hidden="true" className={d.linkMark()} />}
              </a>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Header
