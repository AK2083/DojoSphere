import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem
} from './local-storage'

describe('local-storage helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves JSON values', () => {
    setStorageItem('key', { value: 42 })

    const result = getStorageItem<{ value: number }>('key')

    expect(result).toEqual({ value: 42 })
  })

  it('returns null if key does not exist', () => {
    const result = getStorageItem('missing')

    expect(result).toBeNull()
  })

  it('returns null on invalid JSON', () => {
    localStorage.setItem('broken', 'eee')

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = getStorageItem('broken')

    expect(result).toBeNull()
    expect(warn).toHaveBeenCalled()

    warn.mockRestore()
  })

  it('removes item correctly', () => {
    setStorageItem('test', 'value')
    removeStorageItem('test')

    expect(localStorage.getItem('test')).toBeNull()
  })
})
