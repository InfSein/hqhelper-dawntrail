// env.electron.d.ts
export interface ElectronAPI {
  checkForUpdates: () => void;
  installUpdate: () => void;
  onUpdateReady: (callBack: Function) => void;
  minimize: () => void;
  maximize: () => void;
  restore: () => void;
  close: () => void;
  version: string;
}

// 将 `ElectronAPI` 类型暴露到全局 `window` 对象上
declare global {
  interface Window {
    electronAPI: undefined | ElectronAPI;
  }
}
