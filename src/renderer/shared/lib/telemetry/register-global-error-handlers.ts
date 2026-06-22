import type { App } from 'vue'
import { isPlaywrightBrowserOnly } from '@shared/lib/electron/e2e-api'

import { captureException } from './logging'

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

/**
 * Registers Vue and window-level handlers that capture unhandled renderer errors.
 *
 * @param app Root Vue application instance.
 */
export function registerGlobalErrorHandlers(app: App): void {
  if (isPlaywrightBrowserOnly()) {
    return
  }

  app.config.errorHandler = (error, _instance, info) => {
    captureException(toError(error), 'vue', info || 'errorHandler')
  }

  globalThis.addEventListener('error', (event) => {
    captureException(toError(event.error ?? event.message), 'renderer', 'window.error')
  })

  globalThis.addEventListener('unhandledrejection', (event) => {
    captureException(toError(event.reason), 'renderer', 'unhandledrejection')
  })
}
