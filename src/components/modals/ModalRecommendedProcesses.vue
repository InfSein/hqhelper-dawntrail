<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import {
  NButton, NCheckbox, NCollapse, NCollapseItem, NIcon,
  useMessage
} from 'naive-ui'
import { 
  AllInclusiveSharp, CopyAllOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import XivFARImage from '../custom/general/XivFARImage.vue'
import ItemSpan from '../custom/item/ItemSpan.vue'
import LocationSpan from '../custom/map/LocationSpan.vue'
import ModalFuncPreferences from './ModalFuncPreferences.vue'
import { type UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import { type ItemInfo } from '@/tools/item'
import { XivJobs, type XivJob } from '@/assets/data'
import { CopyToClipboard } from '@/tools'
import type EorzeaTime from '@/tools/eorzea-time'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const currentET = inject<Ref<EorzeaTime>>('currentET')!
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
const NAIVE_UI_MESSAGE = useMessage()
  
const showModal = defineModel<boolean>('show', { required: true })
const expandedBlocks = ref<Record<number, string[]>>({})
/** (groupId, (itemId, checked)) */
const completedItems = ref<Record<number, Record<number, boolean>>>({})

watch(showModal, async(newVal, oldVal) => {
  if (newVal && !oldVal) {
    expandedBlocks.value = {}; completedItems.value = {}
    for (let i = 0; i < itemGroups.value.length; i++) {
      expandedBlocks.value[i] = ['1']
      completedItems.value[i] = {}
      itemGroups.value[i].items.forEach(item => {
        completedItems.value[i][item.id] = false
      })
    }
  }
})

interface RecommendedProcessesProps {
  craftTargets: ItemInfo[],
  lv1Items: ItemInfo[],
  lv2Items: ItemInfo[],
  lv3Items: ItemInfo[],
  lvBaseItems: ItemInfo[]
}
const props = defineProps<RecommendedProcessesProps>()

const showItemGatherDetails = computed(() => {
  return funcConfig.value.processes_show_item_details
})

const itemGroups = computed(() => {
  const itemsGatherableCommon : ItemInfo[] = []
  const itemsGatherableLimited : ItemInfo[] = []
  const aethersands : ItemInfo[] = []
  const itemsTradable : ItemInfo[] = []
  const itemsOtherCollectable : ItemInfo[] = []
  const itemsPrePrePrecraft : Record<number, ItemInfo[]> = {}
  const itemsPrePrecraft : Record<number, ItemInfo[]> = {}
  const itemsPrecraft : Record<number, ItemInfo[]> = {}
  const itemsTarget : Record<number, ItemInfo[]> = {}

  // 从基础素材中检索分类
  props.lvBaseItems.forEach(item => {
    if (item.gatherInfo?.jobId) {
      if (item.gatherInfo.timeLimitInfo?.length) {
        itemsGatherableLimited.push(item)
      } else {
        itemsGatherableCommon.push(item)
      }
    } else if (item.canReduceFrom?.length) {
      aethersands.push(item)
    } else if (item.tradeInfo?.costGlobal) {
      // 部分道具同时具备可采集/精选和可兑换的属性，需要注意区分
      itemsTradable.push(item)
    } else {
      if (item.uiTypeId !== 59) {
        // 忽略水晶
        itemsOtherCollectable.push(item)
      }
    }
  })

  // 逐级遍历半成品
  props.lv1Items.forEach(item => {
    if (item.craftInfo?.jobId) {
      dealCraftableItem(itemsPrecraft, item)
    }
  })
  props.lv2Items.forEach(item => {
    if (item.craftInfo?.jobId) {
      dealCraftableItem(itemsPrePrecraft, item)
    }
  })
  props.lv3Items.forEach(item => {
    if (item.craftInfo?.jobId) {
      dealCraftableItem(itemsPrePrePrecraft, item)
    }
  })

  // 最终处理成品
  props.craftTargets.forEach(item => {
    if (item.craftInfo?.jobId) {
      dealCraftableItem(itemsTarget, item)
    }
  })

  // 根据处理后的物品列表组装各个分组
  const groups : {
    title: string,
    icon: string,
    description?: string,
    items: ItemInfo[]
  }[] = []
  const dealGatherings = (gathering: ItemInfo[], groupTitle: string, orderBy?: "map" | "start-time" | undefined) => {
    if (!gathering?.length) return
    if (orderBy === 'map') {
      gathering.sort((a, b) => {
        const aMap = a.gatherInfo.placeID
        const bMap = b.gatherInfo.placeID
        return aMap - bMap
      })
    } else if (orderBy === 'start-time') {
      gathering.sort((a, b) => {
        let startA = 99, startB = 99
        a.gatherInfo.timeLimitInfo.forEach(limit => {
          startA = Math.min(startA, Number(limit.start.split(':')[0]))
        })
        b.gatherInfo.timeLimitInfo.forEach(limit => {
          startB = Math.min(startB, Number(limit.start.split(':')[0]))
        })
        return startA - startB
      })
    }
    const itemsGatheredByBotanist : ItemInfo[] = []
    const itemsGatheredByMiner : ItemInfo[] = []
    const itemsGatheredByFisher : ItemInfo[] = []
    gathering.forEach(item => {
      switch(item.gatherInfo.jobId) {
        case 16: itemsGatheredByMiner.push(item)
          break
        case 17: itemsGatheredByBotanist.push(item)
          break
        case 18: itemsGatheredByFisher.push(item)
          break
      }
    })
    if (itemsGatheredByMiner.length) {
      const jobid = 16
      groups.push({
        title: groupTitle.replace('{job}', getJobName(XivJobs[jobid])),
        icon: XivJobs[jobid].job_icon_url,
        items: itemsGatheredByMiner
      })
    }
    if (itemsGatheredByBotanist.length) {
      const jobid = 17
      groups.push({
        title: groupTitle.replace('{job}', getJobName(XivJobs[jobid])),
        icon: XivJobs[jobid].job_icon_url,
        items: itemsGatheredByBotanist
      })
    }
    if (itemsGatheredByFisher.length) {
      const jobid = 18
      groups.push({
        title: groupTitle.replace('{job}', getJobName(XivJobs[jobid])),
        icon: XivJobs[jobid].job_icon_url,
        items: itemsGatheredByFisher
      })
    }
  }
  dealGatherings(itemsGatherableCommon, t('使用{job}采集(非限时)'), 'map')
  dealGatherings(itemsGatherableLimited, t('使用{job}采集(限时)'), 'start-time')
  if (aethersands.length) {
    groups.push({
      title: t('筹集灵砂'),
      icon: './ui/reduce.png',
      items: aethersands
    })
  }
  if (itemsTradable.length) {
    groups.push({
      title: t('兑换道具'),
      icon: './ui/important-item.png',
      items: itemsTradable
    })
  }
  if (itemsOtherCollectable.length) {
    groups.push({
      title: t('筹集其他需要的道具'),
      icon: './ui/bag.png',
      items: itemsOtherCollectable
    })
  }
  Object.keys(itemsPrePrePrecraft).forEach(_jobID => {
    const jobId = Number(_jobID)
    const job = XivJobs[jobId]
    groups.push({
      title: t('使用{job}制作半半半成品', getJobName(job)),
      icon: job.job_icon_url,
      items: itemsPrePrePrecraft[jobId]
    })
  })
  Object.keys(itemsPrePrecraft).forEach(_jobID => {
    const jobId = Number(_jobID)
    const job = XivJobs[jobId]
    groups.push({
      title: t('使用{job}制作半半成品', getJobName(job)),
      icon: job.job_icon_url,
      items: itemsPrePrecraft[jobId]
    })
  })
  Object.keys(itemsPrecraft).forEach(_jobID => {
    const jobId = Number(_jobID)
    const job = XivJobs[jobId]
    groups.push({
      title: t('使用{job}制作半成品', getJobName(job)),
      icon: job.job_icon_url,
      items: itemsPrecraft[jobId]
    })
  })
  Object.keys(itemsTarget).forEach(_jobID => {
    const jobId = Number(_jobID)
    const job = XivJobs[jobId]
    groups.push({
      title: t('使用{job}制作成品', getJobName(job)),
      icon: job.job_icon_url,
      items: itemsTarget[jobId]
    })
  })

  return groups

  function dealCraftableItem(target: Record<number, ItemInfo[]>, item: ItemInfo) {
    const jobId = item.craftInfo!.jobId
    target[jobId] ??= []
    const existing = target[jobId].find(_item => item.id === _item.id)
    if (existing) {
      existing.amount += item.amount
    } else {
      target[jobId].push(item)
    }
  }
})

const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})
const getItemName = (itemInfo: ItemInfo) => {
  switch (itemLanguage.value) {
    case 'ja':
      return itemInfo.nameJA
    case 'en':
      return itemInfo.nameEN
    case 'zh':
    default:
      return itemInfo.nameZH || '未翻译的物品'
  }
}
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

const handleCopy = async (content: string, successMessage?: string) => {
  const container = document.getElementById('modal-recomm-process')
  const response = await CopyToClipboard(content, container)
  if (response) {
    NAIVE_UI_MESSAGE.error(t('复制失败：发生意外错误'))
  } else {
    NAIVE_UI_MESSAGE.success(successMessage ?? t('已复制到剪贴板'))
  }
}

const isBlocksAllCollapsed = () => {
  let allCollapsed = true
  for (let i = 0; i < itemGroups.value.length; i++) {
    if (expandedBlocks.value[i] && expandedBlocks.value[i].length > 0) {
      allCollapsed = false
    }
  }
  return allCollapsed
}
const handleCollapseOrUncollapseAllBlocks = () => {
  const allCollapsed = isBlocksAllCollapsed()
  for (let i = 0; i < itemGroups.value.length; i++) {
    expandedBlocks.value[i] = allCollapsed ? ['1'] : []
  }
}
const handleCopyProcesses = () => {
  const text = itemGroups.value.map((group, index) => {
    return (index+1) + '. ' + group.title + ':\n' + group.items.map(item => {
      return '  ' + getItemName(item) + ' x' + item.amount
    }).join('\n')
  }).join('\n\n')
  handleCopy(text)
}
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

const showFuncPreferencesModal = ref(false)
const handleSettingButtonClick = () => {
  showFuncPreferencesModal.value = true
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    max-width="350px"
    extra-style="--n-padding-bottom: 10px;"
    show-setting
    @on-setting-button-clicked="handleSettingButtonClick"
  >
    <template #header>
      <div class="card-title no-select">
        <n-icon><AllInclusiveSharp /></n-icon>
        <span class="title">{{ t('推荐流程') }}</span>
        <div class="card-title-actions">
          <a href="javascript:void(0);" @click="handleCollapseOrUncollapseAllBlocks">[{{ isBlocksAllCollapsed() ? t('全部展开') : t('全部折叠') }}]</a>
        </div>
      </div>
    </template>

    <div class="wrapper">
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
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
        
        
      </div>
    </div>

    <template #action>
      <div class="submit-container">
        <n-button type="info" size="large" @click="handleCopyProcesses">
          <template #icon>
            <n-icon><CopyAllOutlined /></n-icon>
          </template>
          {{ t('复制') }}
        </n-button>
      </div>
    </template>
    
    <ModalFuncPreferences
      v-model:show="showFuncPreferencesModal"
      setting-group="recomm_process"
      @after-submit="appForceUpdate"
    />
  </MyModal>
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
  max-height: 375px;
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