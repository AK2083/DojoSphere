import { getLocalSessionToken } from './local-session-storage'

/**
 * Checks whether the current local session has the given permission.
 *
 * @param resource - Permission resource name.
 * @param action - Permission action name.
 * @returns `true` when the main process grants the permission.
 */
export async function hasUserPermission(resource: string, action: string): Promise<boolean> {
  const token = getLocalSessionToken()

  if (!token || !globalThis.window.api?.hasPermission) {
    return false
  }

  return globalThis.window.api.hasPermission(token, resource, action)
}
