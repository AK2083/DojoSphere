import type { Router } from 'vue-router'
import { ZoneContextManager } from '@opentelemetry/context-zone'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import {
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_SERVICE_NAME
} from '@opentelemetry/semantic-conventions'
import { isPlaywrightBrowserOnly } from '@shared/lib/electron/e2e-api'

import { LOCAL_OTLP_TRACES_URL } from './constants'

/**
 * Initializes OpenTelemetry tracing for the renderer process.
 *
 * In Electron, spans export to the local OTLP collector on localhost.
 * In Playwright browser-only mode, telemetry is disabled.
 *
 * @param _router Vue Router instance (activity-logging scope is bound in the app composition root).
 * @param environmentMode Application environment label.
 */
export function initLoggingProvider(_router: Router, environmentMode: string): void {
  if (isPlaywrightBrowserOnly()) {
    return
  }

  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'dojosphere-renderer',
      [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: environmentMode
    }),
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: LOCAL_OTLP_TRACES_URL
        })
      )
    ]
  })

  provider.register({
    contextManager: new ZoneContextManager()
  })
}
