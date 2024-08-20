/* eslint-disable */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
  installUpdate: () => ipcRenderer.send('install-update'),
  onUpdateReady: (callback) => ipcRenderer.on('update-ready', (event, ...args) => callback(...args)),
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  restore: () => ipcRenderer.send('window-restore'),
  close: () => ipcRenderer.send('window-close')
})