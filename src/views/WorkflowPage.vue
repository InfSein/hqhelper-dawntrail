<script setup lang="ts">
import { inject, onMounted, ref, watch, type Ref } from 'vue'
import {
  NButton, NIcon, NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader, NLayoutSider, 
  useMessage
} from 'naive-ui'
import {
  AddSharp
} from '@vicons/material'
import { useStore } from '@/store'
import {
  defaultWorkflow, fixWorkState
} from '@/models/workflow'
import { type UserConfigModel } from '@/models/config-user'
import { deepCopy } from '@/tools'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const workState = ref(fixWorkState())

const disable_workstate_cache = userConfig.value.disable_workstate_cache ?? false
if (!disable_workstate_cache) {
  const cachedWorkState = userConfig.value.workflow_cache_work_state
  if (cachedWorkState && JSON.stringify(cachedWorkState).length > 2) {
    workState.value = fixWorkState(cachedWorkState)
    // Compatible with older version caching
  }

  // todo - 留意性能：深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大
  watch(workState, async () => {
    if (workState.value && userConfig) {
      try {
        await Promise.resolve()
        userConfig.value.workflow_cache_work_state = workState.value
        store.commit('setUserConfig', userConfig.value)
      } catch (error) {
        console.error('Error handling workState change:', error)
      }
    } else {
      console.warn('workState or userConfig is not defined')
    }
  }, {deep: true})
}
onMounted(() => {

})

const handleAddWorkflow = () => {
  workState.value.workflows.push(deepCopy(defaultWorkflow))
}
</script>

<template>
  <div id="main-container" class="wrapper">
    <div class="block header-block">
      <div class="action">
        <p>{{ t('切换工作流：') }}</p>
        <div class="flex" style="gap: 5px;">
          <n-button
            v-for="(flow, flowIndex) in workState.workflows"
            :key="flowIndex"
            size="tiny"
            :type="flowIndex === workState.currentWorkflow ? 'primary' : 'default'"
            @click="workState.currentWorkflow = flowIndex"
          >
            {{ flow.name || t('工作流{index}', flowIndex + 1) }}
          </n-button>
          <n-button size="tiny" class="n-square-button" @click="handleAddWorkflow">
            <n-icon :size="16"><AddSharp /></n-icon>
          </n-button>
        </div>
      </div>
    </div>
    <n-layout has-sider class="block content-block">
      <n-layout-sider bordered content-style="padding: 12px;">
        Item List
      </n-layout-sider>
      <n-layout-content style="padding: 12px;">
        Flow Act
      </n-layout-content>
    </n-layout>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 12px;
  display: flex;
  flex-direction: column;

  .block {
    padding: 12px;
  }

  .header-block {
    height: auto;
    .action {
      display: flex;
      align-items: center;
    }
  }

  .content-block {
    flex: 1;
  }
}
</style>