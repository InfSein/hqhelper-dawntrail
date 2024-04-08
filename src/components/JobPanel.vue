<script setup lang="ts">
import { useStore } from '@/store/index'
import { XivApiBase } from '@/variables/Constants'
import XivJobs from '@/assets/data/xiv-jobs.json'
import JobButton from './user-controls/JobButton.vue'
import GroupBox from './user-controls/GroupBox.vue'
import XivFARImage from './user-controls/XivFARImage.vue'

const store = useStore()
const uiLanguage = store.state.userConfig?.language_ui ?? 'zh'

let xivApiBase: string, xivApiBaseSpare: string
const disableXivApiMirror = store.state.userConfig?.disable_xivapi_mirror ?? false
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
              :api-base="xivApiBase"
              :api-base-spare="xivApiBaseSpare"
            />
          </div>
        </n-flex>
      </GroupBox>
    </n-flex>
  </n-card>
</template>