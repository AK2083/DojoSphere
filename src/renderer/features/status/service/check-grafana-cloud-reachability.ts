import type { GrafanaReachabilityResult } from '@shared/types/electron-api'

/**
 * Probes Grafana Cloud OTLP reachability through the main process.
 *
 * @returns Reachability result, or unreachable when Electron IPC is unavailable.
 */
export async function checkGrafanaCloudReachability(): Promise<GrafanaReachabilityResult> {
  const invoke = globalThis.window?.api?.checkGrafanaCloudReachability

  if (!invoke) {
    return { reachable: false, reason: 'not_configured' }
  }

  return await invoke()
}
