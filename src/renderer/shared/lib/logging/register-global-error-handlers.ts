import type { App } from 'vue'
import { isPlaywrightBrowserOnly } from '@shared/lib/electron/e2e-api'

import { logError } from './log-error'

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

/**
 * Registers Vue and window-level handlers that log unhandled renderer errors.
 *
 * @param app Root Vue application instance.
 */
export function registerGlobalErrorHandlers(app: App): void {
  if (isPlaywrightBrowserOnly()) {
    return
  }

  app.config.errorHandler = (error, _instance, info) => {
    logError(toError(error), 'vue', info || 'errorHandler')
  }

  globalThis.addEventListener('error', (event) => {
    logError(toError(event.error ?? event.message), 'renderer', 'window.error')
  })

  globalThis.addEventListener('unhandledrejection', (event) => {
    logError(toError(event.reason), 'renderer', 'unhandledrejection')
  })
}
