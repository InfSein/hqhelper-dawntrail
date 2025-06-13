<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import {
  NAvatar, NButton, NDivider, NIcon, NPopover,
} from 'naive-ui'
import {
  LogInOutlined, LogOutOutlined, PersonAddAlt1Filled,
} from '@vicons/material'
import type { UserConfigModel } from '@/models/config-user'
import { type CloudConfigModel, fixCloudConfig } from '@/models/config-cloud'
import { getImgCdnUrl } from '@/tools/item'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const cloudConfig = inject<Ref<CloudConfigModel>>('cloudConfig')!

interface AccountViewProps {
  triggerClass: string
}
defineProps<AccountViewProps>()

const avatarUrl = computed(() => {
  const avatarId = cloudConfig.value.nbb_account_avatar || 64384
  return getImgCdnUrl(avatarId)
})
const userNickName = computed(() => {
  return cloudConfig.value.nbb_account_nickname || t('未登录')
})
const userLoggedIn = computed(() => !!cloudConfig.value.nbb_account_token)
const userTitle = computed(() => {
  if (!userLoggedIn.value) return '-'
  return userConfig.value.user_custom_title || '-'
})
</script>

<template>
  <n-popover trigger="click" placement="bottom-end">
    <template #trigger>
      <n-button
        round strong secondary
        size="small"
        :class="triggerClass"
      >
        <div class="button-container flex-vac gap-2">
          <n-avatar
            :size="14"
            :src="avatarUrl"
            class="button-avatar"
          />
          <div class="button-text">{{ userNickName }}</div>
        </div>
      </n-button>
    </template>

    <div class="avpop-wrapper">
      <div class="user-base">
        <n-avatar
          :size="32"
          :src="avatarUrl"
          class="user-avatar"
        />
        <div class="user-name-container">
          <div class="user-title">{{ userTitle }}</div>
          <div class="user-name">{{ userNickName }}</div>
        </div>
      </div>
      <n-divider style="margin: 4px 0" />
      <div v-if="!userLoggedIn" class="unlogged-wrapper">
        <n-button
          v-if="!userLoggedIn"
          type="primary"
          class="w-full"
        >
          <template #icon><n-icon><LogInOutlined /></n-icon></template>
          {{ t('登录') }}
        </n-button>
        <n-button
          v-if="!userLoggedIn"
          class="w-full"
        >
          <template #icon><n-icon><PersonAddAlt1Filled /></n-icon></template>
          {{ t('注册') }}
        </n-button>
      </div>
    </div>
  </n-popover>
</template>

<style scoped>
.button-container {
  display: flex;
  align-items: center;
  gap: 2px;
  --tsize: 14px;

  .button-avatar {
    display: flex;
    height: var(--tsize);
    line-height: var(--tsize);
  }
  .button-text {
    font-weight: bold;
    font-size: var(--tsize);
    height: var(--tsize);
    line-height: var(--tsize);
  }
}
.avpop-wrapper {
  width: 120px;

  .user-base {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px;

    .user-name-container {
      line-height: 1;
      text-align: end;
      .user-title {
        font-size: 12px;
      }
      .user-name {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  .unlogged-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}
</style>