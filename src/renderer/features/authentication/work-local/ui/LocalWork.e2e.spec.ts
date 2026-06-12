import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('LocalWork', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders local work form on datasource page', async ({ page }) => {
    await page.goto('/#/datasource')

    await expect(page.getByRole('textbox', { name: 'Username', exact: true })).toHaveValue(
      'TestUser'
    )
    await expect(
      page.getByRole('button', { name: 'Continue without registration', exact: true })
    ).toBeVisible()
  })

  test('shows validation hint when name has fewer than three letters', async ({ page }) => {
    await page.goto('/#/datasource')

    const nameField = page.getByRole('textbox', { name: 'Username', exact: true })
    await nameField.fill('ab')
    await nameField.blur()

    await expect(page.getByText('The name must contain at least 3 letters.')).toBeVisible()
  })
})
