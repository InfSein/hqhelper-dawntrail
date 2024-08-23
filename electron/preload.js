/* eslint-disable */
const { contextBridge, ipcRenderer, app } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
  installUpdate: () => ipcRenderer.send('install-update'),
  onUpdateReady: (callback) => ipcRenderer.on('update-ready', (event, ...args) => callback(...args)),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  restore: () => ipcRenderer.send('window-restore'),
  close: () => ipcRenderer.send('window-close'),
  clientVersion: ipcRenderer.invoke('get-app-version'),
  httpGet: (url) => ipcRenderer.invoke('http-get', url),
  downloadUpdatePack: (url) => ipcRenderer.invoke('download-update-pack', url),
  openUrlByBrowser: (url) => ipcRenderer.send('open-url-by-browser', url),
})