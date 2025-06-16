<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NCard, NIcon,
} from 'naive-ui'
import { 
  CloudSyncOutlined,
  ChecklistRtlOutlined,
  CloudOutlined,
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import type { HqList } from '@/models/nbb-cloud'

const showModal = defineModel<boolean>('show', { required: true })

interface ModalCloudSyncProps {
}
const props = defineProps<ModalCloudSyncProps>()

const onLoad = () => {
}

</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="CloudSyncOutlined"
    :title="t('数据同步')"
    max-width="600px"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <n-card size="small" embedded>
        <template #header>
          <div class="card-title">
            <n-icon><ChecklistRtlOutlined /></n-icon>
            <span class="title">{{ t('同步范围') }}</span>
          </div>
        </template>

        <GroupBox
          :title="t('偏好设置')"
          title-background-color="var(--n-color-modal)"
        >

        </GroupBox>
      </n-card>
      <n-card size="small" embedded>
        <template #header>
          <div class="card-title">
            <n-icon><CloudOutlined /></n-icon>
            <span class="title">{{ t('开始同步') }}</span>
          </div>
        </template>

      </n-card>
    </div>
  </MyModal>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>