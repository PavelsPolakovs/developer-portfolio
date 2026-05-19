import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MobileDrawer } from './MobileDrawer'
import { SECTIONS, type SectionId } from './sections'

type Handlers = {
  onClose: ReturnType<typeof vi.fn>
  onSelect: ReturnType<typeof vi.fn>
}

function setup(open: boolean, activeId: SectionId = 'hero'): Handlers {
  const onClose = vi.fn()
  const onSelect = vi.fn((e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault())
  render(
    <MobileDrawer
      id="drawer-test"
      open={open}
      onClose={onClose}
      sections={SECTIONS}
      activeId={activeId}
      onSelect={onSelect}
    />,
  )
  return { onClose, onSelect }
}

describe('MobileDrawer', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('hides drawer contents from the a11y tree when closed', () => {
    setup(false)
    // aside is aria-hidden="true" when closed; getByRole respects that
    expect(screen.queryByRole('complementary', { name: 'Mobile navigation' })).toBeNull()
  })

  it('renders the panel and one link per section when open', () => {
    setup(true)
    const panel = screen.getByRole('complementary', { name: 'Mobile navigation' })
    expect(panel).toBeInTheDocument()
    for (const s of SECTIONS) {
      expect(screen.getByRole('link', { name: s.label })).toBeInTheDocument()
    }
  })

  it('marks the active section with aria-current', () => {
    setup(true, 'skills')
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('link', { name: 'Hero' })).not.toHaveAttribute('aria-current')
  })

  it('calls onSelect when a link is clicked', async () => {
    const user = userEvent.setup()
    const { onSelect } = setup(true)
    await user.click(screen.getByRole('link', { name: 'Projects' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect.mock.calls[0][1]).toBe('projects')
  })

  it('calls onClose when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    const { onClose } = setup(true)
    const backdrop = document.querySelector('[data-state="open"][aria-hidden="true"]')
    expect(backdrop).not.toBeNull()
    await user.click(backdrop as HTMLElement)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed while open', async () => {
    const user = userEvent.setup()
    const { onClose } = setup(true)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('does not bind Escape when closed', async () => {
    const user = userEvent.setup()
    const { onClose } = setup(false)
    await user.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('locks body scroll while open and restores on close', () => {
    expect(document.body.style.overflow).toBe('')
    const { unmount } = render(
      <MobileDrawer
        open={true}
        onClose={() => {}}
        sections={SECTIONS}
        activeId="hero"
        onSelect={() => {}}
      />,
    )
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('lockBodyScroll=false leaves body overflow untouched', () => {
    expect(document.body.style.overflow).toBe('')
    render(
      <MobileDrawer
        open={true}
        onClose={() => {}}
        sections={SECTIONS}
        activeId="hero"
        onSelect={() => {}}
        lockBodyScroll={false}
      />,
    )
    expect(document.body.style.overflow).toBe('')
  })
})
