import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

const USERNAME_LABEL = 'Username'
const SUBMIT_LABEL = 'Continue without registration'
const REQUIRED_MESSAGE = 'Please enter a name.'
const MIN_LETTERS_MESSAGE = 'The name must contain at least 3 letters.'

test.describe('LocalWork', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders local work form on datasource page', async ({ page }) => {
    await page.goto('/#/datasource')

    await expect(page.getByRole('textbox', { name: USERNAME_LABEL, exact: true })).toHaveValue(
      'TestUser'
    )
    await expect(page.getByRole('button', { name: SUBMIT_LABEL, exact: true })).toBeVisible()
  })
})

test.describe('LocalWork display name', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
    await page.goto('/#/datasource')
    await expect(page.getByRole('textbox', { name: USERNAME_LABEL, exact: true })).toHaveValue(
      'TestUser'
    )
  })

  test('shows required validation when the name is cleared', async ({ page }) => {
    const nameField = page.getByRole('textbox', { name: USERNAME_LABEL, exact: true })

    await nameField.fill('')
    await nameField.blur()

    await expect(page.getByText(REQUIRED_MESSAGE)).toBeVisible()
  })

  test('shows validation hint when name has fewer than three letters', async ({ page }) => {
    const nameField = page.getByRole('textbox', { name: USERNAME_LABEL, exact: true })

    await nameField.fill('ab')
    await nameField.blur()

    await expect(page.getByText(MIN_LETTERS_MESSAGE)).toBeVisible()
  })

  test('shows validation hint when digits do not count toward letter minimum', async ({ page }) => {
    const nameField = page.getByRole('textbox', { name: USERNAME_LABEL, exact: true })

    await nameField.fill('ab1')
    await nameField.blur()

    await expect(page.getByText(MIN_LETTERS_MESSAGE)).toBeVisible()
  })

  test('accepts a name with at least three letters', async ({ page }) => {
    const nameField = page.getByRole('textbox', { name: USERNAME_LABEL, exact: true })

    await nameField.fill('Ada')
    await nameField.blur()

    await expect(page.getByText(REQUIRED_MESSAGE)).toHaveCount(0)
    await expect(page.getByText(MIN_LETTERS_MESSAGE)).toHaveCount(0)
  })

  test('shows validation on submit when display name is too short', async ({ page }) => {
    const nameField = page.getByRole('textbox', { name: USERNAME_LABEL, exact: true })

    await nameField.fill('xy')
    await page.getByRole('button', { name: SUBMIT_LABEL, exact: true }).click()

    await expect(page.getByText(MIN_LETTERS_MESSAGE)).toBeVisible()
  })
})
