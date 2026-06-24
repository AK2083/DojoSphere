import type { Router } from 'vue-router'
import { setActivityLoggingEnabled } from '@shared/lib/telemetry/activity-logging-scope'
import { clearUserContext } from '@shared/lib/telemetry/logging'

import { monitorInformation, MONITORING_EVENTS } from './monitoring'

function isActivityLoggingRoute(meta: { activityLogging?: boolean }): boolean {
  return meta.activityLogging !== false
}

/**
 * Syncs activity-logging scope from route meta and records navigation breadcrumbs.
 *
 * Audience routes (`activityLogging: false`) skip info breadcrumbs and clear user context.
 *
 * @param router - Application router instance.
 */
export function bindActivityLoggingToRouter(router: Router) {
  router.beforeEach((to) => {
    const enabled = isActivityLoggingRoute(to.meta)
    setActivityLoggingEnabled(enabled)

    if (!enabled) {
      clearUserContext()
    }
  })

  router.afterEach((to) => {
    if (!isActivityLoggingRoute(to.meta)) {
      return
    }

    monitorInformation(MONITORING_EVENTS.ROUTE_CHANGED, {
      name: String(to.name ?? to.path)
    })
  })
}
