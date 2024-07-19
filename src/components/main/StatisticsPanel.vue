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
import { getItemInfo, type ItemInfo } from '@/tools/item'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const props = defineProps({
  statistics: {
    type: Object as () => any,
    required: true
  }
})

/** 
 * 要高亮显示的素材组。
 * 
 * 在战斗职业HQ版本用于展示炼金术士的秘籍星级半成品-炼金幻水，顺序为`刚巧耐智意`。
 * 在生产采集HQ版本用于展示相较于前一战职版本新增的星级半成品，一般在[1,3]号index填写。
 */
const reagents = computed(() => {
  // todo - 分组归类：炼金秘籍半成品(多半要留到7.05再做)
  const placeHolder = getItemInfo(0)
  return [placeHolder,placeHolder,placeHolder,placeHolder,placeHolder]
})

/**
 * 要展示的秘籍星级半成品。
 * 
 * 按照制作职业排序，一般顺序为`刻木-锻铁-雕金-制革-裁缝`。
 * ? 理论上按照成品id升序排序就可以达到这个效果，有待验证
 */
const masterPrecrafts = computed(() => {
  // todo - 分组归类：其他秘籍半成品(多半要留到7.05再做)
  return [] as ItemInfo[]
})

/**
 * 表示要展示的普通星级半成品。
 * 必须是一个数组，长度无限制
 */
const commonPrecrafts = computed(() => {
  // todo - 这里的分组归类算法会计入秘籍半成品，等7.05了必须做区分
  const crafts = []
  for (const id in props.statistics.lv1) {
    const item = props.statistics.lv1[id]
    if (item.uc && item.uc >= 48 && item.uc <= 54) { // * 参见src\assets\data\xiv-item-types.json
      crafts.push(getItemInfo(item))
    }
  }
  return crafts
})

/**
 * 表示独立统计出的灵砂。
 * 展示时应注意说明此灵砂已计入其他半成品所需的数量。
 */
const aethersands = computed(() => {
  // todo - 分组归类：灵砂
  return [] as ItemInfo[]
})

/**
 * 表示限时采集品统计。
 */
const gatheringsTimed = computed(() => {
  // todo - 分组归类：限时采集
  return [] as ItemInfo[]
})

/**
 * 表示非限时(常规)采集品统计。
 */
const gatheringsCommon = computed(() => {
  // todo - 分组归类：非限时采集
  return [] as ItemInfo[]
})

/**
 * 表示碎晶/水晶/晶簇统计。
 */
const crystals = computed(() => {
  const _crystals = []
  for (const id in props.statistics.lvBase) {
    const item = props.statistics.lv1[id]
    if (item?.uc === 59) { // * 参见src\assets\data\xiv-item-types.json
      _crystals.push(getItemInfo(item))
    }
  }
  return _crystals
})

const reagentsBtnColors = ['#FF8080', '#8080FF', '#FFC080', '#00BFFF', '#40E0D0'] // 刚巧耐智意

</script>

<template>
  <FoldableCard card-key="main-statistics" :reagents="reagents">
    <template #header>
      <i class="xiv square-4"></i>
      <span class="card-title-text">{{ t('查看统计') }}</span>
    </template>
    <div class="wrapper" :size="[1,2]">
      <GroupBox id="reagents-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('特殊秘籍半成品&点数统计') }}</template>
        <div class="container">
          <ItemButton
            v-for="(item, index) in reagents"
            :key="'reagent-' + index"
            :item-info="item"
            show-icon show-name show-amount
            :btn-color="reagentsBtnColors[index]"
          >
          </ItemButton>
          <TomeScriptButton class="w-full h-full"></TomeScriptButton>
        </div>
      </GroupBox>
      <GroupBox id="aethersands-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('灵砂统计') }}</template>
        <div class="container">
          <ItemList
            :items="aethersands"
          />
        </div>
      </GroupBox>
      <GroupBox id="master-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('普通秘籍半成品统计') }}</template>
        <div class="container">
          <ItemList
            :items="masterPrecrafts"
            :list-height="isMobile ? undefined : 320"
          />
        </div>
      </GroupBox>
      <GroupBox id="common-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
        <template #title>{{ t('普通半成品统计') }}</template>
        <div class="container">
          <ItemList
            :items="commonPrecrafts"
            :list-height="isMobile ? undefined : 320"
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
                />
              </div>
            </n-collapse-item>
            <n-collapse-item :title="t('限时采集品')" name="gatheringsTimed">
              <div class="item-collapsed-container">
                <ItemList
                  :items="gatheringsTimed"
                  :list-height="isMobile ? undefined : 320"
                />
              </div>
            </n-collapse-item>
            <n-collapse-item :title="t('水晶')" name="crystals">
              <div class="item-collapsed-container">
                <ItemList
                  :items="crystals"
                  :list-height="isMobile ? undefined : 320"
                />
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
  height: 100%;
}
#reagents-group .container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
    grid-template-columns: repeat(3, 1fr);
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