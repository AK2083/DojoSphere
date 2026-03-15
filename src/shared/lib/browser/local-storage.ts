import { captureException } from '../glitchtip/logging'

/**
 * Retrieves a value from browser localStorage and parses it as JSON.
 *
 * If the stored value exists, it will be parsed and returned as the
 * specified generic type `T`. If the value does not exist or JSON
 * parsing fails, `null` is returned.
 *
 * Any parsing errors are captured via {@link captureException}.
 *
 * @template T
 * @param {string} key - The storage key used to retrieve the value.
 *
 * @returns {T | null} The parsed value if present and valid, otherwise `null`.
 */
export function getStorageItem<T>(key: string): T | null {
  const value = localStorage.getItem(key)
  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      captureException(ex, 'browser', 'getStorageItem')
    }

    return null
  }
}

/**
 * Stores a value in browser localStorage.
 *
 * The value is serialized to JSON before being stored.
 * If serialization or storage fails, the error is captured
 * via {@link captureException}.
 *
 * @template T
 * @param {string} key - The storage key used to store the value.
 * @param {T} value - The value to store. It will be JSON-stringified.
 */
export function setStorageItem<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      captureException(ex, 'browser', 'setStorageItem')
    }
  }
}

/**
 * Removes a value from browser localStorage.
 *
 * @param {string} key - The storage key to remove.
 */
export function removeStorageItem(key: string) {
  localStorage.removeItem(key)
}
