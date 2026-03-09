import { describe, it, expect, vi } from 'vitest'
import { mapRule } from './map-rule'

describe('mapRule', () => {
  it('returns true if rule returns true', () => {
    const rule = vi.fn().mockReturnValue(true)
    const map = { error: 'translation.key' }
    const t = vi.fn()

    const mappedRule = mapRule(rule, map, t)

    const result = mappedRule('test')

    expect(result).toBe(true)
    expect(rule).toHaveBeenCalledWith('test')
    expect(t).not.toHaveBeenCalled()
  })

  it('translates mapped error key', () => {
    const rule = vi.fn().mockReturnValue('error')
    const map = { error: 'translation.key' }
    const t = vi.fn().mockReturnValue('Translated message')

    const mappedRule = mapRule(rule, map, t)

    const result = mappedRule('test')

    expect(result).toBe('Translated message')
    expect(t).toHaveBeenCalledWith('translation.key')
  })

  it('returns true if rule returns key not in map', () => {
    const rule = vi.fn().mockReturnValue('unknown')
    const map = { error: 'translation.key' }
    const t = vi.fn()

    const mappedRule = mapRule(rule, map, t)

    const result = mappedRule('test')

    expect(result).toBe(true)
    expect(t).not.toHaveBeenCalled()
  })

  it('passes undefined values to rule', () => {
    const rule = vi.fn().mockReturnValue(true)
    const map = {}
    const t = vi.fn()

    const mappedRule = mapRule(rule, map, t)

    mappedRule(undefined)

    expect(rule).toHaveBeenCalledWith(undefined)
  })
})
