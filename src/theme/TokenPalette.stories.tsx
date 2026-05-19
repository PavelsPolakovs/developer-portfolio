import type { Meta, StoryObj } from '@storybook/react-vite'

const TOKENS = [
  { name: 'bg', bg: 'bg-bg', label: 'Page background' },
  { name: 'surface', bg: 'bg-surface', label: 'Card / panel surface' },
  { name: 'fg', bg: 'bg-fg', label: 'Primary text' },
  { name: 'muted', bg: 'bg-muted', label: 'Secondary text / muted' },
  { name: 'accent', bg: 'bg-accent', label: 'Accent / interactive' },
  { name: 'accent-fg', bg: 'bg-accent-fg', label: 'Text on accent' },
  { name: 'border', bg: 'bg-border', label: 'Hairlines / dividers' },
  { name: 'ring', bg: 'bg-ring', label: 'Focus ring' },
] as const

function TokenPalette() {
  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-fg text-xl font-semibold">Theme tokens</h2>
        <p className="text-muted text-sm">
          Swap themes via the toolbar above. Every swatch resolves to{' '}
          <code className="text-fg">var(--color-&lt;name&gt;)</code>.
        </p>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {TOKENS.map((t) => (
          <div
            key={t.name}
            className="bg-surface ring-border overflow-hidden rounded-lg shadow-sm ring-1"
          >
            <div className={`${t.bg} ring-border h-16 w-full ring-1`} aria-hidden="true" />
            <div className="px-3 py-2">
              <div className="text-fg text-sm font-medium">{t.name}</div>
              <div className="text-muted text-xs">{t.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: 'Theme/TokenPalette',
  component: TokenPalette,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TokenPalette>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
