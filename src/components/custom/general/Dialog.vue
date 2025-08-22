<script setup lang="ts">
import { ref, type VNodeChild } from "vue"
import {
  NButton, NDialog
} from "naive-ui"

export interface InternalDialogOptions {
  id: number
  title: string | (() => VNodeChild)
  content: string | (() => VNodeChild)
  type: "error" | "success" | "warning" | "info"
  closable: boolean
  positiveText?: string
  negativeText?: string
  onPositiveClick?: () => void
  onNegativeClick?: () => void
}

const dialogs = ref<InternalDialogOptions[]>([])
let idCounter = 0

function openDialog(options: Omit<InternalDialogOptions, "id">) {
  const id = ++idCounter
  dialogs.value.push({ ...options, id })
  return id
}

function closeDialog(id: number) {
  dialogs.value = dialogs.value.filter(d => d.id !== id)
}

defineExpose({
  openDialog,
  closeDialog,
})
</script>

<template>
  <div>
    <transition-group name="fade" tag="div">
      <div
        v-for="dialog in dialogs"
        :key="dialog.id"
        class="dialog-mask"
        @click="() => { 
          if (dialog.negativeText) {
            dialog.onNegativeClick?.()
            closeDialog(dialog.id)
          }
        }"
      >
        <div class="dialog-container" @click.stop>
          <n-dialog
            :title="dialog.title"
            :content="dialog.content"
            :closable="dialog.closable"
            :type="dialog.type"
            style="border-radius: initial; padding: 20px 28px 16px 28px;"
          ></n-dialog>
          <div class="dialog-footer">
            <n-button
              v-if="dialog.negativeText"
              ghost
              class="dialog-button"
              @click="() => { dialog.onNegativeClick?.(); closeDialog(dialog.id) }"
            >
              {{ dialog.negativeText }}
            </n-button>
            <n-button
              :type="dialog.type"
              class="dialog-button"
              @click="() => { dialog.onPositiveClick?.(); closeDialog(dialog.id) }"
            >
              {{ dialog.positiveText || 'OK' }}
            </n-button>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
:deep(.n-dialog__content) {
  white-space: pre-line;
}

.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-container {
  width: 420px;
  border-radius: 4px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.25);
  overflow: hidden;
  animation: fadeInUp 0.2s ease-out;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 16px;
  background: var(--color-background-action);
  border-top: 1px solid var(--color-border);

  .dialog-button {
    min-width: 90px;
    height: 30px;
    border-radius: 4px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
