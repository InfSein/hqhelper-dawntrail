<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
// import {
//   NInputNumber, NScrollbar, NTable
// } from 'naive-ui'
import XivFARImage from '../general/XivFARImage.vue'
import ItemSpan from './ItemSpan.vue'
import type { UserConfigModel } from '@/models/config-user'
import { XivJobs, type XivJob } from '@/assets/data'
import { getItemInfo, type StatementRow } from '@/tools/item'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

interface ItemCellProps {
  item: StatementRow
  showItemDetails: boolean
  containerId?: string
}
defineProps<ItemCellProps>()

const itemServer = computed(() => {
  let server = userConfig.value.item_server
  if (!server || server === 'auto') {
    const lang = userConfig.value.language_ui
    if (lang === 'zh') {
      server = 'chs'
    } else {
      server = 'global'
    }
  }
  return server
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
const getTradeCost = (row: StatementRow) => {
  const itemInfo = row.info; const amount = row.amount.remain
  if (!itemInfo.tradeInfo) return undefined
  const cost = itemServer.value === 'chs' ? itemInfo.tradeInfo.costCHS : itemInfo.tradeInfo.costGlobal
  const receive = itemInfo.tradeInfo.receiveCount || 1
  const totalCost = amount * cost.costCount / receive
  return {
    costItem: cost.costId,
    costCount: totalCost
  }
}
</script>

<template>
  <div v-if="showItemDetails" class="item-detail-container">
    <div class="item-icon">
      <XivFARImage
        :size="26"
        :src="item.info.iconUrl"
      />
    </div>
    <div class="item-info">
      <div class="item-name">
        <ItemSpan hide-icon :item-info="item.info" :container-id="containerId" />
      </div>
      <div class="item-details">
        <div v-if="item.info.craftInfo?.jobId" class="cell crafter">
          <XivFARImage
            :src="XivJobs[item.info.craftInfo.jobId].job_icon_url"
            :size="12"
          />
          <span>{{ getJobName(XivJobs[item.info.craftInfo.jobId]) }}</span>
          <span>
            {{ t('{lv}级', item.info.craftInfo.craftLevel) }}{{ '★'.repeat(item.info.craftInfo?.starCount || 0) }}
          </span>
        </div>
        <div v-if="item.info.gatherInfo?.jobId" class="cell gatherer">
          <XivFARImage
            :src="XivJobs[item.info.gatherInfo.jobId].job_icon_url"
            :size="12"
          />
          <span>{{ getJobName(XivJobs[item.info.gatherInfo.jobId]) }}</span>
        </div>
        <div v-else-if="item.info.canReduceFrom?.length">{{ t('精选') }}</div>
        <div v-else-if="getTradeCost(item)">
          <ItemSpan
            :item-info="getItemInfo(getTradeCost(item)!.costItem)"
            :img-size="12"
            :amount="getTradeCost(item)!.costCount"
            hide-pop-icon hide-name show-amount
          />
        </div>
        <div v-else-if="item.info.isFishingItem">
          <XivFARImage
            :src="XivJobs[18].job_icon_url"
            :size="12"
          />
          <span>{{ getJobName(XivJobs[18]) }}</span>
        </div>
        <div v-if="item.info.uiTypeId === 59">{{ t('水晶') }}</div>
      </div>
    </div>
  </div>
  <ItemSpan
    v-else
    :item-info="item.info"
    :container-id="containerId"
  />
</template>

<style scoped>
/* All */
.item-detail-container {
  display: flex;
  gap: 5px;
  line-height: 1.2;

  .item-icon {
    display: flex;
    align-items: center;
  }
  .item-details {
    font-size: calc(var(--n-font-size) - 2px);
    display: flex;
    gap: 0 3px;
    
    .cell {
      display: flex;
      align-items: center;
    }
    .cell.crafter,
    .cell.gatherer {
      gap: 2px;
    }
  }
}

/* Desktop */
@media screen and (min-width: 768px) {
}

/* Mobile */
@media screen and (max-width: 767px) {
}
</style>