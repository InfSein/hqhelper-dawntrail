<script setup lang="ts">
import { inject } from 'vue'
import { LocalLibrarySharp, CloseSharp } from '@vicons/material'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const modelShow = defineModel<boolean>('show', { required: true })

const handleClose = () => {
  modelShow.value = false
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
          <n-icon><LocalLibrarySharp /></n-icon>
          <span class="title">{{ t('联系我们') }}</span>
        </div>
      </template>

      <n-flex justify="center" class="wrapper">
        <div id="qq" class="contact-container">
          <n-button class="huge-square-button" />
        </div>
        <div id="weibo" class="contact-container">
          <n-button class="huge-square-button" />
        </div>
        <div id="twitter" class="contact-container">
          <n-button class="huge-square-button" />
        </div>
      </n-flex>
      
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
  /*display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;*/

  .contact-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.huge-square-button {
  width: 50px;
  height: 50px;
}

.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile only */
/* @media (max-width: 768px) {
.wrapper {
    grid-template-columns: 1fr;
  }
} */
</style>