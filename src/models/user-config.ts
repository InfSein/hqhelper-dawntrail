export interface UserConfigModel {
  // general
  theme: 'light' | 'dark' | 'system'
  language_ui: 'zh' | 'en' | 'ja'
  language_item: 'auto' | 'zh' | 'en' | 'ja'
  // enhancements
  disable_patchcard_autofold: boolean
  disable_jobbtn_doubleclick: boolean
  // performance
  disable_workstate_cache: boolean
  // network
  disable_api_mirror: boolean

  // hidden options
  cache_ui_fold: any
  cache_work_state: any
}

// eslint-disable-next-line no-var
export var defaultUserConfig: UserConfigModel = {
  theme: 'light',
  language_ui: 'zh',
  language_item: 'auto',
  disable_patchcard_autofold: false,
  disable_jobbtn_doubleclick: false,
  disable_workstate_cache: false,
  disable_api_mirror: false,

  cache_ui_fold: {}, // active cache, { key:string -> value:boolean }
  cache_work_state: {}, // active cache, view struct in `MainPage.vue` 's `workState`
}
