<script setup lang="ts" name="ErrorPage404">
import { computed, inject } from 'vue'
import {
  NButton, NResult
} from 'naive-ui'

const t = inject<(message: string, args?: any) => string>('t')!

const descriptions = computed(() => {
  return [
    t('err_404.page_not_exist'),
    t('err_404.advise')
  ]
})
</script>

<template>
  <div id="main-container" class="flex-center w-full h-full">
    <n-result status="404" title="404 NOT FOUND">
      <div>
        <p v-for="(description, index) in descriptions" :key="index">{{ description }}</p>
      </div>
      <template #footer>
        <div class="footer-container">
          <n-button @click="$router.go(-1)">{{ t('common.back_to_upper') }}</n-button>
          <n-button @click="$router.push('/')">{{ t('common.back_to_index') }}</n-button>
        </div>
      </template>
    </n-result>
  </div>
</template>

<style scoped>
.footer-container {
  display: flex;
  justify-content: center;
  
  .n-button {
    margin: 5px;
  }
}
</style>