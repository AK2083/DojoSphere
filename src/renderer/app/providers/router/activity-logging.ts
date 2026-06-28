import type { Router } from 'vue-router'
import { setActivityLoggingEnabled } from '@shared/lib/logging/activity-logging-scope'

function isActivityLoggingRoute(meta: { activityLogging?: boolean }): boolean {
  return meta.activityLogging !== false
}

/**
 * Syncs activity-logging scope from route meta for audit gating on audience routes.
 *
 * @param router - Application router instance.
 */
export function bindActivityLoggingToRouter(router: Router) {
  router.beforeEach((to) => {
    setActivityLoggingEnabled(isActivityLoggingRoute(to.meta))
  })
}
