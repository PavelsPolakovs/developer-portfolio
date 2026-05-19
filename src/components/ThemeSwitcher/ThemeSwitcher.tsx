import { tv, type VariantProps } from '../../lib/tv'
import { useTheme } from '../../theme'
import { THEMES, THEME_META, type Theme } from '../../theme/themes'

const switcher = tv({
  slots: {
    root: 'relative inline-grid place-items-center text-fg select-none',
    ringSvg: 'pointer-events-none absolute inset-0 h-full w-full',
    ringTrack: 'fill-none stroke-muted/70',
    ringTrackActive: 'fill-none stroke-accent',
    nucleus:
      'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-surface ring-1 ring-border shadow-md',
    orbitTrack: 'pointer-events-none absolute inset-0',
    electron:
      'pointer-events-auto absolute left-1/2 top-1/2 rounded-full ring-1 ring-black/10 shadow-md transition-[box-shadow] duration-200 hover:ring-2 hover:ring-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer',
    electronActive: 'ring-2 ring-accent animate-[var(--animate-electron-pulse)]',
  },
  variants: {
    size: {
      sm: { root: 'h-28 w-28', nucleus: 'h-8 w-8 text-base', electron: 'h-5 w-5' },
      md: { root: 'h-36 w-36', nucleus: 'h-10 w-10 text-xl', electron: 'h-6 w-6' },
      lg: { root: 'h-44 w-44', nucleus: 'h-12 w-12 text-2xl', electron: 'h-7 w-7' },
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
      light: { radius: 28, duration: 14 },
      dark: { radius: 40, duration: 22 },
      nord: { radius: 52, duration: 32 },
    },
  },
  md: {
    box: 144,
    orbits: {
      light: { radius: 36, duration: 16 },
      dark: { radius: 52, duration: 26 },
      nord: { radius: 68, duration: 38 },
    },
  },
  lg: {
    box: 176,
    orbits: {
      light: { radius: 44, duration: 18 },
      dark: { radius: 62, duration: 30 },
      nord: { radius: 80, duration: 44 },
    },
  },
}

const BALL: Record<Theme, { primary: string; highlight: string; shadow: string }> = {
  light: { primary: '#ecb04a', highlight: '#fceaba', shadow: '#a8651a' },
  dark: { primary: '#6e76a8', highlight: '#c7c3e0', shadow: '#3a3f70' },
  nord: { primary: '#88c0d0', highlight: '#dfeef4', shadow: '#4a7585' },
}

function ballBackground(t: Theme) {
  const { primary, highlight, shadow } = BALL[t]
  return `radial-gradient(circle at 30% 28%, ${highlight} 0%, ${primary} 55%, ${shadow} 100%)`
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

      <div className={styles.nucleus()} aria-live="polite" aria-label={`${THEME_META[theme].label} theme`}>
        <span aria-hidden="true" className="leading-none">
          {THEME_META[theme].symbol}
        </span>
      </div>

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
                background: ballBackground(t),
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ThemeSwitcher
