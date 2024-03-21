import { useStore } from '@/store'

interface UserConfigModel {
  theme: 'light' | 'dark' | 'system'
  language_ui: 'zh' | 'en' | 'ja'
}
export type { UserConfigModel };

// eslint-disable-next-line no-var
export var defaultUserConfig: UserConfigModel = {
  theme: 'light',
  language_ui: 'zh'
}

class UserConfig {
  static get theme() {
    const store = useStore()
    return store.state.userConfig?.theme ?? defaultUserConfig.theme
  }
  static set theme(value: UserConfigModel['theme']) {
    const store = useStore()
    const userConfig = store.state.userConfig
    userConfig.theme = value
    store.commit('updateUserConfig', userConfig)
  }

  static get language_ui() {
    const store = useStore()
    return store.state.userConfig?.language_ui ?? defaultUserConfig.language_ui
  }
  static set language_ui(value: UserConfigModel['language_ui']) {
    const store = useStore()
    const userConfig = store.state.userConfig
    userConfig.language_ui = value
    store.commit('updateUserConfig', userConfig)
  }
}

export default UserConfig