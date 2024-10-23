<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import {
  NCard, NIcon, NModal, NTabs, NTabPane
} from 'naive-ui'
import { 
  TableViewOutlined
} from '@vicons/material'
import GroupBox from '../custom-controls/GroupBox.vue'
import ItemList from '../custom-controls/ItemList.vue'
import type { ItemInfo } from '@/tools/item';
import type { UserConfigModel } from '@/models/user-config'
import { useNbbCal } from '@/tools/use-nbb-cal'
import { deepCopy } from '@/tools'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const { calItems } = useNbbCal()

const showModal = defineModel<boolean>('show', { required: true })

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
  for (const itemID in oldprepared) {
    const id = Number(itemID)
    if (newlist[id]) {
      newMap[id] = Math.min(oldprepared[id], newlist[id])
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

/*
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
*/

const handleClose = () => {
  showModal.value = false
}
</script>

<template>
  <n-modal v-model:show="showModal">
    <n-card
      closable
      role="dialog"
      id="modal-craft-statements"
      style="width: 98%; max-width: 1500px;"
      :style="{ height: isMobile ? '650px' : '600px' }"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><TableViewOutlined /></n-icon>
          <span class="title">{{ t('制作报表') }}</span>
        </div>
      </template>

      <div class="wrapper desktop">
        <!-- <GroupBox
          v-for="block in statementBlocks"
          :key="block.id"
          :id="block.id"
          class="group"
          title-background-color="var(--n-color-modal)"
        >
          <template #title>{{ block.name }}</template>
          <div class="container">
            <ItemList
              :items="block.items"
              :list-height="480"
              btn-pop-max-width="300px"
              :show-collector-icon="!userConfig.hide_collector_icons"
              container-id="modal-craft-statements"
            />
          </div>
        </GroupBox> -->
      </div>
    </n-card>
  </n-modal>
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

/* Mobile only */
/* @media (max-width: 768px)*/
</style>