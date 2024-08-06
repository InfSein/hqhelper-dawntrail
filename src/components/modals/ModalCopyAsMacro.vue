<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NCheckbox, NCard, NIcon, NModal, NSelect,
  useMessage
} from 'naive-ui'
import { 
  CodeSharp, ContentCopyRound
} from '@vicons/material'
import { type UserConfigModel } from '@/models/user-config'

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
  
const showModal = defineModel<boolean>('show', { required: true })

const props = defineProps({
  macroContent: {
    type: String,
    required: true
  }
})

const macroPrefix = ref('')
const noMoreInquiries = ref(false)

const prefixOptions = [
  { value: '', label: t('直接复制(无前缀)') },
  { value: '/e ', label: t('自提醒宏(/e)') },
  { value: '/p ', label: t('小队宏(/p)') },
  { value: '/fc ', label: t('部队宏(/fc)') },
  { value: '/b ', label: t('新频宏(/b)') },
]

const macro = computed(() => {
  return macroPrefix.value + props.macroContent
})

const handleCopy = () => {
  navigator.clipboard.writeText(macro.value)
  if (noMoreInquiries.value) {
    // todo
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
  <n-modal v-model:show="showModal">
    <n-card
      closable
      role="dialog"
      class="no-select"
      style="width: 98%; max-width: 300px;"
      :style="{ height: isMobile ? '350px' : '270px' }"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><CodeSharp /></n-icon>
          <span class="title">{{ t('复制宏') }}</span>
        </div>
      </template>

      <div class="wrapper">
        <div class="marco-preview">
          {{ macro }}
        </div>
        <n-select
          v-model:value="macroPrefix"
          :options="prefixOptions"
          :style="{ width: '100%' }"
          placeholder="请选择宏前缀"
        />
        <n-checkbox v-model:checked="noMoreInquiries">
          {{ t('以后不再询问，直接复制') }}
        </n-checkbox>
      </div>

      <template #action>
        <div class="submit-container">
          <n-button type="primary" size="large" @click="handleCopy">
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
/* All */
.wrapper {
  display: flex;
  flex-direction: column;
  user-select: text;
  overflow-y: auto;

}
.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile only */
/* @media (max-width: 768px)*/
</style>