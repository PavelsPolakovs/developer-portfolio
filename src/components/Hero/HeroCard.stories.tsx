import type { Meta, StoryObj } from '@storybook/react-vite'
import { HeroCard } from './HeroCard'

const meta = {
  title: 'Components/Hero/HeroCard',
  component: HeroCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof HeroCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
}

export const NordTheme: Story = {
  globals: { theme: 'nord' },
}

export const AllThemes: Story = {
  name: 'All themes side-by-side',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      {(['light', 'dark', 'nord'] as const).map((theme) => (
        <div key={theme} className="flex flex-col items-center gap-3">
          <div className={`theme-${theme} rounded-2xl p-8`} style={{ background: 'var(--bg)' }}>
            <HeroCard />
          </div>
          <span className="text-muted text-xs tracking-wider uppercase">{theme}</span>
        </div>
      ))}
    </div>
  ),
}

export const OnCanvasBackground: Story = {
  name: 'On canvas background',
  render: () => (
    <div
      className="relative flex h-48 w-96 items-center justify-center overflow-hidden rounded-2xl"
      style={{ background: '#0d1117' }}
    >
      <HeroCard />
    </div>
  ),
}
