import { getDatabase } from '@main/shared/database'

export function findRoleIdByName(name: string): string {
  const row = getDatabase().prepare('SELECT id FROM roles WHERE name = ?').get(name) as
    | { id: string }
    | undefined

  if (!row) {
    throw new Error(`Role not found: ${name}`)
  }

  return row.id
}
