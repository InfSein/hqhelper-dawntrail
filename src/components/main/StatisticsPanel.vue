<script setup lang='ts'>
import { computed, inject, provide, ref, type Ref } from 'vue'
import {
  NButton, NCollapse, NCollapseItem
} from 'naive-ui'
import FoldableCard from '../templates/FoldableCard.vue'
import GroupBox from '../templates/GroupBox.vue'
import ItemButton from '../custom/item/ItemButton.vue'
import ItemList from '../custom/item/ItemList.vue'
import TomeScriptButton from '../custom/other/TomeScriptButton.vue'
import ModalCraftStatements from '../modals/ModalCraftStatements.vue'
import ModalProStatements from '../modals/ModalProStatements.vue'
import ModalCostAndBenefit from '../modals/ModalCostAndBenefit.vue'
import ModalImExportMain from '../modals/ModalImExportMain.vue'
import { type UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import type { GearSelections } from '@/models/gears'
import { useStore } from '@/store'
import { useFufuCal } from '@/tools/use-fufu-cal'
import { calCostAndBenefit, getItemInfo, getItemPriceInfo, type ItemInfo, type ItemTradeInfo } from '@/tools/item'

const store = useStore()
const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const { getStatementData } = useFufuCal(userConfig, funcConfig, t)

interface StatisticsPanelProps {
  patchSelected: string,
  statistics: any,
  normalGatherings: number[] | undefined,
  limitedGatherings: number[] | undefined,
  aethersandGatherings: number[] | undefined,
  masterCraftings: number[] | undefined,
  normalCraftings: number[] | undefined,
  alkahests: number[] | undefined,
  tradeMap: Record<number, ItemTradeInfo>,
  gearSelections: GearSelections
}
const props = defineProps<StatisticsPanelProps>()

const getTradeCost = (itemTradeInfo: ItemTradeInfo) => {
  let server = userConfig.value.item_server
  if (!server || server === 'auto') {
    const lang = userConfig.value.language_ui
    if (lang === 'zh') {
      server = 'chs'
    } else {
      server = 'global'
    }
  }
  return server === 'chs' ? itemTradeInfo?.costCHS : itemTradeInfo?.costGlobal
}

const showBiColorItemsInTomeScriptButton = computed(() => {
  return userConfig.value?.tomescript_show_bicolor_items ?? false
})

const lvBaseItems = computed(() => {
  const items = []
  for (const id in props.statistics.lvBase) {
    try {
      const item = getItemInfo(props.statistics.lvBase[id])
      items.push(item)
    } catch (error) {
      console.warn('[compute.lvBaseItems] Error processing item ' + id + ':', error)
    }
  }
  return items
})

/** 
 * 要高亮显示的素材组。
 * 
 * 在战斗职业HQ版本用于展示炼金术士的秘籍星级半成品-炼金幻水，顺序为`刚巧耐智意`。
 * 在生产采集HQ版本用于展示相较于前一战职版本新增的星级半成品，一般在[1,3]号index填写。
 */
const reagents = computed(() => {
  const placeHolder = getItemInfo(0)
  if (!props.alkahests?.length) {
    return [placeHolder,placeHolder,placeHolder,placeHolder,placeHolder]
  }
  const crafts = []
  props.alkahests.forEach(alkahest => {
    const item = props.statistics.lv1[alkahest.toString()] ?? alkahest
    crafts.push(getItemInfo(item))
  })
  while (crafts.length < 5) {
    crafts.push(placeHolder);
  }
  return crafts
})

const tomeScriptItems = computed(() => {
  const items = {} as Record<number, ItemInfo[]>
  if (!props.tradeMap) {
    return items
  }
  for (const id in props.statistics.lvBase) {
    try {
      const _id = parseInt(id)
      if (props.aethersandGatherings?.length && props.aethersandGatherings.includes(_id)) continue
      const itemTradeInfo = props.tradeMap[_id]
      if (itemTradeInfo) {
        const costId = getTradeCost(itemTradeInfo).costId
        if (!showBiColorItemsInTomeScriptButton.value && costId === 26807) continue // 处理双色宝石
        if (!items[costId]) items[costId] = []
        const item = props.statistics.lvBase[id]
        items[costId].push(getItemInfo(item))
      }
    } catch (error) {
      console.warn('[compute.tomeScriptItems] Error processing item ' + id + ':', error)
    }
  }
  // 根据道具商店兑换顺序重组排序
  // 逻辑应该是：优先根据物品类型ID排序，然后按照物品ID排序
  for (const costId in items) {
    const _costId = Number(costId)
    items[_costId] = items[_costId].sort((a, b) => {
      if (a.uiTypeId === b.uiTypeId) {
        return a.id - b.id
      } else {
        return a.uiTypeId - b.uiTypeId
      }
    })
  }
  return items
})

/**
 * 要展示的秘籍半成品。
 * 
 * 按照制作职业排序，一般顺序为`刻木-锻铁-雕金-制革-裁缝`。
 * ? 理论上按照成品id升序排序就可以达到这个效果，有待验证
 */
const masterPrecrafts = computed(() => {
  if (!props.masterCraftings?.length) {
    return [] as ItemInfo[]
  }
  const crafts : ItemInfo[] = []
  props.masterCraftings.forEach(mc => {
    if (props.alkahests?.includes(mc)) return // 忽略特殊秘籍半成品：炼金幻水
    const item = props.statistics.lv1[mc.toString()] ?? mc
    crafts.push(getItemInfo(item))
  })
  return crafts
})

/**
 * 表示要展示的普通半成品。
 */
const commonPrecrafts = computed(() => {
  if (!props.normalCraftings?.length) {
    return [] as ItemInfo[]
  }
  const crafts = []
  for (const id in props.statistics.lv1) {
    try {
      const _id = parseInt(id)
      if (props.normalCraftings.includes(_id)) {
        const item = props.statistics.lv1[id]
        crafts.push(getItemInfo(item))
      }
    } catch (error) {
      console.warn('[compute.commonPrecrafts] Error processing item ' + id + ':', error)
    }
  }
  return crafts
})

/**
 * 表示独立统计出的灵砂。
 * 展示时应注意说明此灵砂已计入其他半成品所需的数量。
 */
const aethersands = computed(() => {
  if (!props.aethersandGatherings?.length) {
    return [] as ItemInfo[]
  }
  const aethersands : ItemInfo[] = []
  props.aethersandGatherings.forEach(ag => {
    if (props.alkahests?.includes(ag)) return // 忽略特殊秘籍半成品：炼金幻水
    const item = props.statistics.lvBase[ag.toString()] ?? ag
    aethersands.push(getItemInfo(item))
  })
  return aethersands
})

/**
 * 表示限时采集品统计。
 */
const gatheringsTimed = computed(() => {
  const gathers : ItemInfo[] = []
  lvBaseItems.value.forEach(item => {
    if (item.gatherInfo?.timeLimitInfo?.length) {
      gathers.push(item)
    }
  })
  return gathers
})

/**
 * 表示非限时(常规)采集品统计。
 */
const gatheringsCommon = computed(() => {
  const gathers : ItemInfo[] = []
  lvBaseItems.value.forEach(item => {
    if (item.gatherInfo?.placeID && !item.gatherInfo.timeLimitInfo?.length) {
      gathers.push(item)
    }
  })
  return gathers
})

/**
 * 表示碎晶/水晶/晶簇统计。
 */
const crystals = computed(() => {
  const _crystals = []
  for (const id in props.statistics.lvBase) {
    const item = props.statistics.lvBase[id]
    if (item?.uc === 59) { // * 参见src\assets\data\xiv-item-types.json
      _crystals.push(getItemInfo(item))
    }
  }
  return _crystals
})

const reagentsBtnColors = ['#FF8080', '#8080FF', '#FFC080', '#00BFFF', '#40E0D0'] // 刚巧耐智意

const showStatementModal = ref(false)
const showProStatementModal = ref(false)
const showStatement = () => {
  if (funcConfig.value.use_traditional_statement) {
    showStatementModal.value = true
  } else {
    showProStatementModal.value = true
  }
}
const statementData = computed(() => {
  return getStatementData(props.statistics)
})

const importExportData = computed(() => {
  return {
    gearSelections: props.gearSelections,
    statistics: props.statistics,
    tomeScriptItems: tomeScriptItems.value,
    normalGathering: gatheringsCommon.value,
    limitedGathering: gatheringsTimed.value,
    aethersands: aethersands.value,
    crystals: crystals.value,
    ui_lang: userConfig.value.language_ui,
    item_lang: userConfig.value.language_item === 'auto'
      ? userConfig.value.language_ui
      : userConfig.value.language_item,
    patchSelected: props.patchSelected
  }
})
const handleDisplayImportExportModal = () => {
  showImportExportModal.value = true
}
const showImportExportModal = ref(false)

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
      alert(t('common.message.get_price_failed') + '\n' + (error?.message ?? error))
    }
    updatingPrice.value = false
  }
}
provide('updateItemPrices', updateItemPrices)
const handleAnalysisItemPrices = async () => {
  await updateItemPrices()
  showCostAndBenefitModal.value = true
}
</script>

<template>
  <FoldableCard card-key="main-statistics">
    <template #header>
      <i class="xiv square-4"></i>
      <span class="card-title-text">{{ t('statistics.view_statistics') }}</span>
      <a class="card-title-extra" href="javascript:void(0);" @click="showStatement">{{ t('common.mquoted_view_statement') }}</a>
      <a class="card-title-extra" href="javascript:void(0);" @click="handleDisplayImportExportModal">[{{ t('common.imexport') }}]</a>
    </template>
    <div class="wrapper">
      <GroupBox
        id="reagents-group" class="group" title-background-color="var(--n-color-embedded)" title-max-width="200px"
        :title="t('common.special')"
        :descriptions="[
          t('statistics.group_tooltip.special')
        ]"
      >
        <div class="container">
          <ItemButton
            v-for="(item, index) in reagents"
            :key="'reagent-' + index"
            :item-info="item"
            show-icon show-name show-amount
            :btn-color="reagentsBtnColors[index]"
            pop-use-custom-width
            :pop-custom-width="isMobile ? 300 : undefined"
          >
          </ItemButton>
          <TomeScriptButton
            class="w-full h-full"
            :items="tomeScriptItems"
            :trade-map="tradeMap"
          />
        </div>
      </GroupBox>
      <GroupBox
        id="aethersands-group" class="group" title-background-color="var(--n-color-embedded)"
        :title="t('statistics.group.aethersands')"
        :descriptions="[
          t('statistics.group_tooltip.common_material_lvbase')
        ]"
      >
        <div class="container">
          <ItemList
            :items="aethersands"
            :list-height="isMobile ? undefined : 120"
            display-style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));"
            scroll-style="overflow-y: auto;"
            btn-pop-use-custom-width
            :btn-pop-custom-width="isMobile ? 300 : undefined"
          />
        </div>
      </GroupBox>
      <GroupBox
        id="master-precrafts-group" class="group" title-background-color="var(--n-color-embedded)"
        :title="t('statistics.group.common_master_precrafts')"
        :descriptions="[
          t('statistics.group_tooltip.common_master_precrafts')
        ]"
      >
        <div class="container">
          <ItemList
            :items="masterPrecrafts"
            :list-height="isMobile ? undefined : 320"
            :show-collector-icon="!userConfig.hide_collector_icons"
          />
        </div>
      </GroupBox>
      <GroupBox
        id="common-precrafts-group" class="group" title-background-color="var(--n-color-embedded)"
        :title="t('statistics.group.common_precrafts')"
        :descriptions="[
          t('statistics.group_tooltip.common_material_lv1')
        ]"
      >
        <div class="container">
          <ItemList
            :items="commonPrecrafts"
            :list-height="isMobile ? undefined : 320"
            :show-collector-icon="!userConfig.hide_collector_icons"
          />
        </div>
      </GroupBox>
      <div id="statistics-footer">
        <GroupBox
          id="gatherings-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('statistics.group.gatherings.title')"
          :descriptions="[
            t('statistics.group_tooltip.common_material_lvbase')
          ]"
        >
          <div class="container">
            <n-collapse :accordion="!isMobile" :default-expanded-names="['crystals']">
              <n-collapse-item :title="t('statistics.group.gatherings.common')" name="gatheringsCommon">
                <div class="item-collapsed-container">
                  <ItemList
                    :items="gatheringsCommon"
                    :list-height="isMobile ? undefined : 320"
                    :btn-pop-max-width="isMobile ? undefined : '340px'"
                    :show-collector-icon="!userConfig.hide_collector_icons"
                  />
                </div>
              </n-collapse-item>
              <n-collapse-item :title="t('statistics.group.gatherings.time_limited')" name="gatheringsTimed">
                <div class="item-collapsed-container">
                  <ItemList
                    :items="gatheringsTimed"
                    :list-height="isMobile ? undefined : 320"
                    :btn-pop-max-width="isMobile ? undefined : '340px'"
                    :show-collector-icon="!userConfig.hide_collector_icons"
                  />
                </div>
              </n-collapse-item>
              <n-collapse-item :title="t('game.crystal')" name="crystals">
                <div class="item-collapsed-container">
                  <ItemList
                    :items="crystals"
                    :list-height="isMobile ? undefined : 320"
                    :btn-pop-max-width="isMobile ? undefined : '340px'"
                  />
                </div>
              </n-collapse-item>
            </n-collapse>
          </div>
        </GroupBox>
        <GroupBox
          id="price-analysis-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('statistics.group.cost_and_benefit.title')"
          :descriptions="[
            t('statistics.group.cost_and_benefit.button.tooltip.tooltip_1'),
            t('statistics.group.cost_and_benefit.button.tooltip.tooltip_2')
          ]"
        >
          <n-button
            style="width: 100%; height: 55px;"
            @click="handleAnalysisItemPrices"
            :loading="updatingPrice"
            :disabled="updatingPrice"
          >
            <div style="line-height: 1.2; text-align: left;">
              <p>{{ t('statistics.group.cost_and_benefit.button.text.text_1', costAndBenefit.costInfo) }}</p>
              <p>{{ t('statistics.group.cost_and_benefit.button.text.text_2', costAndBenefit.benefitInfo) }}</p>
            </div>
          </n-button>
        </GroupBox>
      </div>
    </div>

    <ModalCraftStatements
      v-model:show="showStatementModal"
      v-bind="statementData"
    />
    <ModalProStatements
      v-model:show="showProStatementModal"
      v-bind="statementData"
    />
    <ModalImExportMain
      v-model:show="showImportExportModal"
      v-bind="importExportData"
    />
    <ModalCostAndBenefit
      v-model:show="showCostAndBenefitModal"
      :cost-items="statementData.materialsLvBase"
      :benefit-items="statementData.craftTargets"
      :cost-info="costAndBenefit.costInfo"
      :benefit-info="costAndBenefit.benefitInfo"
    />
  </FoldableCard>
</template>
  
<style scoped>
:deep(.n-collapse-item__content-inner) {
  padding-top: 2px !important;
}
:deep(.n-collapse-item__header) {
  padding-top: 4px !important;
}
:deep(.n-collapse-item) {
  margin-top: 4px !important;
}
:deep(.n-collapse-item:first-child) {
  margin-top: 0 !important;
}
.group .container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
}
#reagents-group .container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px;
}
#gatherings-group .container {
  padding: 4px 0;
}
.item-collapsed-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 10px;
}

/* Desktop only */
@media screen and (min-width: 768px) {
  div.wrapper {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 15px;
    column-gap: 10px;
  }
  #statistics-footer {
    grid-row: 1 / 3;
    grid-column: 3;

    #price-analysis-group {
      margin-top: 15px;
    }
  }
}

/* Mobile only */
@media screen and (max-width: 767px) {
  div.wrapper, #statistics-footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}
</style>