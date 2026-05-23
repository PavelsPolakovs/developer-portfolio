import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillsSection } from './SkillsSection'

const meta = {
  title: 'Components/Skills/SkillsSection',
  component: SkillsSection,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SkillsSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DarkTheme: Story = {
  globals: { theme: 'dark' },
}

export const NordTheme: Story = {
  globals: { theme: 'nord' },
}
