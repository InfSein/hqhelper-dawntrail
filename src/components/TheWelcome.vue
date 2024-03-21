<script setup lang="ts">
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import WelcomeItem from './WelcomeItem.vue'

import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

import EorzeaTime from '@/tools/EorzeaTime'
import AppStatus from '@/variables/AppStatus'

// * import store
import { useStore } from '@/store/index'
const store = useStore()

const mobile = ref(AppStatus.Mobile)
const theme = ref(store.state.userConfig?.theme ?? 'system')

const hqHelperToaster = inject<(
  message: string, 
  type?: 'info' | 'success' | 'warning' | 'error', 
  duration?: number
) => void>('hqHelperToaster') ?? (() => {})
const setTheme = inject<(theme: 'light' | 'dark' | 'system') => void>('setTheme') ?? (() => {})
const setLocale = inject<(locale: 'zh' | 'en' | 'ja') => void>('setLocale') ?? (() => {})

const eorzeaTime = ref<EorzeaTime>(new EorzeaTime())
setInterval(() => {
  eorzeaTime.value = new EorzeaTime()
}, 200)

const { locale } = useI18n()
locale.value = store.state.userConfig?.language_ui ?? 'zh'
const changeLanguage = (value: 'zh' | 'en' | 'ja') => {
	locale.value = value
  setLocale(value)
}
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Eorzea Time</template>

    HqHelper calculates real-time eorzea time.
    <p>Current Eorzea time is:
    {{ eorzeaTime.gameTime }} (In-game format)</p>
    <p>Total Eorzea minutes (timeStamp):
    {{ eorzeaTime.timeStamp }}</p>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>i18n</template>

    HqHelper has already built `i18n` support.
    <p>Try to change languange:</p>
    <p>
      <a href="javascript:void(0)" @click="changeLanguage('zh')">Zh-CN</a> |
      <a href="javascript:void(0)" @click="changeLanguage('en')">En-US</a> |
      <a href="javascript:void(0)" @click="changeLanguage('ja')">Ja-JP</a>
    </p>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Theme</template>

    HqHelper can change theme now!
    <p>Try to change theme:</p>
    <p>
      <a href="javascript:void(0)" @click="setTheme('light')">Light</a> |
      <a href="javascript:void(0)" @click="setTheme('dark')">Dark</a> |
      <a href="javascript:void(0)" @click="setTheme('system')">System</a>
    </p>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>AppStatus</template>

    <p>Mobile: {{ mobile }}</p>
    <p>Store.Language: {{ locale }}</p>
    <p>Store.Theme: {{ theme }}</p>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support HqHelper</template>

    Please give us a star in
    <a href="https://github.com/InfSein/hqhelper-dawntrail" target="_blank" rel="noopener">Github</a>.
  </WelcomeItem>
</template>
