<script setup lang="ts">
import { inject } from 'vue';

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
</script>

<template>
  <n-card :title="t('按职能选择')" embedded :bordered="false">
  </n-card>
</template>

<style scoped>
</style>