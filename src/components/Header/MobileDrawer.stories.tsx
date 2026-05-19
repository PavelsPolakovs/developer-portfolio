import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fireEvent, within } from 'storybook/test'
import { HamburgerButton } from './HamburgerButton'
import { MobileDrawer } from './MobileDrawer'
import { SECTIONS, type SectionId } from './sections'

const meta = {
  title: 'Components/Header/MobileDrawer',
  component: MobileDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  globals: {
    viewport: { value: 'mobile1' },
  },
  args: {
    open: false,
    sections: SECTIONS,
    activeId: 'hero' as SectionId,
    onClose: () => {},
    onSelect: () => {},
    lockBodyScroll: false,
  },
} satisfies Meta<typeof MobileDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  args: { open: false },
}

export const Open: Story = {
  args: { open: true, activeId: 'about' },
}

export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState<SectionId>('hero')
    return (
      <div className="bg-bg text-fg min-h-svh">
        <div className="flex items-center justify-between p-4">
          <HamburgerButton open={open} onToggle={() => setOpen((v) => !v)} controls="dr" />
          <span className="text-muted text-sm">Active: {active}</span>
        </div>
        <MobileDrawer
          id="dr"
          open={open}
          onClose={() => setOpen(false)}
          sections={SECTIONS}
          activeId={active}
          onSelect={(e, id) => {
            e.preventDefault()
            setActive(id)
            setOpen(false)
          }}
          lockBodyScroll={false}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const burger = canvas.getByRole('button', { name: /open menu/i })
    fireEvent.click(burger)
    await expect(burger).toHaveAttribute('aria-expanded', 'true')
  },
}
