// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  executeFFmpeg: (exe, args) => ipcRenderer.invoke('ffmpeg:execute', { exe, args }),
  groqGenerate: (params) => ipcRenderer.invoke('groq:generate', params),
  onFFmpegLog: (callback) => ipcRenderer.on('ffmpeg-log', (event, value) => callback(value)),
  offFFmpegLog: () => ipcRenderer.removeAllListeners('ffmpeg-log'),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),

  // Auth
  setApiKey: (key) => ipcRenderer.invoke('auth:setKey', key),
  getApiKey: () => ipcRenderer.invoke('auth:getKey'),
  clearApiKey: () => ipcRenderer.invoke('auth:clearKey'),

  // File operations
  showInFolder: (filePath) => ipcRenderer.invoke('file:showInFolder', filePath),
  listOutputs: () => ipcRenderer.invoke('file:listOutputs'),
  readAsDataURL: (filePath) => ipcRenderer.invoke('file:readAsDataURL', filePath),

  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  log: (...args) => ipcRenderer.send('console-log', ...args),
  getFilePath: (file) => {
    try {
      const path = webUtils.getPathForFile(file);
      ipcRenderer.send('console-log', 'webUtils.getPathForFile result:', path);
      return path;
    } catch (e) {
      ipcRenderer.send('console-log', 'Error in getFilePath:', e.message);
      return file.path; // Fallback
    }
  },
});