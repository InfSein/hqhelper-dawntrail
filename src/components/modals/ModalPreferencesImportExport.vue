<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import {
  NButton, NIcon, NInput,
  useMessage
} from 'naive-ui'
import { 
  ArchiveSharp, UnarchiveSharp,
  ContentCopyRound, FileDownloadOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import { CopyToClipboard, deepCopy } from '@/tools'
import { exportPreferences, importPreferences } from '@/tools/preferences'
import { type UserConfigModel, fixUserConfig } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })
const userConfigModel = defineModel<UserConfigModel>('userConfig', { required: true })
const funcConfigModel = defineModel<FuncConfigModel>('funcConfig', { required: true })
interface ModalPreferencesImportExportProps {
  action: "import" | "export"
}
const props = defineProps<ModalPreferencesImportExportProps>()

const wrapper = ref<HTMLElement>()
const importContent = ref('')

const onLoad = () => {
}

const modalTitle = computed(() => {
  let icon = ArchiveSharp
  let text = t('导入偏好设置')
  if (props.action === 'export') {
    icon = UnarchiveSharp
    text = t('导出偏好设置')
  }
  return { icon, text }
})
const exportContent = computed(() => {
  return exportPreferences(userConfigModel.value, funcConfigModel.value)
})

const handleClose = () => {
  showModal.value = false
}
const handleCopy = async () => {
  const errored = await CopyToClipboard(exportContent.value, wrapper.value)
  if (errored) {
    NAIVE_UI_MESSAGE.error(t('复制失败，请手动框选预览区域内的文本复制'))
    return
  }
  handleClose()
  NAIVE_UI_MESSAGE.success(t('已复制到剪贴板'))
}
const handleImport = () => {
  if (!importContent.value.length) {
    NAIVE_UI_MESSAGE.error(t('请输入内容')); return
  }
  try {
    const { u, f } = importPreferences(importContent.value)
    const oldu = deepCopy(userConfigModel.value)
    const oldf = deepCopy(funcConfigModel.value)
    // 处理一些导入不会有的缓存，这些仍旧使用旧设置
    u.cache_work_state = oldu.cache_work_state
    u.fthelper_cache_work_state = oldu.fthelper_cache_work_state
    u.gatherclock_cache_work_state = oldu.gatherclock_cache_work_state
    if (f.universalis_server === oldf.universalis_server) {
      f.cache_item_prices = oldf.cache_item_prices
    }
    userConfigModel.value = fixUserConfig(u)
    funcConfigModel.value = fixFuncConfig(f)
    handleClose()
    NAIVE_UI_MESSAGE.success(t('导入成功'))
  } catch (e) {
    console.error(e)
    NAIVE_UI_MESSAGE.error(t('导入失败'))
  }
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="modalTitle.icon"
    :title="modalTitle.text"
    max-width="400px"
    @on-load="onLoad"
  >
    <div class="wrapper" ref="wrapper">
      <div class="desc">
        <p v-if="action === 'export'">{{ t('现在你可以将本设备的偏好设置/功能设置导出到其他设备了。不包括物品价格等缓存。') }}</p>
        <p v-if="action === 'export'">{{ t('请注意：导出的内容会根据偏好设置窗口的当前设置生成，而非已经保存的设置。') }}</p>
        <p v-if="action === 'import'">{{ t('在这里导入其他设备导出的设置，从而保持同步。') }}</p>
        <p v-if="action === 'import'">{{ t('导入之后请在偏好设置窗口确认更改。直到你点击保存前，实际设置不会变化。') }}</p>
      </div>
      <div class="content">
        <n-input
          v-if="action === 'export'"
          :value="exportContent"
          type="textarea"
          readonly
        />
        <n-input
          v-if="action === 'import'"
          v-model:value="importContent"
          type="textarea"
          :placeholder="t('在此处粘贴从其他HqHelper导出的设置')"
        />
      </div>
    </div>

    <template #action>
      <div class="submit-container">
        <n-button v-if="action === 'export'" type="primary" @click="handleCopy">
          <template #icon>
            <n-icon><ContentCopyRound /></n-icon>
          </template>
          {{ t('复制') }}
        </n-button>
        <n-button v-if="action === 'import'" type="primary" @click="handleImport">
          <template #icon>
            <n-icon><FileDownloadOutlined /></n-icon>
          </template>
          {{ t('导入') }}
        </n-button>
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  user-select: text;

  .desc {
    line-height: 1.2;
  }
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>