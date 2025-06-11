<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import {
  NTabs, NTabPane
} from 'naive-ui'
// import { 
//   TableViewOutlined
// } from '@vicons/material'
import GroupBox from '@/components/templates/GroupBox.vue'
import ItemStatementTable from '@/components/custom/item/ItemStatementTable.vue'
import { type FuncConfigModel } from '@/models/config-func'
import { deepCopy } from '@/tools'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import type { ProStatementBlock } from '@/tools/use-fufu-cal'

// const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
// const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const itemsPrepared = defineModel<{
  craftTarget: Record<number, number>;
  materialsLv1: Record<number, number>;
  materialsLvBase: Record<number, number>;
}>('itemsPrepared', { required: true })

const itemSpanMaxWidth = ref('inherit')
const cspWrapper = ref<HTMLElement>()
const selectedItem = ref<ItemInfo | undefined>(undefined)

interface CraftStatementsProProps {
  /** 是否处于模态框内。此参数会影响一些UI效果。 */
  insideModal?: boolean,
  craftTargets: ItemInfo[],
  statementBlocks: ProStatementBlock[],
  contentHeight?: string
  containerId?: string
}
const props = defineProps<CraftStatementsProProps>()
const emit = defineEmits(['loaded'])

const updateSize = () => {
  if (cspWrapper.value?.offsetWidth) {
    const eachBlockWidth = (cspWrapper.value.offsetWidth - 20) / 3
    itemSpanMaxWidth.value = ((eachBlockWidth - 16) * 0.4 - 48) + 'px'
  } else {
    itemSpanMaxWidth.value = 'inherit'
  }
}
onMounted(() => {
  updateSize()
  window.addEventListener('resize', updateSize)
  emit('loaded')
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})

const showItemDetails = computed(() => {
  return !funcConfig.value.prostate_concise_mode
})
const groupBoxTitleBackground = computed(() => {
  return props.insideModal ? 'var(--n-color-modal)' : 'var(--n-color-embedded)'
})
const highlightedItems = computed(() : number[] => {
  if (!selectedItem.value || funcConfig.value.statement_no_highlights) return []
  if (!selectedItem.value.craftRequires.length) return [selectedItem.value.id]
  const recipeSearch = [selectedItem.value.id]
  const recipeResult = [selectedItem.value.id]
  while (recipeSearch.length) {
    const itemId = recipeSearch.pop()!
    recipeResult.push(itemId)
    const itemInfo = getItemInfo(itemId)
    if (itemInfo.craftRequires?.length) {
      recipeSearch.push(...itemInfo.craftRequires.map(item => item.id))
    }
  }
  return recipeResult
})

const setPreparedItemsByInventory = () => {
  const inventory = deepCopy(funcConfig.value.inventory_data)
  dealPrepared(itemsPrepared.value.materialsLv1, props.statementBlocks[1].items)
  dealPrepared(itemsPrepared.value.materialsLvBase, props.statementBlocks[2].items)

  function dealPrepared(pmap: Record<number, number>, tmap: Record<number, number>) {
    Object.keys(pmap).forEach(_id => {
      const id = Number(_id)
      if (inventory[id]) {
        // 物品在库存中
        const inventAmount = inventory[id]
        const needAmount = tmap[id] || 0
        const reduceAmount = Math.min(inventAmount, needAmount)
        pmap[id] = reduceAmount
        inventory[id] -= reduceAmount
      } else {
        // 不在库存，按照用户设置处理
        if (funcConfig.value.inventory_other_items_way === 'clear') {
          pmap[id] = 0
        }
      }
    })
  }
}

defineExpose({
  updateSize,
  setPreparedItemsByInventory,
})
</script>

<template>
  <n-tabs v-if="isMobile" type="line" animated>
    <n-tab-pane
      v-for="block in statementBlocks"
      :key="block.id"
      :name="block.id"
      :tab="block.name"
    >
      <div class="container">
        <ItemStatementTable
          v-model:items-prepared="itemsPrepared[block.preparedKey]"
          v-model:selected-item="selectedItem"
          :items-total="block.items"
          :show-item-details="showItemDetails"
          :container-id="containerId"
          :content-height="contentHeight"
          :highlighted-items="highlightedItems"
        />
      </div>
    </n-tab-pane>
  </n-tabs>
  <div v-else ref="cspWrapper" class="csp-wrapper desktop" :style="`grid-template-columns: repeat(${statementBlocks.length}, minmax(0, 1fr));`">
    <GroupBox
      v-for="block in statementBlocks"
      :key="block.id"
      :id="block.id"
      class="group"
      :title-background-color="groupBoxTitleBackground"
    >
      <template #title>{{ block.name }}</template>
      <div class="container">
        <ItemStatementTable
          v-model:items-prepared="itemsPrepared[block.preparedKey]"
          v-model:selected-item="selectedItem"
          :items-total="block.items"
          :show-item-details="showItemDetails"
          :container-id="containerId"
          :content-height="contentHeight"
          :item-span-max-width="itemSpanMaxWidth"
          :highlighted-items="highlightedItems"
        />
      </div>
    </GroupBox>
  </div>
</template>

<style scoped>
/* All */
.csp-wrapper {
  user-select: text;
}
.csp-wrapper.desktop {
  display: grid;
  gap: 10px;
}
.group .container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
  user-select: text;
}

/* Desktop */
@media screen and (min-width: 768px) {
}

/* Mobile */
@media screen and (max-width: 767px) {
  .card-title-actions {
    flex-basis: 100%;
  }
}
</style>