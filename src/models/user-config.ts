import type { ItemPriceInfo } from "@/tools/item"

export interface UserConfigModel {
  // #region 在偏好设置弹窗中设置的配置项
  // * general
  /** 界面语言 */
  language_ui: 'zh' | 'en' | 'ja'
  /** 物品语言 */
  language_item: 'auto' | 'zh' | 'en' | 'ja'
  /** 服务器 */
  item_server: 'auto' | 'chs' | 'global'
  // * appearance
  /** 主题 */
  theme: 'light' | 'dark' | 'system'
  /** 自定义字体 */
  custom_font: string
  /** 字体大小 */
  custom_font_size: string
  /** 隐藏物品按钮的职业图标 */
  hide_collector_icons: boolean
  // * enhancements
  /** 禁用选择版本后自动折叠 */
  disable_patchcard_autofold: boolean
  /** 禁用重复点击已选择的职业按钮时添加主副手 */
  disable_jobbtn_doubleclick: boolean
  /** 使用旧版本制作报表 */
  use_traditional_statement: boolean
  /** 手动控制二级悬浮窗 */
  click_to_show_pop_in_span: boolean
  /** 点击“复制宏”时直接复制 */
  macro_direct_copy: boolean
  /** 默认宏前缀 */
  macro_copy_prefix: string
  /** 点击物品按钮时的行为 */
  item_button_click_event: 'none' | 'copy_name' | 'copy_isearch'
  /** 点击物品信息图标时的行为 */
  item_info_icon_click_event: 'none' | 'copy_name' | 'copy_isearch'
  /** 材料清单格式 */
  item_list_style: 'standard' | 'teamcraft'
  // * performance
  /** 禁用工作状态记忆 */
  disable_workstate_cache: boolean
  // * special
  /** 物品价格服务器 */
  universalis_server: string
  /** 物品价格类型 */
  universalis_priceType: 'averagePrice' | 'currentAveragePrice' | 'minPrice' | 'maxPrice' | 'marketLowestPrice' | 'marketPrice' | 'purchasePrice'
  /** 物品价格有效期 */
  universalis_expireTime: number
  // * update
  /** 禁用自动更新 */
  disable_auto_update: boolean
  // #endregion
  
  // #region 在其他界面中设置的配置项
  // * tome-script-button
  /** 在点数按钮的统计中显示双色宝石兑换物 */
  tomescript_show_bicolor_items: boolean
  // * craft-statements
  /** 专业版制作报表：使用详细模式展示物品 */
  statement_show_item_details: boolean
  // * recomm. processes
  /** 推荐流程：显示采集详情 */
  processes_show_item_gatherdetails: boolean
  // #endregion

  // #region 隐藏的配置项/缓存
  cache_lasttime_version: string
  cache_ui_fold: any
  cache_work_state: any
  cache_item_prices: Record<number, ItemPriceInfo>
  fthelper_cache_work_state: any
  gatherclock_cache_work_state: any
  // #endregion
}

// eslint-disable-next-line no-var
const defaultUserConfig: UserConfigModel = {
  // general
  language_ui: 'zh',
  language_item: 'auto',
  item_server: 'auto',
  // appearance
  theme: 'light',
  custom_font: '',
  custom_font_size: '14px',
  hide_collector_icons: false,
  // enhancements
  disable_patchcard_autofold: false,
  disable_jobbtn_doubleclick: false,
  use_traditional_statement: false,
  click_to_show_pop_in_span: false,
  macro_direct_copy: false,
  macro_copy_prefix: '',
  item_button_click_event: 'none',
  item_info_icon_click_event: 'none',
  item_list_style: 'standard',
  // performance
  disable_workstate_cache: false,
  // special
  universalis_server: '红玉海',
  universalis_priceType: 'averagePrice',
  universalis_expireTime: 6 * 60 * 60 * 1000, // 默认6小时
  // update
  disable_auto_update: false,
  
  // tome-script-button
  tomescript_show_bicolor_items: false,

  // craft-statements
  statement_show_item_details: true,

  // recomm. processes
  processes_show_item_gatherdetails: false,

  // hidden options
  cache_lasttime_version: 'none',
  cache_ui_fold: {}, // active cache, { key:string -> value:boolean }
  cache_work_state: {}, // active cache, view struct in `MainPage.vue` 's `workState`
  cache_item_prices: {},
  fthelper_cache_work_state: {},
  gatherclock_cache_work_state: {}
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