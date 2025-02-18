<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import {
  NCheckbox, NCollapse, NCollapseItem,
  // useMessage
} from 'naive-ui'
// import { 
//   AllInclusiveSharp, CopyAllOutlined
// } from '@vicons/material'
import XivFARImage from '@/components/custom/general/XivFARImage.vue'
import ItemSpan from '@/components/custom/item/ItemSpan.vue'
import LocationSpan from '@/components/custom/map/LocationSpan.vue'
import { type UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import { type ItemInfo } from '@/tools/item'
import { XivJobs, type XivJob } from '@/assets/data'
import type EorzeaTime from '@/tools/eorzea-time'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const currentET = inject<Ref<EorzeaTime>>('currentET')!
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
// const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
// const NAIVE_UI_MESSAGE = useMessage()

const expandedBlocks = defineModel<Record<number, string[]>>('expandedBlocks', { required: true })
const completedItems = defineModel<Record<number, Record<number, boolean>>>('completedItems', { required: true })

export interface CraftRecommProcessesProps {
  contentMaxHeight?: string;
  itemGroups: {
    title: string;
    icon: string;
    description?: string;
    items: ItemInfo[];
  }[];
}
defineProps<CraftRecommProcessesProps>()

const showItemGatherDetails = computed(() => {
  return funcConfig.value.processes_show_item_details
})

const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})
const getJobName = (jobInfo: XivJob) => {
  switch (userConfig.value.language_ui) {
    case 'ja':
      return jobInfo?.job_name_ja || t('未知')
    case 'en':
      return jobInfo?.job_name_en || t('未知')
    default:
      return jobInfo?.job_name_zh || t('未知')
  }
}
const getPlaceName = (itemInfo : ItemInfo) => {
  switch (itemLanguage.value) {
    case 'ja':
      return itemInfo.gatherInfo?.placeNameJA
    case 'en':
      return itemInfo.gatherInfo?.placeNameEN
    case 'zh':
    default:
      return itemInfo.gatherInfo?.placeNameZH
  }
}
const textsGatherAt = computed(() => {
  const [p1, p2] = t('在{}采集').split('{}')
  return { p1, p2 }
})

const handleItemCompletionChange = (groupIndex: number) => {
  let needToCollapseGroup = true
  Object.values(completedItems.value[groupIndex]).forEach(completed => {
    needToCollapseGroup = needToCollapseGroup && completed
  })
  if (needToCollapseGroup) {
    expandedBlocks.value[groupIndex] = []
  }
}

const isItemGatherableNow = (item: ItemInfo) => {
  let gatherable = false
  item.gatherInfo.timeLimitInfo?.forEach(info => {
    const parseTime = (time: string) => time.split(':').reduce((acc, val, idx) => acc + parseInt(val) * [60, 1][idx], 0)
    const s = parseTime(info.start)
    const e = parseTime(info.end)
    const c = currentET.value.hour * 60 + currentET.value.minute
    if (c >= s && c < e) {
      gatherable = true
    }
  })
  return gatherable
}
</script>

<template>
  <div class="wrapper" :style="{ maxHeight: contentMaxHeight ?? '375px' }">
    <div
      class="block"
      v-for="(group, groupIndex) in itemGroups"
      :key="'group-' + groupIndex"
    >
      <n-collapse arrow-placement="right" v-model:expanded-names="expandedBlocks[groupIndex]">
        <n-collapse-item name="1">
          <template #header>
            <div class="title">
              <span class="icon">
                <XivFARImage
                  :size="14"
                  :src="group.icon"
                  class="no-select"
                />
              </span>
              <span>
                {{ groupIndex + 1 }}. {{ group.title }}
              </span>
            </div>
          </template>

          <div class="description" v-if="group.description">{{ group.description }}</div>
          <div class="items">
            <div
              v-for="item in group.items"
              :key="'item-' + item.id"
              style=""
            >
              <div class="item-container">
                <n-checkbox
                  size="small"
                  v-model:checked="completedItems[groupIndex][item.id]"
                  @update:checked="handleItemCompletionChange(groupIndex)"
                />
                <ItemSpan
                  :item-info="item"
                  :amount="item.amount"
                  show-amount
                  container-id="modal-recomm-process"
                />
              </div>
              <div
                class="gather-detail-time"
                v-if="showItemGatherDetails && item.gatherInfo?.timeLimitDescription && !completedItems[groupIndex][item.id]"
              >
                <span style="margin-right: 1px;">(</span>
                <span>{{ t('限时: {}', item.gatherInfo.timeLimitDescription) }}</span>
                <span v-if="isItemGatherableNow(item)" class="green" style="margin-left: 3px;">{{ t('现可采集') }}</span>
                <span style="margin-left: 1px;">)</span>
              </div>
              <div
                class="gather-detail-position"
                v-if="showItemGatherDetails && item.gatherInfo?.placeID && !completedItems[groupIndex][item.id]"
              >
                <span style="margin-right: 1px;">(</span>
                <span v-if="showItemGatherDetails && item.gatherInfo?.placeID">{{ textsGatherAt.p1 }}</span>
                <LocationSpan
                  v-if="showItemGatherDetails && item.gatherInfo?.placeID"
                  :place-id="item.gatherInfo.placeID"
                  :place-name="getPlaceName(item)"
                  :coordinate-x="item.gatherInfo.posX"
                  :coordinate-y="item.gatherInfo.posY"
                  :size="12"
                  style="margin: 0 2px 0 1px; "
                />
                <span v-if="showItemGatherDetails && item.gatherInfo?.placeID">{{ textsGatherAt.p2 }}</span>
                <span style="margin-left: 1px;">)</span>
              </div>
              <div
                class="gather-detail-recomm"
                v-if="showItemGatherDetails && item.gatherInfo?.placeID && !completedItems[groupIndex][item.id]"
              >
                <span v-if="funcConfig.processes_merge_gatherings" style="margin-right: 1px;">(</span>
                <span v-if="funcConfig.processes_merge_gatherings" class="flex-vac">
                  <XivFARImage
                    class="icon no-select"
                    :src="XivJobs[item.gatherInfo.jobId].job_icon_url"
                    :size="12"
                  />
                  <p>{{ getJobName(XivJobs[item.gatherInfo.jobId]) }}</p>
                </span>
                <span v-if="funcConfig.processes_merge_gatherings" style="margin: 0 3px 0 1px;">)</span>
                <span style="margin-right: 1px;">(</span>
                <span>{{ t('推荐传送点') }} - {{ item.gatherInfo.recommAetheryte?.[`name_${itemLanguage}`] }}</span>
                <span style="margin-left: 1px;">)</span>
              </div>
            </div>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-card__action) {
  padding-top: 15px;
  padding-bottom: 15px;
}
:deep(.n-collapse-item__content-inner) {
  padding-top: 0 !important;
}

/* All */
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  user-select: text;
  overflow-y: auto;

  .block {
    line-height: 1.2;

    .title {
      display: flex;
      align-items: center;
      span {
        font-weight: bold;
      }
      span.icon {
        display: flex;
        margin-right: 3px;
      }
    }
    .items {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin: 3px 0 0 1em;

      .item-container {
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .gather-detail-time,
      .gather-detail-recomm,
      .gather-detail-position {
        display: flex;
        flex-wrap: wrap;
        margin-left: 1em;
        font-size: calc(var(--n-font-size) - 2px);
      }
    }
  }
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile only */
/* @media (max-width: 768px)*/
</style>