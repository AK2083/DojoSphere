import { getDatabase } from '../database/connection'

export type CreateUserInput = {
  name: string
  data: unknown
}

export function getUsers() {
  const db = getDatabase()

  return db.prepare('SELECT * FROM users').all()
}

export function addUser(user: CreateUserInput) {
  const db = getDatabase()

  const insert = db.prepare(`
    INSERT INTO users (name, data)
    VALUES (?, ?)
  `)

  return insert.run(user.name, JSON.stringify(user.data))
}
