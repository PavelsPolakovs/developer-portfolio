import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { ThemeProvider } from './theme'

describe('App', () => {
  it('renders heading', () => {
    render(
      <ThemeProvider initialTheme="light">
        <App />
      </ThemeProvider>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Developer Portfolio')
  })
})
