<script setup lang="ts">
import { computed, watch, type Component } from 'vue'
import {
  NButton, NCard, NIcon, NModal
} from 'naive-ui'
import {
  SettingsSharp
} from '@vicons/material'

// const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const showModal = defineModel<boolean>('show', { required: true })
interface MyModalProps {
  /** 模态框标题图标。 */
  icon?: Component
  /** 模态框标题文本。 */
  title?: string
  /** 代表这是一个功能弹窗，并且可以关联到 `功能设置` 中的选项卡。 */
  showSetting?: boolean
  /** 控制模态框标题的 `padding` 属性。 */
  headerPadding?: string
  /** 控制模态框内容的 `padding` 属性。 */
  contentPadding?: string
  /** 控制模态框容器的最大宽度。默认为 `600px`。 */
  maxWidth?: string
  /** 控制模态框容器的高度。默认为 `auto`。 */
  height?: string
  /** 控制模态框容器的额外样式。 */
  extraStyle?: string
  /** 控制内容样式。 */
  contentStyle?: string
}
const props = defineProps<MyModalProps>()
const emit = defineEmits([
  'onLoad',
  'onSettingButtonClicked'
])

watch(showModal, async (newVal, oldVal) => {
  if (newVal && !oldVal) {
    emit('onLoad')
  }
})

const containerStyle = computed(() => {
  let builtStyle = [
    'max-width: ' + (props.maxWidth ?? '600px'),
    'height: ' + (props.height ?? 'auto'),
    '--header-padding: ' + (props.headerPadding ?? 'var(--n-padding-top) var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left)'),
    '--content-padding: ' + (props.contentPadding ?? '0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left)')
  ].join('; ')
  if (props.extraStyle) {
    builtStyle += '; ' + props.extraStyle
  }
  return builtStyle
})

const handleShowFuncPreference = () => {
  emit('onSettingButtonClicked')
}
const handleClose = () => {
  showModal.value = false
}
</script>

<template>
  <n-modal v-model:show="showModal">
    <n-card
      role="dialog"
      class="no-select"
      style="width: 98%;"
      :style="containerStyle"
      :content-style="contentStyle"
      closable
      @close="handleClose"
    >
      <template #header>
        <slot name="header">
          <div class="card-title">
            <n-icon v-if="!!icon" :component="icon" />
            <span class="title">{{ title }}</span>
          </div>
        </slot>
      </template>

      <template #header-extra>
        <n-button v-if="showSetting" quaternary size="small" class="square-action" @click="handleShowFuncPreference">
          <n-icon><SettingsSharp /></n-icon>
          <div class="unshow-text">{{ t('设置') }}</div>
        </n-button>
      </template>

      <slot />

      <template #action>
        <slot name="action">
        </slot>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
:deep(.n-card-header) {
  padding: var(--header-padding);
}
:deep(.n-card__content) {
  padding: var(--content-padding);
}

.square-action {
  width: 22px;
  height: 22px;
  padding: 2px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
  transition: width 0.3s ease;

  .unshow-text {
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
}
.square-action:hover {
  width: auto;
  
  .unshow-text {
    opacity: 1;
  }
}
</style>