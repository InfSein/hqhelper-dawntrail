<script setup lang="ts" name="FT Helper">
import { computed, inject, ref, watch, type Ref } from 'vue'
import {
  NBackTop,
  useMessage
} from 'naive-ui'
import {
  FastfoodOutlined
} from '@vicons/material'
import RouterCard from '@/components/custom/general/RouterCard.vue'
import ItemSelectionPanel from '@/components/ft-helper/ItemSelectionPanel.vue'
import StatisticsPanel from '@/components/ft-helper/StatisticsPanel.vue'
import ModalJoinInWorkflow from '@/components/modals/ModalJoinInWorkflow.vue'
import { useStore } from '@/store'
import { useNbbCal } from '@/tools/use-nbb-cal'
import type { UserConfigModel } from '@/models/config-user'

const t = inject<(message: string, args?: any) => string>('t')!
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const appMode = inject<Ref<"overlay" | "" | undefined>>('appMode') ?? ref('')

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const { calItems, getFoodAndTincs } = useNbbCal()

const workState = ref({
  patch: '7.2',
  hidePrecraftMaterials: false,
  itemSelected: {} as Record<number, number>
})

const disable_workstate_cache = userConfig.value.disable_workstate_cache ?? false
if (!disable_workstate_cache) {
  const cachedWorkState = userConfig.value.fthelper_cache_work_state
  if (cachedWorkState && JSON.stringify(cachedWorkState).length > 2) {
    workState.value = cachedWorkState
    // 处理新加参数与旧缓存的兼容逻辑
    workState.value.hidePrecraftMaterials ??= (cachedWorkState?.hidePrecraftGatherings || false)
  }

  // todo - 留意性能：深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大
  watch(workState, async () => {
    if (workState.value && userConfig) {
      try {
        await Promise.resolve()
        userConfig.value.fthelper_cache_work_state = workState.value
        store.commit('setUserConfig', userConfig.value)
      } catch (error) {
        console.error('Error handling workState change:', error)
      }
    } else {
      console.warn('workState or userConfig is not defined')
    }
  }, {deep: true})
}

const fixItemSelections = () => {
  const { data } = getFoodAndTincs()
  data.forEach(pd => {
    pd.foods?.forEach(item => {
      if (workState.value.itemSelected[item] === undefined) {
        workState.value.itemSelected[item] = 0
      }
    })
    pd.tincs?.forEach(item => {
      if (workState.value.itemSelected[item] === undefined) {
        workState.value.itemSelected[item] = 0
      }
    })
  })
}
fixItemSelections()

const statistics = computed(() => {
  const value = calItems(workState.value.itemSelected)
  return value
})

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
    NAIVE_UI_MESSAGE.error(t('workflow.join_in_workflow.message.no_food_tinc')); return
  }
  showModalJoinInWorkflow.value = true
}
</script>

<template>
  <div id="main-container">
    <RouterCard
      id="router-card"
      v-show="appMode !== 'overlay'"
      :page-name="t('common.appfunc.cal_food_and_tinc')"
      :page-icon="FastfoodOutlined"
    />
    <div id="left-layout">
      <ItemSelectionPanel
        v-model:patch="workState.patch"
        v-model:item-selected="workState.itemSelected"
        @join-workflow="handleJoinWorkflow"
      />
    </div>
    <div id="right-layout">
      <StatisticsPanel
        v-model:hide-precraft-materials="workState.hidePrecraftMaterials"
        :statistics="statistics"
        :item-selected="workState.itemSelected"
      />
    </div>
    
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
  gap: 0.6rem;
}

/* Desktop */
@media screen and (min-width: 768px) {
  #main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-height: 100%;
    overflow: auto;

    #router-card {
      grid-row: 1;
      grid-column: 1 / 3;
    }
    #left-layout {
      grid-row: 2;
      grid-column: 1;
    }
    #right-layout {
      grid-row: 2 / 4;
      grid-column: 2;
    }
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  #main-container {
    display: flex;
    flex-direction: column;

    #left-layout {
      width: 100%;
      display: flex;
      flex-direction: column;

      .job-panel {
        width: 100%;
      }
      .gear-panel {
        width: 100%;
      }
    }
    #right-layout {
      width: 100%;

      .statistics-panel {
        width: 100%;
      }
    }
  }
}
</style>