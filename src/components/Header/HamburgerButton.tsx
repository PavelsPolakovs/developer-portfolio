import { tv } from '../../lib/tv'

const burger = tv({
  slots: {
    root: 'relative inline-grid h-10 w-10 place-items-center rounded-md text-fg transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    bar: 'absolute left-1/2 h-[3px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-all duration-300',
  },
})

export type HamburgerButtonProps = {
  open: boolean
  onToggle: () => void
  controls?: string
  labels?: { open: string; close: string }
  className?: string
}

export function HamburgerButton({
  open,
  onToggle,
  controls,
  labels = { open: 'Open menu', close: 'Close menu' },
  className,
}: HamburgerButtonProps) {
  const styles = burger()
  return (
    <button
      type="button"
      className={styles.root({ class: className })}
      aria-label={open ? labels.close : labels.open}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
      data-state={open ? 'open' : 'closed'}
    >
      <span
        aria-hidden="true"
        data-bar="top"
        className={styles.bar({ class: open ? 'top-1/2 rotate-45' : 'top-[14px]' })}
      />
      <span
        aria-hidden="true"
        data-bar="middle"
        className={styles.bar({ class: open ? 'top-1/2 opacity-0' : 'top-1/2' })}
      />
      <span
        aria-hidden="true"
        data-bar="bottom"
        className={styles.bar({ class: open ? 'top-1/2 -rotate-45' : 'top-[26px]' })}
      />
    </button>
  )
}

export default HamburgerButton
