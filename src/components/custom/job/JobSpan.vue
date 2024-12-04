<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import XivFARImage from '../general/XivFARImage.vue'
import { XivJobs } from '@/assets/data'
import type { UserConfigModel } from '@/models/user-config'

interface JobInfo {
  job_id: number,
  job_name_en: string,
  job_name_zh: string,
  job_name_ja: string,
  job_icon_url: string
}

const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})

const props = defineProps({
  jobId: {
    type: Number,
    required: true
  },
  imgSize: {
    type: Number,
    default: 14
  },
  hideIcon: {
    type: Boolean,
    default: false
  },
  hideName: {
    type: Boolean,
    default: false
  }
})

const jobInfo = computed(() => {
  if (XivJobs[props.jobId]) {
    return XivJobs[props.jobId]
  } else {
    return {
      job_id: 0,
      job_name_en: 'Unknown',
      job_name_zh: '未知',
      job_name_ja: '未知',
      job_icon_url: './image/game-job/companion/none.png'
    } as JobInfo
  }
})

const getJobName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return jobInfo.value.job_name_ja
    case 'en':
      return jobInfo.value.job_name_en
    case 'zh':
    default:
      return jobInfo.value.job_name_zh || '未知'
  }
}
</script>

<template>
  <div class="container">
    <XivFARImage
      v-show="!hideIcon"
      class="img"
      :size="imgSize"
      :src="jobInfo.job_icon_url"
    />
    <span v-show="!hideName" class="name">
      {{ getJobName() }}
    </span>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
}
</style>