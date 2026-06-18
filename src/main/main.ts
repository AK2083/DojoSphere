import { app } from 'electron'

import { resolveDevServerUrl } from '../../config/dev'
import { bootstrap } from './app/bootstrap'
import { initMonitoring } from './app/init-monitoring'
import { createWindow } from './window/main-window'

const DEV_SERVER_URL = resolveDevServerUrl()

app.whenReady().then(() => {
  try {
    initMonitoring(import.meta.env.VITE_GLITCHTIP_DSN ?? '', import.meta.env.MODE ?? 'production')
    bootstrap()
    createWindow(DEV_SERVER_URL)
  } catch (error) {
    console.error('Database initialization failed:', error)
    app.quit()
    process.exit(1)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
