<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NButton, NIcon,
  useMessage
} from 'naive-ui'
import { 
  SettingsSharp,
  SaveOutlined
} from '@vicons/material'
import DraggableTable from '../custom/general/DraggableTable.vue'
import MyModal from '../templates/MyModal.vue'
import { useStore } from '@/store'
import { _VAR_PRESET_TAG_MAXAMOUNT } from '@/models/macromanage'
import type { UserConfigModel } from '@/models/config-user'
import { deepCopy } from '@/tools'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const showModal = defineModel<boolean>('show', { required: true })

const tags = ref<string[]>([])
const dataTable = ref<any>()

const onLoad = () => {
  tags.value = userConfig.value.macromanage_cache_work_state.presetTags ?? []
}

const handleCheck = (new_data: string[]) => {
  if (new_data.some(dr => !dr)) {
    return t('不能设置空白内容的标签')
  }
  return ''
}
const handleSave = () => {
  if (!dataTable.value?.handleSave) {
    NAIVE_UI_MESSAGE.error('Unexpected error: dataTable not defined')
    return
  }
  const saveSuccess = dataTable.value.handleSave()
  if (!saveSuccess) {
    return
  }
  const newUserConfig = deepCopy(userConfig.value)
  newUserConfig.macromanage_cache_work_state.presetTags = tags.value
  store.commit('setUserConfig', newUserConfig)
  appForceUpdate()
  showModal.value = false
  NAIVE_UI_MESSAGE.success(t('保存成功'))
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="SettingsSharp"
    :title="t('管理常用标签')"
    max-width="600px"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <DraggableTable
        v-model:data="tags"
        ref="dataTable"
        can-add
        :max="_VAR_PRESET_TAG_MAXAMOUNT"
        :max-tip="t('最多只能添加{num}个常用标签', _VAR_PRESET_TAG_MAXAMOUNT)"
        :get-default-data-row="() => ''"
        :check-rows-before-save="handleCheck"
      >
        <template #tableTitle>
          <div class="bold">{{ t('标签名称') }}</div>
        </template>
      </DraggableTable>
      <p>{{ t('所有修改都只在点击保存之后才会生效。') }}</p>
    </div>

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
.wrapper {
  line-height: 1.2;
}
</style>