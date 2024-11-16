<script setup lang="ts">
import { computed, h, inject, ref, watch, type Ref } from 'vue'
import {
  NButton, NCard, NCheckbox, NIcon, NModal, NTree,
  useMessage,
  type TreeOption
} from 'naive-ui'
import { 
  CodeSharp, ContentCopyRound
} from '@vicons/material'
import GroupBox from '../custom-controls/GroupBox.vue'
import { XivJobs, type XivJob } from '@/assets/data'
import { type UserConfigModel } from '@/models/user-config'
import { CopyToClipboard } from '@/tools'
import type { ItemGroup } from '@/models/item'
import ItemSpan from '../custom-controls/ItemSpan.vue'
import type { AlarmMacroOptions } from '@/models/gather-clock'
import { getItemInfo, type ItemInfo } from '@/tools/item'

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const uiLanguage = computed(() => {
  return userConfig.value.language_ui
})
const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})
  
const showModal = defineModel<boolean>('show', { required: true })
const alarmMacroOptions = defineModel<AlarmMacroOptions>('options', { required: true })
const modalId = 'modal-alarm-macro-export'

interface ModalAlarmMacroExportProps {
  itemGroups: ItemGroup[]
}
const props = defineProps<ModalAlarmMacroExportProps>()

const wrapper = ref<HTMLElement>()

watch(showModal, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    //
  }
})

const itemTreeCheckedKeys = ref<number[]>([])
const handleItemTreeSelectedKeysUpdate = (keys: Array<string | number>) => {
  itemTreeCheckedKeys.value = []
  keys.forEach(key => {
    const itemId = parseInt(key as string)
    if (itemId && !itemTreeCheckedKeys.value.includes(itemId)) {
      itemTreeCheckedKeys.value.push(itemId)
    }
  })
}
const itemTreeData = computed(() => {
  const treeData : TreeOption[] = []
  const keys : string[] = []

  props.itemGroups.forEach(group => {
    if (['stars', 'subscribed'].includes(group.key)) {
      return // 重复的key会导致组件出问题，所以先把收藏/订阅给过滤掉
    }
    const groupKey = 'group-' + group.key
    const subTreeOption : TreeOption[] = []
    group.items.forEach(item => {
      const itemKey = item.id
      const itemSpan = () => h(ItemSpan, {
        itemInfo: item,
        containerId: modalId
      })
      subTreeOption.push({
        key: itemKey,
        label: '',
        prefix: itemSpan
      })
    })
    treeData.push({
      key: groupKey,
      label: group.title,
      children: subTreeOption
    })
    keys.push(groupKey)
  })

  return {
    treeData,
    keys
  }
})
const macro = computed(() => {
  let result : string[] = []
  if (alarmMacroOptions.value.clearOldAlarms) {
    result.push('/alarm clear')
  }
  let repeat = ' rp'
  if (alarmMacroOptions.value.noRepeat) repeat = ''
  itemTreeCheckedKeys.value.forEach(itemId => {
    const item = getItemInfo(itemId)
    let alarmName = getItemName(item)

    if (alarmMacroOptions.value.containsMapName) {
      alarmName = `${getPlaceName(item)}-${alarmName}`
    }
    if (alarmMacroOptions.value.containsAetheryteName) {
      alarmName = `${item.gatherInfo.recommAetheryte![`name_${itemLanguage.value}`]}-${alarmName}`
    }
    if (alarmMacroOptions.value.containsJobName) {
      alarmName = `${getJobName(XivJobs[item.gatherInfo.jobId])}-${alarmName}`
    }

    if (alarmName.length > 20) {
      alarmName = alarmName.slice(0, 20);  // 截取前20个字符
    }

    item.gatherInfo.timeLimitInfo.forEach(timeLimit => {
      const startET = timeLimit.start.replace(':', '')
      result.push(`/alarm "${alarmName}" et${repeat} ${startET} 0`)
    })
  })
  return result
})

const getItemName = (itemInfo: ItemInfo) => {
  switch (itemLanguage.value) {
    case 'ja':
      return itemInfo.nameJA
    case 'en':
      return itemInfo.nameEN
    case 'zh':
    default:
      return itemInfo.nameZH || '未翻译的物品'
  }
}
const getJobName = (jobInfo: XivJob) => {
  switch (uiLanguage.value) {
    case 'ja':
      return jobInfo?.job_name_ja || t('未知')
    case 'en':
      return jobInfo?.job_name_en || t('未知')
    case 'zh':
    default:
      return jobInfo?.job_name_zh || t('未知')
  }
}
const getPlaceName = (itemInfo : ItemInfo) => {
  switch (itemLanguage.value) {
    case 'ja':
      return itemInfo.gatherInfo?.placeNameJA
    case 'en':
      return itemInfo.gatherInfo?.placeNameEN
    case 'zh':
    default:
      return itemInfo.gatherInfo?.placeNameZH
  }
}

const handleCopy = async () => {
  const errored = await CopyToClipboard(macro.value.join('\n'), wrapper.value)
  if (errored) {
    NAIVE_UI_MESSAGE.error(t('复制失败，请手动框选预览区域内的文本复制'))
    return
  }
  handleClose()
  NAIVE_UI_MESSAGE.success(t('已复制到剪贴板'))
}
const handleClose = () => {
  showModal.value = false
}
</script>

<template>
  <n-modal v-model:show="showModal" :id="modalId">
    <n-card
      closable
      role="dialog"
      class="no-select"
      style="width: 98%; max-width: 650px;"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><CodeSharp /></n-icon>
          <span class="title">{{ t('导出闹钟宏') }}</span>
        </div>
      </template>

      <div class="wrapper" ref="wrapper">
        <GroupBox id="select-items" title-background-color="var(--n-color-modal)">
          <template #title>
            <span class="title">{{ t('选择物品') }}</span>
          </template>
          <n-tree
            block-line
            cascade
            checkable
            :selectable="false"
            :data="itemTreeData.treeData"
            :default-expanded-keys="itemTreeData.keys"
            :default-checked-keys="[]"
            @update:checked-keys="handleItemTreeSelectedKeysUpdate"
          />
        </GroupBox>
        <div id="right-container">
          <GroupBox id="export-settings" title-background-color="var(--n-color-modal)">
            <template #title>
              <span class="title">{{ t('选项') }}</span>
            </template>
            <div class="settings-container">
              <n-checkbox v-model:checked="alarmMacroOptions.clearOldAlarms">
                {{ t('同时清除此前设置的闹钟') }}
              </n-checkbox>
              <div class="flex">
                <div>{{ t('闹钟名包括：') }}</div>
                <n-checkbox v-model:checked="alarmMacroOptions.containsJobName">
                  {{ t('职业') }}
                </n-checkbox>
                <n-checkbox v-model:checked="alarmMacroOptions.containsMapName">
                  {{ t('地图名') }}
                </n-checkbox>
                <n-checkbox v-model:checked="alarmMacroOptions.containsAetheryteName">
                  {{ t('推荐传送点') }}
                </n-checkbox>
              </div>
              <n-checkbox v-model:checked="alarmMacroOptions.noRepeat">
                {{ t('不重复提醒') }}
              </n-checkbox>
            </div>
          </GroupBox>
          <GroupBox id="macro-preview" title-background-color="var(--n-color-modal)">
            <template #title>
              <span class="title">{{ t('预览') }}</span>
            </template>

            <div class="preview-container" v-html="macro.join('<br>')" />
          </GroupBox>
        </div>
      </div>

      <template #action>
        <div class="submit-container">
          <n-button type="primary" @click="handleCopy">
            <template #icon>
              <n-icon><ContentCopyRound /></n-icon>
            </template>
            {{ t('复制') }}
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
:deep(.n-card-header) {
  padding-bottom: 10px;
}
:deep(.n-card__action) {
  padding-top: 15px;
  padding-bottom: 15px;
}
:deep(.n-tree-node-wrapper) {
  padding: 0;
}
:deep(.n-tree-node-switcher--hide) {
  width: auto !important;
}
:deep(.n-checkbox__label) {
  padding: 0 4px;
}

/* All */
.wrapper {
  display: grid;
  grid-template-columns: 235px 1fr;
  gap: 10px;
  user-select: text;

  #right-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 15px;

    #export-settings {
      height: fit-content;
    }
    #macro-preview {
      flex: 1;
      .preview-container {
        max-width: 100%;
        max-height: 250px;
        overflow: auto;
      }
    }
  }

  #marco-preview {
    margin-top: 10px;

  }
  .settings-container {
    display: flex;
    flex-direction: column;
    margin-left: 0.6em;
  }
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile only */
/* @media (max-width: 768px)*/
</style>