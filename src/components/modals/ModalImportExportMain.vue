<script setup lang="ts">
import { ref } from 'vue'
import {
  NButton, NCheckbox, NIcon, NInput, NP, NTabs, NTabPane, NText, NUpload, NUploadDragger
} from 'naive-ui'
import { 
  ImportExportOutlined,
  UnarchiveOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import { importExcel } from '@/tools/excel'

const showModal = defineModel<boolean>('show', { required: true })

const fileName = ref('')

const onFileSelected = async (file: File) => {
  const response = await importExcel(file)
  console.log('response', response)
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="ImportExportOutlined"
    :title="t('导入/导出')"
    max-width="500px"
  >
    <n-tabs type="segment" animated>
      <n-tab-pane name="export" :tab="t('导出为Excel')">
        <div class="pane-container export-panel">
          <GroupBox id="gbx-file-name" :title="t('文件名')">
            <n-input v-model:value="fileName" maxlength="100" :placeholder="t('不填则默认以时间命名')">
              <template #suffix>.xlsx</template>
            </n-input>
          </GroupBox>
          <GroupBox :title="t('选项')">
            <n-checkbox>
              {{ t('导出成本/收益信息') }}
            </n-checkbox>
            <n-checkbox>
              {{ t('导出成功后打开导出目录') }}
            </n-checkbox>
          </GroupBox>
          <GroupBox :title="t('操作')">
            <n-button class="w-full h-full">
              {{ t('导出') }}
            </n-button>
          </GroupBox>
        </div>
      </n-tab-pane>
      <n-tab-pane name="import" :tab="t('从Excel导入')">
        <n-upload
          multiple
          directory-dnd
          :max="1"
          accept=".xlsx"
          @change="onFileSelected"
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
              {{ t('仅可接受格式与 HqHelper 导出格式一致的xlsx文件') }}
            </n-p>
          </n-upload-dragger>
        </n-upload>
      </n-tab-pane>
    </n-tabs>
  </MyModal>
</template>

<style scoped>
.pane-container {
  padding: 0 5px;
}
.export-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;

  #gbx-file-name {
    grid-column: 1 / 3;
  }
}
</style>