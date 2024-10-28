<script setup lang='ts'>
import { inject, ref, type PropType, type Ref } from 'vue'
import {
  NCard, NIcon, NModal, NTabs, NTabPane
} from 'naive-ui'
import { 
  AttachMoneyOutlined
} from '@vicons/material'
import type { ItemInfo } from '@/tools/item'
import ItemPriceTable from '../custom-controls/ItemPriceTable.vue'
import GroupBox from '../custom-controls/GroupBox.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const showModal = defineModel<boolean>('show', { required: true })
defineProps({
  costItems: {
    type: Array as PropType<ItemInfo[]>,
    required: true
  },
  benefitItems: {
    type: Array as PropType<ItemInfo[]>,
    required: true
  },
  costInfo: {
    type: String,
    default: ''
  },
  benefitInfo: {
    type: String,
    default: ''
  }
})

const handleClose = () => {
  showModal.value = false
}
</script>

<template>
  <n-modal v-model:show="showModal">
    <n-card
      closable
      role="dialog"
      id="modal-cost-and-benefits"
      style="width: 98%; max-width: 1200px;"
      :style="{ height: isMobile ? '650px' : '600px' }"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><AttachMoneyOutlined /></n-icon>
          <span class="title">{{ t('成本/收益预估') }}</span>
        </div>
      </template>

      <n-tabs v-if="isMobile" type="segment" animated>
        <n-tab-pane
          name="cost"
          :tab="t('成本')"
        >
          <div class="container">
            <div class="align-right">{{ t('预计成本 {val}', costInfo) }}</div>
            <ItemPriceTable
              price-type="NQ"
              :items="costItems"
              container-id="modal-cost-and-benefits"
            />
          </div>
        </n-tab-pane>
        <n-tab-pane
          name="benefit"
          :tab="t('收益')"
        >
          <div class="container">
            <div class="align-right">{{ t('预计收益 {val}', benefitInfo) }}</div>
            <ItemPriceTable
              price-type="HQ"
              :items="benefitItems"
              container-id="modal-cost-and-benefits"
            />
          </div>
        </n-tab-pane>
      </n-tabs>
      <div v-else class="wrapper">
        <GroupBox
          :title="t('预计成本 {val}', costInfo) + '&#xE049;'"
          :descriptions="[
            t('此处计入物品的NQ价格。')
          ]"
          title-background-color="var(--n-color-modal)"
        >
          <ItemPriceTable
            price-type="NQ"
            :items="costItems"
            container-id="modal-cost-and-benefits"
          />
        </GroupBox>
        <GroupBox
          :title="t('预计收益 {val}', benefitInfo) + '&#xE049;'"
          :descriptions="[
            t('此处计入物品的HQ价格。')
          ]"
          title-background-color="var(--n-color-modal)"
        >
          <ItemPriceTable
            price-type="HQ"
            :items="benefitItems"
            container-id="modal-cost-and-benefits"
          />
        </GroupBox>
      </div>
    </n-card>
  </n-modal>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
</style>