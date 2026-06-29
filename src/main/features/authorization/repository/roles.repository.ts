import { getDatabase } from '@main/shared/database'

/**
 * Resolves a role identifier by its stable name.
 *
 * @param name - Role name stored in the roles table (e.g. `list_keeper`).
 * @returns The role identifier.
 * @throws {Error} When the role does not exist.
 */
export function findRoleIdByName(name: string): string {
  const row = getDatabase().prepare('SELECT id FROM roles WHERE name = ?').get(name) as
    { id: string } | undefined

  if (!row) {
    throw new Error(`Role not found: ${name}`)
  }

  return row.id
}
