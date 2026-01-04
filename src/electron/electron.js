const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged,
    },
  });

  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  }

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (
      app.isPackaged &&
      (input.control || input.meta) &&
      input.shift &&
      input.key.toLowerCase() === "i"
    ) {
      event.preventDefault();
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const { contextBridge, ipcRenderer } = require("electron");

ipcMain.on("server-start", () => {
  console.log("Server starten");
});
