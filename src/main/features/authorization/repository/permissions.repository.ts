import { getDatabase } from '@main/shared/database'
import { withDbErrorLogging } from '@main/shared/logging'

/**
 * Returns whether the user has an active role assignment granting the permission.
 *
 * @param userId - User identifier to check.
 * @param resource - Permission resource name (e.g. `participants-overview`).
 * @param action - Permission action name (e.g. `read`).
 * @returns `true` when an active assignment grants the permission.
 */
export function userHasPermission(userId: string, resource: string, action: string): boolean {
  return withDbErrorLogging('permissions', 'hasPermission', () => {
    const db = getDatabase()

    const row = db
      .prepare(
        `
      SELECT 1
      FROM user_role_assignments ura
      JOIN role_permissions rp ON rp.role_id = ura.role_id
      JOIN permissions p ON p.id = rp.permission_id
      WHERE ura.user_id = ?
        AND ura.revoked_at IS NULL
        AND p.resource = ?
        AND p.action = ?
      LIMIT 1
    `
      )
      .get(userId, resource, action)

    return row !== undefined
  })
}
