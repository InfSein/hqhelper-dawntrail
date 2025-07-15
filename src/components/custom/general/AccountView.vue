<script setup lang="ts">
import { inject, computed, onMounted, type Ref } from 'vue'
import {
  NAvatar, NButton, NDivider, NIcon, NPopover,
  useMessage,
} from 'naive-ui'
import {
  LogInOutlined, LogOutOutlined, PersonAddAlt1Filled,
  CloudSyncOutlined,
  EditNoteOutlined,
} from '@vicons/material'
import { useStore } from '@/store'
import { type CloudConfigModel, fixCloudConfig } from '@/models/config-cloud'
import { getImgCdnUrl } from '@/tools/item'
import { useNbbCloud } from '@/tools/nbb-cloud'

const t = inject<(message: string, args?: any) => string>('t')!
const cloudConfig = inject<Ref<CloudConfigModel>>('cloudConfig')!
const displayLoginModal = inject<(action: "login" | "register" | "edituser") => void>('displayLoginModal')!
const displayCloudSyncModal = inject<() => {}>('displayCloudSyncModal')!
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const {
  updateUserInfo,
  resolveUserInfo,
} = useNbbCloud(cloudConfig)

interface AccountViewProps {
  triggerClass?: string
}
defineProps<AccountViewProps>()

onMounted(async () => {
  const nextUpdateTime = cloudConfig.value.nbb_userinfo_last_update + 5000
  if (
    cloudConfig.value.nbb_account_token
    && Date.now() >= nextUpdateTime
  ) {
    const response = await updateUserInfo()
    if (response.errno) {
      console.warn('User info auto update failed.\n', response)
    } else {
      const newCloudConfig = resolveUserInfo(response.data, cloudConfig.value)
      if (JSON.stringify(newCloudConfig) !== JSON.stringify(cloudConfig.value)) {
        store.commit('setCloudConfig', newCloudConfig)
        appForceUpdate()
      }
    }
  }
})

const avatarUrl = computed(() => {
  if (cloudConfig.value.nbb_account_avatar_vip) {
    return cloudConfig.value.nbb_account_avatar_vip
  } else if (cloudConfig.value.nbb_account_avatar) {
    return getImgCdnUrl(cloudConfig.value.nbb_account_avatar)
  } else {
    return './image/game-job/companion/none.png'
  }
})
const userNickName = computed(() => {
  return cloudConfig.value.nbb_account_nickname || t('cloud.text.not_logged_in')
})
const userLoggedIn = computed(() => !!cloudConfig.value.nbb_account_token)
const userTitle = computed(() => {
  if (!userLoggedIn.value) return '-'
  return cloudConfig.value.nbb_account_title || '-'
})

const handleLogin = () => {
  displayLoginModal('login')
}
const handleRegister = () => {
  displayLoginModal('register')
}
const handleEditUserInfo = () => {
  displayLoginModal('edituser')
}
const handleCloudSync = () => {
  displayCloudSyncModal()
}
const handleLogout = () => {
  const newCloudConfig = fixCloudConfig()
  store.commit('setCloudConfig', newCloudConfig)
  appForceUpdate()
  NAIVE_UI_MESSAGE.success(t('cloud.message.logged_out'))
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
        <div class="group-title">
          {{ t('common.account') }}
        </div>
        <n-button
          type="primary"
          @click="handleLogin"
        >
          <template #icon><n-icon><LogInOutlined /></n-icon></template>
          {{ t('common.login') }}
        </n-button>
        <n-button
          @click="handleRegister"
        >
          <template #icon><n-icon><PersonAddAlt1Filled /></n-icon></template>
          {{ t('common.register') }}
        </n-button>
      </div>
      <div v-else class="logged-wrapper">
        <div class="group-title">
          {{ t('common.data') }}
        </div>
        <n-button
          type="primary"
          @click="handleCloudSync"
        >
          <template #icon><n-icon><CloudSyncOutlined /></n-icon></template>
          {{ t('common.sync') }}
        </n-button>
        <div class="group-title">
          {{ t('common.account') }}
        </div>
        <n-button @click="handleEditUserInfo">
          <template #icon><n-icon><EditNoteOutlined /></n-icon></template>
          {{ t('common.edit') }}
        </n-button>
        <n-button
          type="error"
          @click="handleLogout"
        >
          <template #icon><n-icon><LogOutOutlined /></n-icon></template>
          {{ t('common.logout') }}
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
  min-width: 140px;

  .user-base {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px;

    .user-avatar {
      background-color: var(--color-background-popover);
    }
    .user-name-container {
      line-height: 1;
      text-align: end;
      .user-title {
        font-size: 12px;
        user-select: none;
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
      margin-bottom: 2px;
    }
    .group-title {
      line-height: 1.2;
      font-size: 12px;
      color: var(--color-text-sub);
      user-select: none;
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