<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NIcon, NTag
} from 'naive-ui'
import { 
  TableViewOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import ModalRecommendedProcesses from './ModalRecommendedProcesses.vue'
import ModalPreferences from './ModalPreferences.vue'
import { getProStatementData, type ItemInfo } from '@/tools/item'
import { useFufuCal } from '@/tools/use-fufu-cal'
import CraftStatementsPro from '../custom/general/CraftStatementsPro.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
// const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const { calRecommProcessData } = useFufuCal()

const showModal = defineModel<boolean>('show', { required: true })
const showRecommendedProcessesModal = ref(false)

interface ModalProStatementsProps {
  craftTargets: ItemInfo[]
}
const props = defineProps<ModalProStatementsProps>()

const onLoad = async () => {
  itemsPrepared.value.craftTarget = fixMap(itemsPrepared.value.craftTarget, proStatementData.value.targetItems)
  itemsPrepared.value.materialsLv1 = fixMap(itemsPrepared.value.materialsLv1, proStatementData.value.lv1Items)
  itemsPrepared.value.materialsLvBase = fixMap(itemsPrepared.value.materialsLvBase, proStatementData.value.baseItems)
}

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

const proStatementData = computed(() => {
  return getProStatementData(props.craftTargets, itemsPrepared.value, t)
})

const recommProcessData = computed(() => {
  return calRecommProcessData(proStatementData.value.targetItemsForCal, proStatementData.value.lv1ItemsForCal, proStatementData.value.baseItemsForCal)
})

const handleResetPreparedItems = () => {
  itemsPrepared.value.craftTarget = fixMap({}, proStatementData.value.targetItems)
  itemsPrepared.value.materialsLv1 = fixMap({}, proStatementData.value.lv1Items)
  itemsPrepared.value.materialsLvBase = fixMap({}, proStatementData.value.baseItems)
}
const handleShowRecommendedProcesses = () => {
  showRecommendedProcessesModal.value = true
}

const showPreferencesModal = ref(false)
const handleSettingButtonClick = () => {
  showPreferencesModal.value = true
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    id="modal-pro-statements"
    max-width="1500px"
    :height="isMobile ? '650px' : '600px'"
    @on-load="onLoad"
    show-setting
    @on-setting-button-clicked="handleSettingButtonClick"
  >
    <template #header>
      <div class="card-title no-select">
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

    <CraftStatementsPro
      v-model:items-prepared="itemsPrepared"
      inside-modal
      container-id="modal-pro-statements"
      :craft-targets="props.craftTargets"
      :statement-blocks="proStatementData.statementBlocks"
    />

    <ModalRecommendedProcesses
      v-model:show="showRecommendedProcessesModal"
      v-bind="recommProcessData"
    />
    <ModalPreferences
      v-model:show="showPreferencesModal"
      setting-group="craft_statement"
      app-show-fp
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