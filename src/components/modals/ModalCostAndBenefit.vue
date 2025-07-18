<script setup lang='ts'>
import { computed, inject, ref, type Ref } from 'vue'
import {
  NTabs, NTabPane
} from 'naive-ui'
import { 
  AttachMoneyOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import ItemPriceTable from '../custom/item/ItemPriceTable.vue'
import ModalPreferences from './ModalPreferences.vue'
import type { ItemInfo } from '@/tools/item'
import type { FuncConfigModel } from '@/models/config-func'

const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
// const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const modalId = 'modal-cost-and-benefits'

const showModal = defineModel<boolean>('show', { required: true })

interface ModalCostAndBenefitProps {
  costItems: ItemInfo[],
  benefitItems: ItemInfo[],
  costInfo?: string,
  benefitInfo?: string
}
defineProps<ModalCostAndBenefitProps>()

const showItemDetails = computed(() => {
  return funcConfig.value.costandbenefit_show_item_details
})

const showPreferencesModal = ref(false)
const handleSettingButtonClick = () => {
  showPreferencesModal.value = true
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :id="modalId"
    :icon="AttachMoneyOutlined"
    :title="t('statistics.group.cost_and_benefit.title')"
    max-width="1200px"
    :height="isMobile ? '650px' : '600px'"
    show-setting
    @on-setting-button-clicked="handleSettingButtonClick"
  >
    <n-tabs v-if="isMobile" type="segment" animated>
      <n-tab-pane
        name="cost"
        :tab="t('common.cost')"
      >
        <div class="container">
          <div class="align-right">{{ t('statistics.group.cost_and_benefit.button.text.text_1', costInfo) }}</div>
          <ItemPriceTable
            price-type="NQ"
            :items="costItems"
            :show-item-details="showItemDetails"
            :container-id="modalId"
          />
        </div>
      </n-tab-pane>
      <n-tab-pane
        name="benefit"
        :tab="t('common.benefit')"
      >
        <div class="container">
          <div class="align-right">{{ t('statistics.group.cost_and_benefit.button.text.text_2', benefitInfo) }}</div>
          <ItemPriceTable
            price-type="HQ"
            :items="benefitItems"
            :show-item-details="showItemDetails"
            :container-id="modalId"
          />
        </div>
      </n-tab-pane>
    </n-tabs>
    <div v-else class="wrapper">
      <GroupBox
        :title="t('statistics.group.cost_and_benefit.button.text.text_1', costInfo) + '&#xE049;'"
        :descriptions="[
          t('cost_and_benefit.tooltip.cal_nq_price_here')
        ]"
        title-background-color="var(--n-color-modal)"
      >
        <ItemPriceTable
          price-type="NQ"
          :items="costItems"
          :show-item-details="showItemDetails"
          :container-id="modalId"
        />
      </GroupBox>
      <GroupBox
        :title="t('statistics.group.cost_and_benefit.button.text.text_2', benefitInfo) + '&#xE049;'"
        :descriptions="[
          t('cost_and_benefit.tooltip.cal_hq_price_here')
        ]"
        title-background-color="var(--n-color-modal)"
      >
        <ItemPriceTable
          price-type="HQ"
          :items="benefitItems"
          :show-item-details="showItemDetails"
          :container-id="modalId"
        />
      </GroupBox>
    </div>

    <ModalPreferences
      v-model:show="showPreferencesModal"
      setting-group="cost_benefit"
      app-show-fp
    />
  </MyModal>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
</style>