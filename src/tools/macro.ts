import { computed, type Ref } from "vue"
import type { UserConfigModel } from "@/models/config-user"
import type { FuncConfigModel } from "@/models/config-func"
import { XivCraftActions, type XivCraftAction } from '@/assets/data'

const useMacroHelper = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userConfig: Ref<UserConfigModel>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  funcConfig: Ref<FuncConfigModel>,
) => {
  /** 将生产宏转换为技能列表 */
  const parseCraftMacroText = (macro: string) => {
    const actions : string[] = []
    macro.split('\n').forEach(line => {
      const action = line.match(/\/ac\s"?(.*?)"?\s(<wait\.\d+>|)/)?.[1]
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

  return {
    /** 将生产宏转换为技能列表 */
    parseCraftMacroText,
    /** 将生产模拟器导出的工序转换为技能列表 */
    parseCraftProcedure,
  }
}

export default useMacroHelper