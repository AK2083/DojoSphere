const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("server", {
  start: () => ipcRenderer.send("server-start"),
  stop: () => ipcRenderer.send("server-stop"),
});
