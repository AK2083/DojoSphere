import { heartbeat } from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException } from '@shared/lib'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { checkHeartbeatConnectivity } from './check-heartbeat'

vi.mock('@shared/api', () => ({
  heartbeat: vi.fn()
}))

vi.mock('@shared/lib', () => ({
  captureException: vi.fn()
}))

describe('checkHeartbeatConnectivity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns success when heartbeat responds with ok status', async () => {
    vi.mocked(heartbeat).mockResolvedValue({
      data: { status: 'ok', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof heartbeat>>)

    const result = await checkHeartbeatConnectivity()

    expect(result).toStrictEqual({ success: true })
    expect(captureException).not.toHaveBeenCalled()
  })

  it('maps likely network errors to retry without exception capture', async () => {
    vi.mocked(heartbeat).mockResolvedValue({
      data: null,
      error: new Error('Failed to fetch')
    } as Awaited<ReturnType<typeof heartbeat>>)

    const result = await checkHeartbeatConnectivity()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(AppError)
      expect(result.error.code).toBe('shared.error.retry')
    }
    expect(captureException).not.toHaveBeenCalled()
  })

  it('captures unexpected invoke errors as unknown', async () => {
    vi.mocked(heartbeat).mockResolvedValue({
      data: null,
      error: new Error('Unexpected function error')
    } as Awaited<ReturnType<typeof heartbeat>>)

    const result = await checkHeartbeatConnectivity()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe('shared.error.unknown')
    }
    expect(captureException).toHaveBeenCalledTimes(1)
  })

  it('fails when payload status is not ok', async () => {
    vi.mocked(heartbeat).mockResolvedValue({
      data: { status: 'down', timestamp: '2026-05-20T10:00:00.000Z' },
      error: null
    } as Awaited<ReturnType<typeof heartbeat>>)

    const result = await checkHeartbeatConnectivity()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe('shared.error.unknown')
    }
    expect(captureException).toHaveBeenCalledTimes(1)
  })
})
