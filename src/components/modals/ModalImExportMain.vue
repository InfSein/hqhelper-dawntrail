<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import {
  NButton, NCheckbox, NIcon, NInput, NP, NTabs, NTabPane, NText, NUpload, NUploadDragger,
  type UploadFileInfo,
  useMessage
} from 'naive-ui'
import { 
  ImportExportOutlined,
  ArrowUpwardOutlined, ArrowDownwardOutlined,
  FileDownloadOutlined,
  UnarchiveOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import HelpButton from '../custom/general/HelpButton.vue'
import ModalConfirmImportMain from './ModalConfirmImportMain.vue'
import { useStore } from '@/store'
import type { GearSelections } from '@/models/gears'
import { type UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import { useFufuCal } from '@/tools/use-fufu-cal'
import { export2Excel, importExcel } from '@/tools/excel'
import type { ItemInfo, ItemPriceInfo } from '@/tools/item'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
const updateItemPrices = inject<() => Promise<void>>('updateItemPrices')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const { getStatementData } = useFufuCal(userConfig, funcConfig, t)

const showModal = defineModel<boolean>('show', { required: true })
const onLoad = () => {
  exportItemPrices.value = funcConfig.value.export_item_price
}

interface ModalImportExportMainProps {
  gearSelections: GearSelections | undefined,
  statistics: any,
  tomeScriptItems: Record<number, ItemInfo[]>,
  normalGathering: ItemInfo[],
  limitedGathering: ItemInfo[],
  aethersands: ItemInfo[],
  crystals: ItemInfo[],
  ui_lang: 'zh' | 'ja' | 'en',
  item_lang: 'zh' | 'ja' | 'en',
  patchSelected: string
}
const props = defineProps<ModalImportExportMainProps>()

const fileName = ref('')
const exportItemPrices = ref(false)
const exporting = ref(false)
const fileList = ref<UploadFileInfo[]>([])
const showConfirmImportModal = ref(false)
const importGearSelections = ref<GearSelections>()

watch(exportItemPrices, async(newVal, oldVal) => {
  if (newVal !== oldVal) {
    const newConfig = fixFuncConfig(store.state.funcConfig, store.state.userConfig)
    newConfig.export_item_price = newVal
    await store.commit('setFuncConfig', fixFuncConfig(newConfig, store.state.userConfig))
  }
})

const handleExportExcel = async () => {
  if (!props.gearSelections) {
    NAIVE_UI_MESSAGE.error(t('请先选择版本和职业'))
    return
  }
  exporting.value = true
  let item_price_map : Record<number, ItemPriceInfo> | undefined = undefined
  if (exportItemPrices.value) {
    await updateItemPrices()
    item_price_map = funcConfig.value.cache_item_prices
  }
  export2Excel(
    props.gearSelections,
    props.statistics,
    props.tomeScriptItems,
    props.normalGathering,
    props.limitedGathering,
    props.aethersands,
    props.crystals,
    props.ui_lang,
    props.item_lang,
    t,
    getStatementData,
    fileName.value ? fileName.value + '.xlsx' : undefined,
    item_price_map,
    funcConfig.value.universalis_priceType
  )
  exporting.value = false
}

const handleExcel = async (file: File) => {
  const response = await importExcel(file)
  importGearSelections.value = response
  showConfirmImportModal.value = true
}

const handleBeforeUpload = async ({ file }: { file: UploadFileInfo }) => {
  if (!file.name.endsWith('.xlsx')) {
    NAIVE_UI_MESSAGE.error(t('只能导入.xlsx文件'))
    return false
  }
  if (file.file) {
    await handleExcel(file.file)
  } else {
    NAIVE_UI_MESSAGE.error(t('未获取到文件'))
  }
  fileList.value = [] // 清空文件列表，允许再次上传
  return false
}

const onImportConfirmed = () => {
  showConfirmImportModal.value = false
  showModal.value = false
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="ImportExportOutlined"
    :title="t('导入/导出')"
    max-width="500px"
    @on-load="onLoad"
  >
    <n-tabs type="segment" animated>
      <n-tab-pane name="export">
        <template #tab>
          <n-icon><ArrowDownwardOutlined /></n-icon>
          {{ t('导出为Excel') }}
        </template>
        <div class="pane-container export-panel">
          <GroupBox id="gbx-file-name" :title="t('文件名')" title-background-color="var(--n-color-modal)">
            <n-input v-model:value="fileName" maxlength="100" :placeholder="t('不填则默认以时间命名')">
              <template #suffix>.xlsx</template>
            </n-input>
          </GroupBox>
          <GroupBox :title="t('选项')" title-background-color="var(--n-color-modal)">
            <n-checkbox v-model:checked="exportItemPrices">
              <div class="flex-center">
                <div>{{ t('导出成本/收益分析') }}</div>
                <HelpButton
                  icon="question"
                  :descriptions="[
                    t('遵循“功能设置”中的“物品价格”设置。'),
                    t('启用此项时，如果物品价格缓存已过期，则需要耗费一定时间来刷新数据。')
                  ]"
                />
              </div>
            </n-checkbox>
            <n-checkbox v-show="false">
              {{ t('导出成功后打开导出目录') }}
            </n-checkbox>
          </GroupBox>
          <div class="submit-bar">
            <n-button type="primary" :disabled="exporting" :loading="exporting" @click="handleExportExcel">
              <template #icon>
                <n-icon><FileDownloadOutlined /></n-icon>
              </template>
              {{ t('导出') }}
            </n-button>
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="import">
        <template #tab>
          <n-icon><ArrowUpwardOutlined /></n-icon>
          {{ t('从Excel导入') }}
        </template>
        <div class="pane-container import-panel">
          <n-upload
            accept=".xlsx"
            :max="1"
            :show-file-list="true"
            :file-list="fileList"
            @before-upload="handleBeforeUpload"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <UnarchiveOutlined />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                {{ t('点击或者拖动文件到该区域来上传') }}
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                {{ t('需要确保表格的第一个工作表是“已选部件”') }}
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </div>
      </n-tab-pane>
    </n-tabs>

    <ModalConfirmImportMain
      v-model:show="showConfirmImportModal"
      :gear-selections="importGearSelections"
      :default-patch="patchSelected"
      @on-import-confirmed="onImportConfirmed"
    />
  </MyModal>
</template>

<style scoped>
:deep(.n-checkbox__label) {
  padding: 0 4px;
}
.pane-container {
  padding: 0 5px;
  height: 205px;
}
.export-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .submit-bar {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .pane-container {
    height: 205px;
  }
}
</style>