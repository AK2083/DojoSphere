/**
 * Prepared statement handle for parameterized SQL execution.
 */
export interface DatabaseStatement {
  run(...params: unknown[]): unknown
  get(...params: unknown[]): unknown
  all(...params: unknown[]): unknown[]
}

/**
 * Database port used by repositories and migration code.
 *
 * Implemented by the SQLite driver; features must not import the driver directly.
 */
export interface Database {
  prepare(sql: string): DatabaseStatement
  exec(sql: string): void
  close(): void
}
