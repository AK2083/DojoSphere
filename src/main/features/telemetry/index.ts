export { registerTelemetryIpc } from './ipc/register'
export { checkGrafanaCloudReachability } from './service/grafana-reachability'
export type { GrafanaReachabilityResult } from './service/grafana-reachability'
import {
  startLocalCollector,
  stopLocalCollector,
  type LocalCollectorHandle
} from './service/local-collector'
import {
  initNodeTelemetry,
  shutdownNodeTelemetry,
  type NodeTelemetryHandle
} from './service/node-telemetry'
import { registerMainSpanFlush, setTraceUploadUserDataPath } from './service/trace-upload'

/** Options for initializing local telemetry capture in the main process. */
export type InitTelemetryOptions = {
  environment: string
  userDataPath: string
}

let collectorHandle: LocalCollectorHandle | null = null
let nodeTelemetryHandle: NodeTelemetryHandle | null = null

/**
 * Starts local telemetry capture: OTLP collector plus main-process tracing.
 *
 * @param options Environment label and Electron userData path for JSONL output.
 * @returns Resolves when the collector and main-process tracer are running.
 */
export async function initTelemetry(options: InitTelemetryOptions): Promise<void> {
  setTraceUploadUserDataPath(options.userDataPath)
  collectorHandle = await startLocalCollector({ userDataPath: options.userDataPath })

  const otlpEndpoint = `http://${collectorHandle.host}:${collectorHandle.port}`
  nodeTelemetryHandle = initNodeTelemetry({
    environment: options.environment,
    otlpEndpoint
  })
  registerMainSpanFlush(() => nodeTelemetryHandle!.forceFlush())
}

/**
 * Stops telemetry exporters and the local OTLP collector.
 *
 * @returns Resolves when exporters and the collector have shut down.
 */
export async function shutdownTelemetry(): Promise<void> {
  if (nodeTelemetryHandle) {
    await shutdownNodeTelemetry(nodeTelemetryHandle)
    nodeTelemetryHandle = null
  }

  if (collectorHandle) {
    await stopLocalCollector(collectorHandle)
    collectorHandle = null
  }
}

/**
 * Returns the trace file path when the local collector is running.
 *
 * @returns Absolute JSONL path or null before initialization.
 */
export function getLocalTraceFilePath(): string | null {
  return collectorHandle?.traceFilePath ?? null
}

export { uploadTracesOnError } from './service/trace-upload'
export { setTelemetryUploadPreferences } from './service/upload-preferences'
export type { TelemetryUploadPreferences } from './service/upload-preferences'
