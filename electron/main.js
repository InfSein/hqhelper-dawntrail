/* eslint-disable */
const { app, BrowserWindow, ipcMain, shell, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const unzipper = require('unzipper');
const dns = require('dns');
const net = require('net');
const logger = require('electron-log');

logger.transports.console.level = false
logger.transports.file.level = 'debug'
logger.transports.file.maxSize = 10024300 // 文件最大不超过 10M
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
let date = new Date()
let dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
logger.transports.file.resolvePath = () => 'log\\' + dateStr + '.log';

let mainWindow;
const CLIENT_VERSION = 'v2'

const ZIP_PATH = path.join(app.getPath('userData'), 'static-pages.zip');
const TEMP_DIR = path.join(app.getPath('userData'), 'static-pages-temp');
const EXTRACTED_DIR = path.join(TEMP_DIR, 'dist');
const STATICPAGE_DIR = path.join(process.resourcesPath, 'static-pages');

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
  const indexPath = path.join(STATICPAGE_DIR, 'index.html');
  mainWindow.loadURL(`file://${indexPath}`);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipcMain.on('check-for-updates', async () => {
    logger.warn('[common-warn] 调用了被弃用的API: check-for-updates')
    return 'api deprecated'
  });

  ipcMain.on('install-update', () => {
    logger.warn('[common-warn] 调用了被弃用的API: install-update')
    return 'api deprecated'
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
      logger.info('[download-update-pack] 下载URL: ' + url)
      const response = await axios.get(url, { responseType: 'stream' });
      const writeStream = fs.createWriteStream(ZIP_PATH);
      response.data.pipe(writeStream);

      writeStream.on('finish', async () => {
        logger.info('[download-update-pack] 下载成功，开始解压')
        try {
          await extractZipFile(ZIP_PATH, TEMP_DIR);
          console.log('ZIP file extracted successfully');
          logger.info('[download-update-pack] 解压成功，开始替换本地文件')

          updateLocalFiles(EXTRACTED_DIR, STATICPAGE_DIR);
          logger.info('[download-update-pack] 替换成功')

          fs.rmSync(TEMP_DIR, { recursive: true, force: true });
          logger.info('[download-update-pack] 临时文件清理成功')

          app.relaunch();
          app.exit();
        } catch (error) {
          logger.error('[download-update-pack] 解压期间发生错误：' + error)
          throw error
        }
      });

      writeStream.on('error', (error) => {
        logger.error('[download-update-pack] 下载期间发生错误：' + error)
        throw error
      });

      writeStream.on('close', () => {
        logger.info('[download-update-pack] 下载完成');
      });

    } catch (error) {
      logger.error('[download-update-pack] 检查更新时发生错误：' + error)
      throw error
    }
    return ''
  })
  
  /* 调用默认浏览器打开给定URL */
  ipcMain.on('open-url-by-browser', (event, url) => {
    try {
      shell.openExternal(url)
    } catch (error) {
      throw error
    }
  })
  
  /* 复制给定字符串 (electron环境下调用网页的复制方法不生效，需要专门写一个API) */
  ipcMain.handle('copy-text', (event, text) => {
    try {
      clipboard.writeText(text)
      return ''
    } catch (e) {
      return e?.message ?? e
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