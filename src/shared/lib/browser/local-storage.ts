export function getStorageItem<T>(key: string): T | null {
  const value = localStorage.getItem(key)

  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch {
    console.warn(`Invalid JSON in localStorage for key "${key}"`)
    return null
  }
}

export function setStorageItem<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageItem(key: string) {
  localStorage.removeItem(key)
}
