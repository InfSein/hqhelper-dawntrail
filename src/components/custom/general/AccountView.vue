<script setup lang="ts">
import {
  LogInOutlined, LogOutOutlined, PersonAddAlt1Filled,
  CloudSyncOutlined,
  EditNoteOutlined,
} from '@vicons/material'
import { useStore } from '@/store'
import { type CloudConfigModel, fixCloudConfig } from '@/models/config-cloud'
import { useNbbCloud } from '@/tools/nbb-cloud'
import useCloud from '@/tools/cloud'

const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile')!
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
const {
  avatarUrl,
  userNickName,
  userLoggedIn,
  userTitle,
} = useCloud(cloudConfig, t)

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
        store.setCloudConfig(newCloudConfig)
        appForceUpdate()
      }
    }
  }
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
  store.setCloudConfig(newCloudConfig)
  appForceUpdate()
  NAIVE_UI_MESSAGE.success(t('cloud.message.logged_out'))
}
</script>

<template>
  <n-popover
    placement="bottom-end"
    :width="isMobile ? 'trigger' : undefined"
    :trigger="isMobile ? 'click' : 'hover'"
  >
    <template #trigger>
      <n-button v-if="isMobile" style="--n-height: 65px;">
        <div class="button-container" style="min-width: 165px; justify-content: space-between; --isize: 36px; --tsize: 24px;">
          <n-avatar
            :size="36"
            :src="avatarUrl"
            class="button-avatar"
            style="background-color: var(--color-background-modal);"
          />
          <div class="user-block">
            <div class="button-text-sub">{{ userTitle }}</div>
            <div class="button-text">{{ userNickName }}</div>
          </div>
        </div>
      </n-button>
      <n-button
        v-else
        round strong secondary
        size="small"
        :class="triggerClass"
      >
        <div class="button-container">
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
      <div class="user-base" v-show="!isMobile">
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
      <div v-if="isMobile" style="height: 3px;" />
      <n-divider v-else style="margin: 4px 0" />
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
  --isize: 14px;
  --tsize: 14px;
  --tsize-sub: 12px;

  .button-avatar {
    display: flex;
    height: var(--isize);
    line-height: var(--isize);
  }
  .button-text {
    font-weight: bold;
    font-size: var(--tsize);
    height: var(--tsize);
    line-height: var(--tsize);
  }
  .button-text-sub {
    font-size: var(--tsize-sub);
    height: var(--tsize-sub);
    line-height: var(--tsize-sub);
  }
  .user-block {
    text-align: end;
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