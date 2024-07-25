<script setup lang="ts">
import { inject } from 'vue'
import {
  NBreadcrumb, NBreadcrumbItem, NCard, NIcon
} from 'naive-ui'
import {
  HomeOutlined
} from '@vicons/material'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

defineProps({
  pageName: {
    type: String,
    required: true
  },
  pageIcon: {
    type: Object as () => any,
    required: true
  }
})
</script>

<template>
  <n-card id="router-card" embedded :bordered="false">
    <div class="wrapper">
      <n-breadcrumb separator=">">
        <n-breadcrumb-item @click="$router.push('/')" :title="t('返回首页')">
          <n-icon :component="HomeOutlined" /> {{ t('主页' )}}
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <n-icon :component="pageIcon" /> {{ pageName }}
        </n-breadcrumb-item>
      </n-breadcrumb>
      <div class="tip-container">
        <p>{{ t('※ 您正处于HqHelper的子页面。') }}</p>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.tip-container {
  text-indent: 1em;
}
</style>