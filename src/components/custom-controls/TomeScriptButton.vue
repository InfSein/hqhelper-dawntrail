<script lang="ts" setup>
import { NButton } from 'naive-ui'
</script>

<template>
  <n-button class="ts-btn">
    <div class="w-full flex-column align-right">
      <p>{{ t('点数') }}</p>
      <p>x0</p>
    </div>
  </n-button>
</template>

<style scoped>
:deep(.n-button__content){
  width: 100%;
  height: 100%;
}
</style>