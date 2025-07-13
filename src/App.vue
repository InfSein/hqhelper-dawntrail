<script setup lang="ts">
import { computed, provide, ref, getCurrentInstance, onMounted, watch, onBeforeUnmount } from 'vue'
import {
  darkTheme, lightTheme, useOsTheme,
  zhCN, enUS, jaJP, dateZhCN, dateEnUS, dateJaJP,
  NConfigProvider, NGlobalStyle, NMessageProvider,
  NLayout, NLayoutHeader, NLayoutContent,
  type GlobalThemeOverrides
} from 'naive-ui'
import AppHeader from './components/custom/general/AppHeader.vue'
import AccountView from './components/custom/general/AccountView.vue'
import ModalCopyAsMacro from './components/modals/ModalCopyAsMacro.vue'
import ModalCheckUpdates from './components/modals/ModalCheckUpdates.vue'
import ModalLogin from '@/components/modals/ModalLogin.vue'
import ModalCloudSync from './components/modals/ModalCloudSync.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import { useElectronSync } from '@/composables/electron-sync'
import { useLocale } from './locales'
import { checkAppUpdates, CopyToClipboard, deepCopy, sleep } from './tools'
import EorzeaTime from './tools/eorzea-time'
import { type UserConfigModel, fixUserConfig } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel, type MacroGenerateMode } from './models/config-func'
import { type CloudConfigModel, fixCloudConfig } from '@/models/config-cloud'
import AppStatus from './variables/app-status'
import ModalFestivalEgg from './components/modals/ModalFestivalEgg.vue'

const route = useRoute()
const store = useStore()
const { t: rawT, setLocale } = useLocale()
const { emitSync, onSync } = useElectronSync()

const userConfig = ref<UserConfigModel>(fixUserConfig(store.state.userConfig))
const funcConfig = ref<FuncConfigModel>(fixFuncConfig(store.state.funcConfig, store.state.userConfig))
const cloudConfig = ref<CloudConfigModel>(fixCloudConfig(store.state.cloudConfig))
const locale = computed(() => {
  return userConfig.value?.language_ui ?? 'zh'
})
setLocale(locale.value)

const appMode = ref<"overlay" | "" | undefined>('')
provide('appMode', appMode)

const isMobile = ref(false)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < window.innerHeight
}

const osTheme = useOsTheme()
const theme = computed(() => {
  let _theme = userConfig.value.theme
  if (_theme === 'system') {
    return osTheme.value === 'dark' ? 'dark' : 'light'
  }
  return _theme
})
const naiveUiTheme = computed(() => {
  const isDarkMode = theme.value !== 'light'
  if (window.electronAPI?.updateTitleBarTheme) {
    window.electronAPI.updateTitleBarTheme(isDarkMode)
  }
  return theme.value === 'light' ? lightTheme : darkTheme
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

const appForceUpdate = () => {
  // update app
  handleAppUpdate(
    store.state.userConfig,
    store.state.funcConfig,
    store.state.cloudConfig
  )
  // Update electron settings
  emitSync('update-setting', deepCopy({
    userConfig: userConfig.value,
    funcConfig: funcConfig.value,
    cloudConfig: cloudConfig.value,
  }))
}
onSync('update-setting', (value) => {
  console.log('on-sync was called', value)
  const {
    userConfig: _userConfig, funcConfig: _funcConfig, cloudConfig: _cloudConfig
  } = value
  handleAppUpdate(_userConfig, _funcConfig, _cloudConfig)
  store.commit('setUserConfig', userConfig.value)
  store.commit('setFuncConfig', funcConfig.value)
  store.commit('setCloudConfig', cloudConfig.value)
})
const handleAppUpdate = (
  _userConfig: UserConfigModel | undefined,
  _funcConfig: FuncConfigModel | undefined,
  _cloudConfig: CloudConfigModel | undefined,
) => {
  userConfig.value = fixUserConfig(_userConfig)
  funcConfig.value = fixFuncConfig(_funcConfig, _userConfig)
  cloudConfig.value = fixCloudConfig(_cloudConfig)
  // Update i18n
  setLocale(locale.value)
  // Update vue
  const instance = getCurrentInstance()
  instance?.proxy?.$forceUpdate()
}
const switchTheme = () => {
  userConfig.value.theme = theme.value === 'light' ? 'dark' : 'light'
  store.commit('setUserConfig', userConfig.value)
}

const t = (message: string, args?: any) => {
  const rawTranslate = rawT(message)

  if (typeof rawTranslate !== 'string') {
    console.warn(`[i18n] '${message}' resolved to a non-string`)
    return message
  }

  let result = ''

  if (typeof args === 'object') {
    result = rawT(message, args)
  } else if (args !== undefined) {
    result = rawT(message, {
      val: args, f: args, index: args, gen: args, v: args, ver: args, date: args, option: args, il: args,
    })
  } else {
    result = rawT(message)
  }

  if (result === 'DONT_SHOW') result = ''

  return result
}

provide('userConfig', userConfig)
provide('funcConfig', funcConfig)
provide('cloudConfig', cloudConfig)
provide('t', t)
provide('theme', theme)
provide('locale', locale)
provide('isMobile', isMobile)
provide('appForceUpdate', appForceUpdate)
provide('switchTheme', switchTheme)

const currentET = ref<EorzeaTime>(new EorzeaTime())
setInterval(() => {
  currentET.value = new EorzeaTime()
}, 200)
provide('currentET', currentET)

const showCopyMacroModal = ref(false)
const macroMapValue = ref<Record<MacroGenerateMode, string>>({
  singleLine: '', multiLine: ''
})
const copyAsMacro = async (macroMap: Record<MacroGenerateMode, string>, container?: HTMLElement | undefined) : Promise<{
  result: "success" | "info" | "error"
  msg: string
} | undefined> => {
  const macroContent = macroMap[funcConfig.value.macro_generate_mode]
  if (!macroContent) {
    return { result: 'info', msg: t('common.message.nothing_to_copy') }
  }
  if (funcConfig.value.macro_direct_copy) {
    const errored = await CopyToClipboard(funcConfig.value.macro_copy_prefix + macroContent, container)
    if (errored) {
      return { result: 'error', msg: t('common.message.copy_failed') }
    }
    return { result: 'success', msg: t('common.message.copy_succeed') }
  } else {
    macroMapValue.value = macroMap
    showCopyMacroModal.value = true
  }
}
provide('copyAsMacro', copyAsMacro)

const showCheckUpdatesModal = ref(false)
const displayCheckUpdatesModal = () => {
  showCheckUpdatesModal.value = true
}
provide('displayCheckUpdatesModal', displayCheckUpdatesModal)

const loginAction = ref<"login" | "register" | "edituser">('login')
const showModalLogin = ref(false)
const displayLoginModal = (action: "login" | "register" | "edituser") => {
  loginAction.value = action
  showModalLogin.value = true
}
provide('displayLoginModal', displayLoginModal)

const showModalCloudSync = ref(false)
const displayCloudSyncModal = () => {
  showModalCloudSync.value = true
}
provide('displayCloudSyncModal', displayCloudSyncModal)

const appClass = computed(() => {
  const classes = [
    'lang-' + locale.value,
    'theme-' + theme.value,
    'app-' + (isMobile.value ? 'mobile' : 'desktop'),
    window.electronAPI ? 'env-electron' : 'env-web',
    appMode.value === 'overlay' ? 'env-overlay' : ''
  ]
  return classes.join(' ')
})

const showFestivalEgg = ref(false)

onMounted(async () => {
  await sleep(500)
  // 处理全局页面参数
  appMode.value = route.query.mode as typeof appMode.value
  // 处理自动更新
  if (!userConfig.value.disable_auto_update && appMode.value !== 'overlay') {
    try {
      const checkUpdateResponse = await checkAppUpdates()
      if (checkUpdateResponse.success) {
        const versionContent = checkUpdateResponse.data!
        
        let needUpdateElectron = false, needUpdateHqHelper = false
        if (window.electronAPI) {
          const currentElectronVersion = await window.electronAPI.clientVersion
          needUpdateElectron = currentElectronVersion !== versionContent.electron
        }
        needUpdateHqHelper = AppStatus.Version !== versionContent.hqhelper

        if (needUpdateElectron) {
          if (window.confirm(
            t('update.message.checked_new_client', versionContent.electron)
            + (needUpdateHqHelper ? ('\n' + t('update.message.checked_new_hqhelper', versionContent.hqhelper)) : '')
            + '\n' + t('update.message.ask_update_now')
          )) {
            displayCheckUpdatesModal()
          }
        } else if (needUpdateHqHelper) {
          if (window.confirm(
            t('update.message.checked_new_hqhelper', versionContent.hqhelper)
            + '\n' + t('update.message.ask_update_now')
          )) {
            if (window.electronAPI) {
              displayCheckUpdatesModal()
            } else {
              const cacheKeys = await caches.keys()
              for (const name of cacheKeys) {
                await caches.delete(name)
              }
              location.reload()    
            }
          }
        }
      } else {
        console.error('自动更新失败:', checkUpdateResponse.message, '\n', checkUpdateResponse)
      }
    } catch (err) {
      console.error('自动更新发生错误', err)
    }
  }
  // 处理彩蛋
  const now = new Date()
  const date = now.getDate()
  const eggId = 20241225
  if (
    userConfig.value.last_triggered_egg !== eggId &&
    (now.getMonth() === 11) && ((date === 24 && now.getHours() >= 18) || date === 25)
  ) {
    showFestivalEgg.value = true
    const newConfig = fixUserConfig(store.state.userConfig)
    newConfig.last_triggered_egg = eggId
    store.commit('setUserConfig', newConfig)
  }
  // 处理 UI
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
  updateDraggableArea()
  window.addEventListener('resize', updateDraggableArea)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  window.removeEventListener('resize', updateDraggableArea)
})
watch(
  () => route.query.mode,
  (newMode) => {
    appMode.value = newMode as typeof appMode.value
    updateIsMobile()
  }
)

const updateDraggableArea = () => {
  const dragArea = document.getElementById('drag-area')
  const appLayoutHeader = document.getElementById('app-layout-header')
  if (dragArea && appLayoutHeader && window.electronAPI && appMode.value !== 'overlay') {
    dragArea.innerHTML = ''

    const regions = [
      { top: 0, left: 0, width: appLayoutHeader.offsetWidth - 145, height: appLayoutHeader.offsetHeight },
    ]

    for (const { top, left, width, height } of regions) {
      const div = document.createElement('div')
      Object.assign(div.style, {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        WebkitAppRegion: 'drag',
        'z-index': '-1',
      })
      dragArea.appendChild(div)
    }
  }
}

const naiveUIThemeOverrides = computed(() : GlobalThemeOverrides => {
  let fontFamily = 'Lato, -apple-system, Helvetica Neue, Segoe UI, Microsoft Yahei, 微软雅黑, Arial, Helvetica, sans-serif'
  if (userConfig.value.custom_font) {
    fontFamily = userConfig.value.custom_font + ', ' + fontFamily
  }
  fontFamily = 'FFXIV, ' + fontFamily
  const fontSize = userConfig.value.custom_font_size || '14px'
  return {
    common: {
      fontFamily,
      fontSize,
      fontSizeMedium: fontSize,
      fontSizeSmall: fontSize,
      fontSizeTiny: `calc(${fontSize} - 2px)`,
      fontSizeMini: `calc(${fontSize} - 1px)`,
      fontSizeLarge: `calc(${fontSize} + 1px)`,
      fontSizeHuge: `calc(${fontSize} + 2px)`
    }
  }
})
</script>

<template>
  <n-config-provider
    :theme="naiveUiTheme"
    :locale="naiveUiLocale"
    :date-locale="naiveUiDateLocale"
    :namespace="appClass"
    :theme-overrides="naiveUIThemeOverrides"
  >
    <n-global-style />
    <n-message-provider :placement="naiveUiMessagePlacement">
      <div :class="appClass" :data-theme="theme">
        <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
          <n-layout-header v-if="appMode !== 'overlay'" id="app-layout-header" position="absolute" bordered>
            <AppHeader class="app-header" />
          </n-layout-header>

          <n-layout-content id="main-content" position="absolute" :native-scrollbar="false">
            <router-view />
          </n-layout-content>
          
          <AccountView v-if="!isMobile && appMode !== 'overlay'" trigger-class="account-view" />
        </n-layout>
        
        <ModalCopyAsMacro
          v-model:show="showCopyMacroModal"
          :macro-map="macroMapValue"
        />
        <ModalCheckUpdates v-model:show="showCheckUpdatesModal" />
        <ModalLogin
          v-model:show="showModalLogin"
          :default-tab="loginAction"
        />
        <ModalCloudSync
          v-model:show="showModalCloudSync"
        />
        <ModalFestivalEgg v-model:show="showFestivalEgg" />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
#app-layout-header {
  .app-header {
    position: relative;
    z-index: 1;
  }
}

:deep(#main-content>.n-scrollbar>.n-scrollbar-container) {
  padding: 1rem;
}
.n-layout-header {
  height: 70px;
  padding: 10px 20px;
  z-index: 1000;
}
.n-layout-content {
  margin-top: 70px;
}
.env-overlay .n-layout-content {
  margin-top: 0;
}
</style>
