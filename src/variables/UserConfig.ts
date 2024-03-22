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
