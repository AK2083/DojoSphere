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
          <h2>DojoSphere could not be loaded</h2>
          <p>The dev server at <code>${devServerUrl}</code> is not reachable.</p>
          <p>Start <code>npm run dev</code> or build the app first with <code>npm run build</code>.</p>
        </body>
      </html>
    `)
  )
}

/**
 * Loads the renderer into the given window — production build, dev server, or fallback error page.
 *
 * @param win - Browser window to load content into.
 * @param devServerUrl - Vite dev server URL used in unpackaged builds.
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
