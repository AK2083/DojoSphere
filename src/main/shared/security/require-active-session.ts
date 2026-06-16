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
