import fs from 'node:fs'
import path from 'node:path'

import { app, type BrowserWindow } from 'electron'

const DIST_INDEX_PATH = path.join(__dirname, '../dist/index.html')

function toHtmlDataUrl(content: string) {
  return `data:text/html;charset=UTF-8,${encodeURIComponent(content)}`
}

async function showLoadErrorPage(win: BrowserWindow, devServerUrl: string) {
  await win.loadURL(
    toHtmlDataUrl(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>DojoSphere</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; line-height: 1.5; }
            code { background: #f1f1f1; padding: 2px 6px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h2>DojoSphere konnte nicht geladen werden</h2>
          <p>Der Dev-Server unter <code>${devServerUrl}</code> ist nicht erreichbar.</p>
          <p>Starte <code>npm run dev</code> oder erzeuge zuerst ein Build mit <code>npm run build</code>.</p>
        </body>
      </html>
    `)
  )
}

/**
 * Loads the renderer into the given window — production build, dev server, or fallback error page.
 */
export async function loadRenderer(win: BrowserWindow, devServerUrl: string) {
  if (app.isPackaged) {
    await win.loadFile(DIST_INDEX_PATH)
    return
  }

  try {
    await win.loadURL(devServerUrl)
    win.webContents.openDevTools()
  } catch {
    if (fs.existsSync(DIST_INDEX_PATH)) {
      await win.loadFile(DIST_INDEX_PATH)
      return
    }

    await showLoadErrorPage(win, devServerUrl)
  }
}
