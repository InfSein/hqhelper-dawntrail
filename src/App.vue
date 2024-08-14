<script setup lang="ts">
// #region Imports

// * import basic
import { computed, provide, ref, getCurrentInstance } from 'vue'
import {
  darkTheme, lightTheme, useOsTheme,
  zhCN, enUS, jaJP, dateZhCN, dateEnUS, dateJaJP,
  NConfigProvider, NMessageProvider,
  NLayout, NLayoutHeader, NLayoutContent
} from 'naive-ui'

// * import pages and components
import AppHeader from './components/custom-controls/AppHeader.vue'
import DialogConfirm from './components/custom-controls/DialogConfirm.vue'

// * import others
import { useStore } from '@/store/index'
import { t } from '@/languages'
import { injectVoerkaI18n } from "@voerkai18n/vue"
import { type UserConfigModel, fixUserConfig } from '@/models/user-config'
import EorzeaTime from './tools/eorzea-time'

// #endregion

// #region Refs

const store = useStore()
const i18n = injectVoerkaI18n()

const userConfig = ref<UserConfigModel>(fixUserConfig(store.state.userConfig))
const locale = computed(() => {
  return userConfig.value?.language_ui ?? 'zh'
})
i18n.activeLanguage = locale.value

const isMobile = ref(false)
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
  let _theme = userConfig.value.theme
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

// #region Disable mobile scale (好像没用，先不管他)
document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault()
  }
}, { passive: false })
// #endregion

// #region functions

const appForceUpdate = () => {
  // Update user config
  userConfig.value = fixUserConfig(store.state.userConfig)
  // Update i18n
  i18n.activeLanguage = locale.value
  // Update vue
  const instance = getCurrentInstance()
  instance?.proxy?.$forceUpdate()
}

// #endregion

// #region Provides

// #region Provide dialoger

const dialogConfirm_show = ref(false)
const dialogConfirm_type = ref<'info' | 'success' | 'error' | 'warning'>('warning')
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
  type: 'info' | 'success' | 'error' | 'warning' = 'warning',
  autoClose: boolean = true, // Close dialog after confirm or cancel automatically.
  confirmText: string = t('确定 (Enter)'),
  cancelText: string = t('取消 (Esc)'),
) => {
  dialogConfirm_type.value = type
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

provide('userConfig', userConfig)
provide('t', t)
provide('locale', locale)
provide('isMobile', isMobile)
provide('appForceUpdate', appForceUpdate)

const currentET = ref<EorzeaTime>(new EorzeaTime())
setInterval(() => {
  currentET.value = new EorzeaTime()
}, 200)
provide('currentET', currentET)

// #endregion

const appClass = computed(() => {
  const classes = [
    'lang-' + locale.value,
    'app-' + (isMobile.value ? 'mobile' : 'desktop'),
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
        <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
          <n-layout-header bordered position="absolute">
            <AppHeader />
          </n-layout-header>

          <n-layout-content id="main-content" position="absolute" :native-scrollbar="false">
            <router-view />
          </n-layout-content>
        </n-layout>
        
        
        <DialogConfirm
          v-model:show="dialogConfirm_show"
          :type="dialogConfirm_type"
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
:deep(#main-content .n-scrollbar-container) {
  padding: 1rem;
}
:deep(#main-content .n-scrollbar-container .n-scrollbar-content){
  height: 100%;
}
.n-layout-header {
  height: 70px;
  padding: 10px 20px;
  z-index: 1000;
}
.n-layout-content {
  margin-top: 70px;
}
</style>
