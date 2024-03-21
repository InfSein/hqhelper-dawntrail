<script setup lang="ts">
// #region Imports

import { computed, provide, ref, getCurrentInstance } from 'vue'

// * import components
import AppHeader from './components/AppHeader.vue'
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import UserPreferences from './components/UserPreferences.vue'

// * import ui lib
import {
  createDiscreteApi,
  type ConfigProviderProps,
  darkTheme,
  lightTheme,
  useOsTheme,
  zhCN, enUS, jaJP,
  dateZhCN, dateEnUS, dateJaJP
} from 'naive-ui'

// * import variables
//import AppStatus from './variables/AppStatus'

// * import store
import { useStore } from '@/store/index'
import { useI18n } from 'vue-i18n'
const store = useStore()
const { locale } = useI18n()

// #endregion

// #region Stored Variables

const theme = ref(store.state.userConfig?.theme ?? 'system')
locale.value = store.state.userConfig?.language_ui ?? 'zh'

// #endregion

// #region Registers

// * register ui
const osTheme = useOsTheme()
const naiveUiTheme = computed(() => {
  let _theme = theme.value
  if (_theme === 'system') {
    return osTheme.value === 'dark' ? darkTheme : lightTheme
  }
  return _theme === 'light' ? lightTheme : darkTheme
})
const naiveUiLocale = computed(() => {
  switch (locale.value) {
    case 'en': return enUS
    case 'ja': return jaJP
    default: return zhCN
  }
})
const naiveUiDateLocale = computed(() => {
  switch (locale.value) {
    case 'en': return dateEnUS
    case 'ja': return dateJaJP
    default: return dateZhCN
  }
})
const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: naiveUiTheme.value,
  locale: naiveUiLocale.value,
  dateLocale: naiveUiDateLocale.value
}))
const { message/*, notification, dialog, loadingBar*/ } = createDiscreteApi(
  ['message'/*, 'dialog', 'notification', 'loadingBar'*/], {
    configProviderProps: configProviderPropsRef
  }
)
const NAIVE_UI_MESSAGE = message

// * register i18n
const { t } = useI18n()

// * register child components ref
const appHeader = ref<any>(null)

// #endregion

// #region Local Variables

const showUserPreferencesModal = ref(false)

// #endregion

// #region functions

const appForceUpdate = () => {
  const instance = getCurrentInstance()
  instance?.proxy?.$forceUpdate()

  // Update i18n
  locale.value = store.state.userConfig?.language_ui ?? 'zh'
  // Update ui
  theme.value = store.state.userConfig?.theme ?? 'system'
  appHeader?.value?.initializeSettingOptions()
}

// * HqHelper Toast
const hqHelperToast = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  duration: number = 2000,
) => {
  // Naive Message
  NAIVE_UI_MESSAGE[type](message, { closable: true, duration: duration })
}

const closeUserPreferencesModal = () => {
  showUserPreferencesModal.value = false
}
const onUserPreferencesSubmitted = () => {
  closeUserPreferencesModal()
  appForceUpdate()
  hqHelperToast(t('tips.save_succeed'), 'success')
}

// #endregion

// #region Provides

// * Provide i18n t
provide('t', t)

// * Provide User Preferences Modal
provide('showUserPreferencesModal', () => {
  showUserPreferencesModal.value = true
})

// * Provide Theme Changer
provide('setTheme', (newTheme: 'light' | 'dark' | 'system') => {
  theme.value = newTheme
  const newConfig = store.state.userConfig ?? {}
  newConfig.theme = newTheme
  store.commit('setUserConfig', newConfig)
  hqHelperToast('Theme has been changed to ' + newTheme)
})

// * Provide Locale Changer
provide('setLocale', (newLocale: 'zh' | 'en' | 'ja') => {
  locale.value = newLocale
  const newConfig = store.state.userConfig ?? {}
  newConfig.language_ui = newLocale
  store.commit('setUserConfig', newConfig)
  hqHelperToast('Language has been changed to ' + newLocale)
})

// * Provide HqHelper Toaster
provide('hqHelperToaster', hqHelperToast)

// #endregion
</script>

<template>
  <n-config-provider
    :theme="naiveUiTheme"
    :locale="naiveUiLocale"
    :date-locale="naiveUiDateLocale"
  >
    <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
      <n-layout-header bordered position="absolute">
        <AppHeader ref="appHeader" />
      </n-layout-header>

      <n-layout-content>
        <div id="main-container">
          <header>
            <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

            <div class="wrapper">
              <HelloWorld :msg="$t('welcome')" />
            </div>
          </header>
          <main>
            <TheWelcome />
          </main>
        </div>
      </n-layout-content>
    </n-layout>

    <n-modal :show="showUserPreferencesModal">
      <UserPreferences
        @after-submit="onUserPreferencesSubmitted"
        @close="closeUserPreferencesModal"
      />
    </n-modal>
    
    <n-back-top />
  </n-config-provider>
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
    margin: 0 auto;
    padding: 2rem;
    font-weight: 400;
  }
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  #main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
