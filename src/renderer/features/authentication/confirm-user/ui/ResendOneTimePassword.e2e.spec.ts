import { expect, test } from '@playwright/test'
import { gotoHashRoute } from '@shared/tests/e2e/navigation'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'

test.describe('ResendOneTimePassword (confirm-user)', () => {
  test.beforeEach(async ({ page }) => {
    await setEnglishLanguage(page)
  })

  test('renders resend action on confirmation page', async ({ page }) => {
    await gotoHashRoute(page, '/#/emailverification')

    await expect(
      page.getByRole('button', {
        name: /Send me a new confirmation code|Code erneut senden/
      })
    ).toBeVisible()
  })
})
