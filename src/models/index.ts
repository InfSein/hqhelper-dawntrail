import type { Component } from "vue"
import type { CascaderOption } from "naive-ui"

export interface AppVersionJson {
  hqhelper: string;
  electron: string;
  dlink_hqhelper: string;
  dlink_electron: string;
}

export interface SettingGroup {
  key: string
  icon: Component
  text: string
  children: SettingOption[]
}
export interface SettingOption {
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
  options?: CascaderOption[]
}