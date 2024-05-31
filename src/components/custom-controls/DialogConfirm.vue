<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    @on-esc="handleCancel"
  >
    <n-card size="small" style="width: 88%; max-width: 400px;">
      <template #header>
        <div class="dialog-title">
          <component :is="getIcon()" />
          {{ title }}
        </div>
      </template>

      <div class="dialog-content">{{ content }}</div>

      <div class="button-container">
          <n-button-group>
            <n-button secondary @click="handleCancel">{{ cancelText }}</n-button>
            <n-button strong type="primary" @click="handleConfirm">{{ confirmText }}</n-button>
          </n-button-group>
        </div>
      
      <KeyboardEventListener @keydown="handleKeyDownEvent"/>
    </n-card>
  </n-modal>
</template>
  
<script setup lang='ts'>
import type { PropType } from 'vue'
import IconInfo from '@/assets/icons/IconInfo.vue'
import IconError from '@/assets/icons/IconError.vue'
import IconSuccess from '@/assets/icons/IconSuccess.vue'
import IconWarning from '@/assets/icons/IconWarning.vue'
import KeyboardEventListener from '../keyboard-listener/KeyboardEventListener.vue'
  
const showModal = defineModel<boolean>('show', { required: true })
const props = defineProps({
  type: {
    type: String as PropType<'info' | 'success' | 'error' | 'warning'>,
    default: 'warning'
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmText: {
    type: String,
    default: 'OK'
  }
})
const emit = defineEmits(['confirm', 'cancel'])

const getIcon = () => {
  switch (props.type) {
    case 'error':
      return IconError
    case 'success':
      return IconSuccess
    case 'info':
      return IconInfo
  }
  return IconWarning // default
}

const handleKeyDownEvent = (event: KeyboardEvent) => {
  if (!showModal.value) return
  if (event.key === 'Escape') {
    handleCancel()
  } else if (event.key === 'Enter') {
    handleConfirm()
  }
}

const handleCancel = () => {
  emit('cancel')
  showModal.value = false
}

const handleConfirm = () => {
  emit('confirm')
  showModal.value = false
}
</script>
  
<style scoped>
.dialog-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;

  i {
    margin-right: 4px;
  }
}
.button-container {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 14px;

  .n-button-group {
    width: 100%;
    height: 100%;

    .n-button {
      width: 50%;
      height: 100%;
    }
  }
}
</style>