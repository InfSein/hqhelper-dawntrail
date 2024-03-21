<script setup lang="ts">
import { inject, h, ref } from 'vue'
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'

import MenuIcon from "./x-icons/IconMenu.vue"
import SettingsIcon from "./x-icons/IconSettings.vue"

const t = inject<(i18nKey: string) => string>('t') ?? (() => { return '' })
const showUserPreferencesModal = inject<() => void>('showUserPreferencesModal') ?? (() => {})

// to use icons in naive-ui, re-render is needed
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const settingOptions = ref<any[]>([])
const initializeSettingOptions = () => {
  settingOptions.value = [
    {
      label: t('ui.settings.user_preferences'),
      key: 'user_preferences',
      icon: renderIcon(SettingsIcon)
    },
  ]
}
initializeSettingOptions()
defineExpose({initializeSettingOptions})

const onSettingOptionSelected = (key: string) => {
  if (key === 'user_preferences') {
    // show user preferences modal by inject from `App.vue`.
    showUserPreferencesModal()
    // refresh options every time after languange setting might be changed.
    initializeSettingOptions()
  } else {
    console.warn('unknown setting-option selected.')
  }
}
</script>

<template>
  <div class="app-header">
    <img src="../assets/logo_32x32.png" width="15" height="15" alt="Logo" />
    <p class="app-name">HQ Helper</p>
    <n-dropdown
      size="huge"
      trigger="click"
      :options="settingOptions"
      @select="onSettingOptionSelected"
    >
      <n-button secondary strong class="menu-btn">
        <template #icon>
          <MenuIcon />
        </template>
        {{ $t('ui.more') }}
      </n-button>
    </n-dropdown>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  line-height: 35px;

  .app-name {
    margin: 5px;
    font-weight: 600;
  }
  .menu-btn {
    margin-left: auto;
  }
}
</style>