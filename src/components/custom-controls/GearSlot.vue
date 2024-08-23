<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NPopover
} from 'naive-ui'
import XivFARImage from './XivFARImage.vue'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

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
  <n-popover :trigger="isMobile ? 'click' : 'hover'" style="max-width: 300px;">
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