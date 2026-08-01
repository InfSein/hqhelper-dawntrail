type ElectronSyncEvent = "update-setting" | "workflowStateChanged"
type ElectronSyncCallback = (data: any) => void

interface ElectronSync {
  emitSync: (event: ElectronSyncEvent, data: any) => void
  onSync: (event: ElectronSyncEvent, callback: ElectronSyncCallback) => void
  isElectron: boolean
}

declare global {
  interface Window {
    $syncStore?: {
      emit: (event: ElectronSyncEvent, data: any) => void
      on: (event: ElectronSyncEvent, callback: ElectronSyncCallback) => void
    },
  }
}

export function useElectronSync(): ElectronSync {
  const isElectron = typeof window !== 'undefined' && !!window.$syncStore

  function emitSync(event: ElectronSyncEvent, data: any) {
    if (isElectron) {
      console.log('emitSync', event, data)
      window.$syncStore!.emit(event, data)
    }
  }

  function onSync(event: ElectronSyncEvent, callback: ElectronSyncCallback) {
    if (isElectron) {
      console.log('onSync', event)
      window.$syncStore!.on(event, callback)
    }
  }

  return { emitSync, onSync, isElectron }
}