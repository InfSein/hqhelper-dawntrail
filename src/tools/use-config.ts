import { computed, type Ref } from "vue"
import type { UserConfigModel } from "@/models/config-user"
import type { FuncConfigModel } from "@/models/config-func"

/** 获取与用户配置相关的计算属性 */
const useConfig = (
  userConfig: Ref<UserConfigModel>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  funcConfig: Ref<FuncConfigModel>,
) => {
  /** 界面语言 */
  const uiLanguage = computed(() => {
    return userConfig.value.language_ui
  })
  /** 物品语言 */
  const itemLanguage = computed(() => {
    if (userConfig.value.language_item !== 'auto') {
      return userConfig.value.language_item
    }
    return userConfig.value.language_ui
  })

  return {
    /** 界面语言 */
    uiLanguage,
    /** 物品语言 */
    itemLanguage,
  }
}

export default useConfig