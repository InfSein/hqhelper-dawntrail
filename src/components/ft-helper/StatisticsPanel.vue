<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NSwitch
} from 'naive-ui'
import FoldableCard from '@/components/custom-controls/FoldableCard.vue'
import ModalCraftStatements from '../modals/ModalCraftStatements.vue'
import { getItemInfo, getStatementData, type ItemInfo } from '@/tools/item'
import GroupBox from '../custom-controls/GroupBox.vue'
import ItemList from '../custom-controls/ItemList.vue'
import { useNbbCal } from '@/tools/use-nbb-cal'
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
  normalCraftings: {
    type: Array as () => number[] | undefined,
    required: true
  }
})

const hidePrecraftGatherings = defineModel<boolean | undefined>('hidePrecraftGatherings', { required: true })

const { getTradeMap } = useNbbCal()
const tradeMap = getTradeMap()

/**
 * 表示需要用亚拉戈神典石或工票兑换的道具。
 */
const tomeScriptItems = computed(() => {
  const items = []
  for (const id in props.statistics.lvBase) {
    try {
      const _id = parseInt(id)

      // * 过滤掉一些兑换品，以避免出现重复统计
      if (props.aethersandGatherings?.length && props.aethersandGatherings.includes(_id)) continue
      if (props.normalCraftings?.length && props.normalCraftings.includes(_id)) continue
      if (props.limitedGatherings?.length && props.limitedGatherings.includes(_id)) continue
      if (props.normalGatherings?.length && props.normalGatherings.includes(_id)) continue
      
      if (tradeMap[_id]) {
        const item = props.statistics.lvBase[id]
        items.push(getItemInfo(item))
      }
    } catch (error) {
      console.warn('[compute.gatheringsTimed] Error processing item ' + id + ':', error)
    }
  }
  return items
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
 * 统计采集品时的目标统计表。
 * 在开启了`hidePrecraftGatherings`时，将从`直接素材`而非`基础素材`中获取统计数据。
 */
const getGatheringBase = () => {
  if (hidePrecraftGatherings.value) {
    return props.statistics.lv1
  } else {
    return props.statistics.lvBase
  }
}

/**
 * 表示限时采集品统计。
 */
const gatheringsTimed = computed(() => {
  if (!props.limitedGatherings?.length) {
    return [] as ItemInfo[]
  }
  const gathers = []
  const gatheringBase = getGatheringBase()
  for (const id in gatheringBase) {
    try {
      const _id = parseInt(id)
      if (props.limitedGatherings.includes(_id) && !props.aethersandGatherings?.includes(_id)) {
        const item = gatheringBase[id]
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
  const gatheringBase = getGatheringBase()
  for (const id in gatheringBase) {
    try {
      const _id = parseInt(id)
      if (props.normalGatherings.includes(_id)) {
        const item = gatheringBase[id]
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

const showStatementModal = ref(false)
const showStatement = () => {
  console.log('statistics:', props.statistics)
  showStatementModal.value = true
}
const statementData = computed(() => {
  return getStatementData(props.statistics)
})
</script>

<template>
  <div>
    <FoldableCard card-key="ft-statistics">
      <template #header>
        <i class="xiv square-2"></i>
        <span class="card-title-text">{{ t('查看统计') }}</span>
        <a class="card-title-extra" href="javascript:void(0);" @click="showStatement">{{ t('[查看报表]') }}</a>
      </template>

      <div class="pre">
        <div class="preset-item">
          <n-switch v-model:value="hidePrecraftGatherings" :round="false" size="small" />
          <div>{{ t('采集统计不显示半成品需要的素材') }}</div>
        </div>
      </div>
      <div class="wrapper">
        <GroupBox
          id="tome-script-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('兑换道具统计')"
          :descriptions="[
            t('此处的统计包括直接制作成品的所需素材和制作半成品的所需素材。')
          ]"
        >
          <div class="container">
            <ItemList
              :items="tomeScriptItems"
              :list-height="isMobile ? undefined : 245"
            />
          </div>
        </GroupBox>
        <GroupBox id="common-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
          <template #title>{{ t('半成品统计') }}</template>
          <div class="container">
            <ItemList
              :items="commonPrecrafts"
              :list-height="isMobile ? undefined : 245"
              :show-collector-icon="!userConfig.hide_collector_icons"
            />
          </div>
        </GroupBox>
        <GroupBox
          id="aethersands-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('灵砂统计')"
          :descriptions="[
            t('此处的统计包括直接制作成品的所需素材和制作半成品的所需素材。')
          ]"
        >
          <div class="container">
            <ItemList
              :items="aethersands"
            />
          </div>
        </GroupBox>
        <GroupBox
          id="common-gatherings-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('常规采集品')"
          :descriptions="[
            hidePrecraftGatherings
              ? t('此处的统计只计算了直接制作成品的所需素材，未包括制作半成品的所需素材。')
              : t('此处的统计包括直接制作成品的所需素材和制作半成品的所需素材。')
          ]"
        >
          <div class="container">
            <ItemList
              :items="gatheringsCommon"
              :list-height="isMobile ? undefined : 245"
              :show-collector-icon="!userConfig.hide_collector_icons"
            />
          </div>
        </GroupBox>
        <GroupBox
          id="timed-gatherings-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('限时采集品')"
          :descriptions="[
            hidePrecraftGatherings
              ? t('此处的统计只计算了直接制作成品的所需素材，未包括制作半成品的所需素材。')
              : t('此处的统计包括直接制作成品的所需素材和制作半成品的所需素材。')
          ]"
        >
          <div class="container">
            <ItemList
              :items="gatheringsTimed"
              :list-height="isMobile ? undefined : 245"
              :show-collector-icon="!userConfig.hide_collector_icons"
            />
          </div>
        </GroupBox>
        <GroupBox
          id="crystals-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('水晶统计')"
          :descriptions="[
            t('此处的统计包括直接制作成品的所需素材和制作半成品的所需素材。')
          ]"
        >
          <div class="container">
            <ItemList
              :items="crystals"
              :list-height="isMobile ? undefined : 245"
            />
          </div>
        </GroupBox>
      </div>
      
      <ModalCraftStatements
        v-model:show="showStatementModal"
        v-bind="statementData"
      />
    </FoldableCard>
  </div>
</template>

<style scoped>
.pre {
  margin-bottom: 15px;

  .preset-item {
    width: fit-content;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px;
    border: 1px solid var(--n-color-target);
    border-radius: var(--n-border-radius);
  }
}
.wrapper {
  row-gap: 15px;
  column-gap: 10px;
}
/* Desktop */
@media screen and (min-width: 768px) {
  .wrapper {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
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