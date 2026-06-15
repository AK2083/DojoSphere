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
  const localSessions = new Map<string, { userId: string; displayName: string }>()

  const api: ElectronAPI = {
    getUsers: async () => [],
    addUser: async () => ({ id: 'local-user-id', sessionToken: 'local-session-token' }),
    ensureLocalSession: async (displayName) => {
      const id = 'local-user-id'
      const sessionToken = 'local-session-token'

      localSessions.set(sessionToken, { userId: id, displayName })

      return {
        id,
        sessionToken,
        expiresAt: new Date(Date.now() + 86_400_000).toISOString()
      }
    },
    getLocalSession: async (token) => {
      const session = localSessions.get(token)

      if (!session) {
        return null
      }

      return {
        id: 'session-1',
        userId: session.userId,
        expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
        createdAt: new Date().toISOString(),
        user: {
          id: session.userId,
          displayName: session.displayName,
          email: null,
          userType: 'local',
          createdAt: new Date().toISOString(),
          updatedAt: null
        }
      }
    },
    revokeLocalSession: async () => undefined,
    dbHealthcheck: async () => ({ ok: true, version: 'playwright-browser' }),
    getOsUsername: async () => 'TestUser',
    ...overrides
  }

  globalThis.window.api = api
}
