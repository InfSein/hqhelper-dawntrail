<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import FoldableCard from '@/components/custom-controls/FoldableCard.vue'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import GroupBox from '../custom-controls/GroupBox.vue'
import ItemList from '../custom-controls/ItemList.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

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
  normalCraftings: {
    type: Array as () => number[] | undefined,
    required: true
  }
})

/**
 * 表示需要用亚拉戈神典石或工票兑换的道具。
 */
const tomeScriptItems = computed(() => {
  return [] // todo
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
</script>

<template>
  <div>
    <FoldableCard card-key="ft-statistics">
      <template #header>
        <i class="xiv square-2"></i>
        <span class="card-title-text">{{ t('查看统计') }}</span>
      </template>

      <div class="wrapper">
        <GroupBox id="tome-script-group" class="group" title-background-color="var(--n-color-embedded)">
          <template #title>{{ t('兑换道具统计') }}</template>
          <div class="container">
            <ItemList
              :items="tomeScriptItems"
              :list-height="isMobile ? undefined : 250"
            />
          </div>
        </GroupBox>
        <GroupBox id="common-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
          <template #title>{{ t('半成品统计') }}</template>
          <div class="container">
            <ItemList
              :items="commonPrecrafts"
              :list-height="isMobile ? undefined : 250"
            />
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
        <GroupBox id="common-gatherings-group" class="group" title-background-color="var(--n-color-embedded)">
          <template #title>{{ t('常规采集品') }}</template>
          <div class="container">
            <ItemList
              :items="gatheringsCommon"
              :list-height="isMobile ? undefined : 250"
            />
          </div>
        </GroupBox>
        <GroupBox id="timed-gatherings-group" class="group" title-background-color="var(--n-color-embedded)">
          <template #title>{{ t('限时采集品') }}</template>
          <div class="container">
            <ItemList
              :items="gatheringsTimed"
              :list-height="isMobile ? undefined : 250"
            />
          </div>
        </GroupBox>
        <GroupBox id="crystals-group" class="group" title-background-color="var(--n-color-embedded)">
          <template #title>{{ t('水晶') }}</template>
          <div class="container">
            <ItemList
              :items="crystals"
              :list-height="isMobile ? undefined : 250"
            />
          </div>
        </GroupBox>
      </div>
    </FoldableCard>
  </div>
</template>

<style scoped>
.wrapper {
  row-gap: 15px;
  column-gap: 10px;
}
/* Desktop */
@media screen and (min-width: 768px) {
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-flow: row;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .wrapper {
    display: flex;
    flex-direction: column;
  }
}
</style>