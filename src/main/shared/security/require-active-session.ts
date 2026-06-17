/**
 * Ensures a valid active session exists for a privileged IPC operation.
 *
 * @param token - Raw session token from the renderer.
 * @param getSession - Session lookup function from the sessions feature.
 * @returns The validated session record.
 * @throws {Error} When the session is missing or inactive.
 */
export function requireActiveSession<T extends { userId: string }>(
  token: string,
  getSession: (token: string) => T | null
): T {
  const session = getSession(token)

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}
