import { ref } from 'vue'
import { recheckNetworkStatusAfterFailedUserAction, useNetworkStatusState } from '@shared/model'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useNetworkStatus } from './use-network-status'

vi.mock('@shared/model', () => ({
  useNetworkStatusState: vi.fn(),
  recheckNetworkStatusAfterFailedUserAction: vi.fn()
}))

describe('useNetworkStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns reactive status refs from shared model', () => {
    const isOnline = ref(true)
    const isCloudUsed = ref(false)

    vi.mocked(useNetworkStatusState).mockReturnValue({ isOnline, isCloudUsed })

    const result = useNetworkStatus()

    expect(result.isOnline).toBe(isOnline)
    expect(result.isCloudUsed).toBe(isCloudUsed)
  })

  it('forwards failed-action recheck to shared model', async () => {
    const isOnline = ref(false)
    const isCloudUsed = ref(false)

    vi.mocked(useNetworkStatusState).mockReturnValue({ isOnline, isCloudUsed })
    vi.mocked(recheckNetworkStatusAfterFailedUserAction).mockResolvedValue(true)

    const result = useNetworkStatus()
    const isReachable = await result.recheckAfterFailedUserAction()

    expect(isReachable).toBe(true)
    expect(recheckNetworkStatusAfterFailedUserAction).toHaveBeenCalledTimes(1)
  })
})
