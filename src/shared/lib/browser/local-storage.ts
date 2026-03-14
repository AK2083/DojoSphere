import { captureException } from '../glitchtip/logging'

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

export function setStorageItem<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      captureException(ex, 'browser', 'setStorageItem')
    }

    return null
  }
}

export function removeStorageItem(key: string) {
  localStorage.removeItem(key)
}
