<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import {
  NButton, NCheckbox, NIcon, NInput, NP, NTabs, NTabPane, NText, NUpload, NUploadDragger,
  type UploadFileInfo,
  useMessage
} from 'naive-ui'
import { 
  BackpackFilled,
  SaveOutlined,
} from '@vicons/material'
import MyModal from '@/components/templates/MyModal.vue'
import SettingItem from '@/components/custom/general/SettingItem.vue'
import { useStore } from '@/store'
import type { SettingItem as Setting } from '@/models'
import { type UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import { deepCopy } from '@/tools'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const showModal = defineModel<boolean>('show', { required: true })

const formFuncConfigData = ref<FuncConfigModel>(deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig)))

const onLoad = () => {
  formFuncConfigData.value = deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig))
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
        t('开启此项后，工作流将追加一个可以将报表中“已有”数量设置为背包库存数量的按钮。'),
      ]),
    },
    {
      key: 'inventory_other_items_way',
      label: t('对不在库存中物品的处理方式'),
      type: 'select',
      options: [
        { label: t('忽略'), value: 'ignore', description: t('保持现有数量') },
        { label: t('清空'), value: 'clear', description: t('将数量重设为0') },
      ],
      warnings: dealDesc([
        t('决定自动同步或手动同步时，对不在背包库存中的物品要如何处理。'),
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

const handleSave = () => {
  // * 保存选项
  store.commit('setFuncConfig', fixFuncConfig(formFuncConfigData.value))

  // * 结算
  showModal.value = false
  appForceUpdate()
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
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
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* Mobile */
@media screen and (max-width: 767px) {
  .pane-container {
    height: 400px;
  }
}
</style>