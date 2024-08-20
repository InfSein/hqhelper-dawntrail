// electron.d.ts
export interface ElectronAPI {
  checkForUpdates: () => void;
  installUpdate: () => void;
  onUpdateReady: () => void;
  minimize: () => void;
  maximize: () => void;
  restore: () => void;
  close: () => void;
}

// 将 `ElectronAPI` 类型暴露到全局 `window` 对象上
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
