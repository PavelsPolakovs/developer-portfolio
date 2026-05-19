import { useId, useState } from 'react'
import { tv } from '../../lib/tv'
import { ThemeSwitcher } from '../ThemeSwitcher'
import { HamburgerButton } from './HamburgerButton'
import { MobileDrawer } from './MobileDrawer'
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

  function navigateTo(e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) {
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
            <HamburgerButton
              open={open}
              onToggle={() => setOpen((v) => !v)}
              controls={drawerId}
              className="md:hidden"
            />

            <a href="#hero" className={h.brand()} onClick={(e) => navigateTo(e, 'hero')}>
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
                  onClick={(e) => navigateTo(e, s.id)}
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

      <MobileDrawer
        id={drawerId}
        open={open}
        onClose={() => setOpen(false)}
        sections={SECTIONS}
        activeId={active}
        onSelect={navigateTo}
      />
    </>
  )
}

export default Header
