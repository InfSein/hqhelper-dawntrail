<script setup lang="ts">
import { computed, watch, type Component } from 'vue'
import {
  NButton, NCard, NIcon, NModal
} from 'naive-ui'
import {
  SettingsSharp,
  CloseOutlined
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
    'height: ' + (props.height ?? 'auto')
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
        </n-button>
        <n-button ref="closeButton" quaternary size="small" class="square-action" @click="handleClose">
          <n-icon><CloseOutlined /></n-icon>
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
.square-action {
  width: 24px;
  height: 24px;
  padding: 2px;
  font-size: 20px;
}
</style>