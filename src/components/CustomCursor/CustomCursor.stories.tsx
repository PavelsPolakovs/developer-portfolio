import type { Meta, StoryObj } from '@storybook/react-vite'
import { CustomCursor } from './CustomCursor'

const meta = {
  title: 'Components/CustomCursor',
  component: CustomCursor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Move your mouse over the canvas to see the atom cursor. Hover over the links and button below to trigger the active state.',
      },
    },
  },
} satisfies Meta<typeof CustomCursor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="bg-bg flex min-h-screen flex-col items-center justify-center gap-8">
      <CustomCursor />
      <p className="text-muted font-mono text-sm">Move your mouse to see the cursor</p>
      <div className="flex gap-4">
        <a href="#" className="text-accent underline">
          Hover → active state
        </a>
        <button type="button" className="border-border rounded border px-4 py-2 text-sm">
          Button → active state
        </button>
      </div>
    </div>
  ),
}

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
  render: Default.render,
}

export const NordTheme: Story = {
  globals: { theme: 'nord' },
  render: Default.render,
}
