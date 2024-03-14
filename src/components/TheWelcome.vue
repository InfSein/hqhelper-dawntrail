<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import WelcomeItem from './WelcomeItem.vue'

import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

import EorzeaTime from '@/tools/EorzeaTime'
import AppStatus from '@/variables/AppStatus'

const eorzeaTime = ref<EorzeaTime>(new EorzeaTime())
setInterval(() => {
  eorzeaTime.value = new EorzeaTime()
}, 200)

const { locale } = useI18n()
const changeLanguage = (value: string) => {
	locale.value = value
  console.log('Language has already been changed to ' + value)
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
      <a href="javascript:void(0)" @click="changeLanguage('jp')">Ja-JP</a>
    </p>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>AppStatus</template>

    Mobile: {{ AppStatus.Mobile }}
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    Got stuck? Ask your question on
    <a href="https://chat.vuejs.org" target="_blank" rel="noopener">Vue Land</a>, our official
    Discord server, or
    <a href="https://stackoverflow.com/questions/tagged/vue.js" target="_blank" rel="noopener"
      >StackOverflow</a
    >. You should also subscribe to
    <a href="https://news.vuejs.org" target="_blank" rel="noopener">our mailing list</a> and follow
    the official
    <a href="https://twitter.com/vuejs" target="_blank" rel="noopener">@vuejs</a>
    twitter account for latest news in the Vue world.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help
    us by
    <a href="https://vuejs.org/sponsor/" target="_blank" rel="noopener">becoming a sponsor</a>.
  </WelcomeItem>
</template>
