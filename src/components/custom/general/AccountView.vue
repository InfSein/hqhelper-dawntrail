<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import {
  NAvatar, NButton, NIcon,
} from 'naive-ui'
import {
  KeyboardArrowDownRound
} from '@vicons/material'
import { type CloudConfigModel, fixCloudConfig } from '@/models/config-cloud'
import { getImgCdnUrl } from '@/tools/item'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const cloudConfig = inject<Ref<CloudConfigModel>>('cloudConfig')!

const avatarUrl = computed(() => {
  const avatarId = cloudConfig.value.nbb_account_avatar || 64384
  return getImgCdnUrl(avatarId)
})
const userNickName = computed(() => {
  return cloudConfig.value.nbb_account_nickname || t('未登录')
})
</script>

<template>
  <div>
    <n-button
      round strong secondary
      size="small"
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
    
  </div>
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
</style>