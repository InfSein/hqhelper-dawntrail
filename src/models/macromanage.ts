import type { XivCraftAction } from '@/assets/data'
import {
  assignDefaults,
  deepCopy
} from '@/tools'
import type { ItemInfo } from '@/tools/item'

export const _VAR_TAG_MAXLEN = 5
export const _VAR_REMARK_MAXLINE = 3
export const _VAR_RELATEITEM_MAXLEN = 99
export const _VAR_TABLESHOW_RELATEITEM_MAXLEN = 3
export const _VAR_MACRO_MAXAMOUNT = 500

export interface RecordedCraftMacro {
  id: number,
  name: string,
  remark: string,
  /** 关联的物品 (数据库里没有的物品以字符串形式存储名称) */
  relateItems: (number|string)[],
  /** 用户自定义标签 */
  tags: string[],
  /** 此生产宏的属性要求 */
  requirements: {
    /** 作业精度 */
    craftsmanship?: number,
    /** 加工精度 */
    control?: number,
    /** 制作力 */
    cp?: number,
  },
  craftActions: number[],
}
const defaultCraftMacro: RecordedCraftMacro = {
  id: -1,
  name: '',
  remark: '',
  relateItems: [],
  tags: [],
  requirements: {},
  craftActions: []
}
export const getDefaultCraftMacro = (id: number) => {
  const macro = deepCopy(defaultCraftMacro)
  macro.id = id
  return macro
}

export interface CraftMacroRow {
  id: number,
  name: string,
  remark: string,
  /** 关联的物品 */
  relateItems: (ItemInfo|string)[],
  /** 用户自定义标签 */
  tags: string[],
  /** 此生产宏的属性要求 */
  requirements: {
    /** 作业精度 */
    craftsmanship?: number,
    /** 加工精度 */
    control?: number,
    /** 制作力 */
    cp: number,
  },
  craftActions: XivCraftAction[],
}

export interface WorkState {
  searchKeyword: string;
  macroItemLanguage: "zh" | "en" | "ja";
  recordIndex: number;
  recordedCraftMacros: RecordedCraftMacro[];
}
export const defaultWorkState: WorkState = {
  searchKeyword: '',
  macroItemLanguage: 'zh',
  recordIndex: 1,
  recordedCraftMacros: []
}

export const fixWorkState = (state?: WorkState) : WorkState => {
  const _state = assignDefaults(defaultWorkState, state || {}) as WorkState
  return _state
}