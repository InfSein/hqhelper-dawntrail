<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NInput, NPopover, NRadio, NRadioGroup
} from 'naive-ui'
import ButtonCopyAsMacro from './ButtonCopyAsMacro.vue'
import type { ItemInfo, StatementRow } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config'
import { deepCopy } from '@/tools'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})
const getItemName = (itemInfo: ItemInfo) => {
  switch (itemLanguage.value) {
    case 'ja':
      return itemInfo.nameJA
    case 'en':
      return itemInfo.nameEN
    case 'zh':
    default:
      return itemInfo.nameZH
  }
}

interface ItemListPopProps {
  rows: StatementRow[]
}
const props = defineProps<ItemListPopProps>()

const amountRule = ref<"all" | "prepared" | "remaining">('all')
const listPopContainer = ref<HTMLElement>()

const items = computed(() => {
  const arr : ItemInfo[] = []
  props.rows.filter(row => {
    switch (amountRule.value) {
      case 'all':
        return true
      case 'prepared':
        return row.amount.prepared > 0
      case 'remaining':
        return row.amount.remain > 0
    }
  }).forEach(row => {
    const item = deepCopy(row.info)
    switch (amountRule.value) {
      case 'all': item.amount = row.amount.total; break
      case 'prepared': item.amount = row.amount.prepared; break
      case 'remaining': item.amount = row.amount.remain; break
    }
    arr.push(item)
  })
  return arr
})
const listValue = computed(() => {
  const result : string[] = []
  items.value.forEach(item => {
    if (item.amount) {
      if (userConfig.value.item_list_style === 'teamcraft') {
        result.push(`${item.amount}x ${getItemName(item)}`)
      } else {
        result.push(`${getItemName(item)} x ${item.amount}`)
      }
    }
  })
  return result.join('\n')
})
</script>

<template>
  <n-popover
    :trigger="isMobile ? 'click' : 'hover'"
    :placement="isMobile ? 'bottom' : 'right-start'"
    :width="290"
  >
    <template #trigger>
      <slot />
    </template>

    <div class="wrapper" ref="listPopContainer">
      <div class="config-container">
        <div class="config-item">
          {{ t('数量使用：') }}
          <n-radio-group
            v-model:value="amountRule"
            name="amount-rule"
          >
            <n-radio value="all">
              {{ t('总需') }}
            </n-radio>
            <n-radio value="prepared">
              {{ t('已有') }}
            </n-radio>
            <n-radio value="remaining">
              {{ t('尚需') }}
            </n-radio>
          </n-radio-group>
        </div>
      </div>
      <ButtonCopyAsMacro
        :items="items"
        :container="listPopContainer"
      />
      <n-input
        v-model:value="listValue"
        readonly
        autosize
        type="textarea"
        :placeholder="t('本组没有需要的道具')"
        style="max-height: 350px;"
      />
    </div>
  </n-popover>
</template>

<style scoped>
</style>