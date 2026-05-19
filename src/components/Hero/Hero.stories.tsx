import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, within } from 'storybook/test'
import { Hero } from './Hero'

const meta = {
  title: 'Components/Hero/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
}

export const NordTheme: Story = {
  globals: { theme: 'nord' },
}

export const MobileLayout: Story = {
  globals: { viewport: { value: 'mobile1' } },
}

export const TabletLayout: Story = {
  globals: { viewport: { value: 'ipad' } },
}

export const HoverRevealsCopyButton: Story = {
  name: 'Hover — reveals Copy Animation button',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const wrapper = canvas.getByTestId('animation-wrapper')

    // default: card visible, overlay hidden
    await expect(canvas.getByTestId('hero-card-container')).toHaveClass('opacity-100')

    fireEvent.mouseEnter(wrapper)

    await expect(canvas.getByTestId('hero-card-container')).toHaveClass('opacity-0')
    const copyBtn = canvas.getByRole('button', { name: /copy animation/i })
    await expect(copyBtn.parentElement).toHaveClass('opacity-100')
  },
}

export const HoverThenLeave: Story = {
  name: 'Hover then leave — card restored',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const wrapper = canvas.getByTestId('animation-wrapper')

    fireEvent.mouseEnter(wrapper)
    await expect(canvas.getByTestId('hero-card-container')).toHaveClass('opacity-0')

    fireEvent.mouseLeave(wrapper)
    await expect(canvas.getByTestId('hero-card-container')).toHaveClass('opacity-100')
  },
}
