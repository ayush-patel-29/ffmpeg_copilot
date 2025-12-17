const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('node:path');
const { setApiKey, getApiKey, clearApiKey } = require("./auth");
const { executeFFmpeg } = require("./ffmpegExecutor");
const { generateFFmpegCommand } = require("./services/groqClient");
const { error } = require('node:console');


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

ipcMain.handle('groq:generate', async (_, { prompt, model, file }) => {
  return await generateFFmpegCommand({ prompt, model, file });
});

ipcMain.handle('ffmpeg:execute', async (_, { exe, args }) => {
  try {
    const result = await executeFFmpeg({ exe, args });
    return result;
  } catch (err) {
    return err;
  }
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