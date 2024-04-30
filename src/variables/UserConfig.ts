interface UserConfigModel {
  ui_size_preset: '1080p' | '2k' | '4k'
  theme: 'light' | 'dark' | 'system'
  language_ui: 'zh' | 'en' | 'ja'
  disable_workstate_cache: boolean
  disable_api_mirror: boolean

  // hidden options
  cache_ui_fold: any
  cache_work_state: any
}
export type { UserConfigModel };

// eslint-disable-next-line no-var
export var defaultUserConfig: UserConfigModel = {
  ui_size_preset: '2k',
  theme: 'light',
  language_ui: 'zh',
  disable_workstate_cache: false,
  disable_api_mirror: false,

  cache_ui_fold: {}, // active cache, { key:string -> value:boolean }
  cache_work_state: {}, // active cache, view struct in `MainPage.vue` 's `workState`
}
