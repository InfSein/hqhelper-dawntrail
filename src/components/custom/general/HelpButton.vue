<script setup lang="ts">
import { inject, ref, computed, type Ref } from 'vue'
import {
  NIcon, NPopover, NTooltip,
  type PopoverTrigger
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
  placement?: import("vueuc/lib/binder/src/interface").Placement,
  popTrigger?: PopoverTrigger,
  popType?: "popover" | "tooltip",
  descriptions?: string[]
}
const props = defineProps<HelpButtonProps>()

const icon = computed(() => {
  switch (props.icon) {
    case 'warning':
      return ErrorOutlineRound;
    case 'question':
      return HelpOutlineRound;
    case 'info':
    default:
      return InfoOutlined;
  }
})
const placement = computed(() => props.placement)
const popTrigger = computed(() => props.popTrigger ?? (isMobile.value ? 'click' : 'hover'))
const popType = computed(() => props.popType ?? 'tooltip')
</script>

<template>
  <n-tooltip v-if="popType === 'tooltip'" :trigger="popTrigger" :placement="placement" :style="isMobile ? 'max-width: 250px;' : ''">
    <template #trigger>
      <n-icon :component="icon" :size="size ?? 18" :color="color" style="display: flex;" />
    </template>
    <slot>
      <div class="descriptions">
        <div v-for="(desc, dIndex) in descriptions" :key="'desc-' + dIndex">{{ desc }}</div>
      </div>
    </slot>
  </n-tooltip>
  <n-popover v-else-if="popType === 'popover'" :trigger="popTrigger" :placement="placement" :style="isMobile ? 'max-width: 250px;' : ''">
    <template #trigger>
      <n-icon :component="icon" :size="size ?? 18" :color="color" style="display: flex;" />
    </template>
    <slot>
      <div class="descriptions">
        <div v-for="(desc, dIndex) in descriptions" :key="'desc-' + dIndex">{{ desc }}</div>
      </div>
    </slot>
  </n-popover>
</template>

<style scoped>
</style>