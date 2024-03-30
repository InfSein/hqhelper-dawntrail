interface UserConfigModel {
  theme: 'light' | 'dark' | 'system'
  language_ui: 'zh' | 'en' | 'ja'
  disable_xivapi_mirror: boolean
}
export type { UserConfigModel };

// eslint-disable-next-line no-var
export var defaultUserConfig: UserConfigModel = {
  theme: 'light',
  language_ui: 'zh',
  disable_xivapi_mirror: false
}
