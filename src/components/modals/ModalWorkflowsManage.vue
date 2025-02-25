<script setup lang="ts">
import { inject, ref } from 'vue'
import {
  NButton, NIcon, NInput, NTable,
  useMessage
} from 'naive-ui'
import { 
  SettingsSharp,
  DeleteFilled,
  AddSharp,
  SaveOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import { _VAR_MAX_WORKFLOW, getDefaultWorkflow, type Workflow } from '@/models/workflow'
import { deepCopy } from '@/tools'

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })
const workflows = defineModel<Workflow[]>('workflows', { required: true })
const emits = defineEmits(['afterSave'])

const formDataWorkflows = ref<Workflow[]>([])

const onLoad = () => {
  formDataWorkflows.value = deepCopy(workflows.value)
}

const handleAddWorkflow = () => {
  if (formDataWorkflows.value.length >= _VAR_MAX_WORKFLOW) {
    NAIVE_UI_MESSAGE.warning(t('最多只能添加{num}条工作流', _VAR_MAX_WORKFLOW))
    return
  }
  formDataWorkflows.value.push(getDefaultWorkflow())
}

const handleSave = () => {
  workflows.value = deepCopy(formDataWorkflows.value)
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
    @on-load="onLoad"
  >
    <div class="wrapper">
      <p>{{ t('在这里可以修改各个工作流的名称，或是直接删除工作流。') }}</p>
      <n-table class="workflows-table" :single-line="false">
        <thead>
          <tr>
            <th>{{ t('工作流名称') }}</th>
            <th>{{ t('管理') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(workflow, flowIndex) in formDataWorkflows" :key="flowIndex">
            <td>
              <n-input v-model:value="workflow.name" type="text" :placeholder="t('工作流{index}', flowIndex + 1)" />
            </td>
            <td>
              <n-button ghost type="error" size="small" @click="() => formDataWorkflows.splice(flowIndex, 1)">
                <template #icon>
                  <n-icon><DeleteFilled /></n-icon>
                </template>
                {{ t('删除') }}
              </n-button>
            </td>
          </tr>
          <tr v-if="formDataWorkflows.length < _VAR_MAX_WORKFLOW">
            <td></td>
            <td>
              <n-button ghost type="info" size="small" @click="handleAddWorkflow">
                <template #icon>
                  <n-icon><AddSharp /></n-icon>
                </template>
                {{ t('添加') }}
              </n-button>
            </td>
          </tr>
        </tbody>
      </n-table>
      <p>{{ t('所有修改都只在点击保存之后才会生效。') }}</p>
    </div>

    <template #action>
      <div class="submit-container">
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

  .workflows-table {
    margin: 10px 0;

    th {
      font-weight: bold;
    }
    th:first-child, td:first-child {
      width: 60%;
    }
    th:nth-child(2), td:nth-child(2) {
      width: 15%;
      text-align: center;
    }
  }
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>