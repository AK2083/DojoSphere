import {
  readOtlpExportConfig,
  resolveGrafanaReachabilityUrl,
  type OtlpExportConfig
} from '../config/otlp-env'

/** Outcome of probing Grafana Cloud OTLP reachability. */
export type GrafanaReachabilityResult =
  | { reachable: true }
  | { reachable: false; reason: 'not_configured' | 'request_failed' }

const GRAFANA_REACHABILITY_TIMEOUT_MS = 5_000

type FetchLike = typeof fetch

/**
 * Returns true when the HTTP status indicates the ingest endpoint responded.
 *
 * @param status HTTP response status code.
 * @returns True for responses that prove network reachability.
 */
export function isGrafanaReachabilityStatus(status: number): boolean {
  return status > 0 && status < 500
}

/**
 * Probes Grafana Cloud OTLP ingest reachability with a HEAD request.
 *
 * @param options Optional fetch implementation and environment overrides (for tests).
 * @param options.fetchImpl
 * @param options.env
 * @returns Reachability result without exposing credentials.
 */
export async function checkGrafanaCloudReachability(options?: {
  fetchImpl?: FetchLike
  env?: NodeJS.ProcessEnv
}): Promise<GrafanaReachabilityResult> {
  const config = readOtlpExportConfig(options?.env)

  if (!config) {
    return { reachable: false, reason: 'not_configured' }
  }

  const fetchImpl = options?.fetchImpl ?? fetch
  const url = resolveGrafanaReachabilityUrl(config, options?.env)

  try {
    const response = await fetchImpl(url, {
      method: 'HEAD',
      headers: buildReachabilityHeaders(config),
      signal: AbortSignal.timeout(GRAFANA_REACHABILITY_TIMEOUT_MS)
    })

    if (!isGrafanaReachabilityStatus(response.status)) {
      return { reachable: false, reason: 'request_failed' }
    }

    return { reachable: true }
  } catch {
    return { reachable: false, reason: 'request_failed' }
  }
}

function buildReachabilityHeaders(config: OtlpExportConfig): Record<string, string> {
  return { ...config.headers }
}
