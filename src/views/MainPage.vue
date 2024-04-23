<script lang="ts" setup>
import { inject, provide, ref, type Ref } from 'vue';
import AppHeader from '../components/main/AppHeader.vue'
import PatchPanel from '../components/PatchPanel.vue'
import JobPanel from '../components/JobPanel.vue'
import GearSelectionPanel from '@/components/GearSelectionPanel.vue'
import QuickOperatePanel from '@/components/QuickOperatePanel.vue'
import EorzeaTimeCard from '../components/EorzeaTimeCard.vue'
import ModalUserPreferences from '../components/modals/ModalUserPreferences.vue'
import ModalAboutApp from '../components/modals/ModalAboutApp.vue'
import { useMessage } from 'naive-ui';

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
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
  hqHelperToast(t('保存成功'), 'success')
}

// * Provide Show Modals
provide('showUserPreferencesModal', () => {
  showUserPreferencesModal.value = true
})
provide('showAboutAppModal', () => {
  showAboutAppModal.value = true
})

</script>

<template>
  <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
    <n-layout-header bordered position="absolute">
      <AppHeader />
    </n-layout-header>

    <n-layout-content id="main-content" position="absolute" :native-scrollbar="false">
      <n-flex vertical id="main-container">
        <PatchPanel />
        <n-flex>
          <n-flex vertical id="sub-container-1">
            <n-flex>
              <JobPanel class="job-panel" />
              <GearSelectionPanel class="gear-panel" />
            </n-flex>
            <QuickOperatePanel class="quick-operate-panel" />
          </n-flex>
          <n-flex vertical id="sub-container-2">
            <EorzeaTimeCard class="eorzea-time-card" />
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
  padding: 1rem;
  font-weight: 400;
}

/* PC only */
@media screen and (min-width: 768px) {
  #main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    overflow: auto;
    padding: 0 2rem;

    #sub-container-1 {
      width: 900px;

      .job-panel {
        width: 480px;
      }
      .gear-panel {
        width: 405px;
      }
    }
    #sub-container-2 {

      .eorzea-time-card {
        width: 300px;
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

      .eorzea-time-card {
        width: 100%;
      }
    }
  }
}
</style>