<script setup lang="ts">
import { computed, inject, onMounted, ref, watch, h, type Ref } from 'vue'
import {
  NButton, NIcon, NInputGroup, NInputGroupLabel, NSelect, NTabs, NTabPane,
  type SelectOption, type SelectRenderLabel,
  useMessage
} from 'naive-ui'
import {
  AddSharp,
  DeleteSweepRound,
  QueryStatsFilled,
  TableViewOutlined,
  AllInclusiveSharp,
} from '@vicons/material'
import FoldableCard from '@/components/templates/FoldableCard.vue'
import ItemSpan from '@/components/custom/item/ItemSpan.vue'
import ItemSelectTable from '@/components/custom/item/ItemSelectTable.vue'
import CraftStatistics from '@/components/custom/general/CraftStatistics.vue'
import CraftStatements from '@/components/custom/general/CraftStatements.vue'
import CraftStatementsPro from '@/components/custom/general/CraftStatementsPro.vue'
import { useStore } from '@/store'
import { XivUnpackedItems } from '@/assets/data'
import {
  getDefaultWorkflow, fixWorkState, _VAR_MAX_WORKFLOW
} from '@/models/workflow'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'
import { getItemInfo, getProStatementData, getStatementData, type ItemInfo } from '@/tools/item'
import { useNbbCal } from '@/tools/use-nbb-cal'
import { useFufuCal } from '@/tools/use-fufu-cal'
import CraftRecommProcess from '@/components/custom/general/CraftRecommProcess.vue'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const { calItems } = useNbbCal()
const { calRecommProcessData, calRecommProcessGroups } = useFufuCal()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const workState = ref(fixWorkState())

const currentWorkflow = computed(() => {
  return workState.value.workflows[workState.value.currentWorkflow]
})

const disable_workstate_cache = userConfig.value.disable_workstate_cache ?? false
if (!disable_workstate_cache) {
  const cachedWorkState = userConfig.value.workflow_cache_work_state
  if (cachedWorkState && JSON.stringify(cachedWorkState).length > 2) {
    workState.value = fixWorkState(cachedWorkState)
    // Compatible with older version caching
  }

  // todo - 留意性能：深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大
  watch(workState, async () => {
    if (workState.value && userConfig) {
      try {
        await Promise.resolve()
        userConfig.value.workflow_cache_work_state = workState.value
        store.commit('setUserConfig', userConfig.value)
      } catch (error) {
        console.error('Error handling workState change:', error)
      }
    } else {
      console.warn('workState or userConfig is not defined')
    }
  }, {deep: true})
}
onMounted(() => {

})

// #region header
const handleAddWorkflow = () => {
  if (workState.value.workflows.length >= _VAR_MAX_WORKFLOW) {
    NAIVE_UI_MESSAGE.warning(t('最多只能添加{num}条工作流', _VAR_MAX_WORKFLOW))
    return
  }
  workState.value.workflows.push(getDefaultWorkflow())
}
// #endregion

// #region content-items
const itemOptions = computed(() => {
  return Object.values(XivUnpackedItems).filter(item => item.rids?.length > 0).map(item => {
    return {
      label: item.lang[0],
      value: item.id
    }
  })
})
const renderItemLabel : SelectRenderLabel = (option) => {
  if (!option.value || typeof option.value !== 'number') {
    return h('div', null, [option.label as string])
  }
  return h(ItemSpan, {
    itemInfo: getItemInfo(option.value),
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
const itemInputVal = ref<number | null>(null)
const handleItemInputValueUpdate = (value: number) => {
  if (!value) return
  if (currentWorkflow.value.targetItems[value]) {
    NAIVE_UI_MESSAGE.info(t('已有该物品'))
  } else {
    currentWorkflow.value.targetItems[value] = 1
    currentWorkflow.value.preparedItems.craftTarget[value] = 0
  }
  itemInputVal.value = null
}
const handleClearCurrentWorkflow = () => {
  currentWorkflow.value.targetItems = {}
  currentWorkflow.value.preparedItems = {
    craftTarget: {},
    materialsLv1: {},
    materialsLvBase: {},
  }
  NAIVE_UI_MESSAGE.success(t('已清空'))
}
// #endregion

// #region content-statistics
const craftTargetsArray = computed(() => {
  const items : ItemInfo[] = []
  for (const _id in currentWorkflow.value.targetItems) {
    const id = Number(_id)
    let count = currentWorkflow.value.targetItems[id]
    if (count > 0) {
      const itemInfo = getItemInfo(id)
      itemInfo.amount = count
      items.push(itemInfo)
    }
  }
  return items
})
const statistics = computed(() => {
  const value = calItems(currentWorkflow.value.targetItems)
  return value
})
const statementData = computed(() => {
  return getStatementData(statistics.value)
})
const proStatementData = computed(() => {
  return getProStatementData(craftTargetsArray.value, currentWorkflow.value.preparedItems, t)
})
const recommProcessData = computed(() => {
  return calRecommProcessData(proStatementData.value.targetItemsForCal, proStatementData.value.lv1ItemsForCal, proStatementData.value.baseItemsForCal)
})
const recommProcessGroups = computed(() => {
  const {
    craftTargets,
    lv1Items, lv2Items, lv3Items,
    lvBaseItems
  } = recommProcessData.value
  return calRecommProcessGroups(
    craftTargets,
    lv1Items,
    lv2Items,
    lv3Items,
    lvBaseItems,
    funcConfig.value.processes_craftable_item_sortby,
    funcConfig.value.processes_merge_gatherings,
    userConfig.value.language_ui,
    t
  )
})

const expandedBlocks = ref<Record<number, string[]>>({})
/** (groupId, (itemId, checked)) */
const completedItems = ref<Record<number, Record<number, boolean>>>({})

const fixPreparedItems = () => {
  const {
    craftTargets, lv1Items, lvBaseItems
  } = recommProcessData.value
  craftTargets.forEach(item => {
    const val = currentWorkflow.value.preparedItems.craftTarget[item.id]
    if (!val) {
      currentWorkflow.value.preparedItems.craftTarget[item.id] = 0
    } else if (val > item.amount) {
      currentWorkflow.value.preparedItems.craftTarget[item.id] = item.amount
    }
  })
  lv1Items.forEach(item => {
    const val = currentWorkflow.value.preparedItems.materialsLv1[item.id]
    if (!val) {
      currentWorkflow.value.preparedItems.materialsLv1[item.id] = 0
    } else if (val > item.amount) {
      currentWorkflow.value.preparedItems.materialsLv1[item.id] = item.amount
    }
  })
  lvBaseItems.forEach(item => {
    const val = currentWorkflow.value.preparedItems.materialsLvBase[item.id]
    if (!val) {
      currentWorkflow.value.preparedItems.materialsLvBase[item.id] = 0
    } else if (val > item.amount) {
      currentWorkflow.value.preparedItems.materialsLvBase[item.id] = item.amount
    }
  })
}
const fixRecommMaps = () => {
  for (let i = 0; i < recommProcessGroups.value.length; i++) {
    if (!expandedBlocks.value[i]) expandedBlocks.value[i] = ['1']
    if (!completedItems.value[i]) completedItems.value[i] = {}
    recommProcessGroups.value[i].items.forEach(item => {
      if (!completedItems.value[i][item.id]) {
        completedItems.value[i][item.id] = false
      }
    })
  }
}
watch(recommProcessGroups, async () => {
  fixRecommMaps()
  fixPreparedItems()
})
fixRecommMaps()
fixPreparedItems()
// #endregion
</script>

<template>
  <div id="main-container" class="wrapper">
    <FoldableCard card-key="workflow-header" class="header-block">
      <template #header>
        <i class="xiv sync-invert"></i>	
        <span class="card-title-text">{{ t('配置工作流') }}</span>
      </template>
      <div class="block">
        <div class="action">
          <p>{{ t('切换工作流：') }}</p>
          <div class="flex" style="gap: 5px;">
            <n-button
              v-for="(flow, flowIndex) in workState.workflows"
              :key="flowIndex"
              size="tiny"
              :type="flowIndex === workState.currentWorkflow ? 'primary' : 'default'"
              @click="workState.currentWorkflow = flowIndex"
            >
              {{ flow.name || t('工作流{index}', flowIndex + 1) }}
            </n-button>
            <n-button size="tiny" class="n-square-button" @click="handleAddWorkflow">
              <n-icon :size="16"><AddSharp /></n-icon>
            </n-button>
          </div>
        </div>
      </div>
    </FoldableCard>
    <div class="content-block">
      <FoldableCard unfoldable card-key="workflow-content-items" class="items-wrapper">
        <template #header>
          <i class="xiv square-1"></i>
          <span class="card-title-text">{{ t('挑选物品') }}</span>
        </template>
        <div class="block items-block">
          <div class="top-actions">
            <n-input-group>
              <n-input-group-label>{{ t('添加物品') }}</n-input-group-label>
              <n-select
                v-model:value="itemInputVal"
                filterable
                :filter="filterItem"
                :options="itemOptions"
                :render-label="renderItemLabel"
                :placeholder="t('支持按物品名/ID/品级/版本搜索')"
                :title="t('支持按物品名/ID/品级/版本搜索')"
                @update:value="handleItemInputValueUpdate"
              />
            </n-input-group>
          </div>
          <div class="content-table">
            <ItemSelectTable
              v-model:items="currentWorkflow.targetItems"
              show-item-details
              content-height="350px"
            />
          </div>
          <div class="bottom-actions">
            <n-button :title="t('清空当前工作流的已选物品')" @click="handleClearCurrentWorkflow">
              <template #icon>
                <n-icon><DeleteSweepRound /></n-icon>
              </template>
              {{ t('清空') }}
            </n-button>
          </div>
        </div>
        
      </FoldableCard>
      <FoldableCard unfoldable card-key="workflow-content-statistics" class="statistics-wrapper">
        <template #header>
          <i class="xiv square-2"></i>
          <span class="card-title-text">{{ t('查看分析') }}</span>
        </template>
        <div class="block">
          <n-tabs type="segment" animated>
            <n-tab-pane name="statistics">
              <template #tab>
                <div class="tab-title">
                  <n-icon :size="16"><QueryStatsFilled /></n-icon>
                  <div>{{ t('统计') }}</div>
                </div>
              </template>
              <CraftStatistics
                :item-selected="currentWorkflow.targetItems"
                :list-height="175"
              />
            </n-tab-pane>
            <n-tab-pane name="statements">
              <template #tab>
                <div class="tab-title">
                  <n-icon :size="16"><TableViewOutlined /></n-icon>
                  <div>{{ t('报表') }}</div>
                </div>
              </template>
              <CraftStatements
                v-if="funcConfig.use_traditional_statement"
                v-bind="statementData"
              />
              <CraftStatementsPro
                v-else
                v-model:items-prepared="currentWorkflow.preparedItems"
                :craft-targets="craftTargetsArray"
                :statement-blocks="proStatementData.statementBlocks"
                content-height="390px"
              />
            </n-tab-pane>
            <n-tab-pane name="processes">
              <template #tab>
                <div class="tab-title">
                  <n-icon :size="16"><AllInclusiveSharp /></n-icon>
                  <div>{{ t('流程') }}</div>
                </div>
              </template>
              <CraftRecommProcess
                v-model:expanded-blocks="expandedBlocks"
                v-model:completed-items="completedItems"
                :item-groups="recommProcessGroups"
                content-max-height="440px"
              />
            </n-tab-pane>
          </n-tabs>
        </div>
      </FoldableCard>
    </div>
  </div>
</template>

<style scoped>
.tab-title {
  display: flex;
  line-height: 1;
  align-items: center;
  gap: 3px;
}
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .header-block {
    height: auto;
    .action {
      display: flex;
      align-items: center;
    }
  }

  .content-block {
    flex: 1;
    display: grid;
    grid-template-columns: 450px 1fr;
    gap: 8px;

    .block {
      padding: 0 4px;
    }
    .items-block {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .top-actions {
        display: flex;
        align-items: center;
        gap: 5px;

        .label {
          font-size: 16px;
        }
        .n-select {
          flex: 1;
        }
      }
      .content-table {
        flex: 1;
      }
      .bottom-actions {
        display: flex;
        justify-content: end;
      }
    }
  }
}
</style>