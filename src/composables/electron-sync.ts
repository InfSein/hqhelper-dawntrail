type Callback = (data: any) => void

interface ElectronSync {
  emitSync: (event: string, data: any) => void
  onSync: (event: string, callback: Callback) => void
  isElectron: boolean
}

declare global {
  interface Window {
    $syncStore?: {
      emit: (event: string, data: any) => void
      on: (event: string, callback: Callback) => void
    }
  }
}

export function useElectronSync(): ElectronSync {
  const isElectron = typeof window !== 'undefined' && !!window.$syncStore

  function emitSync(event: string, data: any) {
    console.log('emit-sync was called', isElectron, data)
    if (isElectron) {
      window.$syncStore!.emit(event, data)
    }
  }

  function onSync(event: string, callback: Callback) {
    if (isElectron) {
      window.$syncStore!.on(event, callback)
    }
  }

  return { emitSync, onSync, isElectron }
}