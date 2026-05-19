import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { HeroCanvas } from './HeroCanvas'

const meta = {
  title: 'Components/Hero/HeroCanvas',
  component: HeroCanvas,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  args: {
    overlayVisible: false,
  },
} satisfies Meta<typeof HeroCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OverlayVisible: Story = {
  name: 'Overlay visible — Copy Animation button shown',
  args: { overlayVisible: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /copy animation/i })
    await expect(btn.parentElement).toHaveClass('opacity-100')
  },
}

export const OverlayHidden: Story = {
  name: 'Overlay hidden — animation clean',
  args: { overlayVisible: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /copy animation/i })
    await expect(btn.parentElement).toHaveClass('opacity-0')
    await expect(btn.parentElement).toHaveClass('pointer-events-none')
  },
}

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
    <div className="flex flex-col gap-6 sm:flex-row">
      {(['light', 'dark', 'nord'] as const).map((theme) => (
        <div key={theme} className="flex flex-col items-center gap-2">
          <div
            className={`theme-${theme} w-72 rounded-2xl p-3`}
            style={{ background: 'var(--bg)' }}
          >
            <HeroCanvas overlayVisible={false} />
          </div>
          <span className="text-muted text-xs tracking-wider uppercase">{theme}</span>
        </div>
      ))}
    </div>
  ),
}
