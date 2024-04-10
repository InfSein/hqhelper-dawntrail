<script setup lang="ts">
import { inject, ref } from 'vue'
import AppStatus from '@/variables/AppStatus'
import { NIcon } from 'naive-ui'
import {
  MenuFilled,
  SettingsSharp,
  InfoFilled
} from '@vicons/material'

const t = inject<(i18nKey: string) => string>('t') ?? (() => { return '' })
const showUserPreferencesModal = inject<() => void>('showUserPreferencesModal') ?? (() => {})
const showAboutAppModal = inject<() => void>('showAboutAppModal') ?? (() => {})

const showMenus = ref(false)

const menuItems = [
  { key: 'user-preferences', label: t('偏好设置'), icon: SettingsSharp },
  { key: 'about-app', label: t('关于本作'), icon: InfoFilled }
]

const openModal = (key: string) => {
  // close menus first
  showMenus.value = false
  // show modal by inject
  switch (key) {
    case 'user-preferences':
      showUserPreferencesModal()
      break
    case 'about-app':
      showAboutAppModal()
      break
  }
}

</script>

<template>
  <div class="app-header">
    <i class="xiv hq logo-font"></i>
    <p class="app-name">HQ Helper</p>
    <p>{{ AppStatus.Version }}</p>
    <div class="tail-contents">
      <n-button ghost @click="showMenus = !showMenus">
        <template #icon>
          <n-icon><menu-filled /></n-icon>
        </template>
        {{ t('更多') }}
      </n-button>
    </div>
    
    <n-drawer
      v-model:show="showMenus"
      placement="right"
      :width="250"
      :trap-focus="false"
      :block-scroll="false"
      to="#main-container"
    >
      <n-drawer-content>
        <n-flex vertical>
          <n-button
            v-for="item in menuItems"
            :key="item.key"
            @click="openModal(item.key)"
          >
            <template #icon>
              <n-icon><component :is="item.icon" /></n-icon>
            </template>
            {{ item.label }}
          </n-button>
        </n-flex>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  line-height: 35px;

  .logo-font {
    font-size: 24px;
    color: var(--n-text-color);
  }
  .app-name {
    margin: 5px;
    font-weight: 600;
  }
  .tail-contents {
    margin-left: auto;
  }
}
</style>