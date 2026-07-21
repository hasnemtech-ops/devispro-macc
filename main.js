const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 850,
    minWidth: 380,
    minHeight: 600,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);

  // Les liens externes (ex : WhatsApp) s'ouvrent dans le navigateur/l'app du système,
  // jamais dans la fenêtre de l'application elle-même.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== win.webContents.getURL()) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  win.loadFile(path.join(__dirname, 'electricien-devis.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
