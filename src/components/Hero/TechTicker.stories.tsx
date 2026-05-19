import type { Meta, StoryObj } from '@storybook/react-vite'
import { TechTicker } from './TechTicker'

const meta = {
  title: 'Components/Hero/TechTicker',
  component: TechTicker,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TechTicker>

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
  name: 'All themes stacked',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col">
      {(['light', 'dark', 'nord'] as const).map((theme) => (
        <div key={theme} className={`theme-${theme}`} style={{ background: 'var(--bg)' }}>
          <div className="py-2 pl-4 font-mono text-xs" style={{ color: 'var(--muted)' }}>
            {theme}
          </div>
          <TechTicker />
        </div>
      ))}
    </div>
  ),
}
