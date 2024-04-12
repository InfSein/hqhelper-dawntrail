interface UserConfigModel {
  ui_size_preset: '1080p' | '2k' | '4k'
  theme: 'light' | 'dark' | 'system'
  language_ui: 'zh' | 'en' | 'ja'
  disable_xivapi_mirror: boolean
}
export type { UserConfigModel };

// eslint-disable-next-line no-var
export var defaultUserConfig: UserConfigModel = {
  ui_size_preset: '2k',
  theme: 'light',
  language_ui: 'zh',
  disable_xivapi_mirror: false
}
