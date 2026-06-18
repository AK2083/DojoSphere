let cloudModeCheck: (() => boolean) | null = null

/**
 * Registers a cloud-mode check reserved for future upload gating.
 * @param fn Returns true when cloud mode allows telemetry upload.
 */
export function setCloudModeMonitoringCheck(fn: () => boolean) {
  cloudModeCheck = fn
}

/**
 * Indicates whether telemetry should be captured locally.
 * @returns True when capture calls should proceed.
 */
export function shouldCaptureTelemetry(): boolean {
  return true
}

/**
 * Indicates whether cloud mode currently allows monitoring upload.
 * Upload gating is wired in a later issue; kept for App.vue registration.
 * @returns True when cloud mode check passes or is not registered.
 */
export function isCloudModeMonitoringAllowed(): boolean {
  return cloudModeCheck?.() ?? true
}

/**
 * Resets cloud-mode monitoring check (for tests).
 */
export function resetCloudModeMonitoringCheck() {
  cloudModeCheck = null
}
