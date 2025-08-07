<script lang="ts" setup>
import { computed, inject, provide, ref, watch, type Ref } from 'vue';
import {
  NBackTop, NGrid, NGridItem,
  useMessage
} from 'naive-ui'
import PatchPanel from '@/components/main/PatchPanel.vue'
import JobPanel from '@/components/main/JobPanel.vue'
import GearSelectionPanel from '@/components/main/GearSelectionPanel.vue'
import StatisticsPanel from '@/components/main/StatisticsPanel.vue'
import ModalJoinInWorkflow from '@/components/modals/ModalJoinInWorkflow.vue'
import { type UserConfigModel } from '@/models/config-user'
import type { AttireAffix, AccessoryAffix, GearSelections } from '@/models/gears'
import { getDefaultGearSelections, fixGearSelections } from '@/models/gears'
import { useStore } from '@/store'
import { useNbbCal } from '@/tools/use-nbb-cal'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(message: string, args?: any) => string>('t')!
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const { calGearSelections, getSpecialItems, getTradeMap, getPatchData } = useNbbCal()

const workState = ref({
  patch: '',
  job: 0,
  affixes: {
    attire: '',
    accessory: ''
  },
  gears: getDefaultGearSelections(),
})

const gearSelectionPanel = ref<InstanceType<typeof GearSelectionPanel>>()

const disable_workstate_cache = userConfig.value.disable_workstate_cache ?? false
if (!disable_workstate_cache) {
  const cachedWorkState = userConfig.value.cache_work_state
  if (cachedWorkState && JSON.stringify(cachedWorkState).length > 2) {
    workState.value = cachedWorkState
    fixGearSelections(workState.value.gears)
    // Compatible with older version caching
  }

  // todo - 留意性能：深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大
  watch(workState, async () => {
    if (workState.value && userConfig) {
      try {
        await Promise.resolve()
        userConfig.value.cache_work_state = workState.value
        store.setUserConfig(userConfig.value)
      } catch (error) {
        console.error('Error handling workState change:', error)
      }
    } else {
      console.warn('workState or userConfig is not defined')
    }
  }, {deep: true})
}

const handleJobButtonDupliClick = () => {
  if (!userConfig.value.disable_jobbtn_doubleclick) {
    gearSelectionPanel.value?.addCurrMainOffHand()
  }
}

const showModalJoinInWorkflow = ref(false)
const workflowItems = computed(() => {
  const items : Record<number, number> = {}
  Object.values(statistics.value.ls).forEach((stat: any) => {
    items[stat.id] = stat.need
  })
  return items
})
const handleJoinWorkflow = () => {
  if (!Object.values(workflowItems.value).length) {
    NAIVE_UI_MESSAGE.error(t('workflow.join_in_workflow.message.no_armor')); return
  }
  showModalJoinInWorkflow.value = true
}

const handleImportState = (patch: string, gearSelections?: GearSelections) => {
  workState.value.patch = patch
  workState.value.gears = fixGearSelections(gearSelections)
  NAIVE_UI_MESSAGE.success(t('common.message.import_succeed'))
}
provide('handleImportState', handleImportState)

const patchData = computed(() => {
  return getPatchData(workState.value.patch)
})
const statistics = computed(() => {
  return calGearSelections(workState.value.gears, workState.value.patch || '7.0')
})
const specialItems = computed(() => {
  return getSpecialItems(workState.value.patch || '7.0')
})
const tradeMap = computed(() => {
  return getTradeMap()
})
</script>

<template>
  <div id="main-container">
    <!-- <n-alert
      type="info"
      style="margin-bottom: 10px;"
    >
      {{ t('我们已经开始内测，并提供7.0版本生产采集新HQ的装备数据。如果遇到问题，请通过“联系我们”中的方式反馈。') }}
    </n-alert> -->
    <n-grid cols="4" item-responsive :x-gap="10" :y-gap="10">
      <n-grid-item span="4">
        <PatchPanel
          v-model:patch-selected="workState.patch"
          v-model:gears-selected="workState.gears"
          class="h-full"
        />
      </n-grid-item>
      <n-grid-item span="4 600:2 1340:1">
        <JobPanel
          v-model:job-selected="workState.job"
          v-model:affixes-selected="workState.affixes"
          v-model:gears-selected="workState.gears"
          class="h-full"
          :patch-selected="workState.patch"
          :patch-data="patchData"
          @on-job-button-dupli-click="handleJobButtonDupliClick"
        />
      </n-grid-item>
      <n-grid-item span="4 600:2 1340:1">
        <GearSelectionPanel
          v-model:gear-selections="workState.gears"
          ref="gearSelectionPanel"
          class="h-full"
          :patch-selected="workState.patch"
          :job-id="workState.job"
          :patch-data="patchData"
          :attire-affix="(workState.affixes?.attire as AttireAffix)"
          :accessory-affix="(workState.affixes?.accessory as AccessoryAffix)"
          @join-workflow="handleJoinWorkflow"
        />
      </n-grid-item>
      <n-grid-item span="4 1340:2">
        <StatisticsPanel
          class="h-full"
          :patch-selected="workState.patch"
          :statistics="statistics"
          :normal-gatherings="specialItems.normalGathering"
          :limited-gatherings="specialItems.limitedGathering"
          :aethersand-gatherings="specialItems.aethersands"
          :master-craftings="specialItems.masterCrafting"
          :normal-craftings="specialItems.normalCrafting"
          :alkahests="specialItems.alkahests"
          :trade-map="tradeMap"
          :gear-selections="workState.gears"
        />
      </n-grid-item>
    </n-grid>

    <ModalJoinInWorkflow
      v-model:show="showModalJoinInWorkflow"
      :items="workflowItems"
    />

    <n-back-top />
  </div>
</template>

<style scoped>
/* All */
#main-container {
  max-width: 100%;
  font-weight: 400;
}

/* PC only */
@media screen and (min-width: 768px) {
  #main-container {
    height: 100%;
    overflow: auto;
  }
}

/* Mobile only */
@media screen and (max-width: 767px) {
}
</style>