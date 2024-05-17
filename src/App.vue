<script setup lang="ts">
// #region Imports

// * import basic
import { computed, provide, ref, getCurrentInstance } from 'vue'
import { useStore } from '@/store/index'
import { t } from '@/languages'
import { injectVoerkaI18n } from "@voerkai18n/vue"

// * import pages
import MainPage from './views/MainPage.vue'

// * import components
import DialogConfirm from './components/custom-controls/DialogConfirm.vue'

// * import ui lib
import {
  darkTheme,
  lightTheme,
  useOsTheme,
  zhCN, enUS, jaJP,
  dateZhCN, dateEnUS, dateJaJP
} from 'naive-ui'

// * user preferences
import { type UserConfigModel, defaultUserConfig } from '@/variables/UserConfig'

// #endregion

// #region Refs

const store = useStore()
const i18n = injectVoerkaI18n()

// * Stored Variables
const theme = ref(store.state.userConfig?.theme ?? 'system')
const locale = ref(store.state.userConfig?.language_ui ?? 'zh')
i18n.activeLanguage = locale.value
const userConfig = ref<UserConfigModel>(store.state.userConfig ?? defaultUserConfig)

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

// #endregion

// #region Disable mobile scale
document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault()
  }
}, { passive: false })
// #endregion

// #region functions

const appForceUpdate = () => {
  // Update user config
  userConfig.value = store.state.userConfig ?? defaultUserConfig
  // Update i18n
  locale.value = userConfig.value?.language_ui ?? 'zh'
  i18n.activeLanguage = locale.value
  // Update ui
  theme.value = userConfig.value?.theme ?? 'system'
  // Update vue
  const instance = getCurrentInstance()
  instance?.proxy?.$forceUpdate()
}

// #endregion

// #region Provides

// #region Provide dialoger

const dialogConfirm_show = ref(false)
const dialogConfirm_title = ref('')
const dialogConfirm_content = ref('')
const dialogConfirm_confirmText = ref('')
const dialogConfirm_cancelText = ref('')
const dialogConfirm_confirmFunc = ref(() => {})
const dialogConfirm_cancelFunc = ref(() => {})

const showDialogConfirm = (
  title: string,
  content: string,
  confirmFunc: () => void,
  cancelFunc: () => void,
  autoClose: boolean = true, // Close dialog after confirm or cancel automatically.
  confirmText: string = t('确定 (Enter)'),
  cancelText: string = t('取消 (Esc)'),
) => {
  dialogConfirm_title.value = title
  dialogConfirm_content.value = content
  dialogConfirm_confirmText.value = confirmText
  dialogConfirm_cancelText.value = cancelText
  dialogConfirm_confirmFunc.value = () => {
    confirmFunc() 
    if (autoClose) dialogConfirm_show.value = false
  }
  dialogConfirm_cancelFunc.value = () => {
    cancelFunc()
    if (autoClose) dialogConfirm_show.value = false
  }
  setTimeout(() => {
    dialogConfirm_show.value = true
  }, 100) // To prevent the k.e.l. triggered duplicately.
}
provide('showDialogConfirm', showDialogConfirm)
/* -- use: 
const showDialogConfirm = inject<(
  title: string,
  content: string,
  confirmFunc: () => void,
  cancelFunc: () => void,
  autoClose?: boolean,
  confirmText?: string,
  cancelText?: string
) => void>('showDialogConfirm') ?? (() => {})
*/

// #endregion

// * Provide user config
provide('userConfig', userConfig)

// * Provide i18n t
provide('t', t)
provide('locale', locale)

// * Provide is-mobile
provide('isMobile', isMobile)

// * Provide App Force Update
provide('appForceUpdate', appForceUpdate)

// #endregion

const appClass = computed(() => {
  const classes = [
    'lang-' + locale.value,
    'app-' + isMobile.value ? 'mobile' : 'desktop',
  ]
  return classes.join(' ')
})

</script>

<template>
  <n-config-provider
    :theme="naiveUiTheme"
    :locale="naiveUiLocale"
    :date-locale="naiveUiDateLocale"
  >
    <n-message-provider :placement="naiveUiMessagePlacement">
      <div :class="appClass">
        <MainPage />
        
        <DialogConfirm
          v-model:show="dialogConfirm_show"
          :title="dialogConfirm_title"
          :content="dialogConfirm_content"
          :confirm-text="dialogConfirm_confirmText"
          :cancel-text="dialogConfirm_cancelText"
          @confirm="dialogConfirm_confirmFunc"
          @cancel="dialogConfirm_cancelFunc"
        />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
