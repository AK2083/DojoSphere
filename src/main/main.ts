import { app } from 'electron'

import { resolveDevServerUrl } from '../../config/dev'
import { bootstrap } from './app/bootstrap'
import { createWindow } from './window/main-window'

const DEV_SERVER_URL = resolveDevServerUrl()

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
