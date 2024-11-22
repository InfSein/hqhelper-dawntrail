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
  simulatePing: (domain) => ipcRenderer.invoke('simulate-ping', domain),
  downloadUpdatePack: (url) => ipcRenderer.invoke('download-update-pack', url),
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', (event, progressData) => callback(progressData)),
  openUrlByBrowser: (url) => ipcRenderer.send('open-url-by-browser', url),
  copyText: (text) => ipcRenderer.invoke('copy-text', text),
  createNewWindow: (id, url, defaultWidth, defaultHeight, title) => ipcRenderer.send('create-new-window', { id, url, defaultWidth, defaultHeight, title }),
  toggleAlwaysOnTop: () => ipcRenderer.send('toggle-always-on-top'),
  updateTitleBarTheme: (isDarkMode) => ipcRenderer.send('update-title-bar-theme', isDarkMode),
})