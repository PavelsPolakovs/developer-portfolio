import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fireEvent, within } from 'storybook/test'
import { HamburgerButton } from './HamburgerButton'

const meta = {
  title: 'Components/Header/HamburgerButton',
  component: HamburgerButton,
  parameters: { layout: 'centered' },
  args: {
    open: false,
    onToggle: () => {},
  },
  argTypes: {
    onToggle: { action: 'toggle' },
  },
} satisfies Meta<typeof HamburgerButton>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  args: { open: false },
}

export const Open: Story = {
  args: { open: true },
}

export const SideBySide: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <HamburgerButton open={false} onToggle={() => {}} />
        <span className="text-muted text-xs tracking-wide uppercase">closed</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <HamburgerButton open={true} onToggle={() => {}} />
        <span className="text-muted text-xs tracking-wide uppercase">open</span>
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [open, setOpen] = useState(false)
    return <HamburgerButton open={open} onToggle={() => setOpen((v) => !v)} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /menu/i })
    await expect(btn).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(btn)
    await expect(btn).toHaveAttribute('aria-expanded', 'true')
    await expect(btn).toHaveAccessibleName(/close menu/i)
  },
}
