/** Resolved OTLP export settings for Grafana Cloud reachability checks. */
export type OtlpExportConfig = {
  /** Base OTLP HTTP endpoint without a trailing slash. */
  endpoint: string
  /** Optional request headers (e.g. Grafana Cloud authorization). */
  headers: Record<string, string>
}

const HEADER_PAIR_SEPARATOR = ','

/**
 * Parses `OTEL_EXPORTER_OTLP_HEADERS` (`key=value,key2=value2`).
 *
 * @param raw Raw header string from the environment.
 * @returns Header map for fetch requests.
 */
export function parseOtlpHeaders(raw: string | undefined): Record<string, string> {
  if (!raw?.trim()) {
    return {}
  }

  return raw.split(HEADER_PAIR_SEPARATOR).reduce<Record<string, string>>((headers, pair) => {
    const separatorIndex = pair.indexOf('=')

    if (separatorIndex <= 0) {
      return headers
    }

    const key = pair.slice(0, separatorIndex).trim()
    const value = pair.slice(separatorIndex + 1).trim()

    if (key) {
      try {
        headers[key] = decodeURIComponent(value)
      } catch {
        headers[key] = value
      }
    }

    return headers
  }, {})
}

/**
 * Reads Grafana Cloud OTLP settings from the main-process environment.
 *
 * @param env Process environment (defaults to `process.env`).
 * @returns Config when an endpoint is configured, otherwise null.
 */
export function readOtlpExportConfig(
  env: NodeJS.ProcessEnv = process.env
): OtlpExportConfig | null {
  const endpoint = env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim() ?? env.GRAFANA_OTLP_ENDPOINT?.trim()

  if (!endpoint) {
    return null
  }

  return {
    endpoint: endpoint.replace(/\/$/, ''),
    headers: parseOtlpHeaders(env.OTEL_EXPORTER_OTLP_HEADERS)
  }
}

/**
 * Resolves the URL used for Grafana Cloud reachability probes.
 *
 * @param config OTLP export configuration.
 * @param env Process environment (defaults to `process.env`).
 * @returns Absolute URL for a HEAD request.
 */
export function resolveGrafanaReachabilityUrl(
  config: OtlpExportConfig,
  env: NodeJS.ProcessEnv = process.env
): string {
  const override = env.GRAFANA_OTLP_HEALTH_URL?.trim()

  if (override) {
    return override
  }

  return `${config.endpoint}/v1/traces`
}
