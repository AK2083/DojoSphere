import { heartbeat } from '@shared/api'
import { AppError } from '@shared/errors'
import { captureException } from '@shared/lib'

export type HeartbeatCheckResult = { success: true } | { success: false; error: AppError }

function isLikelyNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase()

  return (
    message.includes('failed to fetch') ||
    message.includes('network error') ||
    message.includes('load failed') ||
    message.includes('network')
  )
}

function mapHeartbeatError(error: Error): AppError {
  if (isLikelyNetworkError(error)) {
    return new AppError('shared.error.retry')
  }

  return new AppError('shared.error.unknown', error.message)
}

/**
 * Checks backend reachability through the heartbeat edge function.
 *
 * This is a high-level network-status use-case that maps raw API failures
 * into application-level errors for UI/service consumers.
 * @returns Connectivity result with success state or mapped application error.
 */
export async function checkHeartbeatConnectivity(): Promise<HeartbeatCheckResult> {
  const { data, error } = await heartbeat()

  if (error) {
    const mappedError = mapHeartbeatError(error)

    if (mappedError.code !== 'shared.error.retry') {
      captureException(mappedError, 'network', 'checkHeartbeatConnectivity')
    }

    return {
      success: false,
      error: mappedError
    }
  }

  if (data?.status !== 'ok') {
    const payloadError = new AppError('shared.error.unknown', 'Invalid heartbeat response payload')
    captureException(payloadError, 'network', 'checkHeartbeatConnectivity')

    return {
      success: false,
      error: payloadError
    }
  }

  return { success: true }
}
