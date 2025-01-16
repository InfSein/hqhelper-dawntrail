<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NAvatar, NDivider, NPopover
} from 'naive-ui'
import type { StaffMember } from '@/models/about-app'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface StaffGroupProps {
  groupMembers: StaffMember[]
}
defineProps<StaffGroupProps>()
</script>

<template>
  <n-popover
    :placement="isMobile ? 'bottom' : 'right'"
    v-for="(member, mIndex) in groupMembers"
    :key="'staff-member-' + mIndex"
  >
    <template #trigger>
      <div class="subgroup-item">
        <div class="member-avatar">
          <n-avatar round :size="15" :src="member.avatar_url"
            fallback-src="./image/game-job/companion/none.png" />
        </div>
        <div class="member-name">
          <a href="javascript:void(0);">{{ member.name }}</a>
        </div>
      </div>
    </template>
    <div class="intro-popover">
      <div class="base-info">
        <div class="avatar">
          <n-avatar round size="medium" :src="member.avatar_url"
            fallback-src="./image/game-job/companion/none.png" />
        </div>
        <div class="name title">{{ member.name }}</div>
      </div>
      <n-divider />
      <div class="intro">
        <p v-for="(intro, i) in member.introductions" :key="member.name + '-intro-' + i">
          {{ intro }}
        </p>
      </div>
      <div class="tail">
        <div class="title">{{ t('个人主页：') }}</div>
        <div class="pages">
          <a target="_blank" v-for="(page, pIndex) in member.pages"
            :key="member.name + '-page-' + pIndex" :href="page.url">
            {{ page.name }}
          </a>
        </div>
      </div>
    </div>
  </n-popover>
</template>

<style scoped>
.subgroup-item {
  display: flex;
  align-items: center;
  line-height: 20px;
  
  .member-avatar {
    display: flex;
    align-items: center;
  }
  .member-name {
    text-indent: initial;
  }
}
</style>