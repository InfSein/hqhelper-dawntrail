<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NIcon, NTooltip
} from 'naive-ui'
import {
  InfoOutlined,
  HelpOutlineRound,
  ErrorOutlineRound
} from '@vicons/material'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface HelpButtonProps {
  icon: "info" | "question" | "warning"
  color?: string,
  size?: number,
  descriptions?: string[]
}
defineProps<HelpButtonProps>()
</script>

<template>
  <n-tooltip :trigger="isMobile ? 'click' : 'hover'" placement="top" :style="isMobile ? 'max-width: 250px;' : ''">
    <template #trigger>
      <n-icon :size="size ?? 18" :color="color" style="display: flex;">
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