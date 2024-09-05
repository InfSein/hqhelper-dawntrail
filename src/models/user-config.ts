export interface UserConfigModel {
  // general
  theme: 'light' | 'dark' | 'system'
  language_ui: 'zh' | 'en' | 'ja'
  language_item: 'auto' | 'zh' | 'en' | 'ja'
  item_server: 'auto' | 'chs' | 'global'
  // enhancements
  item_button_click_event: 'none' | 'copy_name' | 'copy_isearch'
  disable_patchcard_autofold: boolean
  disable_jobbtn_doubleclick: boolean
  macro_direct_copy: boolean
  macro_copy_prefix: string
  // performance
  disable_workstate_cache: boolean
  // network
  github_mirror_site: string
  // update
  disable_auto_update: boolean

  // hidden options
  cache_ui_fold: any
  cache_work_state: any
  fthelper_cache_work_state: any
}

// eslint-disable-next-line no-var
const defaultUserConfig: UserConfigModel = {
  theme: 'light',
  language_ui: 'zh',
  language_item: 'auto',
  item_server: 'auto',
  item_button_click_event: 'none',
  disable_patchcard_autofold: false,
  disable_jobbtn_doubleclick: false,
  macro_direct_copy: false,
  macro_copy_prefix: '',
  disable_workstate_cache: false,
  github_mirror_site: 'https://mirror.ghproxy.com',
  disable_auto_update: false,

  cache_ui_fold: {}, // active cache, { key:string -> value:boolean }
  cache_work_state: {}, // active cache, view struct in `MainPage.vue` 's `workState`
  fthelper_cache_work_state: {},
}

/**
 * 修正用户配置，将其合并到默认配置中
 * 如果用户配置中有未定义的字段，则会使用默认配置中的值覆盖
 * 这样可以在添加配置项后保持对旧版本缓存的兼容性
 * @param config 传入缓存中的用户配置：`store.state.userConfig`
 * @returns 修正后的用户配置
 */
export const fixUserConfig = (config?: UserConfigModel) => {
  // 处理特定环境下的设置项
  if (!config) {
    config = {} as UserConfigModel

    // 用户初次访问时，尝试根据系统语言自动设置UI语言
    const systemLanguage = navigator?.language ?? ''
    if (systemLanguage?.startsWith('en')) {
      config.language_ui = 'en'
    } else if (systemLanguage.startsWith('ja')) {
      config.language_ui = 'ja'
    }
  }
  
  // 处理其他的设置项
  return assignDefaults(defaultUserConfig, config || {}) as UserConfigModel

  function assignDefaults(defaultConfig: any, currentConfig: any): any {
    for (const key in defaultConfig) {
      if (Object.prototype.hasOwnProperty.call(defaultConfig, key)) {
        if (typeof defaultConfig[key] === 'object' && !Array.isArray(defaultConfig[key]) && defaultConfig[key] !== null) {
          currentConfig[key] = assignDefaults(defaultConfig[key], currentConfig[key] || {});
        } else {
          currentConfig[key] = currentConfig[key] !== undefined ? currentConfig[key] : defaultConfig[key];
        }
      }
    }
    return currentConfig;
  }
}