import { expect, test } from '@playwright/test'

test.describe('Theme switcher', () => {
  test('switches theme on electron click and persists across reload', async ({ page }) => {
    await page.goto('/')

    const html = page.locator('html')
    await expect(html).toHaveClass(/theme-(light|dark|nord)/)

    await page.getByRole('button', { name: /Nord theme/i }).click()
    await expect(html).toHaveClass(/theme-nord/)
    await expect(page.getByRole('button', { name: /Nord theme/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await page.reload()
    await expect(page.locator('html')).toHaveClass(/theme-nord/)

    await page.getByRole('button', { name: /Light theme/i }).click()
    await expect(page.locator('html')).toHaveClass(/theme-light/)
  })
})
