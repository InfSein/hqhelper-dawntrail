<script setup lang="ts">
import { ref, computed, h, inject } from 'vue'
import {
  NSelect,
  type SelectOption, type SelectRenderLabel
} from 'naive-ui'
import ItemSpan from '@/components/custom/item/ItemSpan.vue'
import { XivUnpackedItems } from '@/assets/data'
import { getItemInfo, getMaterialItems } from '@/tools/item'

const t = inject<(message: string, args?: any) => string>('t')!

interface ItemSelectorProps {
  optionsPreset?: "craftable" | "materials"
  containerId?: string
}
const props = defineProps<ItemSelectorProps>()
const emits = defineEmits(['onItemSelected'])

const itemInputVal = ref<number | null>(null)

const optionsPreset = computed(() => props.optionsPreset ?? 'craftable')
const itemOptions = computed(() => {
  if (optionsPreset.value === 'craftable') {
    return Object.values(XivUnpackedItems).filter(item => item.rids?.length > 0).map(item => {
      return {
        label: item.lang[0],
        value: item.id
      }
    })
  } else {
    const items = getMaterialItems()
    return items.map(item => {
      return {
        label: 'item-' + item,
        value: item
      }
    })
  }
  
})
const renderItemLabel : SelectRenderLabel = (option) => {
  if (!option.value || typeof option.value !== 'number') {
    return h('div', null, [option.label as string])
  }
  return h(ItemSpan, {
    itemInfo: getItemInfo(option.value),
    containerId: props.containerId,
  })
}
const filterItem = (pattern: string, option: SelectOption) => {
  if (!pattern) {
    return true
  }
  if (!option.value || typeof option.value !== 'number') {
    return false
  }
  const item = getItemInfo(option.value)

  let itemMatched = false
  const availableKeywords = [
    item.name_zh, item.name_en, item.name_ja
  ]
  availableKeywords.forEach(keyword => {
    if (keyword?.toLowerCase().includes(pattern.toLowerCase())) {
      itemMatched = true
    }
  })
  if (itemMatched) return true

  if (item.id.toString() === pattern) return true
  if (item.itemLevel.toString() === pattern) return true
  if (item.patch === pattern) return true

  return false
}

const handleItemInputValueUpdate = (value: number) => {
  if (!value) return
  emits('onItemSelected', value)
  itemInputVal.value = null
}
</script>

<template>
  <n-select
    v-model:value="itemInputVal"
    filterable
    :filter="filterItem"
    :options="itemOptions"
    :render-label="renderItemLabel"
    :placeholder="t('common.item_search_input_placeholder')"
    :title="t('common.item_search_input_placeholder')"
    @update:value="handleItemInputValueUpdate"
  />
</template>

<style scoped>
</style>