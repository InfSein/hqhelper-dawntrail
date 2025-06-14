<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import {
  NAvatar, NButton, NDivider, NIcon, NPopover,
  useMessage,
} from 'naive-ui'
import {
  LogInOutlined, LogOutOutlined, PersonAddAlt1Filled,
  EditNoteOutlined,
} from '@vicons/material'
import { useStore } from '@/store'
import type { UserConfigModel } from '@/models/config-user'
import { type CloudConfigModel, fixCloudConfig } from '@/models/config-cloud'
import { getImgCdnUrl } from '@/tools/item'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const cloudConfig = inject<Ref<CloudConfigModel>>('cloudConfig')!
const displayLoginModal = inject<(action: "login" | "register") => void>('displayLoginModal')!
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

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

const handleLogin = () => {
  displayLoginModal('login')
}
const handleRegister = () => {
  displayLoginModal('register')
}
const handleLogout = () => {
  const newCloudConfig = fixCloudConfig()
  store.commit('setCloudConfig', newCloudConfig)
  appForceUpdate()
  NAIVE_UI_MESSAGE.success(t('已退出登录'))
}
</script>

<template>
  <n-popover placement="bottom-end">
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
          type="primary"
          @click="handleLogin"
        >
          <template #icon><n-icon><LogInOutlined /></n-icon></template>
          {{ t('登录') }}
        </n-button>
        <n-button
          @click="handleRegister"
        >
          <template #icon><n-icon><PersonAddAlt1Filled /></n-icon></template>
          {{ t('注册') }}
        </n-button>
      </div>
      <div v-else class="logged-wrapper">
        <n-button>
          <template #icon><n-icon><EditNoteOutlined /></n-icon></template>
          {{ t('编辑') }}
        </n-button>
        <n-button
          type="error"
          @click="handleLogout"
        >
          <template #icon><n-icon><LogOutOutlined /></n-icon></template>
          {{ t('登出') }}
        </n-button>
      </div>
      <div class="copyright">Powered by NBB Cloud</div>
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
  width: 150px;

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
  .unlogged-wrapper,
  .logged-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2px;

    button {
      width: 100%;
    }
  }
  .copyright {
    line-height: 1.2;
    font-size: 12px;
    color: gray;
    text-align: center;
    margin-top: 5px;
  }
}
</style>