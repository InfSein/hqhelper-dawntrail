<template>
  <div id="main-container" class="flex-center w-full h-full">
    <n-result status="404" title="404 NOT FOUND">
      <div>
        <p v-for="(description, index) in descriptions" :key="index">{{ description }}</p>
      </div>
      <template #footer>
        <div class="footer-container">
          <n-button @click="$router.go(-1)">{{ t('返回上一页') }}</n-button>
          <n-button @click="$router.push('/')">{{ t('返回首页') }}</n-button>
        </div>
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts" name="ErrorPage404">
import { computed, inject } from 'vue'
import {
  NButton, NResult
} from 'naive-ui'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

const descriptions = computed(() => {
  return [
    t('访问的页面不存在。'),
    t('请尝试回到上一页或直接返回首页。')
  ]
})
</script>

<style scoped>
.footer-container {
  display: flex;
  justify-content: center;
  
  .n-button {
    margin: 5px;
  }
}
</style>