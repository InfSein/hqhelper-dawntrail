<script setup lang="ts">
import { inject, onMounted, ref, type Ref } from 'vue'
import {
  NAvatar, NDivider, NPopover
} from 'naive-ui'
import type { StaffMember } from '@/models/about-app'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface StaffGroupProps {
  groupMembers: StaffMember[]
}
const props = defineProps<StaffGroupProps>()

onMounted(() => {
  console.log('staff group mounted:', props.groupMembers)
})
</script>

<template>
  <div class="member-group">
    <n-popover
      :placement="isMobile ? 'bottom' : 'right-start'"
      v-for="(member, mIndex) in groupMembers"
      :key="'staff-member-' + mIndex"
    >
      <template #trigger>
        <a href="javascript:void(0);" class="member">
          <n-avatar round :size="15" :src="member.avatar_url" fallback-src="./image/game-job/companion/none.png" />
          <div class="member-name">{{ member.name }}</div>
        </a>
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
  </div>
</template>

<style scoped>
.n-divider {
  margin: 10px 0;
}
.member-group {
  display: flex;
  gap: 1px;

  .member {
    display: flex;
    align-items: center;
    line-height: 20px;
    width: fit-content;
    padding: 1px 3px;

    .member-name {
      margin-left: 2px;
    }
  }
}
.intro-popover {
  width: 220px;
  max-width: 98%;

  .base-info {
    display: flex;
    align-items: center;
    gap: 5px;
    line-height: 15px;

    .name {
      font-size: 20px;
    }
  }
  .tail {
    margin-top: 5px;
  }
  .title {
    font-weight: bold;
  }
}
</style>