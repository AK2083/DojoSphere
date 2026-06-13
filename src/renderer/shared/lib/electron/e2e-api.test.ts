import { describe, expect, it } from 'vitest'

import { isPlaywrightBrowserOnly } from './e2e-api'

describe('isPlaywrightBrowserOnly', () => {
  it('returns true for enabled values', () => {
    expect(isPlaywrightBrowserOnly('true')).toBe(true)
    expect(isPlaywrightBrowserOnly('1')).toBe(true)
  })

  it('returns false when unset or disabled', () => {
    expect(isPlaywrightBrowserOnly(undefined)).toBe(false)
    expect(isPlaywrightBrowserOnly('false')).toBe(false)
    expect(isPlaywrightBrowserOnly('')).toBe(false)
  })
})
