<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NButton, NCard, NDivider, NFlex, NGradientText, NIcon, NModal, NPopover, NQrCode, NScrollbar, NTabs, NTabPane
} from 'naive-ui'
import {
  CloseSharp,
  UpdateSharp,
  VpnLockRound
} from '@vicons/material'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })

const proxyValue = ref('https://mirror.ghproxy.com')
const proxyOptions = [
  { label: t('不使用加速服务'), value: '' },
  { label: 'mirror.ghproxy.com', value: 'https://mirror.ghproxy.com' },
  { label: 'github.moeyy.xyz', value: 'https://github.moeyy.xyz' },
  { label: 'ghps.cc', value: 'https://ghps.cc' }
  // https://www.cnblogs.com/ting1/p/18356265
]

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
          <n-icon><UpdateSharp /></n-icon>
          <span class="title">{{ t('检查更新') }}</span>
        </div>
      </template>

      <div class="wrapper">
        <n-card size="small" embedded :bordered="false">
          <template #header>
            <div class="card-title-small">
              <n-icon><VpnLockRound /></n-icon>
              <span class="title">{{ t('加速服务') }}</span>
            </div>
          </template>

          <div class="tip-text">
          </div>
          <div class="proxy-actions">
            <n-button>{{ t('测速') }}</n-button>
          </div>
          <div class="proxy-selection-container">
            <div
              class="item"
              v-for="option in proxyOptions"
              :key="'proxy-' + option.value"
            >
              <n-radio
                name="proxy-option"
                :checked="proxyValue === option"
                :value="option"
                @change="handleProxyOptionChange"
              >
                {{ proxyValue.label }}
              </n-radio>
            </div>
          </div>
        </n-card>
      </div>
      
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
:deep(.qgroup-qrcode canvas) {
  /* The size of canvas in `n-qr-code` is wrong. So it is nececssary to override it. */
  width: 86px !important;
  height: 86px !important;
}
:deep(.n-divider:not(.n-divider--vertical)) {
  /* Reduce the margin of `n-divider` (default is 24px) */
  margin-top: 12px;
  margin-bottom: 12px;
}
:deep(.n-gradient-text) {
  /* Set display from `inline-block` to `inline` to prevent `text-indent` lose its effect. */
  display: inline;
}
.item {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .title {
    font-size: 21px;
    display: flex;
    gap: 10px;
    line-height: 29px;
  }
  .content {
    text-indent: 2em;
  }
  /*.tail {
    display: flex;
    flex-direction: row-reverse;
  }*/
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