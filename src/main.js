const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('node:path');
const fs = require('fs');
const { setApiKey, getApiKey, clearApiKey } = require("./auth");
const { executeFFmpeg } = require("./ffmpegExecutor");
const { generateFFmpegCommand } = require("./services/groqClient");
const { error } = require('node:console');
const { OUTPUT_DIR } = require('./utils/constants');

// ... (existing code) ...

// Open external URL in default browser
ipcMain.on('open-external-url', (event, url) => {
  shell.openExternal(url);
});

// List output files
ipcMain.handle('file:listOutputs', async () => {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      return { ok: true, files: [] };
    }

    const files = await fs.promises.readdir(OUTPUT_DIR);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(OUTPUT_DIR, file);
        try {
          const stats = await fs.promises.stat(filePath);
          const ext = path.extname(file).toLowerCase();

          let type = 'other';
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'].includes(ext)) type = 'image';
          else if (['.mp4', '.mkv', '.avi', '.mov', '.webm', '.flv'].includes(ext)) type = 'video';
          else if (['.mp3', '.wav', '.aac', '.flac', '.m4a', '.ogg'].includes(ext)) type = 'audio';

          return {
            name: file,
            path: filePath,
            type,
            createdAt: stats.birthtime,
            size: stats.size
          };
        } catch (e) {
          return null;
        }
      })
    );

    // Filter out nulls and sort by createdAt descending
    const sortedFiles = fileStats
      .filter(f => f !== null)
      .sort((a, b) => b.createdAt - a.createdAt);

    return { ok: true, files: sortedFiles };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// Read file as base64 data URL for preview
ipcMain.handle('file:readAsDataURL', async (event, filePath) => {
  try {
    const buffer = await fs.promises.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();

    let mimeType = 'application/octet-stream';
    if (['.jpg', '.jpeg'].includes(ext)) mimeType = 'image/jpeg';
    else if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.svg') mimeType = 'image/svg+xml';
    else if (ext === '.mp4') mimeType = 'video/mp4';
    else if (ext === '.webm') mimeType = 'video/webm';

    const base64 = buffer.toString('base64');
    return { ok: true, dataURL: `data:${mimeType};base64,${base64}` };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}



const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 550,
    height: 700,
    resizable: false,     // fixed size
    maximizable: false,   // removes maximize ability
    minimizable: true,    // keeps minimize
    closable: true,       // keeps close button
    frame: false,         // Remove frame for custom design
    transparent: true,    // Enable transparency
    backgroundColor: '#00000000', // Fully transparent background
    // hasShadow: false, // Optional: might want to remove system shadow if it looks weird with glass
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  Menu.setApplicationMenu(null);
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open DevTools to see errors
  mainWindow.webContents.openDevTools();

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// ipcMain handlers

ipcMain.handle('auth:setKey', async (__, apiKey) => {
  try {
    await setApiKey(apiKey);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
})

ipcMain.handle('auth:getKey', async () => {
  try {
    const key = await getApiKey();
    return { ok: true, apiKey: key };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('auth:clearKey', async () => {
  try {
    const deleted = await clearApiKey();
    return { ok: true, deleted };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('groq:generate', async (_, { prompt, model, files }) => {
  return await generateFFmpegCommand({ prompt, model, files });
});

ipcMain.handle('ffmpeg:execute', async (event, { exe, args }) => {
  try {
    const onLog = (msg) => {
      event.sender.send('ffmpeg-log', msg);
    };
    const result = await executeFFmpeg({ exe, args, onLog });
    return result;
  } catch (err) {
    return err;
  }
});

ipcMain.on('console-log', (event, ...args) => {
  console.log('Renderer Log:', ...args);
});

// Window control handlers
ipcMain.handle('window:minimize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.handle('window:close', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

// Open file folder
ipcMain.handle('file:showInFolder', async (event, filePath) => {
  try {
    shell.showItemInFolder(filePath);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// Open external URL in default browser
ipcMain.on('open-external-url', (event, url) => {
  shell.openExternal(url);
});