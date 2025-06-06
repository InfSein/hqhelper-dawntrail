import { type Ref } from "vue"
import { XivCraftActions, type XivCraftAction } from '@/assets/data'
import type { UserConfigModel } from "@/models/config-user"
import type { FuncConfigModel } from "@/models/config-func"
import type { CraftMacroRow, RecordedCraftMacro } from "@/models/macromanage"
import { deepCopy } from "."
import { getItemInfo } from "./item"

const useMacroHelper = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userConfig: Ref<UserConfigModel>,
  funcConfig: Ref<FuncConfigModel>,
) => {
  /** 将生产宏转换为技能列表 */
  const parseCraftMacroText = (macro: string) => {
    const actions : string[] = []
    macro.split('\n').forEach(line => {
      const match = line.match(/\/(ac|action|技能)\s(?:"(.*?)"|(\S+))(?:\s?<wait\.\d+>)?/)
      const action = match?.[2] || match?.[3]
      if (action) actions.push(action)
    })
    const result: XivCraftAction[] = []
    actions.forEach(action => {
      const craftAction = Object.values(XivCraftActions).find(a => 
        a.name_zh === action || a.name_en === action || a.name_ja === action
      )
      if (craftAction) {
        result.push(craftAction)
      } else {
        console.warn(`Unknown action: ${action}`)
      }
    })
    return result
  }

  /** 将生产模拟器导出的工序转换为技能列表 */
  const parseCraftProcedure = (procedure: string) : XivCraftAction[] => {
    const procedures = JSON.parse(procedure) as string[]
    if (!Array.isArray(procedures) || !procedures?.length) {
      return []
    }
    const result: XivCraftAction[] = []
    procedures.forEach(p => {
      const craftAction = Object.values(XivCraftActions).find(a => 
        a.simulator_keys.includes(p)
      )
      if (craftAction) {
        result.push(craftAction)
      } else {
        console.warn(`Unknown procedure: ${p}`)
      }
    })
    return result
  }

  /** 计算生产宏消耗的CP */
  const calMacroCpCost = (actions: XivCraftAction[]) => {
    return actions.reduce((total, action, index) => {
      if (action.combo_actions && action.combo_cost_cp) {
        const in_combo = action.combo_actions.some(comboLink => {
          return comboLink.every((comboId, i) => actions[index - (comboLink.length - 1 - i)]?.id === comboId)
        })
        return total + (in_combo ? action.combo_cost_cp : action.cost_cp)
      } else {
        return total + action.cost_cp
      }
    }, 0)
  }

  /** 将技能列表按用户设置组装为宏 */
  const exportCraftMacroText = (_actions: XivCraftAction[]) => {
    const actions = deepCopy(_actions)

    let threshold = 15, pushLines = 14
    if (funcConfig.value.cmacro_use_macrolock) {
      threshold--; pushLines--
    }

    const columns : XivCraftAction[][] = []
    while (actions.length > 0) {
      if (actions.length > threshold) {
        columns.push(actions.splice(0, pushLines))
      } else {
        columns.push(actions.splice(0, actions.length))
      }
    }

    // 处理一些设置项的默认值
    const cmacro_transition_tipper_content = funcConfig.value.cmacro_transition_tipper_content || '/e Macro #~INDEX completed. <se.1>'
    const cmacro_end_tipper_content = funcConfig.value.cmacro_end_tipper_content || '/e Craft done! <se.14>'

    const result = {
      macros_zh: [] as string[],
      macros_en: [] as string[],
      macros_ja: [] as string[],
    }
    const linebreak = '\r\n'

    columns.forEach((column, index) => {
      const macro = {
        macro_zh: '',
        macro_en: '',
        macro_ja: '',
      }
      const langs = ['zh', 'en', 'ja']
      langs.forEach(_lang => {
        const lang = _lang as "zh" | "en" | "ja"
        if (funcConfig.value.cmacro_use_macrolock) {
          macro[`macro_${lang}`] += '/macrolock' + linebreak
        }
        column.forEach(action => {
          let actionName = action[`name_${lang}`]
          if (!funcConfig.value.cmacro_remove_quotes) {
            actionName = `"${actionName}"`
          }
          macro[`macro_${lang}`] += `/ac ${actionName} <wait.${action.wait_time}>${linebreak}`
        })

        if (column.length !== threshold) {
          if (column.length < pushLines) {
            macro[`macro_${lang}`] += cmacro_end_tipper_content + linebreak
          } else {
            macro[`macro_${lang}`] += cmacro_transition_tipper_content.replace('~INDEX', `${index + 1}`) + linebreak
          }
        }

        macro[`macro_${lang}`] = macro[`macro_${lang}`].slice(0, linebreak.length * -1)
        const _macro = deepCopy(macro)
        result[`macros_${lang}`].push(_macro[`macro_${lang}`])
      })
    })

    return result
  }

  /** 将表格行数据归档为缓存的宏内容 */
  const archiveMacroRow = (row: CraftMacroRow, customCpRequirement?: number) : RecordedCraftMacro => {
    const { id, name, remark, relateItems, tags, requirements, craftActions } = row
    return {
      id,
      name,
      remark,
      relateItems: relateItems.map(item => {
        if (typeof item === 'string') {
          return item
        } else {
          return item.id
        }
      }),
      tags,
      requirements: {
        craftsmanship: requirements.craftsmanship,
        control: requirements.control,
        cp: customCpRequirement ?? calMacroCpCost(craftActions),
      },
      craftActions: craftActions.map(action => action.id),
    }
  }
  /** 将缓存的宏内容解档为表格行数据 */
  const unarchiveMacroRow = (macro: RecordedCraftMacro) : CraftMacroRow => {
    const relateItems = macro.relateItems.map(item => {
      if (typeof item === 'number') {
        return getItemInfo(item)
      } else {
        return item
      }
    })
    const craftActions = macro.craftActions.map(actionid => XivCraftActions[actionid])
    const cpRequirement = calMacroCpCost(craftActions)

    return {
      id: macro.id,
      name: macro.name,
      remark: macro.remark,
      relateItems: relateItems,
      tags: macro.tags,
      requirements: {
        craftsmanship: macro.requirements?.craftsmanship,
        control: macro.requirements?.control,
        cp: macro.requirements?.cp ?? cpRequirement,
      },
      craftActions: craftActions,
    }
  }

  return {
    /** 将生产宏转换为技能列表 */
    parseCraftMacroText,
    /** 将生产模拟器导出的工序转换为技能列表 */
    parseCraftProcedure,
    /** 计算生产宏消耗的CP */
    calMacroCpCost,
    /** 将技能列表按用户设置组装为宏 */
    exportCraftMacroText,
    /** 将表格行数据归档为缓存的宏内容 */
    archiveMacroRow,
    /** 将缓存的宏内容解档为表格行数据 */
    unarchiveMacroRow,
  }
}

export default useMacroHelper