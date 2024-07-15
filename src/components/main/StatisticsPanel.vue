<script setup lang='ts'>
import { computed, inject, ref, type Ref } from 'vue'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import GroupBox from '../custom-controls/GroupBox.vue'
import ItemButton from '../custom-controls/ItemButton.vue'
import type { ItemCalculated } from '@/models/item-calculated'
  
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface StatisticsModel {
  /** 
   * 要高亮显示的素材组。
   * 必须是一个长度为5的数组，无数据的元素传递`item_id=undefined`。
   * 
   * 在战斗职业HQ版本用于展示炼金术士的秘籍星级半成品-炼金幻水，顺序为`刚巧耐智意`。
   * 在生产采集HQ版本用于展示相较于前一战职版本新增的星级半成品，一般在[1,3]号index填写。
   */
  reagents: ItemCalculated[]
  /**
   * 要展示的秘籍星级半成品。
   * 必须是一个长度为5的数组，而且一般情况下不应该有无数据的元素。
   * 
   * 按照制作职业排序，一般顺序为`刻木-锻铁-雕金-制革-裁缝`。
   */
  masterPrecrafts: ItemCalculated[]
  /**
   * 表示要展示的普通星级半成品。
   * 必须是一个数组，长度无限制
   */
  commonPrecrafts: ItemCalculated[]

  /**
   * 表示独立统计出的灵砂。
   * 展示时应注意说明此灵砂已计入其他半成品所需的数量。
   */
  aethersands: ItemCalculated[]

  /**
   * 表示限时采集品统计。
   */
  gatheringsTimed: ItemCalculated[]
  /**
   * 表示非限时(常规)采集品统计。
   */
  gatheringsCommon: ItemCalculated[]
  /**
   * 表示碎晶/水晶/晶簇统计。
   */
  crystals: ItemCalculated[]
}
const props = defineProps({
  statistics: {
    type: Object as () => any,
    required: true
  }
})

interface CalculatedItem {
  /** 物品ID */
  id: number
  /** 需要的数量 */
  need: number
  /** 物品图标ID */
  icon: number
  /** 物品名称组，长度必定为3，分别为日语-英文-中文；中文可能是空字符串 */
  name: string[]
  /** 物品描述组，长度必定为3，分别为日语-英文-中文；中文可能是空字符串 */
  desc: string[]
  /** 物品的UI组 */
  uc: number
  // * 还有一些暂时不知道什么作用的
  pc: number
  mkc: number
  rid: string[]
}

/** 
 * 要高亮显示的素材组。
 * 
 * 在战斗职业HQ版本用于展示炼金术士的秘籍星级半成品-炼金幻水，顺序为`刚巧耐智意`。
 * 在生产采集HQ版本用于展示相较于前一战职版本新增的星级半成品，一般在[1,3]号index填写。
 */
const reagents = computed(() => {
  console.log(props.statistics)
  // todo - 分组归类
  return null
})


const reagentsBtnColors = ['#FF8080', '#8080FF', '#FFC080', '#00BFFF', '#40E0D0'] // 刚巧耐智意

const sampleStatistics = {
  reagents: [
    { item_id: 27785, count: 1 },
    { item_id: 27785, count: 2 },
    { item_id: undefined, count: 3 },
    { item_id: 27785, count: 4 },
    { item_id: 27785, count: 5 },
  ] as ItemCalculated[],
  masterPrecrafts: [
    { item_id: 27785, count: 1 },
    { item_id: 27785, count: 2 },
    { item_id: 27785, count: 3 },
    { item_id: 27785, count: 4 },
    { item_id: 27785, count: 5 },
  ] as ItemCalculated[],
  commonPrecrafts: [
    { item_id: 27785, count: 1 },
    { item_id: 27785, count: 2 },
  ] as ItemCalculated[],
  aethersands: [
    { item_id: 27785, count: 1 },
    { item_id: 27785, count: 2 },
    { item_id: 27785, count: 3 },
  ] as ItemCalculated[],
  gatheringsTimed: [
    { item_id: 27785, count: 1 },
    { item_id: 27785, count: 2 },
    { item_id: 27785, count: 3 },
    { item_id: 27785, count: 4 },
    { item_id: 27785, count: 5 },
  ] as ItemCalculated[],
  gatheringsCommon: [
    { item_id: 27785, count: 1 },
    { item_id: 27785, count: 2 },
    { item_id: 27785, count: 3 },
    { item_id: 27785, count: 4 },
    { item_id: 27785, count: 5 },
  ] as ItemCalculated[],
  crystals: [
    { item_id: 27785, count: 1 },
    { item_id: 27785, count: 2 },
    { item_id: 27785, count: 3 },
    { item_id: 27785, count: 4 },
    { item_id: 27785, count: 5 },
  ] as ItemCalculated[]
}
</script>

<template>
  <FoldableCard card-key="main-statistics" :reagents="reagents">
    <template #header>
      <i class="xiv square-4"></i>
      <span class="card-title-text">{{ t('查看统计') }}</span>
    </template>
    <div class="wrapper" :size="[1,2]">
      <GroupBox id="reagents-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('特殊星级半成品&点数统计') }}</template>
        <div class="container">
          <ItemButton
            v-for="(item, index) in sampleStatistics.reagents"
            :key="'reagent-' + index"
            :item-id="item.item_id"
            :amount="item.count"
            show-icon show-name show-amount
            :btn-color="reagentsBtnColors[index]"
          >
          </ItemButton>
          <n-button class="w-full h-full">
            <div class="w-full flex-column align-right">
              <p>{{ t('点数') }}</p>
              <p>x9999</p>
            </div>
          </n-button>
        </div>
      </GroupBox>
      <GroupBox id="master-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('秘籍星级半成品统计') }}</template>
        <div class="container">
          <ItemButton
            v-for="(item, index) in sampleStatistics.masterPrecrafts"
            :key="'masterPrecraft-' + index"
            :item-id="item.item_id"
            :amount="item.count"
            show-icon show-name show-amount
          >
          </ItemButton>
        </div>
      </GroupBox>
      <GroupBox id="common-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('普通星级半成品统计') }}</template>
        <div class="container">
          <ItemButton
            v-for="(item, index) in sampleStatistics.commonPrecrafts"
            :key="'commonPrecraft-' + index"
            :item-id="item.item_id"
            :amount="item.count"
            show-icon show-name show-amount
          >
          </ItemButton>
        </div>
      </GroupBox>
      <GroupBox id="aethersands-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('灵砂统计') }}</template>
        <div class="container">
          <ItemButton
            v-for="(item, index) in sampleStatistics.aethersands"
            :key="'aethersand-' + index"
            :item-id="item.item_id"
            :amount="item.count"
            show-icon show-name show-amount
          >
          </ItemButton>
        </div>
      </GroupBox>
      <GroupBox id="actions-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('采集统计') }}</template>
        <div class="container">
          <n-collapse :accordion="!isMobile" :default-expanded-names="['crystals']">
            <n-collapse-item :title="t('常规采集品')" name="gatheringsCommon">
              <div class="item-collapsed-container">
                <ItemButton
                  v-for="(item, index) in sampleStatistics.gatheringsCommon"
                  :key="'gatheringsCommon-' + index"
                  :item-id="item.item_id"
                  :amount="item.count"
                  show-icon show-name show-amount
                >
                </ItemButton>
              </div>
            </n-collapse-item>
            <n-collapse-item :title="t('限时采集品')" name="gatheringsTimed">
              <div class="item-collapsed-container">
                <ItemButton
                  v-for="(item, index) in sampleStatistics.gatheringsTimed"
                  :key="'gatheringsTimed-' + index"
                  :item-id="item.item_id"
                  :amount="item.count"
                  show-icon show-name show-amount
                >
                </ItemButton>
              </div>
            </n-collapse-item>
            <n-collapse-item :title="t('水晶')" name="crystals">
              <div class="item-collapsed-container">
                <ItemButton
                  v-for="(item, index) in sampleStatistics.crystals"
                  :key="'crystals-' + index"
                  :item-id="item.item_id"
                  :amount="item.count"
                  show-icon show-name show-amount
                >
                </ItemButton>
              </div>
            </n-collapse-item>
          </n-collapse>
        </div>
      </GroupBox>
    </div>
  </FoldableCard>
</template>
  
<style scoped>
.group .container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
#reagents-group .container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}
#actions-group .container {
  padding: 10px 0;
  min-height: calc(100%);
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
    grid-template-columns: repeat(3, 1fr);
    row-gap: 15px;
    column-gap: 10px;
  }
  #actions-group {
    grid-row: 1 / 3;
    grid-column: 3;
  }
  #aethersands-group {
    grid-row: 2;
    grid-column: 1;
  }
  #common-precrafts-group {
    grid-row: 2;
    grid-column: 2;
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