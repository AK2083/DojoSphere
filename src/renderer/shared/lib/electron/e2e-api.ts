import type { ElectronAPI } from '@shared/types/electron-api'

/**
 * Whether the renderer runs in Playwright browser-only mode (without Electron).
 *
 * @param value - Raw env value; defaults to `import.meta.env.VITE_PLAYWRIGHT_BROWSER_ONLY`.
 * @returns `true` when Playwright serves the renderer in a browser and `window.api` is stubbed.
 */
export function isPlaywrightBrowserOnly(
  value: string | undefined = import.meta.env.VITE_PLAYWRIGHT_BROWSER_ONLY
): boolean {
  return value === 'true' || value === '1'
}

/**
 * Installs a stub `window.api` when Playwright runs the renderer in a browser
 * without Electron (see `VITE_PLAYWRIGHT_BROWSER_ONLY` in `.env.e2e`).
 *
 * @param overrides - Optional API method overrides (e.g. custom `getOsUsername` in Storybook).
 */
export function installPlaywrightBrowserElectronApi(overrides: Partial<ElectronAPI> = {}) {
  const api: ElectronAPI = {
    getUsers: async () => [],
    addUser: async () => ({ id: 'local-user-id', sessionToken: 'local-session-token' }),
    getLocalSession: async () => null,
    revokeLocalSession: async () => undefined,
    dbHealthcheck: async () => ({ ok: true, version: 'playwright-browser' }),
    getOsUsername: async () => 'TestUser',
    ...overrides
  }

  globalThis.window.api = api
}
