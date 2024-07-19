<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import {
  NCard, NIcon, NModal, NSpin, NTimeline, NTimelineItem
} from 'naive-ui'
import { EventNoteFilled } from '@vicons/material'
import { type UserConfigModel } from '@/models/user-config'
import { type UpdateLog, convertToUpdateLogs } from '@/models/changelog'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const showModal = defineModel<boolean>('show', { required: true })
  watch(showModal, async(newVal, oldVal) => {
  if (!oldVal && newVal) {
    loading.value = true
    await loadChangelog()
    loading.value = false
  } 
})

const loading = ref(false)
const changelogs = ref<UpdateLog[]>([])
const errorText = ref('')

const loadChangelog = async() => {
  try {
    errorText.value = ''
    let url = 'https://raw.githubusercontent.com/InfSein/hqhelper-dawntrail/master/CHANGELOG'
    if (userConfig.value.language_ui === 'zh') {
      url += '-ZH'
    } else if (userConfig.value.language_ui === 'ja') {
      url += '-JA'
    }
    url += '.md'
    const response = await fetch(url)
    const text = await response.text()
    const arr = convertToUpdateLogs(text)
    changelogs.value = arr
    console.log('text', text)
    console.log('arr', arr)
  } catch (error) {
    console.error(error)
    errorText.value = t('加载更新日志失败')
  }
}

const getType = (type: "major" | "minor" | "patch") => {
  switch (type) {
    case "major":
      return 'success'
    case "minor":
      return 'warning'
    default: // patch
      return 'info'
  }
}

const handleClose = () => {
  showModal.value = false
}
</script>

<template>
  <n-modal v-model:show="showModal">
    <n-card
      closable
      role="dialog"
      class="no-select"
      style="width: 98%; max-width: 600px;"
      :style="{ height: isMobile ? '650px' : '600px' }"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><EventNoteFilled /></n-icon>
          <span class="title">{{ t('更新日志') }}</span>
        </div>
      </template>

      <n-card embedded class="wrapper" :style="{ height: isMobile ? '550px' : '500px' }">
        <div v-if="loading" class="loading">
          <n-spin :size="15" />
          <span>{{ t('加载中...') }}</span>
        </div>
        <div v-if="errorText" class="error-text">
          {{ errorText }}
        </div>
        <div class="main-content">
          <n-timeline size="large">
            <n-timeline-item
              v-for="(item, index) in changelogs"
              :key="'log-' + index"
              :type="getType(item.type)"
              :title="item.version"
              :time="item.date"
              :line-type="item.discontinuous ? 'dashed' : 'default'"
              style="--n-title-font-weight: bold;"
            >
              <div class="vlogs">
                <div v-for="(vlContent, vlTitle) in item.content" :key="`log-${index}-${vlTitle}`" class="vlog">
                  <div class="vlog-title">{{ vlTitle }}</div>
                  <div class="vlog-contents">
                    <ul>
                      <li v-for="(v, i) in vlContent" :key="`log-${index}-${vlTitle}-${i}`">
                        <span v-html="v"></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </n-timeline-item>
          </n-timeline>
        </div>
      </n-card>
    </n-card>
  </n-modal>
</template>

<style scoped>
::deep(.n-timeline .n-timeline-item .n-timeline-item-content .n-timeline-item-content__title) {
  font-weight: bold;
}

/* All */
.wrapper {
  display: flex;
  flex-direction: column;
  user-select: text;
  overflow-y: auto;

  .loading {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .error-text {
    color: red;
  }

  .main-content{
    .n-timeline-item-content__title {
      font-weight: bold;
      text-decoration-line: underline;
    }
    .vlogs {
      .vlog-title {
        font-weight: bold;
      }
      .vlog-contents ul {
        padding-inline-start: 2em;
      }
    }
  }
}

/* Mobile only */
/* @media (max-width: 768px)*/
</style>