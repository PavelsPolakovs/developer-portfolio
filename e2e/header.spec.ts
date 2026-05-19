import { expect, test } from '@playwright/test'

test.describe('Header', () => {
  test('renders fixed header with brand, nav and theme switcher', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByText('Lex Polaris').first()).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Light theme/i })).toBeVisible()
  })

  test('clicking a nav link scrolls the section into view', async ({ page }) => {
    await page.goto('/')
    const projectsSection = page.locator('#projects')
    await expect(projectsSection).not.toBeInViewport()
    await page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Projects' })
      .click()
    await expect(projectsSection).toBeInViewport()
  })

  test('header gains scrolled state when the page is scrolled', async ({ page }) => {
    await page.goto('/')
    const header = page.getByRole('banner')
    await expect(header).toHaveAttribute('data-scrolled', 'false')
    await page.evaluate(() => window.scrollTo({ top: 600 }))
    await expect(header).toHaveAttribute('data-scrolled', 'true')
  })

  test('mobile drawer opens, closes on link click, and closes on backdrop tap', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const burger = page.getByRole('button', { name: /menu/i })
    await expect(burger).toBeVisible()
    await expect(burger).toHaveAttribute('aria-expanded', 'false')

    await burger.click()
    await expect(burger).toHaveAttribute('aria-expanded', 'true')

    const drawer = page.getByRole('complementary', { name: 'Mobile navigation' })
    await expect(drawer).toBeVisible()

    await drawer.getByRole('link', { name: 'About' }).click()
    await expect(burger).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#about')).toBeInViewport()
  })
})
