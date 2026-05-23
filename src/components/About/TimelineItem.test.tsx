import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TimelineItem } from './TimelineItem'

const PROPS = {
  year: '2026',
  title: 'This Portfolio',
  description: 'Pulled everything best into one place',
  modalText: 'Some modal text.',
  active: false,
  onClick: vi.fn(),
}

describe('TimelineItem', () => {
  it('renders year, title and description', () => {
    render(<TimelineItem {...PROPS} />)
    expect(screen.getByTestId('timeline-year')).toHaveTextContent('2026')
    expect(screen.getByTestId('timeline-title')).toHaveTextContent('This Portfolio')
    expect(screen.getByTestId('timeline-desc')).toHaveTextContent(
      'Pulled everything best into one place',
    )
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<TimelineItem {...PROPS} onClick={onClick} />)
    await userEvent.click(screen.getByTestId('timeline-item'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('sets data-active attribute correctly', () => {
    const { rerender } = render(<TimelineItem {...PROPS} active={false} />)
    expect(screen.getByTestId('timeline-item')).toHaveAttribute('data-active', 'false')
    rerender(<TimelineItem {...PROPS} active={true} />)
    expect(screen.getByTestId('timeline-item')).toHaveAttribute('data-active', 'true')
  })
})
