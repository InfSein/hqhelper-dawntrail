<script setup lang='ts'>
import { computed, inject, ref, type Ref } from 'vue'
import {
  NCollapse, NCollapseItem
} from 'naive-ui'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import GroupBox from '../custom-controls/GroupBox.vue'
import ItemButton from '../custom-controls/ItemButton.vue'
import ItemList from '../custom-controls/ItemList.vue'
import TomeScriptButton from '../custom-controls/TomeScriptButton.vue'
import ModalCraftStatements from '../modals/ModalCraftStatements.vue'
import { getItemInfo, type ItemInfo, type ItemTradeInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const props = defineProps({
  statistics: {
    type: Object as () => any,
    required: true
  },
  normalGatherings: {
    type: Array as () => number[] | undefined,
    required: true
  },
  limitedGatherings: {
    type: Array as () => number[] | undefined,
    required: true
  },
  aethersandGatherings: {
    type: Array as () => number[] | undefined,
    required: true
  },
  masterCraftings: {
    type: Array as () => number[] | undefined,
    required: true
  },
  normalCraftings: {
    type: Array as () => number[] | undefined,
    required: true
  },
  alkahests: {
    type: Array as () => number[] | undefined,
    required: true
  },
  tradeMap: {
    type: Object as () => Record<number, ItemTradeInfo>,
    required: true
  }
})

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
  // console.log('tomeScriptItems:', items, '\ntradeMap:', props.tradeMap)
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
  if (!props.limitedGatherings?.length) {
    return [] as ItemInfo[]
  }
  const gathers = []
  for (const id in props.statistics.lvBase) {
    try {
      const _id = parseInt(id)
      if (props.limitedGatherings.includes(_id) && !props.aethersandGatherings?.includes(_id)) {
        const item = props.statistics.lvBase[id]
        gathers.push(getItemInfo(item))
      }
    } catch (error) {
      console.warn('[compute.gatheringsTimed] Error processing item ' + id + ':', error)
    }
  }
  return gathers
})

/**
 * 表示非限时(常规)采集品统计。
 */
const gatheringsCommon = computed(() => {
  if (!props.normalGatherings?.length) {
    return [] as ItemInfo[]
  }
  const gathers = []
  for (const id in props.statistics.lvBase) {
    try {
      const _id = parseInt(id)
      if (props.normalGatherings.includes(_id)) {
        const item = props.statistics.lvBase[id]
        gathers.push(getItemInfo(item))
      }
    } catch (error) {
      console.warn('[compute.gatheringsTimed] Error processing item ' + id + ':', error)
    }
  }
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
const showStatement = () => {
  console.log('statistics:', props.statistics)
  showStatementModal.value = true
}
const statementData = computed(() => {
  const craftTargets : ItemInfo[] = []
  const materialsLv1 : ItemInfo[] = []
  const materialsLv2 : ItemInfo[] = []
  const materialsLv3 : ItemInfo[] = []
  const materialsLv4 : ItemInfo[] = []
  const materialsLv5 : ItemInfo[] = []
  const materialsLvBase : ItemInfo[] = []
  
  processStatistics(props.statistics.ls, craftTargets)
  processStatistics(props.statistics.lv1, materialsLv1)
  processStatistics(props.statistics.lv2, materialsLv2)
  processStatistics(props.statistics.lv3, materialsLv3)
  processStatistics(props.statistics.lv4, materialsLv4)
  processStatistics(props.statistics.lv5, materialsLv5)
  processStatistics(props.statistics.lvBase, materialsLvBase)

  return { craftTargets, materialsLv1, materialsLv2, materialsLv3, materialsLv4, materialsLv5, materialsLvBase }

  function processStatistics(_in: any, out: any[]) {
    for (const id in _in) {
      const item = _in[id]
      out.push(getItemInfo(item))
    }
  }
})
</script>

<template>
  <FoldableCard card-key="main-statistics">
    <template #header>
      <i class="xiv square-4"></i>
      <span class="card-title-text">{{ t('查看统计') }}</span>
      <a class="card-title-extra" href="javascript:void(0);" @click="showStatement">{{ t('[查看报表]') }}</a>
    </template>
    <div class="wrapper">
      <GroupBox id="reagents-group" class="group" title-background-color="var(--n-color-embedded)" title-max-width="200px">
        <template #title>{{ t('特殊秘籍半成品&点数统计') }}</template>
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
      <GroupBox id="aethersands-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('灵砂统计') }}</template>
        <div class="container">
          <ItemList
            :items="aethersands"
            :list-height="isMobile ? undefined : 120"
          />
        </div>
      </GroupBox>
      <GroupBox id="master-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('普通秘籍半成品统计') }}</template>
        <div class="container">
          <ItemList
            :items="masterPrecrafts"
            :list-height="isMobile ? undefined : 320"
            show-collector-icon
          />
        </div>
      </GroupBox>
      <GroupBox id="common-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('普通半成品统计') }}</template>
        <div class="container">
          <ItemList
            :items="commonPrecrafts"
            :list-height="isMobile ? undefined : 320"
            show-collector-icon
          />
        </div>
      </GroupBox>
      <GroupBox id="actions-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('采集统计') }}</template>
        <div class="container">
          <n-collapse :accordion="!isMobile" :default-expanded-names="['crystals']">
            <n-collapse-item :title="t('常规采集品')" name="gatheringsCommon">
              <div class="item-collapsed-container">
                <ItemList
                  :items="gatheringsCommon"
                  :list-height="isMobile ? undefined : 320"
                  :btn-pop-max-width="isMobile ? undefined : '340px'"
                  show-collector-icon
                />
              </div>
            </n-collapse-item>
            <n-collapse-item :title="t('限时采集品')" name="gatheringsTimed">
              <div class="item-collapsed-container">
                <ItemList
                  :items="gatheringsTimed"
                  :list-height="isMobile ? undefined : 320"
                  :btn-pop-max-width="isMobile ? undefined : '340px'"
                  show-collector-icon
                />
              </div>
            </n-collapse-item>
            <n-collapse-item :title="t('水晶')" name="crystals">
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
    </div>

    <ModalCraftStatements
      v-model:show="showStatementModal"
      v-bind="statementData"
    />
  </FoldableCard>
</template>
  
<style scoped>
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
#actions-group .container {
  padding: 10px 0;
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
  #actions-group {
    grid-row: 1 / 3;
    grid-column: 3;
  }
}

/* Mobile only */
@media screen and (max-width: 767px) {
  div.wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}
</style>