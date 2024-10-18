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
const CLIENT_VERSION = 'v4'

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
    function sendProgress(event, stage, progress) {
      event.sender.send('update-progress', { stage, progress });
    }

    try {
      logger.info('[download-update-pack] 下载URL: ' + url)
      let previousTime = Date.now();
      let previousDownloaded = 0;
      sendProgress(event, 'requesting', {});
      const response = await axios.get(url, {
        responseType: 'stream',
        onDownloadProgress: (progressEvent) => {
          const totalBytes = progressEvent.total;
          const downloadedBytes = progressEvent.loaded;

          // Calculate time difference and bytes difference
          const currentTime = Date.now();
          const timeDiff = (currentTime - previousTime) / 1000; // in seconds
          const bytesDiff = downloadedBytes - previousDownloaded;

          // Calculate current speed in MB/s
          const speed = (bytesDiff / (1024 * 1024)) / timeDiff;

          // Update previous values
          previousTime = currentTime;
          previousDownloaded = downloadedBytes;

          const progress = {
            total: (totalBytes / (1024 * 1024)).toFixed(2), // MB
            downloaded: (downloadedBytes / (1024 * 1024)).toFixed(2), // MB
            speed: speed.toFixed(2) // MB/s (for simplicity)
          };
          sendProgress(event, 'downloading', progress);
        }
      });
      const writeStream = fs.createWriteStream(ZIP_PATH);
      response.data.pipe(writeStream);

      writeStream.on('finish', async () => {
        logger.info('[download-update-pack] 下载成功，开始解压')
        sendProgress(event, 'extracting', {});
        try {
          await extractZipFile(ZIP_PATH, TEMP_DIR);
          console.log('ZIP file extracted successfully');
          logger.info('[download-update-pack] 解压成功，开始替换本地文件')
          sendProgress(event, 'replacing', {});

          updateLocalFiles(EXTRACTED_DIR, STATICPAGE_DIR);
          logger.info('[download-update-pack] 替换成功')

          sendProgress(event, 'cleaning', {});
          fs.rmSync(TEMP_DIR, { recursive: true, force: true });
          logger.info('[download-update-pack] 临时文件清理成功')

          sendProgress(event, 'relaunching', {});
          app.relaunch();
          app.exit();
        } catch (error) {
          logger.error('[download-update-pack] 解压期间发生错误：' + error)
          sendProgress(event, 'end', {});
          throw error
        }
      });

      writeStream.on('error', (error) => {
        logger.error('[download-update-pack] 下载期间发生错误：' + error)
        sendProgress(event, 'end', {});
        throw error
      });

      writeStream.on('close', () => {
        logger.info('[download-update-pack] 下载完成');
      });

      return ''
    } catch (error) {
      logger.error('[download-update-pack] 检查更新时发生错误：' + error)
      sendProgress(event, 'end', {});
      throw error
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
  // 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 读取源目录的文件和子目录
  const sourceFiles = fs.readdirSync(sourceDir);

  // 处理源目录中的每个文件/目录
  sourceFiles.forEach(file => {
    const sourceFilePath = path.join(sourceDir, file);
    const targetFilePath = path.join(targetDir, file);

    if (fs.lstatSync(sourceFilePath).isFile()) {
      // 复制文件
      fs.copyFileSync(sourceFilePath, targetFilePath);
    } else if (fs.lstatSync(sourceFilePath).isDirectory()) {
      // 递归处理子目录
      updateLocalFiles(sourceFilePath, targetFilePath);
    }
  });

  // 删除目标目录中不存在于源目录的文件/目录
  const targetFiles = fs.readdirSync(targetDir);
  targetFiles.forEach(file => {
    const targetFilePath = path.join(targetDir, file);
    const sourceFilePath = path.join(sourceDir, file);

    if (!sourceFiles.includes(file)) {
      // 如果目标目录有而源目录没有，删除
      if (fs.lstatSync(targetFilePath).isFile()) {
        fs.unlinkSync(targetFilePath);
      } else if (fs.lstatSync(targetFilePath).isDirectory()) {
        fs.rmSync(targetFilePath, { recursive: true, force: true });
      }
    }
  });
}
