<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NCard, NCollapse, NCollapseItem, NDivider, NH1, NIcon, NText,
} from 'naive-ui'
import {
  EventNoteFilled,
  HistoryOutlined, StickyNote2Outlined,
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import { getChangelogs, type PatchChangeGroup } from '@/data/change-logs'
import type { UserConfigModel } from '@/models/config-user'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const showModal = defineModel<boolean>('show', { required: true })

const showHistory = ref(false)

const wrapperStyle = computed(() => {
  return {
    height: isMobile.value ? '550px' : '450px'
  }
})
const latestPatchNote = computed(() => {
  return getChangelogs(userConfig.value.language_ui)[0]
})
const historyChangelogs = computed(() => {
  return getChangelogs(userConfig.value.language_ui).slice(1)
})
const btnSwitchShowHistoryInfo = computed(() => {
  const icon = showHistory.value ? StickyNote2Outlined : HistoryOutlined
  const text = showHistory.value ? t('查看最新日志') : t('查看历史日志')
  return { icon, text }
})

const getChanges = (change: PatchChangeGroup) => {
  return change.changes.filter(str => str !== '')
}

const handleSwitchShowHistory = () => {
  showHistory.value = !showHistory.value
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="EventNoteFilled"
    :title="t('更新日志')"
    max-width="650px"
    :height="isMobile ? '650px' : '550px'"
  >
    <div v-if="!showHistory" class="wrapper wrapper-latest-update" :style="wrapperStyle">
      <n-card embedded size="small" class="h-full">
        <div class="latest-update-baseinfo">
          <n-h1 prefix="bar">v{{ latestPatchNote.version }}</n-h1>
          <n-text depth="3" class="date">{{ latestPatchNote.date }}</n-text>
        </div>
        <n-divider style="margin: 8px 0 12px 0;" />
        <div class="latest-update-content">
          <div
            v-for="(change, changeIndex) in latestPatchNote.changes"
            :key="'latest-' + changeIndex"
            class="item"
          >
            <div class="change-group-title">{{ t(change.name) }}</div>
            <div class="change-group-content">
              <div
                v-for="(changeContent, changeContentIndex) in getChanges(change)"
                :key="'latest-' + changeIndex + '-' + changeContentIndex"
                class="content-line"
              >
                <span class="line-index">
                  {{ getChanges(change).length > 1 ? ((changeContentIndex + 1) + '. ') : '' }}
                </span>
                <span v-html="changeContent"></span>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>
    <div v-else class="wrapper flex" :style="wrapperStyle">
      <n-card
        v-for="(patchlog, logIndex) in historyChangelogs"
        :key="patchlog.version"
        embedded
        size="small"
      >
        <n-collapse :default-expanded-names="logIndex ? [] : ['1']">
          <n-collapse-item name="1" :title="patchlog.version">
            <template #header-extra>
              {{ t('更新时间：{date}', patchlog.date) }}
            </template>
            <div class="patchnote-container">
              <div
                v-for="(change, changeIndex) in patchlog.changes"
                :key="patchlog.version + '-' + changeIndex"
                class="item"
              >
                <div class="change-group-title">{{ t(change.name) }}</div>
                <div class="change-group-content">
                  <div
                    v-for="(changeContent, changeContentIndex) in getChanges(change)"
                    :key="patchlog.version + '-' + changeIndex + '-' + changeContentIndex"
                  >
                    <span>
                      {{ getChanges(change).length > 1 ? ((changeContentIndex + 1) + '. ') : '' }}
                    </span>
                    <span v-html="changeContent"></span>
                  </div>
                </div>
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </n-card>
    </div>

    <template #action>
      <div class="submit-container">
        <n-button type="primary" @click="handleSwitchShowHistory">
          <template #icon>
            <n-icon :component="btnSwitchShowHistoryInfo.icon" />
          </template>
          {{ btnSwitchShowHistoryInfo.text }}
        </n-button>
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
:deep(.n-collapse-item__header-main) {
  font-size: 16px;
  font-weight: bold !important;
}
:deep(.n-collapse-item__content-inner) {
  padding-top: 0 !important;
  padding: 10px 10px 0 15px !important;
}
:deep(.n-card__content) {
  padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);
}
/* All */
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  user-select: text;
  overflow-y: auto;
}
.wrapper-latest-update {
  .latest-update-baseinfo {
    line-height: 1.2;
    h1 {
      margin-bottom: 0;
    }
    .date {
      padding-left: 20px;
    }
  }
  .latest-update-content {
    display: flex;
    flex-direction: column;
    gap: 3px;

    .item {
      margin-left: 1.5em;

      .change-group-title {
        font-weight: bold;
      }
      .change-group-content {
        margin-left: 1em;

        .content-line {
          display: grid;
          grid-template-columns: 16px 1fr;
          column-gap: 3px;

          .line-index {
            user-select: none;
          }
        }
      }
    }
  }
}
.patchnote-container {
  display: flex;
  flex-direction: column;
  gap: 3px;
  .item .change-group-title {
    font-weight: bold;
  }
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Desktop */
@media screen and (min-width: 768px) {
  .patchnote-container .item {
    display: grid;
    gap: 5px 10px;
    grid-template-columns: 75px 1fr;

    .change-group-title {
      user-select: none;
    }
    .change-group-content {
      border-bottom: 1px solid;
    }
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
}
</style>