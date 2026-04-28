const electron = require('electron');
const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, globalShortcut } = electron;
const path = require('path');

let mainWindow;
let tray;
let isAssistantActive = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 720,
    minWidth: 400,
    minHeight: 600,
    frame: false,
    resizable: true,
    backgroundColor: '#0a0a1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Minimize to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  let trayIcon;
  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    trayIcon = trayIcon.resize({ width: 16, height: 16 });
  } catch (e) {
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('Voice AI Assistant');
  updateTrayMenu();

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isAssistantActive ? '🔴 Desactivar Asistente' : '🟢 Activar Asistente',
      click: () => {
        isAssistantActive = !isAssistantActive;
        updateTrayMenu();
        if (mainWindow) {
          mainWindow.webContents.send('assistant-status-changed', isAssistantActive);
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Mostrar Ventana',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Salir',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
}

function setupIPC() {
  const { session } = electron;
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true);
    } else {
      callback(false);
    }
  });

  ipcMain.handle('toggle-assistant', (event, active) => {
    isAssistantActive = active;
    updateTrayMenu();
    return isAssistantActive;
  });

  ipcMain.handle('get-status', () => {
    return isAssistantActive;
  });

  ipcMain.handle('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('window-close', () => {
    if (mainWindow) mainWindow.hide();
  });

  // Toggle listening via global shortcut
  globalShortcut.register('CommandOrControl+Space', () => {
    if (isAssistantActive && mainWindow) {
      mainWindow.webContents.send('shortcut-pressed');
    }
  });
}

app.whenReady().then(() => {
  setupIPC();
  createWindow();
  createTray();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // Don't quit on Windows when all windows are closed
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});
