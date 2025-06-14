<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NCheckbox, NInputGroup, NInputGroupLabel, NSelect,
  useMessage
} from 'naive-ui'
import { 
  CodeSharp, ContentCopyRound
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import MacroViewer from '../custom/macro/MacroViewer.vue'
import TooltipButton from '@/components/custom/general/TooltipButton.vue'
// import ModalPreferences from './ModalPreferences.vue'
import { CopyToClipboard } from '@/tools'
import { useStore } from '@/store'
import { fixFuncConfig, type FuncConfigModel, type MacroGenerateMode } from '@/models/config-func'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
  
const showModal = defineModel<boolean>('show', { required: true })

interface ModalCopyAsMacroProps {
  macroMap: Record<MacroGenerateMode, string>;
}
const props = defineProps<ModalCopyAsMacroProps>()

const wrapper = ref<HTMLElement>()
const macroPrefix = ref('')
const macroMode = ref<MacroGenerateMode>('singleLine')
const noMoreInquiries = ref(false)

const prefixOptions = [
  { value: '', label: t('直接复制(无前缀)') },
  { value: '/e ', label: t('自提醒宏(/e)') },
  { value: '/p ', label: t('小队宏(/p)') },
  { value: '/fc ', label: t('部队宏(/fc)') },
  { value: '/b ', label: t('新频宏(/b)') },
]
const modeOptions = [
  { value: 'singleLine', label: t('单行模式') },
  { value: 'multiLine', label: t('多行模式') },
]

const onLoad = () => {
  macroPrefix.value = funcConfig.value.macro_copy_prefix
  macroMode.value = funcConfig.value.macro_generate_mode
}

const macroContent = computed(() => {
  return props.macroMap[macroMode.value]
})
const macroLines = computed(() => {
  return macroContent.value.split('\n').map(line => macroPrefix.value + line)
})
const macro = computed(() => {
  return macroLines.value.join('\n')
})
const macroColor = computed(() => {
  switch (macroPrefix.value) {
    case '/e ': return '#7E7E7E' // 默语
    case '/p ': return '#69E6FF' // 小队
    case '/fc ': return '#ADDCE6' // 部队
    case '/b ': return '#ADD74A' // 新频
    default: return ''
  }
})
const macroContentStyle = computed(() => {
  const styles = [
    'max-height: 200px;',
    'overflow-y: auto;'
  ]
  if (macroColor.value) {
    styles.push(`color: ${macroColor.value};`)
  }

  return styles.join(' ')
})

const copyBtnTooltip = computed(() => {
  if (macroMode.value === 'singleLine') {
    return [
      t('目前为单行模式'),
      t('复制的宏可以直接粘贴在游戏内聊天框中发送'),
    ]
  } else {
    return [
      t('目前为多行模式'),
      t('复制的宏需要粘贴在用户宏中执行方可发送'),
    ]
  }
})
const handleCopy = async () => {
  const errored = await CopyToClipboard(macro.value, wrapper.value)
  if (errored) {
    NAIVE_UI_MESSAGE.error(t('复制失败，请手动框选预览区域内的文本复制'))
    return
  }
  if (noMoreInquiries.value) {
    const newConfig = fixFuncConfig(store.state.funcConfig, store.state.userConfig)
    newConfig.macro_direct_copy = true
    newConfig.macro_copy_prefix = macroPrefix.value
    newConfig.macro_generate_mode = macroMode.value
    store.commit('setFuncConfig', newConfig)
  }
  handleClose()
  NAIVE_UI_MESSAGE.success(t('已复制到剪贴板'))
}
const handleClose = () => {
  showModal.value = false
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="CodeSharp"
    :title="t('复制宏')"
    max-width="350px"
    @on-load="onLoad"
  >
    <div class="wrapper" ref="wrapper">
      <GroupBox id="marco-preview" title-background-color="var(--n-color-modal)" :content-style="macroContentStyle">
        <template #title>
          <span class="title">{{ t('预览') }}</span>
        </template>
        <div v-if="macroMode === 'singleLine'">{{ macro }}</div>
        <MacroViewer
          v-else
          :macro-lines="macroLines"
          hide-tabs
          hide-copy-button
        />
      </GroupBox>
      <GroupBox id="marco-settings" title-background-color="var(--n-color-modal)">
        <template #title>
          <span class="title">{{ t('选项') }}</span>
        </template>
        <div class="settings-container">
          <n-input-group>
            <n-input-group-label size="small">{{ t('前缀') }}</n-input-group-label>
            <n-select size="small"
              v-model:value="macroPrefix"
              :options="prefixOptions"
              :placeholder="t('请选择宏前缀')"
            />
          </n-input-group>
          <n-input-group>
            <n-input-group-label size="small">{{ t('模式') }}</n-input-group-label>
            <n-select size="small"
              v-model:value="macroMode"
              :options="modeOptions"
              :placeholder="t('请选择宏生成模式')"
            />
          </n-input-group>
          <n-checkbox v-model:checked="noMoreInquiries">
            {{ t('以后不再询问，直接复制') }}
          </n-checkbox>
        </div>
      </GroupBox>
    </div>

    <template #action>
      <div class="modal-submit-container">
        <TooltipButton
          type="primary"
          :icon="ContentCopyRound"
          :text="t('复制')"
          :tip="copyBtnTooltip"
          placement="bottom"
          @click="handleCopy"
        />
      </div>
    </template>

    <!-- <ModalPreferences
      v-model:show="showPreferencesModal"
      setting-group="copy_macro"
      app-show-fp
    /> -->
  </MyModal>
</template>

<style scoped>
:deep(.n-card-header) {
  padding-bottom: 10px;
}
:deep(.n-card__action) {
  padding-top: 15px;
  padding-bottom: 15px;
}

/* All */
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  user-select: text;

  #marco-preview {
    margin-top: 10px;

    .group-box-content {
      max-height: 300px;
      overflow-y: auto;
    }
  }
  .settings-container {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
}

/* Mobile only */
/* .app-mobile*/
</style>