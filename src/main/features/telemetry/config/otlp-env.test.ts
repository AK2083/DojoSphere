import { describe, expect, it } from 'vitest'

import { parseOtlpHeaders, readOtlpExportConfig, resolveGrafanaReachabilityUrl } from './otlp-env'

describe('otlp-env', () => {
  it('returns null when no OTLP endpoint is configured', () => {
    expect(readOtlpExportConfig({})).toBeNull()
  })

  it('reads standard OTLP endpoint and headers from the environment', () => {
    const config = readOtlpExportConfig({
      OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otlp.example.com/otlp/',
      OTEL_EXPORTER_OTLP_HEADERS: 'Authorization=Basic abc123, X-Test=1'
    })

    expect(config).toEqual({
      endpoint: 'https://otlp.example.com/otlp',
      headers: {
        Authorization: 'Basic abc123',
        'X-Test': '1'
      }
    })
  })

  it('falls back to GRAFANA_OTLP_ENDPOINT when OTEL endpoint is missing', () => {
    const config = readOtlpExportConfig({
      GRAFANA_OTLP_ENDPOINT: 'https://grafana.example/otlp'
    })

    expect(config?.endpoint).toBe('https://grafana.example/otlp')
  })

  it('parses OTLP headers and resolves the default health URL', () => {
    expect(parseOtlpHeaders('Authorization=Basic token')).toEqual({
      Authorization: 'Basic token'
    })

    const config = readOtlpExportConfig({
      OTEL_EXPORTER_OTLP_ENDPOINT: 'https://otlp.example.com'
    })

    expect(resolveGrafanaReachabilityUrl(config!)).toBe('https://otlp.example.com/v1/traces')
    expect(
      resolveGrafanaReachabilityUrl(config!, {
        GRAFANA_OTLP_HEALTH_URL: 'https://health.example/ping'
      })
    ).toBe('https://health.example/ping')
  })

  it('ignores malformed OTLP header pairs', () => {
    expect(parseOtlpHeaders('invalid,Authorization=token')).toEqual({
      Authorization: 'token'
    })
    expect(parseOtlpHeaders('=value')).toEqual({})
    expect(parseOtlpHeaders(' =token,Authorization=token')).toEqual({
      Authorization: 'token'
    })
  })
})
