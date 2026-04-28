const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleAssistant: (active) => ipcRenderer.invoke('toggle-assistant', active),
  getStatus: () => ipcRenderer.invoke('get-status'),
  onStatusChange: (callback) => {
    ipcRenderer.on('assistant-status-changed', (event, active) => callback(active));
  },
  onShortcutPressed: (callback) => {
    ipcRenderer.on('shortcut-pressed', () => callback());
  },
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),
});
