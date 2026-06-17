/**
 * Versioned SQL migration applied through the migration runner.
 */
export interface Migration {
  id: string
  name: string
  sql: string
}
