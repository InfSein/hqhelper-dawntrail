<script lang="ts" setup>
import { inject, provide, ref, watch, type Ref } from 'vue';
import AppHeader from '@/components/main/AppHeader.vue'
import PatchPanel from '@/components/main/PatchPanel.vue'
import JobPanel from '@/components/main/JobPanel.vue'
import GearSelectionPanel from '@/components/main/GearSelectionPanel.vue'
import QuickOperatePanel from '@/components/main/QuickOperatePanel.vue'
import StatisticsPanel from '@/components/main/StatisticsPanel.vue'
import ModalUserPreferences from '@/components/modals/ModalUserPreferences.vue'
import ModalAboutApp from '@/components/modals/ModalAboutApp.vue'
import { useMessage } from 'naive-ui';
import { defaultUserConfig, type UserConfigModel } from '@/models/user-config';
import type { GearSelections } from '@/models/gears'
import { useStore } from '@/store';

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

// #region Provides & Injections

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

// * HqHelper Toast
const hqHelperToast = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  duration: number = 2000,
) => {
  NAIVE_UI_MESSAGE[type](message, { closable: true, duration: duration })
}
provide('hqHelperToaster', hqHelperToast)

const showUserPreferencesModal = ref(false)
const showAboutAppModal = ref(false)

const onUserPreferencesSubmitted = () => {
  showUserPreferencesModal.value = false
  appForceUpdate()
  hqHelperToast(t('保存成功！部分改动需要刷新页面才能生效'), 'success')
}

// * Provide Show Modals
provide('showUserPreferencesModal', () => {
  showUserPreferencesModal.value = true
})
provide('showAboutAppModal', () => {
  showAboutAppModal.value = true
})

// #endregion

const workState = ref({
  patch: '',
  job: 0,
  gears: {} as GearSelections,
})
const disable_workstate_cache = userConfig.value.disable_workstate_cache ?? false
if (!disable_workstate_cache) {
  if (userConfig.value.cache_work_state) {
    workState.value = userConfig.value.cache_work_state
  }

  // todo - 留意性能：深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大
  watch(workState, () => {
    console.log('workState changed', workState.value)
    userConfig.value.cache_work_state = workState.value
    store.commit('setUserConfig', userConfig.value)
  }, {deep: true})
}
</script>

<template>
  <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
    <n-layout-header bordered position="absolute">
      <AppHeader />
    </n-layout-header>

    <n-layout-content id="main-content" position="absolute" :native-scrollbar="false">
      <n-flex vertical id="main-container">
        <PatchPanel v-model:patch-selected="workState.patch" />
        <n-flex>
          <n-flex vertical id="sub-container-1">
            <n-flex>
              <JobPanel v-model:job-selected="workState.job" class="job-panel" />
              <GearSelectionPanel class="gear-panel" />
            </n-flex>
            <QuickOperatePanel class="quick-operate-panel" />
          </n-flex>
          <n-flex vertical id="sub-container-2">
            <StatisticsPanel class="statistics-panel" />
          </n-flex>
        </n-flex>
      </n-flex>
  
      <n-back-top />
    </n-layout-content>
  </n-layout>

  <ModalUserPreferences
    v-model:show="showUserPreferencesModal"
    @after-submit="onUserPreferencesSubmitted"
  />
  <ModalAboutApp v-model:show="showAboutAppModal" />
</template>

<style scoped>
/* All */
:deep(#main-content .n-scrollbar-container) {
  padding: 1rem;
}
.n-layout-header {
  height: 64px;
  padding: 10px 20px;
  z-index: 1000;
}
.n-layout-content {
  margin-top: 65px;
}
#main-container {
  max-width: 100%;
  font-weight: 400;
}

/* PC only */
@media screen and (min-width: 768px) {
  #main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    overflow: auto;

    #sub-container-1 {
      width: 50%;

      .job-panel {
        width: 55%;
      }
      .gear-panel {
        width: calc(45% - 12px);
      }
      .quick-operate-panel {
        width: 100%;
      }
    }
    #sub-container-2 {
      width: calc(50% - 12px);

      .statistics-panel {
        width: 100%;
      }
    }
  }
}

/* Mobile only */
@media screen and (max-width: 767px) {
  #main-container {
    #sub-container-1 {
      width: 100%;

      .job-panel {
        width: 100%;
      }
      .gear-panel {
        width: 100%;
      }
    }
    #sub-container-2 {
      width: 100%;

      .statistics-panel {
        width: 100%;
      }
    }
  }
}
</style>