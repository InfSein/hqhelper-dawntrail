import type { ItemPriceInfo } from "@/tools/item"
import type { UserConfigModel } from "./config-user"
import { deepCopy } from "@/tools"

export type FuncConfigKey = "copy_macro" | "craft_statement" | "recomm_process" | "cost_benefit"

export interface FuncConfigModel {
  // #region 在偏好设置弹窗中设置的配置项
  // * 复制宏
  /** 点击“复制宏”时直接复制 */
  macro_direct_copy: boolean
  /** 默认宏前缀 */
  macro_copy_prefix: string

  // * 制作报表
  /** 使用旧版本制作报表 */
  use_traditional_statement: boolean
  /** 专业版制作报表：使用简洁模式展示物品 */
  prostate_concise_mode: boolean

  // * 推荐流程
  processes_show_item_details: boolean

  // * 物品价格
  /** 物品价格服务器 */
  universalis_server: string
  /** 物品价格类型 */
  universalis_priceType: 'averagePrice' | 'currentAveragePrice' | 'minPrice' | 'maxPrice' | 'marketLowestPrice' | 'marketPrice' | 'purchasePrice'
  /** 物品价格有效期 */
  universalis_expireTime: number
  // #endregion

  // #region 隐藏的配置项/缓存
  cache_item_prices: Record<number, ItemPriceInfo>
  // #endregion
}

const defaultFuncConfig: FuncConfigModel = {
  // * 复制宏
  macro_direct_copy: false,
  macro_copy_prefix: '',
  // * 制作报表
  use_traditional_statement: false,
  prostate_concise_mode: false,
  // * 推荐流程
  processes_show_item_details: false,
  // * 物品价格
  universalis_server: '红玉海',
  universalis_priceType: 'averagePrice',
  universalis_expireTime: 6 * 60 * 60 * 1000, // 默认6小时
  // * 缓存
  cache_item_prices: {},
}

export const fixFuncConfig = (config?: FuncConfigModel, userConfig?: UserConfigModel) => {
  // 处理特定环境下的设置项
  if (!config) {
    config = {} as FuncConfigModel
  }

  // 继承旧版本设置
  if (userConfig) {
    const _userConfig = userConfig as any
    config.macro_direct_copy ??= _userConfig.macro_direct_copy || defaultFuncConfig.macro_direct_copy
    config.macro_copy_prefix ??= _userConfig.macro_copy_prefix || defaultFuncConfig.macro_copy_prefix
    config.use_traditional_statement ??= _userConfig.use_traditional_statement || defaultFuncConfig.use_traditional_statement
    if (_userConfig.statement_show_item_details === false) {
      config.prostate_concise_mode = true
    }
    config.processes_show_item_details ??= _userConfig.processes_show_item_gatherdetails || defaultFuncConfig.processes_show_item_details
    config.universalis_server ??= _userConfig.universalis_server || defaultFuncConfig.universalis_server
    config.universalis_priceType ??= _userConfig.universalis_priceType || defaultFuncConfig.universalis_priceType
    config.universalis_expireTime ??= _userConfig.universalis_expireTime || defaultFuncConfig.universalis_expireTime
    config.cache_item_prices ??= deepCopy(_userConfig.cache_item_prices)
  }

  // 处理其他的设置项
  return assignDefaults(defaultFuncConfig, config || {}) as FuncConfigModel

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