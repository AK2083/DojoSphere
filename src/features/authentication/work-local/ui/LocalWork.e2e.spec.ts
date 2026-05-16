import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('LocalWork', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders local work action on datasource page', async ({ page }) => {
    await page.goto('/#/datasource')

    await expect(
      page.getByRole('button', { name: 'Continue without registration', exact: true })
    ).toBeVisible()
  })
})
