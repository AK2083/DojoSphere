import type { LogLevel } from './log-level'
import { addBreadcrumb } from './logging'

/** Level-specific monitoring helpers for a single breadcrumb category. */
export type MonitoringHelpers = {
  monitorDebug: (event: string, data?: object) => void
  monitorInformation: (event: string, data?: object) => void
  monitorWarning: (event: string, data?: object) => void
  monitorError: (event: string, data?: object) => void
}

/**
 * Creates monitoring helpers that forward breadcrumbs with a fixed category and level.
 *
 * @param category Monitoring category applied to every breadcrumb.
 * @returns Helpers for debug, info, warning, and error breadcrumbs.
 */
export function createMonitoringHelpers(category: string): MonitoringHelpers {
  const monitor = (level: LogLevel) => (event: string, data?: object) => {
    addBreadcrumb(event, category, level, data)
  }

  return {
    monitorDebug: monitor('debug'),
    monitorInformation: monitor('info'),
    monitorWarning: monitor('warning'),
    monitorError: monitor('error')
  }
}
