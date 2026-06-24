import { useNetworkStatusState } from '@shared/model/connectivity-state'

let cloudModeCheck: (() => boolean) | null = null
let autoUploadDiagnosticsCheck: (() => boolean) | null = null

/**
 * Registers a cloud-mode check reserved for upload gating.
 *
 * @param fn Returns true when cloud mode allows telemetry upload.
 */
export function setCloudModeMonitoringCheck(fn: () => boolean) {
  cloudModeCheck = fn
}

/**
 * Registers a check for automatic diagnostic upload preference.
 *
 * @param fn Returns true when auto-upload is enabled in settings.
 */
export function setAutoUploadDiagnosticsCheck(fn: () => boolean) {
  autoUploadDiagnosticsCheck = fn
}

/**
 * Indicates whether telemetry should be captured locally.
 *
 * @returns True when capture calls should proceed.
 */
export function shouldCaptureTelemetry(): boolean {
  return true
}

/**
 * Indicates whether cloud mode currently allows monitoring upload.
 *
 * @returns True when cloud mode check passes or is not registered.
 */
export function isCloudModeMonitoringAllowed(): boolean {
  return cloudModeCheck?.() ?? true
}

/**
 * Indicates whether automatic diagnostic upload is enabled.
 *
 * @returns True when the auto-upload check passes or is not registered.
 */
export function isAutoUploadDiagnosticsEnabled(): boolean {
  return autoUploadDiagnosticsCheck?.() ?? false
}

/**
 * Indicates whether telemetry upload to Grafana Cloud should proceed.
 *
 * @returns True when auto-upload is enabled and Grafana Cloud is reachable.
 */
export function shouldUploadTelemetry(): boolean {
  if (!isAutoUploadDiagnosticsEnabled()) {
    return false
  }

  return useNetworkStatusState().isGrafanaCloudReachable.value
}

/**
 * Resets monitoring checks (for tests).
 */
export function resetCloudModeMonitoringCheck() {
  cloudModeCheck = null
  autoUploadDiagnosticsCheck = null
}
