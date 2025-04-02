<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NTabs, NTabPane
} from 'naive-ui'
// import { 
//   TableViewOutlined
// } from '@vicons/material'
import GroupBox from '@/components/templates/GroupBox.vue'
import ItemList from '@/components/custom/item/ItemList.vue'
import type { ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/config-user'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
// const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

interface CraftStatementsProps {
  craftTargets: ItemInfo[],
  materialsLv1: ItemInfo[],
  materialsLv2: ItemInfo[],
  materialsLv3: ItemInfo[],
  materialsLv4: ItemInfo[],
  materialsLv5: ItemInfo[],
  materialsLvBase: ItemInfo[],
  /** 是否处于模态框内。此参数会影响一些UI效果。 */
  insideModal?: boolean,
  containerId?: string,
}
const props = defineProps<CraftStatementsProps>()

const statementBlocks = computed(() => {
  return [
    {
      id: 'craft-target',
      name: t('成品清单'),
      items: props.craftTargets
    },
    {
      id: 'material-lv1',
      name: t('制作素材：直接'),
      items: props.materialsLv1
    },
    {
      id: 'material-lv2',
      name: t('制作素材：二级'),
      items: props.materialsLv2
    },
    {
      id: 'material-lv3',
      name: t('制作素材：三级'),
      items: props.materialsLv3
    },
    {
      id: 'material-lvBase',
      name: t('制作素材：基础'),
      items: props.materialsLvBase
    },
  ]
})
const groupBoxTitleBackground = computed(() => {
  return props.insideModal ? 'var(--n-color-modal)' : 'var(--n-color-embedded)'
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
        <ItemList
          :items="block.items"
          :list-height="480"
          :show-collector-icon="!userConfig.hide_collector_icons"
          :container-id="containerId"
        />
      </div>
    </n-tab-pane>
  </n-tabs>
  <div v-else class="wrapper desktop">
    <GroupBox
      v-for="block in statementBlocks"
      :key="block.id"
      :id="block.id"
      class="group"
      :title-background-color="groupBoxTitleBackground"
    >
      <template #title>{{ block.name }}</template>
      <div class="container">
        <ItemList
          :items="block.items"
          :list-height="480"
          btn-pop-max-width="300px"
          :show-collector-icon="!userConfig.hide_collector_icons"
          :container-id="containerId"
        />
      </div>
    </GroupBox>
  </div>
</template>

<style scoped>
/* All */
.wrapper {
  user-select: text;
}
.wrapper.desktop {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}
.group .container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
  user-select: text;
}
</style>