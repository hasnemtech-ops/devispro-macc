const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 850,
    minWidth: 380,
    minHeight: 600,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setMenuBarVisibility(false);
  win.maximize();   // s'ouvre sur toute la largeur de l'écran

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

// Enregistrer le devis/facture en PDF (et, optionnellement, ouvrir le client e-mail)
ipcMain.handle('share-pdf', async (event, p) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win || !p || typeof p.base64 !== 'string') return { ok: false, error: 'invalid' };
    const buf = Buffer.from(p.base64, 'base64');
    if (!buf.length || buf.length > 30 * 1024 * 1024) return { ok: false, error: 'size' };
    let name = path.basename(String(p.fileName || 'Document.pdf')).replace(/[^A-Za-z0-9._-]/g, '_');
    if (!/\.pdf$/i.test(name)) name += '.pdf';
    const r = await dialog.showSaveDialog(win, {
      title: 'Enregistrer le PDF',
      defaultPath: path.join(app.getPath('downloads'), name),
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });
    if (r.canceled || !r.filePath) return { ok: false, canceled: true };
    fs.writeFileSync(r.filePath, buf);
    shell.showItemInFolder(r.filePath);
    if (p.action === 'email') {
      const to = (typeof p.email === 'string' && /^[^\s@<>,;]+@[^\s@<>,;]+$/.test(p.email)) ? p.email : '';
      const subject = String(p.subject || '').slice(0, 300);
      const body = (String(p.text || '') + '\n\n(Joignez le fichier PDF enregistré : ' + path.basename(r.filePath) + ')').slice(0, 3000);
      await shell.openExternal('mailto:' + encodeURIComponent(to).replace(/%40/g, '@') +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
    }
    return { ok: true, path: r.filePath };
  } catch (e) {
    return { ok: false, error: String(e && e.message || e) };
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
