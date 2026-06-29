import { getAuthSessionStorageKey } from '@shared/api/supabase/model/auth-storage'
import { expect, test } from '@shared/tests/e2e/fixtures'
import { setEnglishLanguage } from '@shared/tests/e2e/setup-language'
import { mockSupabaseCloudAuthForE2e } from '@shared/tests/e2e/setup-login-available'

const AUTH_SESSION_KEY = getAuthSessionStorageKey()

test.describe('CloudStatus', () => {
  test('displays cloud mode from supabase auth storage', async ({ page }) => {
    await setEnglishLanguage(page)
    await mockSupabaseCloudAuthForE2e(page)

    await page.goto('/#/dashboard')

    await expect(page.getByTestId('cloud-status-chip')).toHaveAttribute('aria-label', 'Cloud')
  })

  test('displays local mode without supabase auth storage', async ({ page }) => {
    await setEnglishLanguage(page)
    await page.addInitScript(
      ([authSessionKey]) => {
        globalThis.localStorage?.removeItem(authSessionKey)
      },
      [AUTH_SESSION_KEY]
    )

    await page.goto('/#/dashboard')

    await expect(page.getByTestId('cloud-status-chip')).toHaveAttribute('aria-label', 'Local')
  })
})
