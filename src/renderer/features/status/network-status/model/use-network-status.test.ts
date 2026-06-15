import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNetworkStatus } from './use-network-status'

vi.mock('../../service/bootstrap-network-status', () => ({
  recheckNetworkStatusAfterFailedUserAction: vi.fn()
}))

vi.mock('../../model/use-status-state', () => ({
  useStatusState: vi.fn()
}))

describe('useNetworkStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns reactive status refs from status state', async () => {
    const { useStatusState } = await import('../../model/use-status-state')
    const isOnline = ref(true)
    const isCloudUsed = ref(false)

    vi.mocked(useStatusState).mockReturnValue({ isOnline, isCloudUsed })

    const result = useNetworkStatus()

    expect(result.isOnline).toBe(isOnline)
    expect(result.isCloudUsed).toBe(isCloudUsed)
  })

  it('forwards failed-action recheck to bootstrap service', async () => {
    const { useStatusState } = await import('../../model/use-status-state')
    const { recheckNetworkStatusAfterFailedUserAction } =
      await import('../../service/bootstrap-network-status')
    const isOnline = ref(false)
    const isCloudUsed = ref(false)

    vi.mocked(useStatusState).mockReturnValue({ isOnline, isCloudUsed })
    vi.mocked(recheckNetworkStatusAfterFailedUserAction).mockResolvedValue(true)

    const result = useNetworkStatus()
    const isReachable = await result.recheckAfterFailedUserAction()

    expect(isReachable).toBe(true)
    expect(recheckNetworkStatusAfterFailedUserAction).toHaveBeenCalledTimes(1)
  })
})
