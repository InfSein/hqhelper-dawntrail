<script setup lang="ts">
import { computed, provide, ref, getCurrentInstance, onMounted, watch } from 'vue'
import {
  darkTheme, lightTheme, useOsTheme,
  zhCN, enUS, jaJP, dateZhCN, dateEnUS, dateJaJP,
  NConfigProvider, NGlobalStyle, NMessageProvider,
  NLayout, NLayoutHeader, NLayoutContent,
  type GlobalThemeOverrides
} from 'naive-ui'
import AppHeader from './components/custom/general/AppHeader.vue'
import ModalCopyAsMacro from './components/modals/ModalCopyAsMacro.vue'
import ModalCheckUpdates from './components/modals/ModalCheckUpdates.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import { t } from '@/languages'
import { injectVoerkaI18n } from "@voerkai18n/vue"
import { CopyToClipboard, sleep } from './tools'
import EorzeaTime from './tools/eorzea-time'
import type { AppVersionJson } from './models'
import { type UserConfigModel, fixUserConfig } from '@/models/user-config'
import AppStatus from './variables/app-status'

const route = useRoute()
const store = useStore()
const i18n = injectVoerkaI18n()

const userConfig = ref<UserConfigModel>(fixUserConfig(store.state.userConfig))
const locale = computed(() => {
  return userConfig.value?.language_ui ?? 'zh'
})
i18n.activeLanguage = locale.value

const appMode = ref<"overlay" | "" | undefined>('')
provide('appMode', appMode)

const isMobile = ref(false)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth < window.innerHeight
}
updateIsMobile()
window.addEventListener('resize', updateIsMobile)

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
  // Update user config
  userConfig.value = fixUserConfig(store.state.userConfig)
  // Update i18n
  i18n.activeLanguage = locale.value
  // Update vue
  const instance = getCurrentInstance()
  instance?.proxy?.$forceUpdate()
}
const switchTheme = () => {
  userConfig.value.theme = theme.value === 'light' ? 'dark' : 'light'
  store.commit('setUserConfig', userConfig.value)
}

provide('userConfig', userConfig)
provide('t', (message: string, ...args: any[]) => {
  const i18nResult = t(message, ...args)
  if (/^[1-9]\d*$/.test(i18nResult)) {
    return '' // 特殊处理 voerka-i18n 会对置空翻译返回 textMap id 的问题
    // * https://github.com/zhangfisher/voerka-i18n/issues/47
  } else {
    return i18nResult
  }
})
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
const macroValue = ref('')
const copyAsMacro = async (macroContent: string, container?: HTMLElement | undefined) : Promise<{
  result: "success" | "info" | "error"
  msg: string
} | undefined> => {
  if (!macroContent) {
    return { result: 'info', msg: t('没有需要复制的内容') }
  }
  if (userConfig.value.macro_direct_copy) {
    const errored = await CopyToClipboard(userConfig.value.macro_copy_prefix + macroContent, container)
    if (errored) {
      return { result: 'error', msg: t('复制失败') }
    }
    return { result: 'success', msg: t('已复制到剪贴板') }
  } else {
    macroValue.value = macroContent
    showCopyMacroModal.value = true
  }
}
provide('copyAsMacro', copyAsMacro)

const showCheckUpdatesModal = ref(false)
const displayCheckUpdatesModal = () => {
  showCheckUpdatesModal.value = true
}
provide('displayCheckUpdatesModal', displayCheckUpdatesModal)

const appClass = computed(() => {
  const classes = [
    'lang-' + locale.value,
    'app-' + (isMobile.value ? 'mobile' : 'desktop'),
    window.electronAPI ? 'env-electron' : 'env-web',
    appMode.value === 'overlay' ? 'env-overlay' : ''
  ]
  return classes.join(' ')
})

onMounted(async () => {
  await sleep(500)
  // 处理全局页面参数
  appMode.value = route.query.mode as typeof appMode.value
  // 处理自动更新
  if (!userConfig.value.disable_auto_update && appMode.value !== 'overlay') {
    try {
      let checkVersionResponse : string
      let url = document?.location?.origin + document.location.pathname + 'version.json'
      if (window.electronAPI?.httpGet) {
        url = 'https://hqhelper.nbb.fan/version.json'
        checkVersionResponse = await window.electronAPI.httpGet(url)
      } else {
        checkVersionResponse = await fetch(url)
          .then(response => response.text())
      }
      const versionContent = JSON.parse(checkVersionResponse) as AppVersionJson

      let needUpdateElectron = false, needUpdateHqHelper = false
      if (window.electronAPI) {
        const currentElectronVersion = await window.electronAPI.clientVersion
        needUpdateElectron = currentElectronVersion !== versionContent.electron
      }
      needUpdateHqHelper = AppStatus.Version !== versionContent.hqhelper

      let breakHqHelperUpdate = false
      if (needUpdateElectron) {
        if (window.confirm(
          t('检测到客户端有新版本({v})。', versionContent.electron)
          + '\n' + t('要现在更新吗?')
        )) {
          breakHqHelperUpdate = true
          displayCheckUpdatesModal()
        }
      }
      if (needUpdateHqHelper && !breakHqHelperUpdate) {
        if (window.confirm(
          t('检测到HqHelper有新版本({v})。', versionContent.hqhelper)
          + '\n' + t('要现在更新吗?')
        )) {
          if (window.electronAPI) {
            displayCheckUpdatesModal()
          } else {
            window.location.reload()
          }
        }
      }
    } catch (err) {
      console.error('自动更新发生错误', err)
    }
  }
  updateIsMobile()
})
watch(
  () => route.query.mode,
  (newMode) => {
    appMode.value = newMode as typeof appMode.value
    updateIsMobile()
  }
)

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
    :theme-overrides="naiveUIThemeOverrides"
  >
    <n-global-style />
    <n-message-provider :placement="naiveUiMessagePlacement">
      <div :class="appClass" :data-theme="theme">
        <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
          <n-layout-header v-if="appMode !== 'overlay'" bordered position="absolute">
            <AppHeader />
          </n-layout-header>

          <n-layout-content id="main-content" position="absolute" :native-scrollbar="false">
            <router-view />
          </n-layout-content>
        </n-layout>
        
        <ModalCopyAsMacro
          v-model:show="showCopyMacroModal"
          :macro-content="macroValue"
        />
        <ModalCheckUpdates v-model:show="showCheckUpdatesModal" />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
.env-electron :deep(.n-layout-header) {
  -webkit-app-region: drag;
}

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
.env-overlay .n-layout-content {
  margin-top: 0;
}
</style>
