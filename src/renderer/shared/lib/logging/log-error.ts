import { isPlaywrightBrowserOnly } from '@shared/lib/electron/e2e-api'

function resolveErrorCode(error: Error): string | undefined {
  if ('code' in error && typeof error.code === 'string') {
    return error.code
  }

  return undefined
}

/**
 * Records an application error via the trusted main-process logger.
 *
 * @param error Error that occurred.
 * @param service Logical service or module name.
 * @param action Action that failed.
 */
export function logError(error: Error, service: string, action: string): void {
  const code = resolveErrorCode(error)
  const payload = {
    service,
    action,
    code,
    message: error.message
  }

  if (globalThis.window.api?.recordError) {
    void globalThis.window.api.recordError(payload)
    return
  }

  if (!isPlaywrightBrowserOnly()) {
    console.error(`[dojosphere:${service}]`, action, payload)
  }
}
