// env.android.d.ts
export interface AndroidAPI {
  checkUpdate: () => void;
}

declare global {
  interface Window {
    androidAPI: undefined | AndroidAPI;
  }
}
