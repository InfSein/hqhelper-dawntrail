import { compressString, decompressString, deepCopy } from '@/tools'
import { type UserConfigModel, fixUserConfig } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'

interface Preferences {
  u: UserConfigModel
  f: FuncConfigModel
}

export const exportPreferences = (userConfig: UserConfigModel, funcConfig: FuncConfigModel) => {
  // 删除缓存项目，减轻导出字符体积
  const u = deepCopy(userConfig)
  delete u.cache_work_state
  delete u.fthelper_cache_work_state
  delete u.gatherclock_cache_work_state
  const f = deepCopy(funcConfig)
  f.cache_item_prices = {}
  const o : Preferences = { u, f }
  return compressString(JSON.stringify(o))
}

export const importPreferences = (str: string) => {
  const o = JSON.parse(decompressString(str)) as Preferences
  return {
    u: fixUserConfig(o.u),
    f: fixFuncConfig(o.f, o.u)
  }
}