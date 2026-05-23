/**
 * Determines if browser globals are available.
 * @returns True when running in a browser-like environment.
 */
export function isBrowserRuntime(): boolean {
  return typeof globalThis.window !== 'undefined' && typeof globalThis.navigator !== 'undefined'
}

/**
 * Reads the online state of the navigator.
 * If browser globals are not available, returns false.
 * @returns True when the navigator is online, otherwise false.
 */
export function getNavigatorOnline(): boolean {
  return isBrowserRuntime() ? globalThis.navigator.onLine : false
}
