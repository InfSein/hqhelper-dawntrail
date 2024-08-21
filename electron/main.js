/* eslint-disable */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const unzipper = require('unzipper');

let mainWindow;
const ZIP_URL = 'https://github.com/InfSein/hqhelper-dawntrail/archive/refs/heads/static-pages.zip';
const ZIP_PATH = path.join(__dirname, 'static-pages.zip');
const TEMP_DIR = path.join(__dirname, 'static-pages-temp');
const EXTRACTED_DIR = path.join(TEMP_DIR, 'hqhelper-dawntrail-static-pages');
// 获取应用的版本号
const appVersion = app.getVersion();
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1620,
    height: 835,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: 'rgba(0,0,0,30)',
      height: 35,
      symbolColor: 'black'
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  const indexPath = path.join(__dirname, 'static-pages/index.html');
  mainWindow.loadURL(`file://${indexPath}`);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipcMain.on('check-for-updates', async () => {
    try {
      // Download ZIP file
      const response = await axios.get(ZIP_URL, { responseType: 'stream' });
      const writeStream = fs.createWriteStream(ZIP_PATH);

      response.data.pipe(writeStream);

      writeStream.on('finish', async () => {
        console.log('ZIP file downloaded successfully');
        try {
          // Extract ZIP file
          await extractZipFile(ZIP_PATH, TEMP_DIR);
          console.log('ZIP file extracted successfully');

          // Update local files
          updateLocalFiles(EXTRACTED_DIR, path.join(__dirname, 'static-pages'));

          // Clean up
          fs.rmSync(TEMP_DIR, { recursive: true, force: true });
          console.log('Temporary files cleaned up');

          // Notify renderer process
          mainWindow.webContents.send('update-ready');
        } catch (error) {
          console.error('Failed to process ZIP file:', error);
        }
      });

      writeStream.on('error', (err) => {
        console.error('Failed to download ZIP file:', err);
      });
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  });

  ipcMain.on('install-update', () => {
    try {
      app.relaunch();
      app.exit();
    } catch (error) {
      console.error('Failed to install update:', error);
    }
  });

  ipcMain.on('window-minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window.minimize();
  });
  
  ipcMain.on('window-maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window.isMaximized()) {
      window.restore();
    } else {
      window.maximize();
    }
  });
  
  ipcMain.on('window-restore', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window.restore();
  });
  
  ipcMain.on('window-close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window.close();
  });
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

async function extractZipFile(zipPath, extractionDir) {
  try {
    await fs.promises.mkdir(extractionDir, { recursive: true });
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractionDir }))
      .promise();
  } catch (error) {
    console.error('Failed to extract ZIP file:', error);
    throw error;
  }
}

function updateLocalFiles(sourceDir, targetDir) {
  fs.readdirSync(sourceDir).forEach(file => {
    const sourceFilePath = path.join(sourceDir, file);
    const targetFilePath = path.join(targetDir, file);

    if (fs.lstatSync(sourceFilePath).isFile()) {
      fs.copyFileSync(sourceFilePath, targetFilePath);
    } else if (fs.lstatSync(sourceFilePath).isDirectory()) {
      if (!fs.existsSync(targetFilePath)) {
        fs.mkdirSync(targetFilePath);
      }
      fs.readdirSync(sourceFilePath).forEach(subFile => {
        const sourceSubFilePath = path.join(sourceFilePath, subFile);
        const targetSubFilePath = path.join(targetFilePath, subFile);
        if (fs.lstatSync(sourceSubFilePath).isFile()) {
          fs.copyFileSync(sourceSubFilePath, targetSubFilePath);
        } else if (fs.lstatSync(sourceSubFilePath).isDirectory()) {
          updateLocalFiles(sourceSubFilePath, targetSubFilePath);
        }
      });
    }
  });
}
