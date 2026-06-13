import defaults from './dev.json'

/**
 * Port and host defaults live in `config/dev.json`.
 * Override them via `.env.development`, `.env.e2e`, or shell environment variables.
 *
 * | Variable | Purpose | Default |
 * | --- | --- | --- |
 * | `VITE_DEV_SERVER_HOST` / `DEV_HOST` | Host for Vite and tooling | `127.0.0.1` |
 * | `VITE_DEV_SERVER_PORT` | Vite dev server (Electron development) | `5173` |
 * | `E2E_SERVER_PORT` | Vite server for Playwright browser tests | `4173` |
 * | `STORYBOOK_PORT` | Storybook UI catalog | `6006` |
 * | `VITEST_STORYBOOK_BROWSER_PORT` | Vitest browser runner for Storybook | `42123` |
 * | `ELECTRON_REMOTE_DEBUG_PORT` | Chromium remote debugging in Electron | `9223` |
 * | `ELECTRON_INSPECT_PORT` | Node.js inspector for Electron main process | `9229` |
 */

export function isPlaywrightBrowserOnly(
  value: string | undefined = process.env.VITE_PLAYWRIGHT_BROWSER_ONLY
): boolean {
  return value === 'true' || value === '1'
}

function readPort(envKey: string, fallback: number) {
  const raw = process.env[envKey]

  if (raw === undefined) {
    return fallback
  }

  const parsed = Number(raw)

  return Number.isFinite(parsed) ? parsed : fallback
}

export const DEV_HOST = process.env.VITE_DEV_SERVER_HOST ?? process.env.DEV_HOST ?? defaults.host

export const DEV_SERVER_PORT = readPort('VITE_DEV_SERVER_PORT', defaults.devServerPort)
export const E2E_SERVER_PORT = readPort('E2E_SERVER_PORT', defaults.e2eServerPort)
export const STORYBOOK_PORT = readPort('STORYBOOK_PORT', defaults.storybookPort)
export const VITEST_STORYBOOK_BROWSER_PORT = readPort(
  'VITEST_STORYBOOK_BROWSER_PORT',
  defaults.vitestStorybookBrowserPort
)
export const ELECTRON_REMOTE_DEBUG_PORT = readPort(
  'ELECTRON_REMOTE_DEBUG_PORT',
  defaults.electronRemoteDebugPort
)
export const ELECTRON_INSPECT_PORT = readPort('ELECTRON_INSPECT_PORT', defaults.electronInspectPort)

export function localUrl(port: number, host: string = DEV_HOST) {
  return `http://${host}:${port}`
}

export const DEV_SERVER_URL = localUrl(DEV_SERVER_PORT)
export const E2E_BASE_URL = localUrl(E2E_SERVER_PORT)

export function resolveDevServerUrl() {
  return process.env.VITE_DEV_SERVER_URL ?? DEV_SERVER_URL
}
