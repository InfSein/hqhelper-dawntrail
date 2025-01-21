<script setup lang='ts'>
import { inject, ref, type PropType, type Ref } from 'vue'
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

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
// const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

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

const showPreferencesModal = ref(false)
const handleSettingButtonClick = () => {
  showPreferencesModal.value = true
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="AttachMoneyOutlined"
    :title="t('成本/收益预估')"
    max-width="1200px"
    :height="isMobile ? '650px' : '600px'"
    show-setting
    @on-setting-button-clicked="handleSettingButtonClick"
  >
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