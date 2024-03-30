<script lang="ts" setup>
import { inject, provide, ref } from 'vue';
import AppHeader from '../components/AppHeader.vue'
import EorzeaTimeCard from '../components/user-controls/EorzeaTimeCard.vue'
import JobPanel from '../components/JobPanel.vue'
import UserPreferences from '../components/UserPreferences.vue'
import AboutApp from '../components/AboutApp.vue'
import HelloWorld from '../components/HelloWorld.vue'
import TheWelcome from '../components/TheWelcome.vue'
import { useMessage } from 'naive-ui';

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(i18nKey: string) => string>('t') ?? (() => { return '' })
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
// const isMobile = inject<boolean>('isMobile') ?? false

// * HqHelper Toast
const hqHelperToast = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  duration: number = 2000,
) => {
  // Naive Message
  NAIVE_UI_MESSAGE[type](message, { closable: true, duration: duration })
}
// * Provide HqHelper Toaster
provide('hqHelperToaster', hqHelperToast)

const showUserPreferencesModal = ref(false)
const showAboutAppModal = ref(false)

const closeUserPreferencesModal = () => {
  showUserPreferencesModal.value = false
}
const closeAboutAppModal = () => {
  showAboutAppModal.value = false
}
const onUserPreferencesSubmitted = () => {
  closeUserPreferencesModal()
  appForceUpdate()
  hqHelperToast(t('保存成功'), 'success')
}

// * Provide Show Modals
provide('showUserPreferencesModal', () => {
  showUserPreferencesModal.value = true
})
provide('showAboutAppModal', () => {
  showAboutAppModal.value = true
})

// ! temp
const base = '/assets/game-icons/jobs/job/'
const jobs = {
  tanks: [
    { job: 'warrior', iconPath: base + 'battle/warrior.png' },
    { job: 'paladin', iconPath: base + 'battle/paladin.png' },
    { job: 'darkknight', iconPath: base + 'battle/darkknight.png' },
    { job: 'gunbreaker', iconPath: base + 'battle/gunbreaker.png' },
  ],
  healers: [
    { job: 'whitemage', iconPath: base + 'battle/whitemage.png' },
    { job: 'scholar', iconPath: base + 'battle/scholar.png' },
    { job: 'astrologian', iconPath: base + 'battle/astrologian.png' },
    { job: 'sage', iconPath: base + 'battle/sage.png' },
  ],
  melee_dps: [
    { job: 'monk', iconPath: base + 'battle/monk.png' },
    { job: 'dragoon', iconPath: base + 'battle/dragoon.png' },
    { job: 'ninja', iconPath: base + 'battle/ninja.png' },
    { job: 'reaper', iconPath: base + 'battle/reaper.png' },
  ],
  ranged_dps: [
    { job: 'bard', iconPath: base + 'battle/bard.png' },
    { job: 'machinist', iconPath: base + 'battle/machinist.png' },
    { job: 'dancer', iconPath: base + 'battle/dancer.png' },
  ],
  magic_dps: [
    { job: 'blackmage', iconPath: base + 'battle/blackmage.png' },
    { job: 'summoner', iconPath: base + 'battle/summoner.png' },
    { job: 'redmage', iconPath: base + 'battle/redmage.png' },
  ],
  crafters: [
    { job: 'carpenter', iconPath: base + 'non-battle/carpenter.png' },
    { job: 'blacksmith', iconPath: base + 'non-battle/blacksmith.png' },
    { job: 'armorer', iconPath: base + 'non-battle/armorer.png' },
    { job: 'goldsmith', iconPath: base + 'non-battle/goldsmith.png' },  
    { job: 'leatherworker', iconPath: base + 'non-battle/leatherworker.png' },
    { job: 'weaver', iconPath: base + 'non-battle/weaver.png' },
    { job: 'alchemist', iconPath: base + 'non-battle/alchemist.png' },
    { job: 'culinarian', iconPath: base + 'non-battle/culinarian.png' },
  ],
  gatherers: [
    { job: 'botanist', iconPath: base + 'non-battle/botanist.png' },
    { job: 'miner', iconPath: base + 'non-battle/miner.png' },  
    { job: 'fisher', iconPath: base + 'non-battle/fisher.png' },
  ]
}
</script>

<template>
  <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
    <n-layout-header bordered position="absolute">
      <AppHeader ref="appHeader" />
    </n-layout-header>

    <n-layout-content id="main-content" position="absolute">
      <n-flex id="main-container">
        <n-flex vertical id="sub-container-1">
          <i class="xiv hq logo" style=""></i>

          <EorzeaTimeCard />

          <JobPanel />
        </n-flex>
        <n-flex vertical id="sub-container-2">
          <TheWelcome />
        </n-flex>
      </n-flex>
    </n-layout-content>
  </n-layout>

  <n-modal :show="showUserPreferencesModal">
    <UserPreferences
      @after-submit="onUserPreferencesSubmitted"
      @close="closeUserPreferencesModal"
    />
  </n-modal>
  <n-modal :show="showAboutAppModal">
    <AboutApp
      @close="closeAboutAppModal"
    />
  </n-modal>
  
  <n-back-top />
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
    padding: 2rem;
    font-weight: 400;
  }
}

header {
  line-height: 1.5;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 85px;
  color: var(--n-text-color);
}

@media (min-width: 1024px) {
  #main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
    margin: 0 auto 0 15%;
  }

  #sub-container-1 {
    max-width: 450px;
  }
  #sub-container-2 {
    margin-left: 10%;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    display: block;
    margin: 0 auto 0.5rem;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>