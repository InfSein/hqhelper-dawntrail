<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    @on-esc="handleCancel"
  >
    <div>
      <n-dialog
        type="warning"
        :title="title"
        :content="content"
        :closable="false"
        :negative-text="cancelText"
        :positive-text="confirmText"
        @positive-click="handleConfirm"
        @negative-click="handleCancel"
      />
      <KeyboardEventListener @keydown="handleKeyDownEvent"/>
    </div>
  </n-modal>
</template>
  
<script setup lang='ts'>
import KeyboardEventListener from '../keyboard-listener/KeyboardEventListener.vue'
  
const showModal = defineModel<boolean>('show')
defineProps({
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
    default: '取消 (Esc)'
  },
  confirmText: {
    type: String,
    default: '确定 (Enter)'
  }
})
const emit = defineEmits(['confirm', 'cancel'])

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
  
</style>