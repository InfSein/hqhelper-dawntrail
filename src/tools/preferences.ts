import { compressString, decompressString } from '@/tools'
import { type UserConfigModel, fixUserConfig } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'

interface Preferences {
  u: UserConfigModel
  f: FuncConfigModel
}

export const exportPreferences = (userConfig: UserConfigModel, funcConfig: FuncConfigModel) => {
  const o : Preferences = { u: userConfig, f: funcConfig }
  return compressString(JSON.stringify(o))
}

export const importPreferences = (str: string) => {
  try {
    const o = JSON.parse(decompressString(str)) as Preferences
    return {
      u: fixUserConfig(o.u),
      f: fixFuncConfig(o.f, o.u)
    }
  } catch (e) {
    return {
      u: fixUserConfig(),
      f: fixFuncConfig()
    }
  }
}