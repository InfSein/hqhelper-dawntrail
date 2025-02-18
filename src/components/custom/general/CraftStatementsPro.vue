<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NTabs, NTabPane
} from 'naive-ui'
// import { 
//   TableViewOutlined
// } from '@vicons/material'
import GroupBox from '@/components/templates/GroupBox.vue'
import ItemStatementTable from '@/components/custom/item/ItemStatementTable.vue'
import { type FuncConfigModel } from '@/models/config-func'
import type { ItemInfo, ProStatementBlock } from '@/tools/item'

// const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
// const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const itemsPrepared = defineModel<{
  craftTarget: Record<number, number>;
  materialsLv1: Record<number, number>;
  materialsLvBase: Record<number, number>;
}>('itemsPrepared', { required: true })

interface CraftStatementsProProps {
  craftTargets: ItemInfo[],
  statementBlocks: ProStatementBlock[],
  contentHeight?: string
}
defineProps<CraftStatementsProProps>()

const showItemDetails = computed(() => {
  return !funcConfig.value.prostate_concise_mode
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
          :items-total="block.items"
          :show-item-details="showItemDetails"
          container-id="modal-pro-statements"
          :content-height="contentHeight"
        />
      </div>
    </n-tab-pane>
  </n-tabs>
  <div v-else class="csp-wrapper desktop" :style="`grid-template-columns: repeat(${statementBlocks.length}, minmax(0, 1fr));`">
    <GroupBox
      v-for="block in statementBlocks"
      :key="block.id"
      :id="block.id"
      class="group"
      title-background-color="var(--n-color-modal)"
    >
      <template #title>{{ block.name }}</template>
      <div class="container">
        <ItemStatementTable
          v-model:items-prepared="itemsPrepared[block.preparedKey]"
          :items-total="block.items"
          :show-item-details="showItemDetails"
          container-id="modal-pro-statements"
          :content-height="contentHeight"
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