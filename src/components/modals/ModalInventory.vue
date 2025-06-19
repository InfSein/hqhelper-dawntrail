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

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const showModal = defineModel<boolean>('show', { required: true })

const formFuncConfigData = ref<FuncConfigModel>(deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig)))
const formInventoryItems = ref<ItemInfo[]>([])

const modalId = 'modal-inventory'

const onLoad = () => {
  formFuncConfigData.value = deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig))
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
      label: t('在制作报表弹窗中启用背包库存自动同步'),
      type: 'switch',
      warnings: dealDesc([
        t('开启此项后，每次在主界面和食药计算器界面打开专业版制作报表时，报表中的“已有”数量会被设置为背包库存的数量。'),
      ]),
    },
    {
      key: 'inventory_workflow_enable_sync',
      label: t('在工作流中启用背包库存手动同步'),
      type: 'switch',
      warnings: dealDesc([
        t('开启此项后，工作流的“{f1}”页面将追加“{f2}”按钮。', {
          f1: t('报表'), f2: t('从背包库存同步')
        }),
        t('点击按钮后便会将报表中的“已有”数量设置为背包库存的数量。')
      ]),
    },
    {
      key: 'inventory_workflow_enable_sync_reverse',
      label: t('在工作流中启用背包库存反向同步'),
      type: 'switch',
      warnings: dealDesc([
        t('开启此项后，工作流的“{f1}”页面将追加“{f2}”按钮。', {
          f1: t('报表'), f2: t('同步到背包库存')
        }),
        t('点击按钮后便会将背包库存的数量设置为报表中的“已有”数量。')
      ]),
    },
    {
      key: 'inventory_other_items_way',
      label: t('对不在库存中物品的处理方式'),
      type: 'select',
      options: [
        { label: t('忽略'), value: 'ignore', description: t('保持现有数量') },
        { label: t('清零'), value: 'clear', description: t('将数量重设为0') },
      ],
      warnings: dealDesc([
        t('决定自动同步或手动同步时，对不在背包库存中的物品要如何处理。'),
      ]),
    },
    {
      key: 'inventory_sync_reverse_mode',
      label: t('反向同步模式'),
      type: 'select',
      options: [
        { label: t('宽松'), value: 'loose', description: t('忽略“已有”数量为0的物品和不在报表中的物品') },
        { label: t('严格'), value: 'strict', description: t('同步“已有”数量为0的物品，忽略不在报表中的物品') },
        { label: t('覆写'), value: 'overwrite', description: t('完全重置库存，以报表数据覆盖现有库存') },
      ],
      warnings: dealDesc([
        t('决定反向同步时，对“已有”数量为0的物品和不在报表中的物品要如何处理。'),
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
    NAIVE_UI_MESSAGE.info(t('已有该物品'))
  } else {
    formFuncConfigData.value.inventory_data[value] = 1
  }
}
const handleClearInventory = () => {
  formFuncConfigData.value.inventory_data = {}
  NAIVE_UI_MESSAGE.success(t('已清空'))
}

const handleSave = () => {
  store.commit('setFuncConfig', fixFuncConfig(formFuncConfigData.value))

  // * 结算
  showModal.value = false
  appForceUpdate()
  NAIVE_UI_MESSAGE.success(t('保存成功'))
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :id="modalId"
    :icon="BackpackFilled"
    :title="t('背包库存')"
    max-width="600px"
    @on-load="onLoad"
  >
    <n-tabs type="segment" animated>
      <n-tab-pane name="options" :tab="t('选项')">
        <div class="pane-container">
          <SettingItem
            v-for="item in inventorySettingItems"
            :key="item.key"
            v-model:form-data="formFuncConfigData"
            :setting-item="item"
          />
        </div>
      </n-tab-pane>
      <n-tab-pane name="data" :tab="t('数据')">
        <div class="pane-container">
          <div class="top-actions">
            <n-input-group>
              <n-input-group-label>{{ t('添加物品') }}</n-input-group-label>
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
              :text="t('清空')"
              :tip="t('清空库存')"
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
          {{ t('保存') }}
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