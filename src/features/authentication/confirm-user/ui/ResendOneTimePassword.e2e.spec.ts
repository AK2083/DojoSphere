import { expect, test } from '@playwright/test'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ResendOneTimePassword (confirm-user)', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders resend action on confirmation page', async ({ page }) => {
    await page.goto('/#/emailverification')

    const resendButton = page.getByRole('button', {
      name: /Send me a new confirmation code|Code erneut senden/
    })

    if ((await resendButton.count()) === 0) {
      await page.reload()
      await expect(page).toHaveURL(/#\/emailverification$/)
    }

    await expect(
      page.getByRole('button', {
        name: /Send me a new confirmation code|Code erneut senden/
      })
    ).toBeVisible()
  })
})
