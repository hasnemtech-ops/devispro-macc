const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopApp', {
  sharePdf: (payload) => ipcRenderer.invoke('share-pdf', payload)
});
