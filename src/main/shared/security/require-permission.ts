/**
 * Ensures the user has the required permission for a privileged IPC operation.
 *
 * @param userId - Authenticated user identifier.
 * @param resource - Permission resource name.
 * @param action - Permission action name.
 * @param hasPermission - Permission lookup function from the authorization feature.
 * @throws {Error} When the permission is missing (`Forbidden`).
 */
export function requirePermission(
  userId: string,
  resource: string,
  action: string,
  hasPermission: (userId: string, resource: string, action: string) => boolean
): void {
  if (!hasPermission(userId, resource, action)) {
    throw new Error('Forbidden')
  }
}
