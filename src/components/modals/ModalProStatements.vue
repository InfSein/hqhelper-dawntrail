<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NIcon, NTabs, NTabPane, NTag
} from 'naive-ui'
import { 
  TableViewOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import ItemStatementTable from '../custom/item/ItemStatementTable.vue'
import ModalRecommendedProcesses from './ModalRecommendedProcesses.vue'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import { useNbbCal } from '@/tools/use-nbb-cal'
import { deepCopy } from '@/tools'
import { type FuncConfigModel } from '@/models/config-func'
import ModalFuncPreferences from './ModalFuncPreferences.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const { getRecipeMap, calItems } = useNbbCal()
const recipeMap = getRecipeMap()

const showModal = defineModel<boolean>('show', { required: true })
const showRecommendedProcessesModal = ref(false)

const props = defineProps({
  craftTargets: {
    type: Array as () => ItemInfo[],
    required: true
  }
})
const onLoad = async () => {
  itemsPrepared.value.craftTarget = fixMap(itemsPrepared.value.craftTarget, targetItems.value)
  itemsPrepared.value.materialsLv1 = fixMap(itemsPrepared.value.materialsLv1, lv1Items.value)
  itemsPrepared.value.materialsLvBase = fixMap(itemsPrepared.value.materialsLvBase, baseItems.value)
}

const showItemDetails = computed(() => {
  return !funcConfig.value.prostate_concise_mode
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
const baseItemsForCal = computed(() => {
  const realItemMap = deepCopy(baseItems.value)
  Object.keys(itemsPrepared.value.materialsLvBase).forEach(itemID => {
    const id = Number(itemID)
    realItemMap[id] -= itemsPrepared.value.materialsLvBase[id]
  })
  return realItemMap
})

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
const recommProcessData = computed(() => {
  const craftTargets = dealItemMapToItemList(targetItemsForCal.value)
  const lv1Items = dealItemMapToItemList(lv1ItemsForCal.value)

  // 根据1级素材计算出2/3级素材 (主要是考虑半成品套娃的情况，所以不需要多做处理)
  const lv2Map : Record<number, number> = {}
  const lv3Map : Record<number, number> = {}
  const statistics = calItems(lv1ItemsForCal.value)
  // 1级素材复算得到的1级素材就是需要的2级素材，2级素材就是需要的3级
  Object.values(statistics.lv1).forEach((calResult : any) => {
    const itemID : number = calResult.id
    const amount : number = calResult.need
    lv2Map[itemID] = amount
  })
  Object.values(statistics.lv2).forEach((calResult : any) => {
    const itemID : number = calResult.id
    const amount : number = calResult.need
    lv3Map[itemID] = amount
  })
  const lv2Items = dealItemMapToItemList(lv2Map)
  const lv3Items = dealItemMapToItemList(lv3Map)

  const lvBaseItems = dealItemMapToItemList(baseItemsForCal.value)

  return {
    craftTargets,
    lv1Items, lv2Items, lv3Items,
    lvBaseItems
  }

  function dealItemMapToItemList(itemMap: Record<number, number>) {
    const list : ItemInfo[] = []
    for (const _id in itemMap) {
      const id = Number(_id)
      const amount = itemMap[id]
      if (amount > 0) {
        const itemInfo = getItemInfo(id)
        itemInfo.amount = amount
        list.push(itemInfo)
      }
    }
    return list
  }
})

const handleResetPreparedItems = () => {
  itemsPrepared.value.craftTarget = fixMap({}, targetItems.value)
  itemsPrepared.value.materialsLv1 = fixMap({}, lv1Items.value)
  itemsPrepared.value.materialsLvBase = fixMap({}, baseItems.value)
}
const handleShowRecommendedProcesses = () => {
  showRecommendedProcessesModal.value = true
}

const showFuncPreferencesModal = ref(false)
const handleSettingButtonClick = () => {
  showFuncPreferencesModal.value = true
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    max-width="1500px"
    :height="isMobile ? '650px' : '600px'"
    @on-load="onLoad"
    show-setting
    @on-setting-button-clicked="handleSettingButtonClick"
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
        <div class="card-title-actions">
          <a href="javascript:void(0);" @click="handleResetPreparedItems">[{{ t('重置已有') }}]</a>
          <a href="javascript:void(0);" @click="handleShowRecommendedProcesses">[{{ t('推荐流程') }}]</a>
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

    <ModalRecommendedProcesses
      v-model:show="showRecommendedProcessesModal"
      v-bind="recommProcessData"
    />
    <ModalFuncPreferences
      v-model:show="showFuncPreferencesModal"
      setting-group="craft_statement"
      @after-submit="appForceUpdate"
    />
  </MyModal>
</template>

<style scoped>
/* All */
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