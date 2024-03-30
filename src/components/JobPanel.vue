<script setup lang="ts">
import { useStore } from '@/store/index'
import { XivApiBase } from '@/variables/Constants'
import XivJobs from '@/assets/data/xiv-jobs.json'
import JobButton from './user-controls/JobButton.vue'
import GroupBox from './user-controls/GroupBox.vue'

const store = useStore()
const uiLanguage = store.state.userConfig?.language_ui ?? 'zh'
const disableXivApiMirror = store.state.userConfig?.disable_xivapi_mirror ?? false
const xivApiBase = disableXivApiMirror ? XivApiBase.global : XivApiBase.cn

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

const getUrl = (url: string) => {
  return url.replace('~ApiBase', xivApiBase)
}
const onImageLoadError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.src.includes(XivApiBase.global)) {
    return
  }
  img.src = img.src.replace(XivApiBase.cn, XivApiBase.global)
}
</script>

<template>
  <n-card embedded :bordered="false">
    <n-flex :size="[10,13]">
      <GroupBox
        v-for="(role, roleIndex) in XivJobs"
        :key="role.role_name_en + roleIndex"
        :border-color="role.role_color"
      >
        <template #title>
          <img
            width="14" height="14"
            :src="getUrl(role.role_icon_url)"
            @error="onImageLoadError"
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
              :job-icon="getUrl(job.job_icon_url)"
              @on-icon-load-error="onImageLoadError"
            />
          </div>
        </n-flex>
      </GroupBox>
    </n-flex>
  </n-card>
</template>