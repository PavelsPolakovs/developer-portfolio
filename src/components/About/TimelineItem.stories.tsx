import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TimelineItem } from './TimelineItem'

const SAMPLE = {
  year: '2026',
  title: 'This Portfolio',
  description: 'Pulled everything best into one place',
  modalText: 'Sample modal text.',
}

const meta = {
  title: 'Components/About/TimelineItem',
  component: TimelineItem,
  parameters: { layout: 'centered' },
  args: { onClick: fn() },
} satisfies Meta<typeof TimelineItem>

export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {
  args: { ...SAMPLE, active: false },
}

export const Active: Story = {
  args: { ...SAMPLE, active: true },
}

export const AllThemes: Story = {
  name: 'All themes side-by-side',
  args: { ...SAMPLE, active: false },
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['light', 'dark', 'nord'] as const).map((theme) => (
        <div
          key={theme}
          className={`theme-${theme} rounded-2xl p-8`}
          style={{ background: 'var(--bg)' }}
        >
          <p
            className="mb-4 font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--muted)' }}
          >
            {theme}
          </p>
          <div className="flex flex-col gap-6">
            <TimelineItem {...SAMPLE} active={false} onClick={args.onClick} />
            <TimelineItem {...SAMPLE} active={true} onClick={args.onClick} />
          </div>
        </div>
      ))}
    </div>
  ),
}
