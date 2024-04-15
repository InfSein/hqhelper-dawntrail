<script lang="ts" setup>
import { inject, provide, ref, type Ref } from 'vue';
import AppHeader from '../components/main/AppHeader.vue'
import PatchPanel from '../components/PatchPanel.vue'
import EorzeaTimeCard from '../components/EorzeaTimeCard.vue'
import JobPanel from '../components/JobPanel.vue'
import GearSelectionPanel from '@/components/GearSelectionPanel.vue'
import UserPreferences from '../components/modals/UserPreferences.vue'
import AboutApp from '../components/modals/AboutApp.vue'
import AppResource from '../components/AppResource.vue'
import { useMessage } from 'naive-ui';

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

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

const closeUserPreferencesModal = () => {
  showUserPreferencesModal.value = false
}
const closeAboutAppModal = () => {
  showAboutAppModal.value = false
}
const onUserPreferencesSubmitted = () => {
  closeUserPreferencesModal()
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

const getPanelStyle = (maxWidth: number) => {
  const style = isMobile.value ? [
    'width: 100%'
  ] : [
    `max-width: ${maxWidth}px`,
  ]
  console.log(style)
  return style.join(';')
}
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
          <n-flex vertical id="sub-container-l1">
            <n-flex>
              <JobPanel :style="getPanelStyle(480)" />
              <GearSelectionPanel :style="getPanelStyle(355)" />
            </n-flex>
            <!-- todo: 快速操作 -->
          </n-flex>
          <n-flex vertical id="sub-container-l2">
            <EorzeaTimeCard :style="getPanelStyle(300)" />
          </n-flex>
        </n-flex>
      </n-flex>
    </n-layout-content>
  </n-layout>

  <n-modal :show="showUserPreferencesModal">
    <UserPreferences
      @after-submit="onUserPreferencesSubmitted"
      @close="closeUserPreferencesModal"
    />
  </n-modal>
  <n-modal :show="showAboutAppModal">
    <AboutApp
      @close="closeAboutAppModal"
    />
  </n-modal>

  <AppResource />
  
  <n-back-top />
</template>

<style scoped>
/* PC only */
@media (min-width: 1024px) {
  #main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    overflow: auto;
    padding: 0 2rem;
    /* margin: 0 auto 0 15%; */

    #sub-container-l1 {
      min-width: 850px;
    }
  }
}
/* common */
.n-layout-header {
    height: 64px; padding: 10px 20px;
    z-index: 1000;
  }
  .n-layout-content {
    margin-top: 65px;
  }

  #main-container {
    max-width: 100%;
    padding: 2rem;
    font-weight: 400;
  }
</style>