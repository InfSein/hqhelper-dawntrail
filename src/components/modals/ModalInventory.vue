<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import {
  NButton, NIcon, NInputGroup, NInputGroupLabel, NTabs, NTabPane,
  useMessage
} from 'naive-ui'
import { 
  BackpackFilled,
  DeleteSweepRound,
  SaveOutlined,
} from '@vicons/material'
import MyModal from '@/components/templates/MyModal.vue'
import TooltipButton from '@/components/custom/general/TooltipButton.vue'
import SettingItem from '@/components/custom/general/SettingItem.vue'
import ItemSelector from '@/components/custom/item/ItemSelector.vue'
import ItemSelectTable from '@/components/custom/item/ItemSelectTable.vue'
import { useStore } from '@/store'
import type { SettingItem as Setting } from '@/models'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import { deepCopy } from '@/tools'
import { getItemInfo, type ItemInfo } from '@/tools/item'

const t = inject<(message: string, args?: any) => string>('t')!
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const showModal = defineModel<boolean>('show', { required: true })

const formFuncConfigData = ref<FuncConfigModel>(deepCopy(fixFuncConfig(store.funcConfig, store.userConfig)))
const formInventoryItems = ref<ItemInfo[]>([])

const modalId = 'modal-inventory'

const onLoad = () => {
  formFuncConfigData.value = deepCopy(fixFuncConfig(store.funcConfig, store.userConfig))
  formInventoryItems.value = Object.keys(formFuncConfigData.value.inventory_data).map(_id => {
    const id = Number(_id)
    const item = getItemInfo(id)
    item.amount = formFuncConfigData.value.inventory_data[id]
    return item
  })
}

const inventorySettingItems = computed(() : Setting[] => {
  return [
    {
      key: 'inventory_statement_enable_sync',
      label: t('ingame_inventory.preference.inventory_statement_enable_sync.title'),
      type: 'switch',
      warnings: dealDesc([
        t('ingame_inventory.preference.inventory_statement_enable_sync.desc.desc_1'),
      ]),
    },
    {
      key: 'inventory_workflow_enable_sync',
      label: t('ingame_inventory.preference.inventory_workflow_enable_sync.title'),
      type: 'switch',
      warnings: dealDesc([
        t('ingame_inventory.shared.desc.add_button_to_workflow_when_enabled', {
          f1: t('common.statement'), f2: t('workflow.text.sync_from_inventory')
        }),
        t('ingame_inventory.preference.inventory_workflow_enable_sync.desc.desc_1')
      ]),
    },
    {
      key: 'inventory_workflow_enable_sync_reverse',
      label: t('ingame_inventory.preference.inventory_workflow_enable_sync_reverse.title'),
      type: 'switch',
      warnings: dealDesc([
        t('ingame_inventory.shared.desc.add_button_to_workflow_when_enabled', {
          f1: t('common.statement'), f2: t('workflow.text.sync_to_inventory')
        }),
        t('ingame_inventory.preference.inventory_workflow_enable_sync_reverse.desc.desc_1')
      ]),
    },
    {
      key: 'inventory_other_items_way',
      label: t('ingame_inventory.preference.inventory_other_items_way.title'),
      type: 'select',
      options: [
        { label: t('common.ignore'), value: 'ignore', description: t('ingame_inventory.preference.inventory_other_items_way.option.ignore.tooltip.tooltip_1') },
        { label: t('common.reset_to_0'), value: 'clear', description: t('ingame_inventory.preference.inventory_other_items_way.option.reset_to_0.tooltip.tooltip_1') },
      ],
      warnings: dealDesc([
        t('ingame_inventory.preference.inventory_other_items_way.desc.desc_1'),
      ]),
    },
    {
      key: 'inventory_sync_reverse_mode',
      label: t('ingame_inventory.preference.inventory_sync_reverse_mode.title'),
      type: 'select',
      options: [
        { label: t('common.loose'), value: 'loose', description: t('ingame_inventory.preference.inventory_sync_reverse_mode.option.loose.tooltip.tooltip_1') },
        { label: t('common.strict'), value: 'strict', description: t('ingame_inventory.preference.inventory_sync_reverse_mode.option.strict.tooltip.tooltip_1') },
        { label: t('common.overwrite'), value: 'overwrite', description: t('ingame_inventory.preference.inventory_sync_reverse_mode.option.overwrite.tooltip.tooltip_1') },
      ],
      warnings: dealDesc([
        t('ingame_inventory.preference.inventory_sync_reverse_mode.desc.desc_1'),
      ]),
    },
  ]

  function dealDesc(descs: string[]){
    return descs.map(desc => {
      return {
        value: desc, class: '', style: '',
      }
    })
  }
})

const handleItemInputValueUpdate = (value: number) => {
  if (!value) return
  if (formFuncConfigData.value.inventory_data[value]) {
    NAIVE_UI_MESSAGE.info(t('common.message.item_already_have'))
  } else {
    formFuncConfigData.value.inventory_data[value] = 1
  }
}
const handleClearInventory = () => {
  formFuncConfigData.value.inventory_data = {}
  NAIVE_UI_MESSAGE.success(t('common.cleared'))
}

const handleSave = () => {
  store.setFuncConfig(fixFuncConfig(formFuncConfigData.value))

  // * 结算
  showModal.value = false
  appForceUpdate()
  NAIVE_UI_MESSAGE.success(t('common.save_succeed'))
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :id="modalId"
    :icon="BackpackFilled"
    :title="t('common.appfunc.ingame_inventory')"
    max-width="600px"
    @on-load="onLoad"
  >
    <n-tabs type="segment" animated>
      <n-tab-pane name="options" :tab="t('common.options')">
        <div class="pane-container">
          <SettingItem
            v-for="item in inventorySettingItems"
            :key="item.key"
            v-model:form-data="formFuncConfigData"
            :setting-item="item"
          />
        </div>
      </n-tab-pane>
      <n-tab-pane name="data" :tab="t('common.data')">
        <div class="pane-container">
          <div class="top-actions">
            <n-input-group>
              <n-input-group-label>{{ t('common.add_item') }}</n-input-group-label>
              <ItemSelector
                options-preset="materials"
                :container-id="modalId"
                @on-item-selected="handleItemInputValueUpdate"
              />
            </n-input-group>
          </div>
          <div class="content-table">
            <ItemSelectTable
              v-model:items="formFuncConfigData.inventory_data"
              show-item-details
              item-span-max-width="260px"
              content-height="285px"
              :container-id="modalId"
            />
          </div>
          <div class="bottom-actions">
            <TooltipButton
              :icon="DeleteSweepRound"
              :text="t('common.clear')"
              :tip="t('inventory.clear_inventory')"
              @click="handleClearInventory"
            />
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>

    <template #action>
      <div class="modal-submit-container">
        <n-button type="primary" size="large" @click="handleSave">
          <template #icon>
            <n-icon><SaveOutlined /></n-icon>
          </template>
          {{ t('common.save') }}
        </n-button>
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
.pane-container {
  padding: 0 5px;
  height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;

  .top-actions {
    display: flex;
    align-items: center;
    gap: 5px;

    .label {
      font-size: 16px;
    }
    .n-select {
      flex: 1;
    }
  }
  .content-table {
    flex: 1;
  }
  .bottom-actions {
    display: flex;
    justify-content: end;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .pane-container {
    height: 400px;
  }
}
</style>