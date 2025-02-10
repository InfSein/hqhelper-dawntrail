import type { Component } from "vue"
import type { CascaderOption } from "naive-ui"
import type { UserConfigKey } from "./config-user"
import type { FuncConfigKey } from "./config-func"

export interface AppVersionJson {
  hqhelper: string;
  electron: string;
  dlink_hqhelper: string;
  dlink_electron: string;
}

export interface PreferenceGroup {
  key: "userConfig" | "funcConfig" | "about"
  text: string
  settings: SettingGroup[]
}
export type SettingGroupKey = UserConfigKey | FuncConfigKey | "about_app"
export interface SettingGroup {
  key: SettingGroupKey
  icon: Component
  text: string
  children: SettingItem[]
}
export interface SettingItem {
  key: string
  label: string
  hide?: boolean
  descriptions?: {
    value: string
    class: string
    style: string
  }[]
  warnings?: {
    value: string
    class: string
    style: string
  }[]
  type: 'radio-group' | 'switch' | 'select' | 'cascader' | 'string'
  multiple?: boolean
  options?: CascaderOption[]
  require_reload?: boolean
}