import { describe, it, expect, beforeEach } from 'vitest'
import { getThemeFromStorage, setThemeToStorage } from './theme-storage'
import { Theme } from '@shared/types/theme-modes'

describe('theme-storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores theme correctly', () => {
    setThemeToStorage(Theme.DARK)

    const stored = localStorage.getItem('thememode')

    expect(stored).toBe(JSON.stringify(Theme.DARK))
  })

  it('retrieves theme correctly', () => {
    localStorage.setItem('thememode', JSON.stringify(Theme.LIGHT))

    const result = getThemeFromStorage()

    expect(result).toBe(Theme.LIGHT)
  })

  it('returns null when theme is missing', () => {
    const result = getThemeFromStorage()

    expect(result).toBeNull()
  })
})
