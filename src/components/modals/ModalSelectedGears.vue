<script setup lang="ts">
import { inject } from 'vue'
import { CheckroomSharp } from '@vicons/material'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const modelShow = defineModel<boolean>('show', { required: true })

const handleClose = () => {
  modelShow.value = false
}

const handleSave = () => {
  console.log('handleSave')
}
</script>

<template>
  <n-modal v-model:show="modelShow">
    <n-card
      closable
      role="dialog"
      class="no-select"
      style="width: 98%; max-width: 750px;"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><CheckroomSharp /></n-icon>
          <span class="title">{{ t('已选部件') }}</span>
        </div>
      </template>

      <div class="wrapper">
        <div class="weapons">
          <n-card size="small" :title="t('主副手')"></n-card>
        </div>
        <div class="subs">
          <div class="attires">
            <n-card size="small" :title="t('防具')"></n-card>
          </div>
          <div class="accessories">
            <n-card size="small" :title="t('首饰')"></n-card>
          </div>
        </div>
      </div>
      
      <template #action>
        <div class="submit-container">
          <n-button type="primary" size="large" @click="handleSave">
            <template #icon>
              <n-icon><SaveOutlined /></n-icon>
            </template>
            {{ t('保存') }}
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
/* All */
.wrapper {
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-gap: 10px;
}

.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile only */
@media (max-width: 768px) {
.wrapper {
    grid-template-columns: 1fr;
  }
}
</style>