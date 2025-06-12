<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NIcon, NInputGroup, NInputGroupLabel, NSelect,
  useMessage
} from 'naive-ui'
import { 
  WaterDropOutlined,
  DoneOutlined,
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import { deepCopy } from '@/tools'
import useUiTools from '@/tools/ui'
import { useStore } from '@/store'
import { fixUserConfig, type UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel, type WorkflowJoinMode } from '@/models/config-func'
import { _VAR_MAX_WORKFLOW, getDefaultWorkflow } from '@/models/workflow'
import ItemSelectTable from '../custom/item/ItemSelectTable.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const { optionsRenderer } = useUiTools(isMobile)

const modalId = 'modal-join-in-workflow'

const showModal = defineModel<boolean>('show', { required: true })

interface ModalAddToWorkflowProps {
  items: Record<number, number>
}
const props = defineProps<ModalAddToWorkflowProps>()

const joinMode = ref<WorkflowJoinMode>('accumulation')
const itemsToAdd = ref<Record<number, number>>({})

const onLoad = () => {
  joinMode.value = funcConfig.value.workflow_default_join_mode
  itemsToAdd.value = deepCopy(props.items)
  targetWorkflow.value = workflowOptions.value[0].value
}

const targetWorkflow = ref<number | "add">(0)
const workflowOptions = computed(() => {
  const existedWorkflows : {
      label: string;
      value: number | "add";
      disabled?: boolean;
  }[] = userConfig.value.workflow_cache_work_state.workflows.map((workflow, flowIndex) => {
    return {
      label: workflow.name || t('工作流{index}', flowIndex + 1),
      value: flowIndex
    }
  })
  existedWorkflows.push({
    label: t('新建工作流'),
    value: 'add',
    disabled: existedWorkflows.length >= _VAR_MAX_WORKFLOW
  })
  return existedWorkflows
})
const joinModeMap = computed(() => {
  return {
    accumulation: {
      label: t('累加'),
      value: 'accumulation',
      description: t('若物品已经存在于工作流中，则数量会累加。')
    },
    cover: {
      label: t('覆盖'),
      value: 'cover',
      description: t('若物品已经存在于工作流中，则数量会被覆盖。')
    },
    overwrite: {
      label: t('覆写'),
      value: 'overwrite',
      description: t('选定工作流的数据将被清除，重新加入下述物品。')
    },
  }
})
const joinModeOptions = computed(() => {
  return Object.values(joinModeMap.value)
})

const handleSubmit = () => {
  const newUserConfig = fixUserConfig(store.state.userConfig)
  if (targetWorkflow.value === 'add') {
    if (newUserConfig.workflow_cache_work_state.workflows.length >= _VAR_MAX_WORKFLOW) {
      NAIVE_UI_MESSAGE.warning(t('最多只能添加{num}条工作流', _VAR_MAX_WORKFLOW))
      return
    }
    const workflow = getDefaultWorkflow()
    workflow.targetItems = itemsToAdd.value
    newUserConfig.workflow_cache_work_state.workflows.push(workflow)
  } else {
    let workflow = newUserConfig.workflow_cache_work_state.workflows[targetWorkflow.value]
    if (joinMode.value === 'overwrite') {
      workflow = getDefaultWorkflow()
      workflow.targetItems = itemsToAdd.value
    } else {
      for (const _id in itemsToAdd.value) {
        const id = Number(_id); const amount = itemsToAdd.value[id]
        if (joinMode.value === 'accumulation' && workflow.targetItems[id]) {
          workflow.targetItems[id] += amount
        } else {
          workflow.targetItems[id] = amount
        }
      }
    }
    newUserConfig.workflow_cache_work_state.workflows[targetWorkflow.value] = workflow
  }
  store.commit('setUserConfig', newUserConfig)
  if (joinMode.value !== funcConfig.value.workflow_default_join_mode) {
    const newFuncConfig = fixFuncConfig(store.state.funcConfig)
    newFuncConfig.workflow_default_join_mode = joinMode.value
    store.commit('setFuncConfig', newFuncConfig)
  }
  NAIVE_UI_MESSAGE.success(t('加入成功'))
  showModal.value = false
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :id="modalId"
    :icon="WaterDropOutlined"
    :title="t('加入工作流')"
    max-width="500px"
    @on-load="onLoad"
  >
    <div class="wrapper" ref="wrapper">
      <GroupBox id="atw-header" title-background-color="var(--n-color-modal)">
        <template #title>
          <span class="title">{{ t('选项') }}</span>
        </template>
        <n-input-group>
          <n-input-group-label>{{ t('目标') }}</n-input-group-label>
          <n-select v-model:value="targetWorkflow" :options="workflowOptions" :placeholder="t('在这里选择要加入到哪条工作流')" />
        </n-input-group>
        <n-input-group v-show="targetWorkflow !== 'add'">
          <n-input-group-label>{{ t('模式') }}</n-input-group-label>
          <n-select v-model:value="joinMode" :options="joinModeOptions" :render-option="optionsRenderer" />
        </n-input-group>
      </GroupBox>
      <GroupBox id="atw-content" title-background-color="var(--n-color-modal)">
        <template #title>
          <span class="title">{{ t('预览') }}</span>
        </template>
        <p>{{ t('下述表格中的物品将被加入到选定的工作流。') }}</p>
        <p v-show="targetWorkflow !== 'add'">{{ joinModeMap[joinMode].description }}</p>
        <ItemSelectTable
          v-model:items="itemsToAdd"
          :show-item-details="false"
          content-height="300px"
          :container-id="modalId"
        />
      </GroupBox>
    </div>

    <template #action>
      <div class="modal-submit-container">
        <n-button type="primary" @click="handleSubmit">
          <template #icon>
            <n-icon><DoneOutlined /></n-icon>
          </template>
          {{ t('确认') }}
        </n-button>
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
/* All */
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  user-select: text;
}
</style>