import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {
  ATTR_SERVICE_NAME,
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME
} from '@opentelemetry/semantic-conventions'
import { BatchSpanProcessor, NodeTracerProvider } from '@opentelemetry/sdk-trace-node'

import { logInformation, MONITORING_EVENTS } from '../monitoring/monitoring'

/** Options for initializing main-process OpenTelemetry tracing. */
export type NodeTelemetryOptions = {
  environment: string
  otlpEndpoint: string
}

/** Handle for the main-process OpenTelemetry tracer provider. */
export type NodeTelemetryHandle = {
  provider: NodeTracerProvider
}

/**
 * Initializes OpenTelemetry tracing for the Electron main process.
 *
 * @param options Service metadata and OTLP export endpoint.
 * @returns Node tracer provider handle for shutdown.
 */
export function initNodeTelemetry(options: NodeTelemetryOptions): NodeTelemetryHandle {
  const provider = new NodeTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'dojosphere-main',
      [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: options.environment
    }),
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: `${options.otlpEndpoint}/v1/traces`
        })
      )
    ]
  })

  provider.register()

  logInformation(MONITORING_EVENTS.NODE_TRACER_INITIALIZED, {
    environment: options.environment,
    otlpEndpoint: options.otlpEndpoint
  })

  return { provider }
}

/**
 * Shuts down the main-process tracer provider.
 *
 * @param handle Provider handle returned by {@link initNodeTelemetry}.
 * @returns Resolves when span processors have finished flushing.
 */
export async function shutdownNodeTelemetry(handle: NodeTelemetryHandle): Promise<void> {
  await handle.provider.shutdown()
}
