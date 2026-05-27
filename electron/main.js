const { app, BrowserWindow, Menu } = require('electron')
const fs = require('fs')
const path = require('path')

const DEV_SERVER_URL = 'http://localhost:5173'
const DIST_INDEX_PATH = path.join(__dirname, '../dist/index.html')

function toHtmlDataUrl(content) {
  return `data:text/html;charset=UTF-8,${encodeURIComponent(content)}`
}

async function loadRenderer(win) {
  if (app.isPackaged) {
    await win.loadFile(DIST_INDEX_PATH)
    return
  }

  try {
    await win.loadURL(DEV_SERVER_URL)
    win.webContents.openDevTools()
  } catch {
    if (fs.existsSync(DIST_INDEX_PATH)) {
      await win.loadFile(DIST_INDEX_PATH)
      return
    }

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
            <p>Der Dev-Server unter <code>${DEV_SERVER_URL}</code> ist nicht erreichbar.</p>
            <p>Starte <code>npm run dev</code> oder erzeuge zuerst ein Build mit <code>npm run build</code>.</p>
          </body>
        </html>
      `)
    )
  }
}

function createWindow() {
  Menu.setApplicationMenu(null)

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged
    }
  })

  void loadRenderer(win)

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

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
