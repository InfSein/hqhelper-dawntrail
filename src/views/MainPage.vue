<script lang="ts" setup>
import { inject, provide, ref } from 'vue';
import AppHeader from '../components/AppHeader.vue'
import EorzeaTimeCard from '../components/user-controls/EorzeaTimeCard.vue'
import UserPreferences from '../components/UserPreferences.vue'
import HelloWorld from '../components/HelloWorld.vue'
import TheWelcome from '../components/TheWelcome.vue'
import { useMessage } from 'naive-ui';

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(i18nKey: string) => string>('t') ?? (() => { return '' })
const appForceUpdate = inject<() => void>('appForceUpdate') ?? (() => { return })
// const isMobile = inject<boolean>('isMobile') ?? false

// * HqHelper Toast
const hqHelperToast = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  duration: number = 2000,
) => {
  // Naive Message
  NAIVE_UI_MESSAGE[type](message, { closable: true, duration: duration })
}
// * Provide HqHelper Toaster
provide('hqHelperToaster', hqHelperToast)

const showUserPreferencesModal = ref(false)

const closeUserPreferencesModal = () => {
  showUserPreferencesModal.value = false
}
const onUserPreferencesSubmitted = () => {
  closeUserPreferencesModal()
  appForceUpdate()
  hqHelperToast(t('保存成功'), 'success')
}

// * Provide User Preferences Modal
provide('showUserPreferencesModal', () => {
  showUserPreferencesModal.value = true
})
</script>

<template>
  <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
    <n-layout-header bordered position="absolute">
      <AppHeader ref="appHeader" />
    </n-layout-header>

    <n-layout-content id="main-content">
      <n-flex id="main-container">
        <n-flex vertical id="sub-container-1">
          <i class="xiv hq logo" style=""></i>

          <div class="wrapper">
            <HelloWorld :msg="t('欢迎')" />
          </div>

          <EorzeaTimeCard />
        </n-flex>
        <n-flex vertical id="sub-container-2">
          <TheWelcome />
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
  
  <n-back-top />
</template>

<style scoped>
#main-layout {
  .n-layout-header {
    height: 64px; padding: 10px 20px;
    z-index: 1000;
  }
  .n-layout-content {
    margin-top: 65px;
  }

  #main-container {
    max-width: 1280px;
    padding: 2rem;
    font-weight: 400;
  }
}

header {
  line-height: 1.5;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 125px;
  color: var(--n-text-color);
}

@media (min-width: 1024px) {
  #main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
    margin: 0 auto 0 15%;
  }

  #sub-container-2 {
    margin-left: 10%;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    display: block;
    margin: 0 auto 2rem;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>