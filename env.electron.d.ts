// env.electron.d.ts
export interface ElectronAPI {
  checkForUpdates: () => void;
  installUpdate: () => void;
  onUpdateReady: (callBack: Function) => void;
  minimize: () => void;
  maximize: () => void;
  restore: () => void;
  close: () => void;
  clientVersion: Promise<string>;
  httpGet: (url: string) => Promise<string>;
  simulatePing: (domain: string) => Promise<number | "error" | "timeout">;
  downloadUpdatePack: (url: string) => Promise<string>;
  onUpdateProgress: (callback: (progressData: ProgressData) => void) => void;
  openUrlByBrowser: (url: string) => void;
  copyText: (text: string) => Promise<string>;
}

export interface ProgressData {
  stage: "downloading" | "extracting" | "replacing" | "cleaning" | "relaunching"; // 当前阶段
  progress?: {
    total: string;      // 总下载大小 (MB)
    downloaded: string; // 已下载大小 (MB)
    speed: string;      // 下载速度 (MB/s)
  };
}

// 将 `ElectronAPI` 类型暴露到全局 `window` 对象上
declare global {
  interface Window {
    electronAPI: undefined | ElectronAPI;
  }
}
