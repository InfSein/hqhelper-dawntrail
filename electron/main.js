/* eslint-disable */
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const unzipper = require('unzipper');
const dns = require('dns');
const net = require('net');

let mainWindow;
const ZIP_URL = 'https://github.com/InfSein/hqhelper-dawntrail/archive/refs/heads/static-pages.zip';
const ZIP_PATH = path.join(__dirname, 'static-pages.zip');
const TEMP_DIR = path.join(__dirname, 'static-pages-temp');
const EXTRACTED_DIR = path.join(TEMP_DIR, 'hqhelper-dawntrail-static-pages');
const CLIENT_VERSION = 'v0'
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

  /* 获取客户端的当前版本(需要手动修改CONST值) */
  ipcMain.handle('get-app-version', () => {
    return CLIENT_VERSION
  });
  
  /* 向给定URL发送GET请求，成功时返回字符串格式的数据 */
  ipcMain.handle('http-get', async (event, url) => {
    console.log('GET', url)
    try {
      const response = await axios.get(url, { timeout: 3000 })
      let data = response.data
      if (typeof(data) !== 'string') data = JSON.stringify(data)
      console.log('RESPONSE', data)
      return data
    } catch (error) {
      throw error
    }
  });
  
  /* 检查给定域名的延迟，返回延迟时间(ms)或超时信息 */
  ipcMain.handle('simulate-ping', async (event, hostname) => {
    return new Promise((resolve, reject) => {
      const start = Date.now()
      if (hostname.startsWith('http://') || hostname.startsWith('https://'))
        hostname = new URL(hostname).hostname
      dns.lookup(hostname, (err, address) => {
        if (err) {
          console.log('DNS lookup failed:', err)
          return reject("error")
        }
        const socket = new net.Socket()
        socket.setTimeout(2000)
        socket.connect(80, address, () => {
          const latency = Date.now() - start
          console.log(`PING ${hostname} latency: ${latency}ms`)
          socket.destroy(); resolve(latency)
        })
        socket.on('error', (err) => {
          console.log(`PING ${hostname} FAILED DUE TO`, err)
          socket.destroy(); reject("error")
        })
        socket.on('timeout', () => {
          console.log(`PING ${hostname} TIMED OUT`)
          socket.destroy(); reject("timeout")
        })
      })
    })
  })
  
  /* 从给定URL下载WEB项目更新包，并在下载成功后自动重启 */
  ipcMain.handle('download-update-pack', async (event, url) => {
    try {
      const response = await axios.get(url, { responseType: 'stream' });
      const writeStream = fs.createWriteStream(ZIP_PATH);
      response.data.pipe(writeStream);

      writeStream.on('finish', async () => {
        console.log('ZIP file downloaded successfully');
        try {
          await extractZipFile(ZIP_PATH, TEMP_DIR);
          console.log('ZIP file extracted successfully');

          updateLocalFiles(EXTRACTED_DIR, path.join(__dirname, 'static-pages'));

          fs.rmSync(TEMP_DIR, { recursive: true, force: true });
          console.log('Temporary files cleaned up');
        } catch (error) {
          console.error('Failed to process ZIP file:', error);
          alert('ZIP file process failed')
          return
        }
        app.relaunch();
        app.exit();
      });

      writeStream.on('error', (err) => {
        console.error('Failed to download ZIP file:', err);
        alert('Download failed')
      });

      return ''
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return String(error)
    }
  })
  
  /* 调用默认浏览器打开给定URL */
  ipcMain.on('open-url-by-browser', (event, url) => {
    try {
      shell.openExternal(url)
    } catch (error) {
      throw error
    }
  })

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
