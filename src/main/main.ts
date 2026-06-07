import { app } from 'electron'

import { createWindow } from './window/main-window'
import { bootstrap } from './app/bootstrap'

const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:5173'

app.whenReady().then(() => {
  try {
    bootstrap()
    createWindow(DEV_SERVER_URL)
  } catch (error) {
    console.error('Datenbank-Initialisierung fehlgeschlagen:', error)
    app.quit()
    process.exit(1)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
