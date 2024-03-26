<script setup lang="ts">
import { inject, ref } from 'vue'

import WelcomeItem from './WelcomeItem.vue'

import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'

import EorzeaTime from '@/tools/EorzeaTime'

// * import store
// import { useStore } from '@/store/index'
// const store = useStore()

const isMobile = inject<boolean>('isMobile') ?? false

const eorzeaTime = ref<EorzeaTime>(new EorzeaTime())
setInterval(() => {
  eorzeaTime.value = new EorzeaTime()
}, 200)

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
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Theme</template>

    HqHelper can change theme now!
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>AppStatus</template>

    <p>Mobile: {{ isMobile }}</p>
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
