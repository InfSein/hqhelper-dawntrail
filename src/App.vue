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
import AccountView from './components/custom/general/AccountView.vue'
import ModalCopyAsMacro from './components/modals/ModalCopyAsMacro.vue'
import ModalCheckUpdates from './components/modals/ModalCheckUpdates.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store/index'
import { t } from '@/languages'
import { injectVoerkaI18n } from "@voerkai18n/vue"
import { checkAppUpdates, CopyToClipboard, sleep } from './tools'
import EorzeaTime from './tools/eorzea-time'
import { type UserConfigModel, fixUserConfig } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel, type MacroGenerateMode } from './models/config-func'
import { type CloudConfigModel, fixCloudConfig } from '@/models/config-cloud'
import AppStatus from './variables/app-status'
import ModalFestivalEgg from './components/modals/ModalFestivalEgg.vue'

const route = useRoute()
const store = useStore()
const i18n = injectVoerkaI18n()

const userConfig = ref<UserConfigModel>(fixUserConfig(store.state.userConfig))
const funcConfig = ref<FuncConfigModel>(fixFuncConfig(store.state.funcConfig, store.state.userConfig))
const cloudConfig = ref<CloudConfigModel>(fixCloudConfig(store.state.cloudConfig))
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
  funcConfig.value = fixFuncConfig(store.state.funcConfig, store.state.userConfig)
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
provide('funcConfig', funcConfig)
provide('cloudConfig', cloudConfig)
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
const macroMapValue = ref<Record<MacroGenerateMode, string>>({
  singleLine: '', multiLine: ''
})
const copyAsMacro = async (macroMap: Record<MacroGenerateMode, string>, container?: HTMLElement | undefined) : Promise<{
  result: "success" | "info" | "error"
  msg: string
} | undefined> => {
  const macroContent = macroMap[funcConfig.value.macro_generate_mode]
  if (!macroContent) {
    return { result: 'info', msg: t('没有需要复制的内容') }
  }
  if (funcConfig.value.macro_direct_copy) {
    const errored = await CopyToClipboard(funcConfig.value.macro_copy_prefix + macroContent, container)
    if (errored) {
      return { result: 'error', msg: t('复制失败') }
    }
    return { result: 'success', msg: t('已复制到剪贴板') }
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
            t('检测到客户端有新版本({v})。', versionContent.electron)
            + (needUpdateHqHelper ? ('\n' + t('检测到HqHelper有新版本({v})。', versionContent.hqhelper)) : '')
            + '\n' + t('要现在更新吗?')
          )) {
            displayCheckUpdatesModal()
          }
        } else if (needUpdateHqHelper) {
          if (window.confirm(
            t('检测到HqHelper有新版本({v})。', versionContent.hqhelper)
            + '\n' + t('要现在更新吗?')
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
    :namespace="appClass"
    :theme-overrides="naiveUIThemeOverrides"
  >
    <n-global-style />
    <n-message-provider :placement="naiveUiMessagePlacement">
      <div :class="appClass" :data-theme="theme">
        <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
          <n-layout-header v-if="appMode !== 'overlay'" bordered position="absolute">
            <AppHeader />
            <!-- <div class="draggable-view" /> -->
          </n-layout-header>

          <n-layout-content id="main-content" position="absolute" :native-scrollbar="false">
            <router-view />
          </n-layout-content>
          
          <AccountView v-if="!isMobile && appMode !== 'overlay'" class="account-view" />
        </n-layout>
        
        <ModalCopyAsMacro
          v-model:show="showCopyMacroModal"
          :macro-map="macroMapValue"
        />
        <ModalCheckUpdates v-model:show="showCheckUpdatesModal" />
        <ModalFestivalEgg v-model:show="showFestivalEgg" />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
.env-electron :deep(.n-layout-header) {
  -webkit-app-region: drag;
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
.account-view {
  position: absolute;
  top: 36px;
  right: 1em;
  z-index: 2000;
}
</style>
