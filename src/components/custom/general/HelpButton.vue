<script setup lang="ts">
import { inject, ref, type PropType, type Ref } from 'vue'
import {
  NIcon, NTooltip
} from 'naive-ui'
import {
  InfoOutlined,
  HelpOutlineRound,
  ErrorOutlineRound
} from '@vicons/material'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

defineProps({
  icon: {
    type: String as PropType<"info" | "question" | "warning">,
    default: 'info'
  },
  size: {
    type: Number,
    default: 18
  },
  descriptions: {
    type: Array as PropType<string[]>,
    default: () => []
  },
})
</script>

<template>
  <n-tooltip :trigger="isMobile ? 'click' : 'hover'" placement="top" :style="isMobile ? 'max-width: 250px;' : ''">
    <template #trigger>
      <n-icon size="18" style="display: flex;">
        <InfoOutlined v-if="icon === 'info'" />
        <HelpOutlineRound v-else-if="icon === 'question'" />
        <ErrorOutlineRound v-else-if="icon === 'warning'" />
      </n-icon>
    </template>
    <slot>
      <div class="descriptions">
        <div v-for="(desc, dIndex) in descriptions" :key="'desc-' + dIndex">{{ desc }}</div>
      </div>
    </slot>
  </n-tooltip>
</template>

<style scoped>
</style>