<script setup lang="ts">
import { ref, inject, type Ref, computed } from 'vue'
import { XivApiBase } from '@/variables/Constants'
import { type UserConfigModel, defaultUserConfig } from '@/variables/UserConfig'
import XivJobs from '@/assets/data/xiv-jobs.json'
import JobButton from './user-controls/JobButton.vue'
import GroupBox from './user-controls/GroupBox.vue'
import XivFARImage from './user-controls/XivFARImage.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)
const uiSizePreset = userConfig.value?.ui_size_preset ?? '2k'
const uiLanguage = userConfig.value?.language_ui ?? 'zh'

let xivApiBase: string, xivApiBaseSpare: string
const disableXivApiMirror = userConfig.value?.disable_xivapi_mirror ?? false
if (disableXivApiMirror) {
  xivApiBase = XivApiBase.global
  xivApiBaseSpare = XivApiBase.cn
} else {
  xivApiBase = XivApiBase.cn
  xivApiBaseSpare = XivApiBase.global
}

const getRoleName = (role: any) => {
  switch (uiLanguage) {
    case 'ja':
      return role.role_name_ja
    case 'en':
      return role.role_name_en
    default:
      return role.role_name_zh
  }
}
const getJobName = (job: any) => {
  switch (uiLanguage) {
    case 'ja':
      return job.job_name_ja
    case 'en':
      return job.job_name_en
    default:
      return job.job_name_zh
  }
}
const jobImageSize = computed(() => {
  switch (uiSizePreset) {
    case '2k':
      return 32
    case '4k':
      return 36
  }
  return 28 // default or 1080p
})
</script>

<template>
  <n-card :title="t('按职业选择')" embedded :bordered="false">
    <n-flex :size="[10,13]">
      <GroupBox
        v-for="(role, roleIndex) in XivJobs"
        :key="role.role_name_en + roleIndex"
        :border-color="role.role_color"
      >
        <template #title>
          <XivFARImage
            :src="role.role_icon_url"
            :size="14"
            :api-base="xivApiBase"
            :api-base-spare="xivApiBaseSpare"
          />
          <span>
            {{ getRoleName(role) }}
          </span>
        </template>
        <n-flex size="small">
          <div
            v-for="(job, jobIndex) in role.jobs"
            :key="job.job_name_en + jobIndex"
            :title="getJobName(job)"
          >
            <JobButton
              :role="roleIndex"
              :job="job.job_name_en"
              :job-icon="job.job_icon_url"
              :img-size="jobImageSize"
              :api-base="xivApiBase"
              :api-base-spare="xivApiBaseSpare"
            />
          </div>
        </n-flex>
      </GroupBox>
    </n-flex>
  </n-card>
</template>