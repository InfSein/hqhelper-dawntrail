<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NButton, NIcon, NInput, NP, NTabs, NTabPane, NText, NUpload, NUploadDragger,
  type UploadFileInfo,
  useMessage
} from 'naive-ui'
import { 
  ImportExportOutlined,
  ArchiveSharp, UnarchiveSharp,
  FileDownloadOutlined,
  UnarchiveOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import {
  type RecordedCraftMacro,
} from '@/models/macromanage'
import { type UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import useMacroHelper from '@/tools/macro-helper'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const NAIVE_UI_MESSAGE = useMessage()
const {
  exportRecordedMacros, importRecordedMacros,
} = useMacroHelper(userConfig, funcConfig)

const showModal = defineModel<boolean>('show', { required: true })
const recordedMacros = defineModel<RecordedCraftMacro[]>('recordedMacros', { required: true })

const onLoad = () => {
  currTab.value = props.mode
}

interface ModalImExportCraftMacroProps {
  mode: "export" | "import"
}
const props = defineProps<ModalImExportCraftMacroProps>()

const currTab = ref('export')
const fileName = ref('')
const exporting = ref(false)
const fileList = ref<UploadFileInfo[]>([])

const handleExport = async () => {
  exporting.value = true
  try {
    exportRecordedMacros(
      recordedMacros.value,
      fileName.value ? fileName.value + '.json' : undefined
    )
  } catch (err) {
    NAIVE_UI_MESSAGE.error(t('导出失败：{err}', err))
  }
  exporting.value = false
}

const handleImport = async (file: File) => {
  try {
    const response = await importRecordedMacros(file)

    const confirmTips = [
      t('成功从文件中读取到{num}条宏。', response.length),
      t('确认要进行导入吗?'),
    ]
    if (recordedMacros.value.length) {
      confirmTips.push(t('已存储的{num}条宏将会丢失!', recordedMacros.value.length))
    }

    if (window.confirm(confirmTips.join('\n'))) {
      recordedMacros.value = response
      showModal.value = false
    }
  } catch (err: any) {
    console.error('import failed:\n', err)
    NAIVE_UI_MESSAGE.error(t('导入失败：{err}', err.message))
  }
}

const handleBeforeUpload = async ({ file }: { file: UploadFileInfo }) => {
  if (!file.name.endsWith('.json')) {
    NAIVE_UI_MESSAGE.error(t('只能导入.json文件'))
    return false
  }
  if (file.file) {
    await handleImport(file.file)
  } else {
    NAIVE_UI_MESSAGE.error(t('未获取到文件'))
  }
  fileList.value = [] // 清空文件列表，允许再次上传
  return false
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="ImportExportOutlined"
    :title="t('宏管理：导入/导出')"
    max-width="500px"
    @on-load="onLoad"
  >
    <n-tabs type="segment" animated v-model:value="currTab">
      <n-tab-pane name="export">
        <!-- @vue-ignore -->
        <template #tab>
          <n-icon><ArchiveSharp /></n-icon>
          {{ t('导出') }}
        </template>
        <div class="pane-container export-panel">
          <GroupBox id="gbx-file-name" :title="t('文件名')" title-background-color="var(--n-color-modal)">
            <n-input v-model:value="fileName" maxlength="100" :placeholder="t('不填则默认以时间命名')">
              <template #suffix>.json</template>
            </n-input>
          </GroupBox>
          <GroupBox id="gbx-cautions" :title="t('注意事项')" title-background-color="var(--n-color-modal)">
            <ul>
              <li>{{ t('与主界面的导入导出功能不同，此处导出的文件并非可供阅读与编辑的表格，而是单纯的数据文件。') }}</li>
              <li>{{ t('请勿直接编辑导出文件的内容，以免数据受损。') }}</li>
            </ul>
          </GroupBox>
          <div class="submit-bar">
            <n-button type="primary" :disabled="exporting" :loading="exporting" @click="handleExport">
              <template #icon>
                <n-icon><FileDownloadOutlined /></n-icon>
              </template>
              {{ t('导出') }}
            </n-button>
          </div>
        </div>
      </n-tab-pane>
      <n-tab-pane name="import">
        <!-- @vue-ignore -->
        <template #tab>
          <n-icon><UnarchiveSharp /></n-icon>
          {{ t('导入') }}
        </template>
        <div class="pane-container import-panel">
          <n-upload
            accept=".json"
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
                {{ t('导入自己的备份或他人的分享') }}
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </div>
      </n-tab-pane>
    </n-tabs>

  </MyModal>
</template>

<style scoped>
:deep(.n-checkbox__label) {
  padding: 0 4px;
}
.pane-container {
  padding: 0 5px;
  height: 205px;

  ul {
    padding-left: 1.5em;
  }
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