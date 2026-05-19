import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, within } from 'storybook/test'
import { Header } from './Header'
import { SECTIONS } from './sections'

function MockSections() {
  return (
    <main className="bg-bg text-fg">
      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`border-border flex min-h-svh items-center justify-center ${
            i === 0 ? '' : 'border-t'
          } px-6`}
        >
          <div className="text-center">
            <p className="text-muted text-sm tracking-[0.2em] uppercase">Section {i + 1}</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">{s.label}</h2>
            <p className="text-muted mt-4 text-base">
              Scroll up and down to see header background, shadow and active link change.
            </p>
          </div>
        </section>
      ))}
    </main>
  )
}

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <MockSections />
      </>
    ),
  ],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomBrand: Story = {
  args: {
    brandName: 'Aurora Studio',
    brandMonogram: 'AS',
  },
}

export const MobileMenuOpen: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const burger = canvas.getByRole('button', { name: /open menu/i })
    fireEvent.click(burger)
    await expect(burger).toHaveAttribute('aria-expanded', 'true')
  },
}
