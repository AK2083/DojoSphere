import { describe, expect, it, vi } from 'vitest'

import { setEnglishLanguage } from './setup-language'

describe('setEnglishLanguage', () => {
  it('registers init script with language storage key', async () => {
    const addInitScript = vi.fn().mockResolvedValue(undefined)
    const page = { addInitScript } as unknown as Parameters<typeof setEnglishLanguage>[0]

    await setEnglishLanguage(page)

    expect(addInitScript).toHaveBeenCalledTimes(1)
    const [script, args] = addInitScript.mock.calls[0]

    expect(typeof script).toBe('function')
    expect(args).toEqual(['dojosphere.settings.language'])

    const setItemSpy = vi.spyOn(Object.getPrototypeOf(globalThis.localStorage), 'setItem')
    ;(script as (args: string[]) => void)(args)
    expect(setItemSpy).toHaveBeenCalledWith('dojosphere.settings.language', JSON.stringify('en'))
    setItemSpy.mockRestore()
  })
})
