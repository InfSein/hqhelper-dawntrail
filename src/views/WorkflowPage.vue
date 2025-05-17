<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import {
  NBackTop, NButton, NFloatButton, NFloatButtonGroup, NIcon, NInputGroup, NInputGroupLabel, NTabs, NTabPane, NTooltip, 
  useMessage
} from 'naive-ui'
import {
  AddSharp, SettingsSharp,
  // ModeEditFilled, DeleteFilled,
  DeleteSweepRound,
  QueryStatsFilled,
  TableViewOutlined,
  AllInclusiveSharp,
  VisibilitySharp, VisibilityOffSharp,
  UnfoldMoreSharp, UnfoldLessSharp,
} from '@vicons/material'
import FoldableCard from '@/components/templates/FoldableCard.vue'
import ItemSelector from '@/components/custom/item/ItemSelector.vue'
import ItemSelectTable from '@/components/custom/item/ItemSelectTable.vue'
import CraftStatistics from '@/components/custom/general/CraftStatistics.vue'
import CraftStatements from '@/components/custom/general/CraftStatements.vue'
import CraftStatementsPro from '@/components/custom/general/CraftStatementsPro.vue'
import ModalCostAndBenefit from '@/components/modals/ModalCostAndBenefit.vue'
import ModalPreferences from '@/components/modals/ModalPreferences.vue'
import { useStore } from '@/store'
import {
  getDefaultWorkflow, fixWorkState, _VAR_MAX_WORKFLOW
} from '@/models/workflow'
import type { UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import { calCostAndBenefit, getItemInfo, getItemPriceInfo, type ItemInfo } from '@/tools/item'
import { useNbbCal } from '@/tools/use-nbb-cal'
import { useFufuCal } from '@/tools/use-fufu-cal'
import UseConfig from '@/tools/use-config'
import CraftRecommProcess from '@/components/custom/general/CraftRecommProcess.vue'
import TooltipButton from '@/components/custom/general/TooltipButton.vue'
import ModalWorkflowsManage from '@/components/modals/ModalWorkflowsManage.vue'
import type { SettingGroupKey } from '@/models'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const { calItems } = useNbbCal()
const { getStatementData, getProStatementData, calRecommProcessData, calRecommProcessGroups } = useFufuCal(userConfig, funcConfig, t)
const {
  itemServer,
} = UseConfig(userConfig, funcConfig)

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

const showPreferencesModal = ref(false)
const preferenceSettingGroup = ref<SettingGroupKey | undefined>(undefined)
const preferenceAppShowUP = ref(false)
const preferenceAppShowFP = ref(false)

const headerBlock = ref<HTMLElement>()
const windowHeight = ref(window.innerHeight)
const headerHeight = ref(0)
const updateHeights = () => {
  windowHeight.value = window.innerHeight
  if (headerBlock.value?.offsetHeight) {
    headerHeight.value = headerBlock.value.offsetHeight + 20 // 考虑padding
  } else {
    headerHeight.value = 0
  }
}
const handleUpdateHeights = () => {
  setTimeout(updateHeights, 10)
}
onMounted(() => {
  updateHeights()
  window.addEventListener('resize', updateHeights)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeights)
})

// #region header
/*
const handleEditWorkflow = (flowIndex: number) => {
  const flow = workState.value.workflows[flowIndex]
  const oldName = flow.name || t('工作流{index}', flowIndex + 1)
  // todo Electron 不支持 prompt()。等待后续替换为组件对话框。
  const newName = prompt(t('将这条工作流重命名为：'), oldName)
  if (newName) {
    flow.name = newName
  }
}
const handleDeleteWorkflow = (flowIndex: number) => {
  if (workState.value.workflows.length <= 1) {
    NAIVE_UI_MESSAGE.warning(t('需要保留至少1条工作流'))
    return
  }
  if (!confirm(t('确认要删除这条工作流吗?'))) {
    return
  }
  workState.value.workflows.splice(flowIndex, 1)
  if (workState.value.currentWorkflow >= flowIndex) {
    workState.value.currentWorkflow--
    if (workState.value.currentWorkflow < 0) {
      workState.value.currentWorkflow = 0
    }
  }
}
*/
const handleAddWorkflow = () => {
  if (workState.value.workflows.length >= _VAR_MAX_WORKFLOW) {
    NAIVE_UI_MESSAGE.warning(t('最多只能添加{num}条工作流', _VAR_MAX_WORKFLOW))
    return
  }
  workState.value.workflows.push(getDefaultWorkflow())
}
const showWorkflowsManageModal = ref(false)
const handleManageWorkflows = () => {
  showWorkflowsManageModal.value = true
}
const handleFixWorkStateAfterWorkflowsManaged = () => {
  if (workState.value.currentWorkflow >= workState.value.workflows.length) {
    workState.value.currentWorkflow = workState.value.workflows.length - 1
  }
}
// #endregion

const pageHeightVals = computed(() => {
  const pageHeight = windowHeight.value - 320
  const contentHeight = pageHeight - headerHeight.value
  if (isMobile.value) {
    return {
      itemSelectTable: 'auto',
      statisticsBlock: undefined,
      statementsBlock: 'auto',
      recommProcess: 'auto',
      recommProcessContainer: '60px',
    }
  } else {
    return {
      itemSelectTable: (contentHeight - 65) + 'px',
      statisticsBlock: (contentHeight / 2 - 45),
      statementsBlock: (contentHeight - 50) + 'px',
      recommProcess: contentHeight + 'px',
      recommProcessContainer: (contentHeight + 12) + 'px', // tabpane 有 12px 的 padding-top
    }
  }
})

// #region content-items
const handleItemInputValueUpdate = (value: number) => {
  if (!value) return
  if (currentWorkflow.value.targetItems[value]) {
    NAIVE_UI_MESSAGE.info(t('已有该物品'))
  } else {
    currentWorkflow.value.targetItems[value] = 1
    currentWorkflow.value.preparedItems.craftTarget[value] = 0
  }
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
const selectCardWidth = ref('450px')
const handleSelectCardFoldStatusChanged = (folded: boolean) => {
  if (folded) {
    selectCardWidth.value = '200px'
  } else {
    selectCardWidth.value = '450px'
  }
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
  return getProStatementData(craftTargetsArray.value, currentWorkflow.value.preparedItems)
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
    itemServer.value,
    t
  )
})

const fixPreparedItems = () => {
  const {
    craftTargets, materialsLv1, materialsLvBase
  } = statementData.value
  craftTargets.forEach(item => {
    const val = currentWorkflow.value.preparedItems.craftTarget[item.id]
    if (!val) {
      currentWorkflow.value.preparedItems.craftTarget[item.id] = 0
    } else if (val > item.amount) {
      currentWorkflow.value.preparedItems.craftTarget[item.id] = item.amount
    }
  })
  materialsLv1.forEach(item => {
    const val = currentWorkflow.value.preparedItems.materialsLv1[item.id]
    if (!val) {
      currentWorkflow.value.preparedItems.materialsLv1[item.id] = 0
    } else if (val > item.amount) {
      currentWorkflow.value.preparedItems.materialsLv1[item.id] = item.amount
    }
  })
  materialsLvBase.forEach(item => {
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
    if (!currentWorkflow.value.recommData.expandedBlocks[i]) currentWorkflow.value.recommData.expandedBlocks[i] = ['1']
    if (!currentWorkflow.value.recommData.completedItems[i]) currentWorkflow.value.recommData.completedItems[i] = {}
    recommProcessGroups.value[i].items.forEach(item => {
      if (!currentWorkflow.value.recommData.completedItems[i][item.id]) {
        currentWorkflow.value.recommData.completedItems[i][item.id] = false
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

const recommGroupAllCollapsed = computed(() => {
  let allCollapsed = true
  for (let i = 0; i < recommProcessGroups.value.length; i++) {
    if (currentWorkflow.value.recommData.expandedBlocks[i] && currentWorkflow.value.recommData.expandedBlocks[i].length > 0) {
      allCollapsed = false
    }
  }
  return allCollapsed
})
const handleCollapseOrUncollapseAllRecommGroupBlocks = () => {
  const cacheRecommGroupAllCollapsed = recommGroupAllCollapsed.value
  // 这里不能直接引用 computed 的值，因为它会在折叠/展开过程中变化
  for (let i = 0; i < recommProcessGroups.value.length; i++) {
    currentWorkflow.value.recommData.expandedBlocks[i] = cacheRecommGroupAllCollapsed ? ['1'] : []
  }
}
const handleRecommSettingButtonClick = () => {
  preferenceAppShowUP.value = false
  preferenceAppShowFP.value = true
  preferenceSettingGroup.value = 'recomm_process'
  showPreferencesModal.value = true
}

const showCostAndBenefitModal = ref(false)
const costAndBenefit = computed(() => {
  return calCostAndBenefit(funcConfig.value, statementData.value)
})
const updatingPrice = ref(false)
const updateItemPrices = async () => {
  if (costAndBenefit.value.updateRequired) {
    updatingPrice.value = true
    try {
      const items : number[] = []
      statementData.value.craftTargets.forEach(item => {
        items.push(item.id)
      })
      statementData.value.materialsLvBase.forEach(item => {
        items.push(item.id)
      })
      const itemPrices = await getItemPriceInfo([...new Set(items)], funcConfig.value.universalis_server)
      const newConfig = funcConfig.value
      Object.keys(itemPrices).forEach(id => {
        const itemID = Number(id)
        newConfig.cache_item_prices[itemID] = itemPrices[itemID]
      })
      await store.commit('setFuncConfig', fixFuncConfig(newConfig, store.state.userConfig))
    } catch (error : any) {
      console.error(error)
      alert(t('获取价格失败') + '\n' + (error?.message ?? error))
    }
    updatingPrice.value = false
  }
}
const handleAnalysisItemPrices = async () => {
  if (updatingPrice.value) {
    NAIVE_UI_MESSAGE.info(t('正在加载……')); return
  }
  await updateItemPrices()
  showCostAndBenefitModal.value = true
}
// #endregion
</script>

<template>
  <div id="main-container" class="wrapper">
    <FoldableCard card-key="workflow-header" class="header-block" @onCardFoldStatusChanged="handleUpdateHeights">
      <template #header>
        <i class="xiv sync-invert"></i>	
        <span class="card-title-text">{{ t('配置工作流') }}</span>
      </template>
      <div class="block" ref="headerBlock">
        <div class="action">
          <p>{{ t('切换工作流：') }}</p>
          <div class="flex-wrap" style="gap: 5px;">
            <!-- <n-button-group
            >
              <n-button v-show="false" size="tiny" class="n-square-button" :title="t('重命名这条工作流')" @click="handleEditWorkflow(flowIndex)">
                <n-icon :size="16"><ModeEditFilled /></n-icon>
              </n-button>
              <n-button v-show="false" size="tiny" class="n-square-button" :title="t('删除这条工作流')" @click="handleDeleteWorkflow(flowIndex)">
                <n-icon :size="16"><DeleteFilled /></n-icon>
              </n-button>
            </n-button-group> -->
            <n-button
              v-for="(flow, flowIndex) in workState.workflows"
              :key="flowIndex"
              size="tiny"
              :type="flowIndex === workState.currentWorkflow ? 'primary' : 'default'"
              @click="workState.currentWorkflow = flowIndex"
            >
              {{ flow.name || t('工作流{index}', flowIndex + 1) }}
            </n-button>
            <TooltipButton
              size="tiny"
              square
              :icon="AddSharp"
              :icon-size="16"
              :tip="t('添加一条工作流')"
              @click="handleAddWorkflow"
            />
            <TooltipButton
              size="tiny"
              square
              :icon="SettingsSharp"
              :icon-size="14"
              :tip="t('管理已有工作流')"
              @click="handleManageWorkflows"
            />
          </div>
        </div>
      </div>
    </FoldableCard>
    <div
      class="content-block"
      :style="{
        '--select-card-width': selectCardWidth,
      }"
    >
      <FoldableCard
        card-key="workflow-content-items"
        class="items-wrapper"
        :fold-direction="isMobile ? 'vertical' : 'horizontal'"
        @on-card-fold-status-changed="handleSelectCardFoldStatusChanged"
      >
        <template #header>
          <i class="xiv square-1"></i>
          <span class="card-title-text">{{ t('挑选物品') }}</span>
        </template>
        <div class="block items-block">
          <div class="top-actions">
            <n-input-group>
              <n-input-group-label>{{ t('添加物品') }}</n-input-group-label>
              <ItemSelector
                @on-item-selected="handleItemInputValueUpdate"
              />
            </n-input-group>
          </div>
          <div class="content-table">
            <ItemSelectTable
              v-model:items="currentWorkflow.targetItems"
              show-item-details
              :content-height="pageHeightVals.itemSelectTable"
            />
          </div>
          <div class="bottom-actions">
            <TooltipButton
              :icon="DeleteSweepRound"
              :text="t('清空')"
              :tip="t('清空当前工作流的已选物品')"
              @click="handleClearCurrentWorkflow"
            />
          </div>
        </div>
        
      </FoldableCard>
      <FoldableCard :unfoldable="!isMobile" card-key="workflow-content-statistics" class="statistics-wrapper">
        <template #header>
          <i class="xiv square-2"></i>
          <span class="card-title-text">{{ t('查看分析') }}</span>
          <a class="card-title-extra" href="javascript:void(0);" :disabled="updatingPrice" :style="updatingPrice ? 'cursor: not-allowed; color: gray;' : 'cursor: pointer;'" @click="handleAnalysisItemPrices">[{{ updatingPrice ? t('正在加载……') : t('成本/收益预估') }}]</a>
        </template>
        <div class="block">
          <n-tabs type="segment" animated class="h-full">
            <n-tab-pane name="statistics">
              <!-- @vue-ignore -->
              <template #tab>
                <div class="tab-title">
                  <n-icon :size="16"><QueryStatsFilled /></n-icon>
                  <div>{{ t('统计') }}</div>
                </div>
              </template>
              <CraftStatistics
                :item-selected="currentWorkflow.targetItems"
                :list-height="pageHeightVals.statisticsBlock"
              />
            </n-tab-pane>
            <n-tab-pane name="statements">
              <!-- @vue-ignore -->
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
                :content-height="pageHeightVals.statementsBlock"
              />
            </n-tab-pane>
            <n-tab-pane name="processes" :style="{
              transform: 'translate(0)',
              minHeight: pageHeightVals.recommProcessContainer,
            }">
              <!-- @vue-ignore -->
              <template #tab>
                <div class="tab-title">
                  <n-icon :size="16"><AllInclusiveSharp /></n-icon>
                  <div>{{ t('流程') }}</div>
                </div>
              </template>
              <CraftRecommProcess
                v-model:expanded-blocks="currentWorkflow.recommData.expandedBlocks"
                v-model:completed-items="currentWorkflow.recommData.completedItems"
                :item-groups="recommProcessGroups"
                :content-max-height="pageHeightVals.recommProcess"
                content-max-width="1080px"
                :hide-chs-offline-items="currentWorkflow.recommData.hideChsOfflineItems"
              />

              <n-float-button-group v-if="!isMobile" right="20px" bottom="5px">
                <n-tooltip v-if="recommProcessGroups.length && itemServer === 'chs'" :trigger="isMobile ? 'manual' : 'hover'" placement="left">
                  <template #trigger>
                    <n-float-button @click="currentWorkflow.recommData.hideChsOfflineItems = !currentWorkflow.recommData.hideChsOfflineItems">
                      <n-icon>
                        <VisibilitySharp v-if="currentWorkflow.recommData.hideChsOfflineItems" />
                        <VisibilityOffSharp v-else />
                      </n-icon>
                    </n-float-button>
                  </template>
                  {{ currentWorkflow.recommData.hideChsOfflineItems ? t('显示国服未实装物品') : t('隐藏国服未实装物品') }}
                </n-tooltip>
                <n-tooltip v-if="recommProcessGroups.length" :trigger="isMobile ? 'manual' : 'hover'" placement="left">
                  <template #trigger>
                    <n-float-button @click="handleCollapseOrUncollapseAllRecommGroupBlocks">
                      <n-icon>
                        <UnfoldMoreSharp v-if="recommGroupAllCollapsed" />
                        <UnfoldLessSharp v-else />
                      </n-icon>
                    </n-float-button>
                  </template>
                  {{ recommGroupAllCollapsed ? t('全部展开') : t('全部折叠') }}
                </n-tooltip>
                <n-tooltip :trigger="isMobile ? 'manual' : 'hover'" placement="left">
                  <template #trigger>
                    <n-float-button @click="handleRecommSettingButtonClick">
                      <n-icon>
                        <SettingsSharp />
                      </n-icon>
                    </n-float-button>
                  </template>
                  {{ t('设置') }}
                </n-tooltip>
              </n-float-button-group>
            </n-tab-pane>
          </n-tabs>
        </div>
      </FoldableCard>
    </div>

    <ModalWorkflowsManage
      v-model:show="showWorkflowsManageModal"
      v-model:workflows="workState.workflows"
      @after-save="handleFixWorkStateAfterWorkflowsManaged"
    />
    <ModalCostAndBenefit
      v-model:show="showCostAndBenefitModal"
      :cost-items="statementData.materialsLvBase"
      :benefit-items="statementData.craftTargets"
      :cost-info="costAndBenefit.costInfo"
      :benefit-info="costAndBenefit.benefitInfo"
    />
    <ModalPreferences
      v-model:show="showPreferencesModal"
      :setting-group="preferenceSettingGroup"
      :app-show-up="preferenceAppShowUP"
      :app-show-fp="preferenceAppShowFP"
    />

    <n-back-top />
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
    grid-template-columns: var(--select-card-width) 1fr;
    gap: 8px;

    .block {
      padding: 0 4px;
      height: 100%;
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

/* Mobile */
@media screen and (max-width: 767px) {
  .wrapper {
    .header-block .action {
      flex-direction: column;
      align-items: flex-start;
      justify-content: start;
      gap: 5px;
    }
    .content-block {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>