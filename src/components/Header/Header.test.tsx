import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Header } from './Header'
import { SECTIONS } from './sections'
import { ThemeProvider } from '../../theme/ThemeProvider'

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, writable: true, configurable: true })
}

function renderWithFixtures() {
  const utils = render(
    <ThemeProvider initialTheme="light">
      <Header />
      <main>
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} style={{ height: '600px' }}>
            <h2>{s.label}</h2>
          </section>
        ))}
      </main>
    </ThemeProvider>,
  )
  return utils
}

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.className = ''
    document.body.style.overflow = ''
    // jsdom does not implement scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('renders brand and desktop nav links for every section', () => {
    renderWithFixtures()
    expect(screen.getByText('Lex Polaris')).toBeInTheDocument()
    for (const s of SECTIONS) {
      const links = screen.getAllByRole('link', { name: s.label })
      expect(links.length).toBeGreaterThan(0)
    }
  })

  it('marks one nav target as the active section', () => {
    renderWithFixtures()
    const allNavLinks = SECTIONS.flatMap((s) => screen.getAllByRole('link', { name: s.label }))
    const active = allNavLinks.filter((el) => el.getAttribute('aria-current') === 'true')
    expect(active.length).toBe(1)
  })

  it('hamburger toggles the mobile drawer aria-expanded state', async () => {
    const user = userEvent.setup()
    renderWithFixtures()
    const burger = screen.getByRole('button', { name: /open menu/i })
    expect(burger).toHaveAttribute('aria-expanded', 'false')
    await user.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'true')
    expect(burger).toHaveAccessibleName(/close menu/i)
  })

  it('clicking a nav link scrolls to its section and closes the drawer', async () => {
    const user = userEvent.setup()
    renderWithFixtures()
    const burger = screen.getByRole('button', { name: /open menu/i })
    await user.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'true')

    const aboutLinks = screen.getAllByRole('link', { name: 'About' })
    await user.click(aboutLinks[aboutLinks.length - 1])

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    expect(burger).toHaveAttribute('aria-expanded', 'false')
  })

  it('Escape closes the open drawer', async () => {
    const user = userEvent.setup()
    renderWithFixtures()
    const burger = screen.getByRole('button', { name: /open menu/i })
    await user.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(burger).toHaveAttribute('aria-expanded', 'false')
  })

  it('locks body scroll while the drawer is open', async () => {
    const user = userEvent.setup()
    renderWithFixtures()
    expect(document.body.style.overflow).toBe('')
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(document.body.style.overflow).toBe('hidden')
    await user.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('')
  })

  it('toggles data-scrolled on window scroll', () => {
    setScrollY(0)
    renderWithFixtures()
    const header = document.querySelector('header')!
    expect(header).toHaveAttribute('data-scrolled', 'false')

    act(() => {
      setScrollY(200)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(header).toHaveAttribute('data-scrolled', 'true')

    act(() => {
      setScrollY(0)
      window.dispatchEvent(new Event('scroll'))
    })
    expect(header).toHaveAttribute('data-scrolled', 'false')
  })

  it('renders custom brandName and brandMonogram', () => {
    render(
      <ThemeProvider initialTheme="light">
        <Header brandName="Aurora Studio" brandMonogram="AS" />
      </ThemeProvider>,
    )
    expect(screen.getByText('Aurora Studio')).toBeInTheDocument()
    expect(screen.getByText('AS')).toBeInTheDocument()
  })

  it('scrolls to hero when the brand link is clicked', async () => {
    const user = userEvent.setup()
    renderWithFixtures()
    const brandLinks = screen.getAllByRole('link', { name: /Lex Polaris/i })
    await user.click(brandLinks[0])
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
  })
})
