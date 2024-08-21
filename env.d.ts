/// <reference types="vite/client" />

declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}

// 宣言 `window` 的属性以允许类型检查
declare global {
  interface Window {
    // * Electron API
    electronAPI: undefined | {
      checkForUpdates: () => void;
      installUpdate: () => void;
      onUpdateReady: (callBack: Function) => void;
      minimize: () => void;
      maximize: () => void;
      restore: () => void;
      close: () => void;
      version: string;
    };
  }
}