import { describe, it, expect, vi, type Mock } from 'vitest'
import { useTranslation } from './use-translation'
import { useI18n } from 'vue-i18n'

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn()
}))

describe('useTranslation', () => {
  it('returns t and locale from useI18n', () => {
    const tMock = vi.fn()
    const localeMock = 'en'

    ;(useI18n as Mock).mockReturnValue({
      t: tMock,
      locale: localeMock
    })

    const result = useTranslation()

    expect(useI18n).toHaveBeenCalledTimes(1)
    expect(result.t).toBe(tMock)
    expect(result.locale).toBe(localeMock)
  })
})
