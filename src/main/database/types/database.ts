import type { DatabaseSync } from 'node:sqlite'

export type SqliteDatabase = DatabaseSync

export interface Migration {
  id: string
  name: string
  sql: string
}
