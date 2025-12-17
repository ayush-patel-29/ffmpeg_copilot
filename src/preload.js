// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  executeFFmpeg: (exe, args) => ipcRenderer.invoke('ffmpeg:execute', { exe, args }),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),

  // Auth
  setApiKey: (key) => ipcRenderer.invoke('auth:setKey', key),
  getApiKey: () => ipcRenderer.invoke('auth:getKey'),
  clearApiKey: () => ipcRenderer.invoke('auth:clearKey'),

  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
});