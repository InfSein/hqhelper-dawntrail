<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import {
  NButton, NCheckbox, NIcon, NSelect,
  useMessage
} from 'naive-ui'
import { 
  CodeSharp, ContentCopyRound
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../custom-controls/GroupBox.vue'
import { fixUserConfig, type UserConfigModel } from '@/models/user-config'
import { CopyToClipboard } from '@/tools'
import { useStore } from '@/store'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
  
const showModal = defineModel<boolean>('show', { required: true })

const props = defineProps({
  macroContent: {
    type: String,
    required: true
  }
})

const wrapper = ref<HTMLElement>()
const macroPrefix = ref('')
const noMoreInquiries = ref(false)

const prefixOptions = [
  { value: '', label: t('直接复制(无前缀)') },
  { value: '/e ', label: t('自提醒宏(/e)') },
  { value: '/p ', label: t('小队宏(/p)') },
  { value: '/fc ', label: t('部队宏(/fc)') },
  { value: '/b ', label: t('新频宏(/b)') },
]

watch(showModal, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    macroPrefix.value = userConfig.value.macro_copy_prefix
  }
})

const macro = computed(() => {
  return macroPrefix.value + props.macroContent
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

const handleCopy = async () => {
  const errored = await CopyToClipboard(macro.value, wrapper.value)
  if (errored) {
    NAIVE_UI_MESSAGE.error(t('复制失败，请手动框选预览区域内的文本复制'))
    return
  }
  if (noMoreInquiries.value) {
    const newConfig = fixUserConfig(store.state.userConfig)
    newConfig.macro_direct_copy = true
    newConfig.macro_copy_prefix = macroPrefix.value
    store.commit('setUserConfig', newConfig)
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
  >
    <div class="wrapper" ref="wrapper">
      <GroupBox id="marco-preview" title-background-color="var(--n-color-modal)" :content-style="macroContentStyle">
        <template #title>
          <span class="title">{{ t('预览') }}</span>
        </template>
        {{ macro }}
      </GroupBox>
      <GroupBox id="marco-settings" title-background-color="var(--n-color-modal)">
        <template #title>
          <span class="title">{{ t('选项') }}</span>
        </template>
        <div class="settings-container">
          <n-select
            size="small"
            v-model:value="macroPrefix"
            :options="prefixOptions"
            :style="{ width: '100%' }"
            placeholder="请选择宏前缀"
          />
          <n-checkbox v-model:checked="noMoreInquiries">
            {{ t('以后不再询问，直接复制') }}
          </n-checkbox>
        </div>
      </GroupBox>
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
.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile only */
/* @media (max-width: 768px)*/
</style>