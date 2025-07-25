<script setup lang="ts">
import { inject, type Ref } from 'vue'
// import {
//   NInputNumber, NScrollbar, NTable
// } from 'naive-ui'
import XivFARImage from '../general/XivFARImage.vue'
import ItemSpan from './ItemSpan.vue'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'
import { XivJobs, type XivJob } from '@/assets/data'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import UseConfig from '@/tools/use-config'

const t = inject<(message: string, args?: any) => string>('t')!
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const {
  itemServer,
} = UseConfig(userConfig, funcConfig)

interface ItemCellProps {
  itemInfo: ItemInfo
  amount: number
  showItemDetails: boolean
  itemSpanMaxWidth?: string
  containerId?: string
}
defineProps<ItemCellProps>()

const getJobName = (jobInfo: XivJob) => {
  switch (userConfig.value.language_ui) {
    case 'ja':
      return jobInfo?.job_name_ja || t('common.unknown')
    case 'en':
      return jobInfo?.job_name_en || t('common.unknown')
    default:
      return jobInfo?.job_name_zh || t('common.unknown')
  }
}
const getTradeCost = (itemInfo: ItemInfo, amount: number) => {
  if (!itemInfo.tradeInfo) return undefined
  const cost = itemServer.value === 'chs' ? itemInfo.tradeInfo.costCHS : itemInfo.tradeInfo.costGlobal
  const receive = itemInfo.tradeInfo.receiveCount || 1
  const totalCost = amount * cost.costCount / receive
  return {
    costItem: cost.costId,
    costCount: (totalCost < 0) ? 0 : totalCost
  }
}
</script>

<template>
  <div v-if="showItemDetails" class="item-detail-container">
    <div class="item-icon">
      <XivFARImage
        :size="26"
        :src="itemInfo.iconUrl"
      />
    </div>
    <div class="item-info">
      <div class="item-name">
        <ItemSpan hide-icon :item-info="itemInfo" :span-max-width="itemSpanMaxWidth" :container-id="containerId" />
      </div>
      <div class="item-details">
        <div v-if="itemInfo.craftInfo?.jobId" class="cell crafter">
          <XivFARImage
            :src="XivJobs[itemInfo.craftInfo.jobId].job_icon_url"
            :size="12"
          />
          <span>
            {{ getJobName(XivJobs[itemInfo.craftInfo.jobId]) + ' ' + t('common.val_level', itemInfo.craftInfo.craftLevel) + '★'.repeat(itemInfo.craftInfo?.starCount || 0) }}
          </span>
        </div>
        <div v-if="itemInfo.gatherInfo?.jobId" class="cell gatherer">
          <XivFARImage
            :src="XivJobs[itemInfo.gatherInfo.jobId].job_icon_url"
            :size="12"
          />
          <span>{{ getJobName(XivJobs[itemInfo.gatherInfo.jobId]) }}</span>
        </div>
        <div v-else-if="itemInfo.canReduceFrom?.length">{{ t('common.reduce') }}</div>
        <div v-else-if="getTradeCost(itemInfo, amount)">
          <ItemSpan
            :item-info="getItemInfo(getTradeCost(itemInfo, amount)!.costItem)"
            :img-size="12"
            :amount="getTradeCost(itemInfo, amount)!.costCount"
            hide-pop-icon hide-name show-amount
          />
        </div>
        <div v-else-if="itemInfo.isFishingItem">
          <XivFARImage
            :src="XivJobs[18].job_icon_url"
            :size="12"
          />
          <span>{{ getJobName(XivJobs[18]) }}</span>
        </div>
        <div v-if="itemInfo.isCrystal">{{ t('game.crystal') }}</div>
      </div>
    </div>
  </div>
  <ItemSpan
    v-else
    :item-info="itemInfo"
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