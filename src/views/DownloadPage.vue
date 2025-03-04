<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import {
  NBackTop, NButton,
  useMessage
} from 'naive-ui'
import { checkAppUpdates } from '@/tools'

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

const loading = ref(false)
const version = ref<string | undefined>(undefined)

onMounted(async () => {
  loading.value = true
  const checkUpdateResponse = await checkAppUpdates()
  if (checkUpdateResponse.success) {
    version.value = checkUpdateResponse.data!.electron
  } else {
    NAIVE_UI_MESSAGE.error(checkUpdateResponse.message)
  }
  loading.value = false
})

const downloadBtnText = computed(() => {
  return loading.value ? t('正在检测') : t('点击下载')
})
</script>

<template>
  <div id="main-container">
    <div class="slogan">
      <p>{{ t('HqHelper客户端') }}</p>
      <p>{{ t('当前版本：{ver}', version) }}</p>
      <n-button size="large" :loading="loading" :disabled="loading || !version">{{ downloadBtnText }}</n-button>
      <p>{{ t('※仅适用于 Windows 7 或更高版本') }}</p>
    </div>
    
    <n-back-top />
  </div>
</template>

<style scoped>
#main-container {
  width: 100%;
  height: 100%;

  .slogan {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    align-items: center;
    justify-content: center;
  }
}
</style>