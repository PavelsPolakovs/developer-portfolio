import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, within } from 'storybook/test'
import { ThemeSwitcher } from './ThemeSwitcher'

const meta = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof ThemeSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { size: 'md' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const AllSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-end gap-8">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <ThemeSwitcher size={size} />
          <span className="text-muted text-xs tracking-wide uppercase">{size}</span>
        </div>
      ))}
    </div>
  ),
}

export const OnSurface: Story = {
  args: { size: 'md' },
  render: (args) => (
    <div className="bg-surface ring-border rounded-2xl p-10 shadow-sm ring-1">
      <ThemeSwitcher {...args} />
    </div>
  ),
}

// Electrons orbit continuously, so we use fireEvent (no pointer stability checks)
// to verify the click handler in Storybook's interactions panel.
export const ClickInteraction: Story = {
  args: { size: 'md' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const nordBtn = canvas.getByRole('button', { name: /nord theme/i })
    fireEvent.click(nordBtn)
    await expect(nordBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(document.documentElement).toHaveClass(/theme-nord/)

    const lightBtn = canvas.getByRole('button', { name: /light theme/i })
    fireEvent.click(lightBtn)
    await expect(lightBtn).toHaveAttribute('aria-pressed', 'true')
    await expect(document.documentElement).toHaveClass(/theme-light/)
  },
}
