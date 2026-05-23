import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fireEvent, within } from 'storybook/test'
import { AboutSection } from './AboutSection'

const meta = {
  title: 'Components/About/AboutSection',
  component: AboutSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AboutSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
}

export const NordTheme: Story = {
  globals: { theme: 'nord' },
}

export const ClickOpensModal: Story = {
  name: 'Click timeline item — opens modal',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByTestId('timeline-item')
    fireEvent.click(items[0])
    await expect(canvas.getByTestId('modal-panel')).toBeInTheDocument()
  },
}

export const CloseModalWithButton: Story = {
  name: 'Close modal with button',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByTestId('timeline-item')
    fireEvent.click(items[0])
    const closeBtn = canvas.getByTestId('modal-close')
    fireEvent.click(closeBtn)
    await expect(canvas.queryByTestId('modal-panel')).not.toBeInTheDocument()
  },
}

export const CloseModalWithBackdrop: Story = {
  name: 'Close modal with backdrop click',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const items = canvas.getAllByTestId('timeline-item')
    fireEvent.click(items[1])
    const backdrop = canvas.getByTestId('modal-backdrop')
    fireEvent.click(backdrop)
    await expect(canvas.queryByTestId('modal-panel')).not.toBeInTheDocument()
  },
}
