import { defineStore } from 'pinia'
import { getItem, setItem } from './storage'
import { _user_config, _func_config, _cloud_config } from './keys'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'
import type { CloudConfigModel } from '@/models/config-cloud'

export const useStore = defineStore('main', {
  state: () => ({
    userConfig: getItem<UserConfigModel>(_user_config),
    funcConfig: getItem<FuncConfigModel>(_func_config),
    cloudConfig: getItem<CloudConfigModel>(_cloud_config),
  }),
  actions: {
    setUserConfig(value: UserConfigModel) {
      this.userConfig = value
      setItem(_user_config, value)
    },
    setFuncConfig(value: FuncConfigModel) {
      this.funcConfig = value
      setItem(_func_config, value)
    },
    setCloudConfig(value: CloudConfigModel) {
      this.cloudConfig = value
      setItem(_cloud_config, value)
    }
  }
})