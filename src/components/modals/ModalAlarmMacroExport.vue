<script setup lang="ts">
import { computed, h, inject, ref, type Ref } from 'vue'
import {
  NCheckbox, NIcon, NPopover, NTree,
  type TreeOption
} from 'naive-ui'
import { 
  CodeSharp,
  HelpOutlineRound
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import ItemSpan from '../custom/item/ItemSpan.vue'
import MacroViewer from '../custom/macro/MacroViewer.vue'
import { XivJobs, type XivJob } from '@/assets/data'
import { type UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'
import UseConfig from '@/tools/use-config'
import type { ItemGroup } from '@/models/item'
import type { AlarmMacroOptions } from '@/models/gather-clock'
import { getItemInfo, type ItemInfo } from '@/tools/item'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const {
  uiLanguage, itemLanguage,
} = UseConfig(userConfig, funcConfig)

const showModal = defineModel<boolean>('show', { required: true })
const alarmMacroOptions = defineModel<AlarmMacroOptions>('options', { required: true })
const modalId = 'modal-alarm-macro-export'

interface ModalAlarmMacroExportProps {
  itemGroups: ItemGroup[]
}
const props = defineProps<ModalAlarmMacroExportProps>()

const wrapper = ref<HTMLElement>()

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
        containerId: modalId,
        spanMaxWidth: '160px',
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
  let repeat = ' repeat'
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
    case 'zh':
      return itemInfo.name_zh || '未翻译的物品'
    default:
      return itemInfo[`name_${itemLanguage.value}`]
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
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :id="modalId"
    :icon="CodeSharp"
    :title="t('导出闹钟宏')"
    max-width="730px"
  >
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
              <div style="min-width: fit-content;">{{ t('闹钟名包括：') }}</div>
              <div class="flex-wrap">
                <n-checkbox v-model:checked="alarmMacroOptions.containsJobName">
                  {{ t('职业') }}
                </n-checkbox>
                <n-checkbox v-model:checked="alarmMacroOptions.containsMapName">
                  {{ t('地图') }}
                </n-checkbox>
                <n-checkbox v-model:checked="alarmMacroOptions.containsAetheryteName">
                  {{ t('推荐传送点') }}
                </n-checkbox>
                <n-popover :trigger="isMobile ? 'click' : 'hover'">
                  <template #trigger>
                    <div style="min-width: fit-content; display: flex; align-items: center;">
                      <n-icon :size="14" style="display: flex;">
                        <HelpOutlineRound />
                      </n-icon>
                    </div>
                  </template>
                  <div>
                    {{ t('闹钟名具有20个字的限制，过长的部分会被截断。') }}
                  </div>
                </n-popover>
              </div>
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

          <MacroViewer
            class="preview-container"
            :macro-lines="macro"
            content-height="190px"
            :container-id="modalId"
          />
        </GroupBox>
      </div>
    </div>
  </MyModal>
</template>

<style scoped>
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
  grid-template-columns: 265px 1fr;
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
        margin: 0.6em;
        padding-right: 0.6em;
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

/* Mobile */
@media (max-width: 768px) {
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-top: 15px;
    max-height: 500px;
    overflow-y: auto;
  }
}
</style>