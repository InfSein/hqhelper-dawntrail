<script lang="ts" setup>
import { computed, inject, type Ref } from 'vue'
import { NButton } from 'naive-ui'
import ItemSpan from './ItemSpan.vue'
import { getItemInfo, type ItemInfo, type ItemTradeInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

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
</script>

<template>
  <!-- todo - 增加一个popup，内含物品汇总和复制宏的操作按钮 -->
  <n-button class="ts-btn" :title="t('点数')">
    <div class="w-full flex-column align-right">
      <p class="text">{{ t('点数') }}</p>
      <div class="tome-scripts">
        <div class="tome-script" v-for="(totalAmount, scriptID) in tomeScripts" :key="'tome-script-' + scriptID">
          <span class="amount">{{ totalAmount }}</span>
          <ItemSpan hide-name :item-info="getItemInfo(scriptID)" />
        </div>
        <div class="tome-script" v-if="!Object.keys(tomeScripts).length">
          <span class="amount">x0</span>
        </div>
      </div>
    </div>
  </n-button>
</template>

<style scoped>
:deep(.n-button__content){
  width: 100%;
  height: 100%;
}
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tome-scripts {
  display: flex;
  align-items: center;
  gap: 3px;

  .tome-script {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
}
</style>