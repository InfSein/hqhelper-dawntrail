<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import {
  NCard, NIcon, NModal, NTabs, NTabPane, NTag
} from 'naive-ui'
import { 
  TableViewOutlined
} from '@vicons/material'
import GroupBox from '../custom-controls/GroupBox.vue'
import ItemStatementTable from '../custom-controls/ItemStatementTable.vue'
import type { ItemInfo } from '@/tools/item'
import { useNbbCal } from '@/tools/use-nbb-cal'
import { deepCopy } from '@/tools'
import { fixUserConfig, type UserConfigModel } from '@/models/user-config'
import { useStore } from '@/store'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const store = useStore()

const { getRecipeMap, calItems } = useNbbCal()
const recipeMap = getRecipeMap()

const showModal = defineModel<boolean>('show', { required: true })
const showItemDetails = ref(true)

const props = defineProps({
  craftTargets: {
    type: Array as () => ItemInfo[],
    required: true
  }
})
watch(showModal, async (newVal, oldVal) => {
  if (newVal && !oldVal) {
    itemsPrepared.value.craftTarget = fixMap(itemsPrepared.value.craftTarget, targetItems.value)
    itemsPrepared.value.materialsLv1 = fixMap(itemsPrepared.value.materialsLv1, lv1Items.value)
    itemsPrepared.value.materialsLvBase = fixMap(itemsPrepared.value.materialsLvBase, baseItems.value)
    showItemDetails.value = userConfig.value.statement_show_item_details
  }
})

/** 记录已经准备了的物品 */
const itemsPrepared = ref({
  craftTarget: {} as Record<number, number>,
  materialsLv1: {} as Record<number, number>,
  materialsLvBase: {} as Record<number, number>
})
/** 根据旧的准备map和计算后更新的列表，修正准备map */
const fixMap = (oldprepared: Record<number, number>, newlist: Record<number, number>) => {
  const newMap : Record<number, number> = {}
  for (const itemID in newlist) {
    const id = Number(itemID)
    if (oldprepared[id]) {
      newMap[id] = Math.min(oldprepared[id], newlist[id])
    } else {
      newMap[id] = 0
    }
  }
  return newMap
}

// 根据已准备物品计算的实际要显示的物品清单
// xxxItems是显示的清单，xxxItemsForCal是用于计算的实际清单(减去已准备的数量)
// 计算顺序：成品->直接素材->基础素材
// 成品清单永远不变
// 修改成品清单的已准备数量，会影响到制作素材：直接和制作素材：基础
// 修改制作素材：直接，会影响到制作素材：基础
const targetItems = computed(() => {
  const itemMap : Record<number, number> = {}
  Object.values(props.craftTargets).forEach(item => {
    itemMap[item.id] = item.amount
  })
  return itemMap
})
const targetItemsForCal = computed(() => {
  const realItemMap : Record<number, number> = {}
  Object.values(props.craftTargets).forEach(item => {
    realItemMap[item.id] = item.amount
  })
  Object.keys(itemsPrepared.value.craftTarget).forEach(itemID => {
    const id = Number(itemID)
    realItemMap[id] -= itemsPrepared.value.craftTarget[id]
  })
  return realItemMap
})
const lv1Items = computed(() => {
  const caledItemMap : Record<number, number> = {}
  const statistics = calItems(targetItemsForCal.value)
  Object.values(statistics.lv1).forEach((calResult : any) => {
    const itemID : number = calResult.id
    const amount : number = calResult.need
    caledItemMap[itemID] = amount
  })
  return caledItemMap
})
const lv1ItemsForCal = computed(() => {
  const realItemMap = deepCopy(lv1Items.value)
  Object.keys(itemsPrepared.value.materialsLv1).forEach(itemID => {
    const id = Number(itemID)
    realItemMap[id] -= itemsPrepared.value.materialsLv1[id]
  })
  return realItemMap
})
const baseItems = computed(() => {
  const caledItemMap : Record<number, number> = {}
  const statistics = calItems(lv1ItemsForCal.value)
  Object.values(statistics.lvBase).forEach((calResult : any) => {
    const itemID : number = calResult.id
    const amount : number = calResult.need
    caledItemMap[itemID] = amount
  })
  // nbb计算模型目前会忽略掉制作目标(这里的话是直接素材列表)中没有配方的道具，这里对它们进行特殊处理
  Object.keys(lv1ItemsForCal.value).forEach(itemID => {
    const id = Number(itemID)
    if (!recipeMap[id]) {
      caledItemMap[id] ??= 0
      caledItemMap[id] += lv1ItemsForCal.value[id]
    }
  })
  return caledItemMap
})
/*
const baseItemsForCal = computed(() => {
  const realItemMap = deepCopy(baseItems.value)
  Object.keys(itemsPrepared.value.materialsLvBase).forEach(itemID => {
    const id = Number(itemID)
    realItemMap[id] -= itemsPrepared.value.materialsLvBase[id]
  })
  return realItemMap
})
*/

const statementBlocks = computed(() => {
  return [
    {
      id: 'craft-target',
      name: t('成品清单'),
      items: targetItems.value,
      preparedKey: 'craftTarget' as keyof typeof itemsPrepared.value
    },
    {
      id: 'material-lv1',
      name: t('制作素材：直接'),
      items: lv1Items.value,
      preparedKey: 'materialsLv1' as keyof typeof itemsPrepared.value
    },
    /*
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
    */
    {
      id: 'material-lvBase',
      name: t('制作素材：基础'),
      items: baseItems.value,
      preparedKey: 'materialsLvBase' as keyof typeof itemsPrepared.value
    },
  ]
})

const handleClose = () => {
  showModal.value = false
}

const handleResetPreparedItems = () => {
  itemsPrepared.value.craftTarget = fixMap({}, targetItems.value)
  itemsPrepared.value.materialsLv1 = fixMap({}, lv1Items.value)
  itemsPrepared.value.materialsLvBase = fixMap({}, baseItems.value)
}
const handleSwitchShowItemDetails = () => {
  showItemDetails.value = !showItemDetails.value
  const newConfig = fixUserConfig(store.state.userConfig)
  newConfig.statement_show_item_details = showItemDetails.value
  store.commit('setUserConfig', newConfig)
}
</script>

<template>
  <n-modal v-model:show="showModal">
    <n-card
      closable
      role="dialog"
      id="modal-pro-statements"
      style="width: 98%; max-width: 1500px;"
      :style="{ height: isMobile ? '650px' : '600px' }"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><TableViewOutlined /></n-icon>
          <span class="title">
            {{ t('制作报表') }}
          </span>
          <span class="card-title-extra">
            <n-tag type="info" size="small" round>PRO</n-tag>
          </span>
          <div class="title-actions">
            <a href="javascript:void(0);" @click="handleResetPreparedItems">[{{ t('重置已有') }}]</a>
            <a href="javascript:void(0);" @click="handleSwitchShowItemDetails">[{{ showItemDetails ? t('简洁模式') : t('详细模式') }}]</a>
          </div>
        </div>
      </template>

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
          title-background-color="var(--n-color-modal)"
        >
          <template #title>{{ block.name }}</template>
          <div class="container">
            <ItemStatementTable
              v-model:items-prepared="itemsPrepared[block.preparedKey]"
              :items-total="block.items"
              :show-item-details="showItemDetails"
              container-id="modal-pro-statements"
            />
          </div>
        </GroupBox>
      </div>
    </n-card>
  </n-modal>
</template>

<style scoped>
/* All */
.title-actions {
  height: 100%;
  display: flex;
  align-items: baseline;
  font-size: var(--n-font-size);
  margin: 3px 0 0 5px;
}
.wrapper {
  user-select: text;
}
.wrapper.desktop {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.group .container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
  user-select: text;
}

/* Mobile only */
/* @media (max-width: 768px)*/
</style>