import {
  assignDefaults
} from '@/tools'

export interface CloudConfigModel {
  /** NBB云账户头像 */
  nbb_account_avatar: number,
  /** NBB云账户昵称 */
  nbb_account_nickname: string,
  /** NBB云账户密钥 */
  nbb_account_token: string,
}

const defaultCloudConfig: CloudConfigModel = {
  nbb_account_avatar: 0,
  nbb_account_nickname: '',
  nbb_account_token: '',
}

/**
 * 修正用户配置，将其合并到默认配置中
 * 如果用户配置中有未定义的字段，则会使用默认配置中的值覆盖
 * 这样可以在添加配置项后保持对旧版本缓存的兼容性
 * @param config 传入缓存中的用户配置：`store.state.cloudConfig`
 * @returns 修正后的用户配置
 */
export const fixCloudConfig = (config?: CloudConfigModel) => {
  // 处理特定环境下的设置项
  if (!config) {
    config = {} as CloudConfigModel
  }
  
  // 处理其他的设置项
  return assignDefaults(defaultCloudConfig, config || {}) as CloudConfigModel
}