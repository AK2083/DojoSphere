export interface DatabaseStatement {
  run(...params: unknown[]): unknown
  get(...params: unknown[]): unknown
  all(...params: unknown[]): unknown[]
}

export interface Database {
  prepare(sql: string): DatabaseStatement
  exec(sql: string): void
  close(): void
}

export interface Migration {
  id: string
  name: string
  sql: string
}
