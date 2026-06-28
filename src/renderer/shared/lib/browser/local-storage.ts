import { logError } from '../logging/log-error'

/**
 * Retrieves a value from browser localStorage and parses it as JSON.
 *
 * @template T
 * @param key - The storage key used to retrieve the value.
 * @returns The parsed value if present and valid, otherwise `null`.
 */
export function getStorageItem<T>(key: string): T | null {
  const storage = globalThis.localStorage

  const value = storage?.getItem(key)
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      logError(ex, 'browser', 'getStorageItem')
    }

    return null
  }
}

/**
 * Stores a value in browser localStorage.
 *
 * @template T
 * @param key - The storage key used to store the value.
 * @param value - The value to store. It will be JSON-stringified.
 */
export function setStorageItem<T>(key: string, value: T) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value))
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      logError(ex, 'browser', 'setStorageItem')
    }
  }
}

/**
 * Removes a value from browser localStorage.
 *
 * @param key - The storage key to remove.
 */
export function removeStorageItem(key: string) {
  globalThis.localStorage?.removeItem(key)
}
