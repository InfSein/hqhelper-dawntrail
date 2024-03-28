<script setup lang="ts">
// #region Imports

// * import basic
import { computed, provide, ref, getCurrentInstance } from 'vue'
import { useStore } from '@/store/index'
import { t } from '@/languages'
import { injectVoerkaI18n } from "@voerkai18n/vue"

// * import pages
import MainPage from './views/MainPage.vue'

// * import ui lib
import {
  darkTheme,
  lightTheme,
  useOsTheme,
  zhCN, enUS, jaJP,
  dateZhCN, dateEnUS, dateJaJP
} from 'naive-ui'

// * import variables
//import AppStatus from './variables/AppStatus'

// #endregion

// #region Refs

const store = useStore()
const i18n = injectVoerkaI18n()

// * Stored Variables
const theme = ref(store.state.userConfig?.theme ?? 'system')
const locale = ref(store.state.userConfig?.language_ui ?? 'zh')
i18n.activeLanguage = locale.value

// * Local Variables
const isMobile = ref(false)

// * Variables' auto updates
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < window.innerHeight
}
updateIsMobile()
window.addEventListener('resize', updateIsMobile)

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
const naiveUiMessagePlacement = computed(() => {
  return isMobile.value ? 'bottom' : 'top'
})

// * register child components ref
const appHeader = ref<any>(null)

// #endregion

// #region functions

const appForceUpdate = () => {
  // Update i18n
  locale.value = store.state.userConfig?.language_ui ?? 'zh'
  i18n.activeLanguage = locale.value
  // Update ui
  theme.value = store.state.userConfig?.theme ?? 'system'
  appHeader?.value?.initializeSettingOptions()

  const instance = getCurrentInstance()
  instance?.proxy?.$forceUpdate()
}

// #endregion

// #region Provides

// * Provide i18n t
provide('t', t)
provide('locale', locale)

// * Provide is-mobile
provide('isMobile', isMobile)

// * Provide App Force Update
provide('appForceUpdate', appForceUpdate)

// #endregion
</script>

<template>
  <n-config-provider
    :theme="naiveUiTheme"
    :locale="naiveUiLocale"
    :date-locale="naiveUiDateLocale"
  >
    <n-message-provider :placement="naiveUiMessagePlacement">
      <MainPage />
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
