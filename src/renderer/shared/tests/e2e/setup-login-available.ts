import type { Page } from '@playwright/test'
import { getAuthSessionStorageKey } from '@shared/api/supabase/model/auth-storage'

const AUTH_SESSION_KEY = getAuthSessionStorageKey()

const E2E_USER_ID = '00000000-0000-0000-0000-000000000001'
const E2E_ACCESS_TOKEN = 'e2e-access-token'

function createE2eSupabaseSessionPayload() {
  const expiresAt = Math.floor(Date.now() / 1000) + 3600
  const user = {
    id: E2E_USER_ID,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'e2e@example.com',
    app_metadata: { provider: 'email' },
    user_metadata: {}
  }

  return {
    access_token: E2E_ACCESS_TOKEN,
    refresh_token: 'e2e-refresh-token',
    expires_in: 3600,
    expires_at: expiresAt,
    token_type: 'bearer',
    user
  }
}

/**
 * Seeds a Supabase auth session in local storage before the app bootstraps.
 *
 * @param page - Playwright page instance.
 */
export async function setSupabaseAuthSessionInStorage(page: Page): Promise<void> {
  const session = createE2eSupabaseSessionPayload()

  await page.addInitScript(
    ([authSessionKey, serializedSession]) => {
      globalThis.localStorage?.setItem(authSessionKey, serializedSession)
    },
    [AUTH_SESSION_KEY, JSON.stringify(session)]
  )
}

/**
 * Prepares a persisted Supabase cloud session for browser e2e tests.
 *
 * Mocks auth endpoints so Supabase keeps the seeded session and emits INITIAL_SESSION.
 *
 * @param page - Playwright page instance.
 */
export async function mockSupabaseCloudAuthForE2e(page: Page): Promise<void> {
  const session = createE2eSupabaseSessionPayload()
  const serializedSession = JSON.stringify(session)

  await setSupabaseAuthSessionInStorage(page)

  await page.route('**/auth/v1/user**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: session.user })
    })
  })

  await page.route('**/auth/v1/token**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: serializedSession
    })
  })
}

/**
 * Clears the Supabase auth session from local storage before the app bootstraps.
 *
 * @param page - Playwright page instance.
 */
export async function clearSupabaseAuthSessionInStorage(page: Page): Promise<void> {
  await page.addInitScript(
    ([authSessionKey]) => {
      globalThis.localStorage?.removeItem(authSessionKey)
    },
    [AUTH_SESSION_KEY]
  )
}

/**
 * Mocks the Supabase heartbeat edge function as reachable.
 *
 * @param page - Playwright page instance.
 */
export async function mockHeartbeatSuccess(page: Page): Promise<void> {
  await page.route('**/functions/v1/heartbeat', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString()
      })
    })
  })
}

/**
 * Prepares a stable online login environment for browser e2e tests.
 *
 * @param page - Playwright page instance.
 */
export async function setupLoginAvailable(page: Page): Promise<void> {
  await mockHeartbeatSuccess(page)
}
