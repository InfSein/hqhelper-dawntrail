import { type InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { getItem, setItem } from './storage'

// * Save store-keys into certain 'keys' file
import {
  _user_config
} from './keys'

// * Import model or default value here
import { type UserConfigModel, defaultUserConfig } from '@/models/user-config'

// * Define states
const state = {
  // Use `getItem` to get object state,
  // and use `getString` to get string state.
  userConfig: getItem<UserConfigModel>(_user_config) || defaultUserConfig
}
export type State = typeof state

// * Export store and injection key
export const key: InjectionKey<Store<State>> = Symbol('store')
export const store = createStore<State>({
  state,
  mutations: {
    setUserConfig (state : State, value : UserConfigModel) {
      state.userConfig = value
      setItem(_user_config, value)
    }
  }
})

// * Export useStore

/**
 * Vuex store (app cache)
 * 
 * @import
 * ```ts
 * import { useStore } from '@/store/index'
 * const store = useStore()
 * ```
 * @get like `store.state.objName`
 * @set like `store.commit('mutation-key', value)`
 */
export function useStore () {
  return baseUseStore(key)
}

