import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useParticipantImport } from './use-participant-import'

const push = vi.fn()
let onUnmountedHandler: (() => void) | undefined

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    onUnmounted: (callback: () => void) => {
      onUnmountedHandler = callback
    }
  }
})

vi.mock('vue-router', () => ({
  useRouter: () => ({ push })
}))

describe('useParticipantImport', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    onUnmountedHandler = undefined
    push.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts on the first step with empty progress', () => {
    const { step, importProgress, isImportComplete, visibleResults } = useParticipantImport()

    expect(step.value).toBe(0)
    expect(importProgress.value).toBe(0)
    expect(isImportComplete.value).toBe(false)
    expect(visibleResults.value).toEqual([])
  })

  it('advances through the first two steps', () => {
    const { step, goNext } = useParticipantImport()

    goNext()
    expect(step.value).toBe(1)

    goNext()
    expect(step.value).toBe(2)
  })

  it('simulates import progress and reveals preview rows', async () => {
    const { goNext, importProgress, isImportComplete, visibleResults } = useParticipantImport()

    goNext()
    goNext()

    expect(importProgress.value).toBe(0)

    vi.advanceTimersByTime(200)
    await flushPromises()

    expect(importProgress.value).toBeGreaterThan(0)
    expect(visibleResults.value.length).toBeGreaterThan(0)

    vi.advanceTimersByTime(2000)
    await flushPromises()

    expect(importProgress.value).toBe(100)
    expect(isImportComplete.value).toBe(true)
    expect(visibleResults.value).toHaveLength(5)
  })

  it('navigates back to participants on finish and cancel', () => {
    const { finish, cancel } = useParticipantImport()

    finish()
    cancel()

    expect(push).toHaveBeenCalledTimes(2)
    expect(push).toHaveBeenCalledWith({ name: 'participants' })
  })

  it('ignores goNext after the import step has started', () => {
    const { step, goNext } = useParticipantImport()

    goNext()
    goNext()
    goNext()

    expect(step.value).toBe(2)
  })

  it('clears the progress interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const { goNext } = useParticipantImport()

    goNext()
    goNext()
    onUnmountedHandler?.()

    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
