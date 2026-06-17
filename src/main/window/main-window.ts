import path from 'node:path'

import { app, BrowserWindow, Menu } from 'electron'

import { loadRenderer } from './load-renderer'

/**
 * Creates and configures the main application window.
 *
 * @param devServerUrl - Vite dev server URL used in unpackaged builds.
 */
export function createWindow(devServerUrl: string) {
  Menu.setApplicationMenu(null)

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged
    }
  })

  void loadRenderer(win, devServerUrl)

  win.webContents.on('before-input-event', (event, input) => {
    if (
      app.isPackaged &&
      (input.control || input.meta) &&
      input.shift &&
      input.key.toLowerCase() === 'i'
    ) {
      event.preventDefault()
    }
  })
}
