import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AboutSection } from './AboutSection'

describe('AboutSection', () => {
  it('renders the section heading', () => {
    render(<AboutSection />)
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })

  it('renders all four stats', () => {
    render(<AboutSection />)
    expect(screen.getByText('4+')).toBeInTheDocument()
    expect(screen.getByText('20+')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('∞')).toBeInTheDocument()
  })

  it('renders five timeline items', () => {
    render(<AboutSection />)
    expect(screen.getAllByTestId('timeline-item')).toHaveLength(5)
  })

  it('opens modal on timeline item click', async () => {
    render(<AboutSection />)
    const items = screen.getAllByTestId('timeline-item')
    await userEvent.click(items[0])
    expect(screen.getByTestId('modal-panel')).toBeInTheDocument()
  })

  it('closes modal when close button clicked', async () => {
    render(<AboutSection />)
    const items = screen.getAllByTestId('timeline-item')
    await userEvent.click(items[0])
    await userEvent.click(screen.getByTestId('modal-close'))
    expect(screen.queryByTestId('modal-panel')).not.toBeInTheDocument()
  })

  it('closes modal when backdrop clicked', async () => {
    render(<AboutSection />)
    const items = screen.getAllByTestId('timeline-item')
    await userEvent.click(items[0])
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(screen.queryByTestId('modal-panel')).not.toBeInTheDocument()
  })

  it('deactivates item when same item clicked again', async () => {
    render(<AboutSection />)
    const items = screen.getAllByTestId('timeline-item')
    await userEvent.click(items[0])
    expect(items[0]).toHaveAttribute('data-active', 'true')
    await userEvent.click(items[0])
    expect(items[0]).toHaveAttribute('data-active', 'false')
  })

  it('switches active item', async () => {
    render(<AboutSection />)
    const items = screen.getAllByTestId('timeline-item')
    await userEvent.click(items[0])
    expect(items[0]).toHaveAttribute('data-active', 'true')
    await userEvent.click(items[1])
    expect(items[0]).toHaveAttribute('data-active', 'false')
    expect(items[1]).toHaveAttribute('data-active', 'true')
  })

  it('shows year and title in modal', async () => {
    render(<AboutSection />)
    const items = screen.getAllByTestId('timeline-item')
    await userEvent.click(items[0])
    expect(screen.getByTestId('modal-panel')).toHaveTextContent('2026')
    expect(screen.getByTestId('modal-panel')).toHaveTextContent('This Portfolio')
  })
})
