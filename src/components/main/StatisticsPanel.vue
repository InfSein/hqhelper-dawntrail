<script setup lang='ts'>
import { ref, inject } from 'vue'
import FoldableCard from '../custom-controls/FoldableCard.vue'
  
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
</script>

<template>
  <FoldableCard card-key="main-statistics">
    <template #header>
      <i class="xiv square-4"></i>
      <span class="card-title-text">{{ t('查看统计') }}</span>
    </template>
    <div />
  </FoldableCard>
</template>
  
<style scoped>
  
</style>