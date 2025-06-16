<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NCard, NCheckbox, NIcon, NSpin,
  useMessage,
} from 'naive-ui'
import { 
  CloudSyncOutlined,
  ChecklistRtlOutlined,
  CloudOutlined,
  CloudDownloadRound, CloudUploadRound,
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import { useStore } from '@/store'
import { type CloudConfigModel } from '@/models/config-cloud'
import { HqList, type ResdataGetList } from '@/models/nbb-cloud'
import { useNbbCloud } from '@/tools/nbb-cloud'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const cloudConfig = inject<Ref<CloudConfigModel>>('cloudConfig')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const {
  getList, addList, editList,
  resolveListTitle,
} = useNbbCloud(cloudConfig)

const showModal = defineModel<boolean>('show', { required: true })

interface ModalCloudSyncProps {
}
const props = defineProps<ModalCloudSyncProps>()

const cloudLists = ref<Record<HqList, CloudList>>()
const syncRange = ref<Record<HqList, boolean>>(
  Object.values(HqList)
    .filter((v): v is HqList => typeof v === 'number')
    .reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {} as Record<HqList, boolean>)
)
const loading = ref(false)
const syncing = ref(false)

const onLoad = () => {
  loadLists()
}

interface CloudList {
  load_succeed: boolean
  last_update: number
  content: string
}

const loadLists = async () => {
  loading.value = true

  const clists = {} as Record<HqList, CloudList>
  const listTypes = Object.values(HqList).filter((v): v is HqList => typeof v === 'number')
  for (const tp of listTypes) {
    const response = await getList(tp)
    const load_succeed = !response.errno
    let last_update = 0, content = ''
    if (load_succeed) {
      if (!Array.isArray(response.data)) {
        const { lastUpdateTime } = resolveListTitle(response.data.desc)
        last_update = lastUpdateTime
        content = response.data.content
      }
    }
    clists[tp] = {
      load_succeed, last_update, content,
    }
  }
  cloudLists.value = clists

  loading.value = false
}

const syncRangeGroups = computed(() => {
  return [
    {
      key: 'preferences',
      title: t('偏好设置'),
      children: [
        {
          value: HqList.ConfigBackupUserConfig,
          label: t('基础设置'),
        },
        {
          value: HqList.ConfigBackupFuncConfig,
          label: t('功能设置'),
        },
        {
          value: HqList.DataBackupInventory,
          label: t('背包库存'),
        },
      ]
    },
    {
      key: 'workstates',
      title: t('工作状态'),
      children: [
        {
          value: HqList.WorkstateBackupMain,
          label: t('主界面'),
        },
        {
          value: HqList.WorkstateBackupGatherClock,
          label: t('采集时钟'),
        },
        {
          value: HqList.WorkstateBackupFtHelper,
          label: t('食药计算器'),
        },
        {
          value: HqList.WorkstateBackupWorkflow,
          label: t('工作流'),
        },
        {
          value: HqList.WorkstateBackupMacromanage,
          label: t('生产宏管理'),
        },
      ]
    },
  ]
})
const syncTypeLabelMap = computed(() => {
  const map = {} as Record<HqList, string>
  syncRangeGroups.value.forEach(group => {
    group.children.forEach(child => {
      map[child.value] = child.label
    })
  })
  return map
})
const syncTargets = computed(() =>
  Object.values(HqList)
    .filter((v): v is HqList => typeof v === 'number')
    .filter(listtype => syncRange.value[listtype])
)

const getUpdateTimeText = (time: number) => {
  if (time) {
    return t('上次上传：{time}', new Date(time).toLocaleString())
  }
  return t('还未上传')
}

const handleUpload = async () => {}
const handleDownload = async () => {
  syncing.value = true

  const getfailedLabels = syncTargets.value
    .filter(target => !cloudLists.value?.[target]?.load_succeed)
    .map(target => syncTypeLabelMap.value[target])
  if (getfailedLabels.length) {
    alert(
      t('同步无法进行，因为以下模块的数据加载失败：') + '\n'
      + '-> ' + getfailedLabels.join(', ') + '\n'
      + t('请考虑刷新页面以重试。')
    )
    syncing.value = false
    return
  }

  const novalLabels = syncTargets.value
    .filter(target => !cloudLists.value?.[target]?.last_update)
    .map(target => syncTypeLabelMap.value[target])
  if (novalLabels.length) {
    alert(
      t('同步无法进行，因为以下模块还没有上传过数据：') + '\n'
      + '-> ' + novalLabels.join(', ') + '\n'
      + t('请先上传数据。')
    )
    syncing.value = false
    return
  }
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
    <n-spin :show="loading">
      <div class="wrapper">
        <n-card size="small" embedded>
          <template #header>
            <div class="card-title">
              <n-icon><ChecklistRtlOutlined /></n-icon>
              <span class="title">{{ t('同步范围') }}</span>
            </div>
          </template>

          <div class="sync-range-wrapper">
            <GroupBox
              v-for="group in syncRangeGroups"
              :key="group.key"
              :title="group.title"
              title-background-color="var(--n-color-embedded-modal)"
            >
              <div class="sync-range-container">
                <div
                  v-for="item in group.children"
                  :key="`syncrange-${item.value}`"
                  class="item"
                >
                  <n-checkbox v-model:checked="syncRange[item.value]">
                    {{ item.label }}
                  </n-checkbox>
                  <div class="desc">
                    <div v-if="loading" class="text">{{ t('加载中……') }}</div>
                    <div v-else-if="!cloudLists?.[item.value]?.load_succeed" class="text error">{{ t('加载失败') }}</div>
                    <div v-else class="text">{{ getUpdateTimeText(cloudLists[item.value].last_update) }}</div>
                  </div>
                </div>
              </div>
            </GroupBox>
          </div>
        </n-card>
        <n-card size="small" embedded>
          <template #header>
            <div class="card-title">
              <n-icon><CloudOutlined /></n-icon>
              <span class="title">{{ t('开始同步') }}</span>
            </div>
          </template>

          <div class="start-sync-wrapper">
            <n-button text :loading="syncing" :disabled="syncing" @click="handleUpload">
              <div class="sync-button-container">
                <n-icon :size="48"><CloudUploadRound /></n-icon>
                {{ t('将本地数据上传到云端') }}
              </div>
            </n-button>
            <n-button text :loading="syncing" :disabled="syncing" @click="handleDownload">
              <div class="sync-button-container">
                <n-icon :size="48"><CloudDownloadRound /></n-icon>
                {{ t('将云端数据下载到本地') }}
              </div>
            </n-button>
          </div>
        </n-card>
      </div>
    </n-spin>
  </MyModal>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;

  .sync-range-wrapper {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 10px;

    .sync-range-container {
      display: flex;
      flex-direction: column;
      gap: 5px;

      .desc>.text {
        line-height: 1;
        font-size: 12px;
        padding-left: 2em;
      }
    }
  }
  .start-sync-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2em 6em;

    .sync-button-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}
.text.error {
  color: var(--color-error);
}
</style>