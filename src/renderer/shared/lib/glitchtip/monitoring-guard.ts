import { getNavigatorOnline } from '@shared/lib'

let cloudModeCheck: (() => boolean) | null = null

/**
 * Registers a cloud-mode check used by monitoring guard decisions.
 * @param fn Returns true when cloud mode allows monitoring.
 */
export function setCloudModeMonitoringCheck(fn: () => boolean) {
  cloudModeCheck = fn
}

/**
 * Indicates whether monitoring calls should currently be sent.
 * @returns True when monitoring calls are allowed.
 */
export function isMonitoringEnabled(): boolean {
  if (!getNavigatorOnline()) {
    return false
  }

  return cloudModeCheck?.() ?? true
}

/**
 * Resets cloud-mode monitoring check (for tests).
 */
export function resetCloudModeMonitoringCheck() {
  cloudModeCheck = null
}
