<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
// import {
//   NSwitch,
// } from 'naive-ui'
import GroupBox from '@/components/templates/GroupBox.vue'
import ItemList from '@/components/custom/item/ItemList.vue'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import { useNbbCal } from '@/tools/use-nbb-cal'
import type { UserConfigModel } from '@/models/config-user'

// const store = useStore()
// const NAIVE_UI_MESSAGE = useMessage()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
// const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

interface CraftStatisticsProps {
  itemSelected: Record<number, number>
  hidePrecraftMaterials?: boolean
  listHeight?: number
}
const props = defineProps<CraftStatisticsProps>()

const { calItems } = useNbbCal()

const statistics = computed(() => {
  const value = calItems(props.itemSelected)
  return value
})

const lv1Items = computed(() => {
  const items = []
  for (const id in statistics.value.lv1) {
    try {
      const item = getItemInfo(statistics.value.lv1[id])
      items.push(item)
    } catch (error) {
      console.warn('[compute.lv1Items] Error processing item ' + id + ':', error)
    }
  }
  return items
})
const lvBaseItems = computed(() => {
  const items = []
  for (const id in statistics.value.lvBase) {
    try {
      const item = getItemInfo(statistics.value.lvBase[id])
      items.push(item)
    } catch (error) {
      console.warn('[compute.lvBaseItems] Error processing item ' + id + ':', error)
    }
  }
  return items
})

const materialTarget = computed(() => {
  if (props.hidePrecraftMaterials) {
    return lv1Items.value
  } else {
    return lvBaseItems.value
  }
})
const materialTargetDescription = computed(() => {
  return [
    props.hidePrecraftMaterials
      ? t('此处的统计只计算了直接制作成品的所需素材，未包括制作半成品的所需素材。')
      : t('此处的统计包括直接制作成品的所需素材和制作半成品的所需素材。')
  ]
})

/**
 * 表示要展示的半成品。
 */
const precrafts = computed(() => {
  const crafts : ItemInfo[] = []
  lv1Items.value.forEach(item => {
    if (item.craftInfo?.jobId) {
      crafts.push(item)
    }
  })
  return crafts
})

/**
 * 表示需要用亚拉戈神典石或工票兑换的道具。
 */
const tomeScriptItems = computed(() => {
  const items : ItemInfo[] = []
  materialTarget.value.forEach(material => {
    if (material.isAethersand) return
    if (material.gatherInfo?.jobId) return
    if (!material.tradeInfo) return
    items.push(material)
  })
  return items
})

/**
 * 表示碎晶/水晶/晶簇统计。
 */
const crystals = computed(() => {
  const _crystals : ItemInfo[] = []
  materialTarget.value.forEach(material => {
    if (material.uiTypeId === 59) {
      _crystals.push(material)
    }
  })
  return _crystals
})

/**
 * 表示限时采集品统计。
 * 包括灵砂。
 */
const gatheringsTimed = computed(() => {
  const aethersands : ItemInfo[] = []
  const gathers : ItemInfo[] = []

  materialTarget.value.forEach(material => {
    if (material.isAethersand) {
      aethersands.push(material)
    }
    if (material.gatherInfo?.timeLimitInfo?.length) {
      gathers.push(material)
    }
  })

  return [...aethersands, ...gathers]
})

/**
 * 表示非限时(常规)采集品统计。
 */
const gatheringsCommon = computed(() => {
  const gathers : ItemInfo[] = []
  materialTarget.value.forEach(material => {
    if (material.gatherInfo?.placeID && !material.gatherInfo.timeLimitInfo?.length) {
      gathers.push(material)
    }
  })
  return gathers
})

/**
 * 表示其他道具统计。
 */
const otherMaterials = computed(() => {
  const items : ItemInfo[] = []
  materialTarget.value.forEach(material => {
    if (material.isAethersand) return
    if (material.craftInfo?.jobId) return
    if (material.gatherInfo?.placeID) return
    if (material.tradeInfo) return
    if (material.uiTypeId === 59) return
    if (material.gatherInfo) return
    items.push(material)
  })
  return items
})
</script>

<template>
  <div class="cs-wrapper">
    <GroupBox id="common-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
      <template #title>{{ t('半成品统计') }}</template>
      <div class="container">
        <ItemList
          :items="precrafts"
          :list-height="listHeight ?? (isMobile ? undefined : 245)"
          :show-collector-icon="!userConfig.hide_collector_icons"
        />
      </div>
    </GroupBox>
    <GroupBox
      id="tome-script-group" class="group" title-background-color="var(--n-color-embedded)"
      :title="t('兑换道具统计')"
      :descriptions="materialTargetDescription"
    >
      <div class="container">
        <ItemList
          :items="tomeScriptItems"
          :list-height="listHeight ?? (isMobile ? undefined : 245)"
        />
      </div>
    </GroupBox>
    <GroupBox
      id="crystals-group" class="group" title-background-color="var(--n-color-embedded)"
      :title="t('水晶统计')"
      :descriptions="materialTargetDescription"
    >
      <div class="container">
        <ItemList
          :items="crystals"
          :list-height="listHeight ?? (isMobile ? undefined : 245)"
        />
      </div>
    </GroupBox>
    <GroupBox
      id="common-gatherings-group" class="group" title-background-color="var(--n-color-embedded)"
      :title="t('常规采集品统计')"
      :descriptions="materialTargetDescription"
    >
      <div class="container">
        <ItemList
          :items="gatheringsCommon"
          :list-height="listHeight ?? (isMobile ? undefined : 245)"
          :show-collector-icon="!userConfig.hide_collector_icons"
        />
      </div>
    </GroupBox>
    <GroupBox
      id="timed-gatherings-group" class="group" title-background-color="var(--n-color-embedded)"
      :title="t('限时采集品&灵砂统计')"
      :descriptions="materialTargetDescription"
    >
      <div class="container">
        <ItemList
          :items="gatheringsTimed"
          :list-height="listHeight ?? (isMobile ? undefined : 245)"
          :show-collector-icon="!userConfig.hide_collector_icons"
        />
      </div>
    </GroupBox>
    <GroupBox
      id="other-materials-group" class="group" title-background-color="var(--n-color-embedded)"
      :title="t('其他素材统计')"
      :descriptions="[
        t('未被其他分组归类的道具。'),
        ...materialTargetDescription
      ]"
    >
      <div class="container">
        <ItemList
          :items="otherMaterials"
          :list-height="listHeight ?? (isMobile ? undefined : 245)"
          :show-collector-icon="!userConfig.hide_collector_icons"
        />
      </div>
    </GroupBox>
  </div>
</template>

<style scoped>
.cs-wrapper {
  row-gap: 15px;
  column-gap: 10px;
}
/* Desktop */
@media screen and (min-width: 768px) {
  .cs-wrapper {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-flow: row;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .cs-wrapper {
    display: flex;
    flex-direction: column;
  }
}
</style>