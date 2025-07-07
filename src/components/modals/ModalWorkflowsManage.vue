<script setup lang="ts">
import { inject, ref } from 'vue'
import {
  NButton, NIcon, NInput,
  useMessage
} from 'naive-ui'
import { 
  SettingsSharp,
  SaveOutlined
} from '@vicons/material'
import DraggableTable from '../custom/general/DraggableTable.vue'
import MyModal from '../templates/MyModal.vue'
import HelpButton from '../custom/general/HelpButton.vue'
import { _VAR_MAX_WORKFLOW, getDefaultWorkflow, type Workflow } from '@/models/workflow'

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })
const workflows = defineModel<Workflow[]>('workflows', { required: true })
const emits = defineEmits(['afterSave'])

const workflowsTable = ref<any>()

const handleSave = () => {
  if (!workflowsTable.value?.handleSave) {
    NAIVE_UI_MESSAGE.error('Unexpected error: workflowsTable not defined')
    return
  }
  const saveSuccess = workflowsTable.value.handleSave()
  if (!saveSuccess) {
    return
  }
  showModal.value = false
  NAIVE_UI_MESSAGE.success(t('保存成功'))
  emits('afterSave')
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="SettingsSharp"
    :title="t('管理工作流')"
    max-width="600px"
  >
    <div class="wrapper">
      <p>{{ t('在这里可以修改各个工作流的名称，或是直接删除工作流。') }}</p>
      <DraggableTable
        v-model:data="workflows"
        ref="workflowsTable"
        can-add
        :min="1"
        :min-tip="t('需要保留至少1条工作流')"
        :max="_VAR_MAX_WORKFLOW"
        :max-tip="t('最多只能添加{num}条工作流', _VAR_MAX_WORKFLOW)"
        :get-default-data-row="getDefaultWorkflow"
      >
        <template #tableTitle>
          <div class="flex-vac">
            <div class="bold">{{ t('工作流名称') }}</div>
            <div>
              <HelpButton
                icon="question"
                :descriptions="[
                  t('如果没有为工作流设置名称，则按顺序自动显示为「工作流1~{maxlen}」。', _VAR_MAX_WORKFLOW),
                  t('删除某一工作流时，其后的所有未命名工作流将重新编号。')
                ]"
              />
            </div>
          </div>
        </template>

        <template #default="{ row, rowIndex }">
          <n-input v-model:value="row.name" type="text" :placeholder="t('工作流{index}', rowIndex + 1)" />
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