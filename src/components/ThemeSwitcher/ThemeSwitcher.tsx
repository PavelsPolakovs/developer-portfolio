import { tv, type VariantProps } from '../../lib/tv'
import { useTheme } from '../../theme'
import { THEMES, THEME_META, type Theme } from '../../theme/themes'

const switcher = tv({
  slots: {
    root: 'relative inline-grid place-items-center text-fg select-none',
    ringSvg: 'pointer-events-none absolute inset-0 h-full w-full',
    ringTrack: 'fill-none stroke-muted/70',
    ringTrackActive: 'fill-none stroke-accent',
    orbitTrack: 'pointer-events-none absolute inset-0',
    electron:
      'pointer-events-auto absolute left-1/2 top-1/2 grid place-items-center rounded-full bg-surface ring-1 ring-border text-fg shadow-sm transition-[box-shadow,background-color,color] duration-200 hover:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer',
    electronActive: 'bg-accent text-accent-fg ring-accent animate-[var(--animate-electron-pulse)]',
    glyph: 'block leading-none',
  },
  variants: {
    size: {
      sm: { root: 'h-28 w-28', electron: 'h-5 w-5 text-[10px]' },
      md: { root: 'h-36 w-36', electron: 'h-6 w-6 text-xs' },
      lg: { root: 'h-44 w-44', electron: 'h-7 w-7 text-sm' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type SizeKey = NonNullable<VariantProps<typeof switcher>['size']>

type OrbitSpec = { radius: number; duration: number }

const LAYOUT: Record<SizeKey, { box: number; orbits: Record<Theme, OrbitSpec> }> = {
  sm: {
    box: 112,
    orbits: {
      light: { radius: 26, duration: 14 },
      dark: { radius: 38, duration: 22 },
      nord: { radius: 50, duration: 32 },
    },
  },
  md: {
    box: 144,
    orbits: {
      light: { radius: 32, duration: 16 },
      dark: { radius: 48, duration: 26 },
      nord: { radius: 64, duration: 38 },
    },
  },
  lg: {
    box: 176,
    orbits: {
      light: { radius: 40, duration: 18 },
      dark: { radius: 60, duration: 30 },
      nord: { radius: 80, duration: 44 },
    },
  },
}

export type ThemeSwitcherProps = {
  size?: SizeKey
  className?: string
}

export function ThemeSwitcher({ size = 'md', className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()
  const styles = switcher({ size })
  const { box, orbits } = LAYOUT[size]
  const center = box / 2

  return (
    <div className={styles.root({ class: className })} role="group" aria-label="Theme switcher">
      <svg
        className={styles.ringSvg()}
        viewBox={`0 0 ${box} ${box}`}
        aria-hidden="true"
        focusable="false"
      >
        {THEMES.map((t) => {
          const active = t === theme
          return (
            <circle
              key={t}
              className={active ? styles.ringTrackActive() : styles.ringTrack()}
              cx={center}
              cy={center}
              r={orbits[t].radius}
              strokeWidth={active ? 2.5 : 1.5}
              strokeDasharray={active ? undefined : '3 4'}
              strokeLinecap="round"
            />
          )
        })}
      </svg>

      {THEMES.map((t) => {
        const { radius, duration } = orbits[t]
        const active = t === theme
        return (
          <div
            key={t}
            className={styles.orbitTrack()}
            style={{ animation: `orbit ${duration}s linear infinite` }}
          >
            <button
              type="button"
              onClick={() => setTheme(t)}
              aria-label={`Switch to ${THEME_META[t].label} theme`}
              aria-pressed={active}
              data-theme={t}
              data-active={active ? 'true' : undefined}
              className={styles.electron({
                class: active ? styles.electronActive() : undefined,
              })}
              style={{
                transform: `translate(-50%, -50%) translateY(-${radius}px)`,
              }}
            >
              <span
                className={styles.glyph()}
                style={{ animation: `orbit-counter ${duration}s linear infinite` }}
                aria-hidden="true"
              >
                {THEME_META[t].symbol}
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ThemeSwitcher
