<script setup lang="ts">
import XivFARImage from './XivFARImage.vue'

defineProps({
  slotIconSrc: {
    type: String,
    required: true
  },
  slotDescription: {
    type: String,
    required: true
  }
})
</script>

<template>
  <n-popover trigger="hover" style="max-width: 300px;">
    <template #trigger>
      <div class="flex-center">
        <XivFARImage
          :src="slotIconSrc"
          :size="20"
        />
      </div>
    </template>
    <div class="flex-column flex-center">
      <p class="font-center">{{ slotDescription }}</p>
    </div>
  </n-popover>
</template>

<style scoped>
</style>