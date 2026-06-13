/**
 * Returns whether at least one local user exists in the SQLite database.
 *
 * @returns `true` when a local user is present in the local database.
 */
export async function hasLocalAccess() {
  if (!globalThis.window.api?.getUsers) {
    return false
  }

  try {
    const users = await globalThis.window.api.getUsers()

    return users.some((user) => user.userType === 'local')
  } catch {
    return false
  }
}
