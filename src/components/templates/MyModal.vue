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
  contentExtraStyle?: string
  /** 控制 `extra-header` 区域的按钮。 */
  extraHeaderButtons?: {
    text: string
    icon: Component
    onClick: (...args: any[]) => void
  }[]
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
    'height: ' + (props.height ?? 'auto')
  ].join('; ')
  if (props.extraStyle) {
    builtStyle += '; ' + props.extraStyle
  }
  return builtStyle
})
const headerStyle = computed(() => {
  return [
    props.headerPadding ? `padding: ${props.headerPadding}` : ''
  ].join('; ')
})
const contentStyle = computed(() => {
  let builtStyle = [
    props.contentPadding ? `padding: ${props.contentPadding}` : ''
  ].join('; ')
  if (props.contentExtraStyle) {
    builtStyle += '; ' + props.contentExtraStyle
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
      style="width: 98%;"
      :style="containerStyle"
      :header-style="headerStyle"
      :content-style="contentStyle"
      closable
      @close="handleClose"
    >
      <template #header>
        <slot name="header">
          <div class="card-title no-select">
            <n-icon v-if="!!icon" :component="icon" />
            <span class="title">{{ title }}</span>
          </div>
        </slot>
      </template>

      <template #header-extra>
        <div class="extra-header-container">
          <n-button
            v-for="(btn, btnIndex) in extraHeaderButtons"
            :key="btnIndex"
            quaternary size="small"
            class="square-action"
            @click="btn.onClick"
          >
            <n-icon :component="btn.icon" />
            <div class="unshow-text">{{ btn.text }}</div>
          </n-button>
          <n-button v-if="showSetting" quaternary size="small" class="square-action" @click="handleShowFuncPreference">
            <n-icon><SettingsSharp /></n-icon>
            <div class="unshow-text">{{ t('设置') }}</div>
          </n-button>
        </div>
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
.extra-header-container {
  display: flex;
  align-items: center;

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
}
</style>