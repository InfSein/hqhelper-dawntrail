<script lang="ts" setup>
import { computed, inject, ref, type Ref } from 'vue'
import { 
  NButton, NDivider, NEmpty, NIcon, NPopover, NSwitch,
  useMessage
} from 'naive-ui'
import {
  CodeSharp
} from '@vicons/material'
import ItemSpan from '../item/ItemSpan.vue'
import { getItemInfo, type ItemInfo, type ItemTradeInfo } from '@/tools/item'
import { fixUserConfig, type UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'
import type { MacroGenerateMode } from '@/models/config-func'
import { useStore } from '@/store'
import UseConfig from '@/tools/use-config'

const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
const copyAsMacro = inject<(macroMap: Record<MacroGenerateMode, string>, container?: HTMLElement | undefined) => Promise<{
  result: "success" | "info" | "error";
  msg: string;
} | undefined>>('copyAsMacro')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const {
  itemLanguage,
} = UseConfig(userConfig, funcConfig)

const props = defineProps({
  /**
   * 点数素材列表
   * * key: 点数的id
   * * value: [item, item, ...]
   */
  items: {
    type: Object as () => Record<number, ItemInfo[]>,
    required: true
  },
  tradeMap: {
    type: Object as () => Record<number, ItemTradeInfo>,
    required: true
  }
})

const showBiColorItems = ref(userConfig.value.tomescript_show_bicolor_items)
const handleShowBiColorItemsChange = (val: boolean) => {
  const newConfig = fixUserConfig(store.state.userConfig)
  newConfig.tomescript_show_bicolor_items = val ?? false
  store.commit('setUserConfig', newConfig)
}

const getTradeCost = (itemTradeInfo: ItemTradeInfo) => {
  let server = userConfig.value.item_server
  if (!server || server === 'auto') {
    const lang = userConfig.value.language_ui
    if (lang === 'zh') {
      server = 'chs'
    } else {
      server = 'global'
    }
  }
  return server === 'chs' ? itemTradeInfo?.costCHS : itemTradeInfo?.costGlobal
}
const getItemPrice = (itemInfo: ItemInfo) => {
  const itemID = itemInfo.id
  const tradeCost = getTradeCost(props.tradeMap[itemID])
  return tradeCost?.costCount ?? 0
}
const tomeScripts = computed(() => {
  const summary = {} as Record<number, number>
  for (const item in props.items) {
    let count = 0
    props.items[item].forEach(itemInfo => {
      count += itemInfo.amount * getItemPrice(itemInfo)
    })
    summary[item] = count
  }
  return summary
})

const getItemName = (itemInfo: ItemInfo) => {
  switch (itemLanguage.value) {
    case 'zh':
      return itemInfo.name_zh || '未翻译的物品'
    default:
      return itemInfo[`name_${itemLanguage.value}`]
  }
}
const getItemAmount = (amount: number) => {
  return userConfig.value.item_amount_use_comma
    ? amount.toLocaleString()
    : amount
}

const macroMap = computed(() : Record<MacroGenerateMode, string> => {
  const result: Record<MacroGenerateMode, string> = {
    singleLine: '',
    multiLine: ''
  }

  for (const _tomeScriptID in props.items) {
    const tomeScriptID = Number(_tomeScriptID)
    let tomeScriptName = getItemName(getItemInfo(tomeScriptID))

    // Group Title
    result.multiLine += `【${tomeScriptName}】x${tomeScripts.value[tomeScriptID]}\n`
    if (itemLanguage.value === 'en') {
      tomeScriptName = `"${tomeScriptName}"`
    }
    result.singleLine += `[${tomeScriptName}x${tomeScripts.value[tomeScriptID]}] `

    const slItems : string[] = []
    const mlItems : string[] = []
    props.items[tomeScriptID].forEach(item => {
      if (item.amount) {
        let itemName = getItemName(item)
        mlItems.push(`・${itemName} x${item.amount}`)
        if (itemLanguage.value === 'en') {
          itemName = `"${itemName}"`
        }
        slItems.push(`${itemName}x${item.amount}`)
      }
    })
    result.singleLine += slItems.join(', ') + '; '
    result.multiLine += mlItems.join('\n') + '\n'
  }

  result.multiLine = result.multiLine.trim()
  return result
})

const copyBtnLoading = ref(false)
const handleCopyAsMacro = async () => {
  copyBtnLoading.value = true
  const response = await copyAsMacro(macroMap.value)
  if (response) {
    NAIVE_UI_MESSAGE[response.result](response.msg)
  }
  copyBtnLoading.value = false
}
</script>

<template>
  <n-popover
    :trigger="isMobile ? 'click' : 'hover'"
    :placement="isMobile ? 'bottom' : 'right-start'"
    :style="{ maxWidth: isMobile ? 'unset' : '320px' }"
  >
    <template #trigger>
      <n-button class="ts-btn" :title="t('common.tomescript')">
        <div class="w-full flex-col align-right">
          <p class="text">{{ t('common.tomescript') }}</p>
          <div class="tome-scripts">
              <div class="tome-script" v-for="(totalAmount, scriptID) in tomeScripts" :key="'tome-script-' + scriptID">
                <span class="amount">{{ getItemAmount(totalAmount) }}</span>
                <ItemSpan hide-name hide-pop-icon :item-info="getItemInfo(scriptID)" />
              </div>
              <div class="tome-script" v-if="!Object.keys(tomeScripts).length">
                <span class="amount">x0</span>
              </div>
            </div>
          </div>
      </n-button>
    </template>

    <div class="pop-wrapper">
      <div class="pop-header">
        <p>{{ t('statistics.tomescript.title') }}</p>
      </div>
      <n-divider class="block-divider" />
      <div class="pre">
        <div class="preset-item">
          <n-switch v-model:value="showBiColorItems" @update:value="handleShowBiColorItemsChange" :round="false" size="small" />
          <div>{{ t('statistics.tomescript.show_bicolor_items') }}</div>
        </div>
      </div>
      <div class="items">
        <div class="item" v-for="(itemInfos, scriptID) in items" :key="'popup-tome-' + scriptID">
          <div class="line">
            <ItemSpan :item-info="getItemInfo(scriptID)" :amount="tomeScripts[scriptID]" show-amount />
          </div>
          <n-divider class="item-divider" />
          <div class="content">
            <div class="line" v-for="(itemInfo, index) in itemInfos" :key="'popup-tome-' + scriptID + '-' + index">
              <ItemSpan :item-info="getItemInfo(itemInfo.id)" :amount="itemInfo.amount" show-amount />
            </div>
          </div>
        </div>
        <div v-if="!Object.keys(items).length">
          <n-empty :description="t('common.no_required_items')" />
        </div>
      </div>
      <n-divider class="block-divider" />
      <div class="actions">
        <n-button size="tiny" :loading="copyBtnLoading" :disabled="copyBtnLoading" @click="handleCopyAsMacro">
          <template #icon>
            <n-icon><CodeSharp /></n-icon>
          </template>
          {{ t('common.appfunc.copy_macro') }}
        </n-button>
      </div>
    </div>
  </n-popover>
</template>

<style scoped>
:deep(.n-button__content){
  width: 100%;
  height: 100%;
}
.item-divider {
  margin: 0 2px;
}
.block-divider {
  margin: 5px 0;
}
.ts-btn {
  width: 100%;
  height: 100%;
  padding: 5px;
}
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tome-scripts-ellipsis {
  flex-shrink: 0;
}
.tome-scripts {
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: flex-end;
  max-width: 100%;
  margin-left: auto;
  overflow: hidden;

  .tome-script {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: auto;
  }
}
.pop-wrapper {
  .pop-header {
    display: flex;
    align-items: center;
    font-size: calc(var(--n-font-size) + 2px);
    line-height: 1.2;

    p { font-weight: bold; }
  }
  .pre {
    margin-bottom: 5px;

    .preset-item {
      width: fit-content;
      line-height: 1.2;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 3px;
      border: 1px solid #18A058;
      border-radius: 3px;
    }
  }
  .items {
    line-height: 1.2;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .item .content {
      margin-left: 1em;
    }
    .item .line {
      display: flex;
      gap: 3px;
    }
  }
}
</style>