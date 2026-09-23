const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

// Ensure Windows taskbar and system identify app properly
app.setAppUserModelId('com.wordhunt.windows');

let mainWindow = null;

function createWindow() {
  // Completely disable default application menu
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1240,
    height: 840,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: '#090d16',
    title: 'Word Hunt',
    icon: path.join(__dirname, '../build/icon.ico'),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      spellcheck: false,
      devTools: false,
    },
  });

  // Block right-click context menu (inspect, reload, etc.)
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault();
  });

  // Block browser shortcuts (F5 reload, Ctrl+R, Ctrl+U view source, Ctrl+W, F12)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (
      (input.control && input.key.toLowerCase() === 'r') ||
      (input.control && input.key.toLowerCase() === 'u') ||
      (input.control && input.key.toLowerCase() === 'w') ||
      input.key === 'F5' ||
      input.key === 'F12'
    ) {
      event.preventDefault();
    }
  });

  // Prevent zoom
  mainWindow.webContents.setVisualZoomLevelLimits(1, 1);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
