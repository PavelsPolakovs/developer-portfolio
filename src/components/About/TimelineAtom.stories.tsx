import type { Meta, StoryObj } from '@storybook/react-vite'
import { TimelineAtom } from './TimelineAtom'

const meta = {
  title: 'Components/About/TimelineAtom',
  component: TimelineAtom,
  parameters: { layout: 'centered' },
  argTypes: {
    active: { control: 'boolean' },
  },
} satisfies Meta<typeof TimelineAtom>

export default meta
type Story = StoryObj<typeof meta>

export const Inactive: Story = {
  args: { active: false },
}

export const Active: Story = {
  args: { active: true },
}

export const AllThemes: Story = {
  name: 'All themes side-by-side',
  args: { active: false },
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-10">
      {(['light', 'dark', 'nord'] as const).map((theme) => (
        <div
          key={theme}
          className={`theme-${theme} flex flex-col items-center gap-4 rounded-2xl p-8`}
          style={{ background: 'var(--bg)' }}
        >
          <TimelineAtom active={false} />
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--muted)' }}
          >
            inactive
          </span>
          <TimelineAtom active={true} />
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--muted)' }}
          >
            active
          </span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: 'var(--muted)' }}
          >
            {theme}
          </span>
        </div>
      ))}
    </div>
  ),
}
