<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NCard, NCollapse, NCollapseItem, NIcon, NModal
} from 'naive-ui'
import { EventNoteFilled } from '@vicons/material'
import { getChangelogs } from '@/data/change-logs'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const showModal = defineModel<boolean>('show', { required: true })
const handleClose = () => {
  showModal.value = false
}

const changelog = computed(() => {
  return getChangelogs(t)
})
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

      <div class="wrapper" :style="{ height: isMobile ? '550px' : '500px' }">
        <n-card
          v-for="(patchlog, logIndex) in changelog"
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
                      v-for="(changeContent, changeContentIndex) in change.changes.filter(str => str !== '')"
                      :key="patchlog.version + '-' + changeIndex + '-' + changeContentIndex"
                    >
                      {{ change.changes.length > 1 ? ((changeContentIndex + 1) + '. ') : '' }}
                      {{ changeContent }}
                    </div>
                  </div>
                </div>
              </div>
            </n-collapse-item>
          </n-collapse>
        </n-card>
      </div>
    </n-card>
  </n-modal>
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
/* All */
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  user-select: text;
  overflow-y: auto;
}
.patchnote-container {
  display: flex;
  flex-direction: column;
  gap: 3px;
  .item .change-group-title {
    font-weight: bold;
  }
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