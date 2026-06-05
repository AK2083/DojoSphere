const path = require('path')
const { app, ipcMain } = require('electron')

let db

function createDatabase(dbPath) {
  try {
    const BetterSqlite3 = require('better-sqlite3')

    return new BetterSqlite3(dbPath)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.warn(`better-sqlite3 nicht verfuegbar (${errorMessage}). Nutze node:sqlite Fallback.`)

    const { DatabaseSync } = require('node:sqlite')
    return new DatabaseSync(dbPath)
  }
}

function initDatabase() {
  if (db) return db

  const dbPath = path.join(app.getPath('userData'), 'database.db')
  db = createDatabase(dbPath)

  return db
}

ipcMain.handle('get-users', () => {
  return db.prepare('SELECT * FROM users').all()
})

ipcMain.handle('add-user', (event, user) => {
  const insert = db.prepare('INSERT INTO users (name, data) VALUES (?, ?)')
  return insert.run(user.name, JSON.stringify(user.data))
})

ipcMain.handle('db-healthcheck', () => {
  const result = db.prepare('SELECT sqlite_version() AS version').get()
  return {
    ok: true,
    version: result?.version ?? 'unknown'
  }
})

module.exports = { initDatabase }
