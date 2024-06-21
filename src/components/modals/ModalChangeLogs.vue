<script setup lang="ts">
import { inject } from 'vue'
import { EventNoteFilled, CloseSharp } from '@vicons/material'
//import ChangeLogContentEN from 'base/CHANGELOG.md'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })

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
      style="width: 98%; max-width: 600px;"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><EventNoteFilled /></n-icon>
          <span class="title">{{ t('更新日志') }}</span>
        </div>
      </template>

      <div class="wrapper"></div>
      
      <template #action>
        <div class="submit-container">
          <n-button type="error" size="large" @click="handleClose">
            <template #icon>
              <n-icon><CloseSharp /></n-icon>
            </template>
            {{ t('关闭') }}
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
/* All */
.wrapper {
  user-select: text;
}

/* Mobile only */
/* @media (max-width: 768px)*/
</style>