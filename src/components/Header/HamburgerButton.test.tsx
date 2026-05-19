import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HamburgerButton } from './HamburgerButton'

describe('HamburgerButton', () => {
  it('renders three decorative bars', () => {
    render(<HamburgerButton open={false} onToggle={() => {}} />)
    const btn = screen.getByRole('button', { name: /open menu/i })
    expect(btn.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3)
  })

  it('exposes open / closed state via aria-expanded, aria-label and data-state', () => {
    const { rerender } = render(<HamburgerButton open={false} onToggle={() => {}} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(btn).toHaveAccessibleName(/open menu/i)
    expect(btn).toHaveAttribute('data-state', 'closed')

    rerender(<HamburgerButton open={true} onToggle={() => {}} />)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(btn).toHaveAccessibleName(/close menu/i)
    expect(btn).toHaveAttribute('data-state', 'open')
  })

  it('animates bars into an X when open (rotation + middle hidden)', () => {
    const { rerender } = render(<HamburgerButton open={false} onToggle={() => {}} />)
    const top = document.querySelector('[data-bar="top"]') as HTMLElement
    const middle = document.querySelector('[data-bar="middle"]') as HTMLElement
    const bottom = document.querySelector('[data-bar="bottom"]') as HTMLElement

    expect(top.className).not.toMatch(/rotate-45/)
    expect(middle.className).not.toMatch(/opacity-0/)
    expect(bottom.className).not.toMatch(/-rotate-45/)

    rerender(<HamburgerButton open={true} onToggle={() => {}} />)
    expect(top.className).toMatch(/rotate-45/)
    expect(middle.className).toMatch(/opacity-0/)
    expect(bottom.className).toMatch(/-rotate-45/)
  })

  it('calls onToggle on click and on Enter', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<HamburgerButton open={false} onToggle={onToggle} />)
    const btn = screen.getByRole('button')
    await user.click(btn)
    btn.focus()
    await user.keyboard('{Enter}')
    expect(onToggle).toHaveBeenCalledTimes(2)
  })

  it('wires aria-controls to the matching drawer id', () => {
    render(<HamburgerButton open={false} onToggle={() => {}} controls="drawer-123" />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'drawer-123')
  })

  it('supports custom labels', () => {
    const { rerender } = render(
      <HamburgerButton
        open={false}
        onToggle={() => {}}
        labels={{ open: 'Развернуть меню', close: 'Свернуть меню' }}
      />,
    )
    expect(screen.getByRole('button')).toHaveAccessibleName('Развернуть меню')
    rerender(
      <HamburgerButton
        open={true}
        onToggle={() => {}}
        labels={{ open: 'Развернуть меню', close: 'Свернуть меню' }}
      />,
    )
    expect(screen.getByRole('button')).toHaveAccessibleName('Свернуть меню')
  })
})
