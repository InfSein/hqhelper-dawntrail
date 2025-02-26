<script setup lang="ts">
import { inject, ref, computed, type Ref, type Component } from 'vue'
import {
  NButton, NIcon, NPopover,
  type PopoverTrigger
} from 'naive-ui'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface TooltipButtonProps {
  size?: "tiny" | "small" | "medium" | "large",
  square?: boolean,
  icon?: Component,
  iconSize?: number,
  text?: string,
  tip?: string | string[],
  placement?: import("vueuc/lib/binder/src/interface").Placement,
  popTrigger?: PopoverTrigger,
}
const props = defineProps<TooltipButtonProps>()
const emits = defineEmits(['click'])

const btnClass = computed(() => {
  return [
    props.square ? 'n-square-button' : ''
  ].join(' ')
})
const tips = computed(() => {
  if (!props.tip) {
    return []
  } else if (Array.isArray(props.tip)) {
    return props.tip
  } else {
    return [props.tip]
  }
})
const popTrigger = computed(() => props.popTrigger ?? (isMobile.value ? 'manual' : 'hover'))

const handleButtonClick = () => {
  emits('click')
}
</script>

<template>
  <n-popover :trigger="popTrigger" :placement="placement">
    <template #trigger>
      <n-button :size="size" :class="btnClass" @click="handleButtonClick">
        <template #icon>
          <slot name="icon">
            <n-icon v-if="icon && !square" :size="iconSize" :component="icon" />
          </slot>
        </template>
        <slot>
          <n-icon v-if="square && icon" :size="iconSize" :component="icon" />
          {{ text }}
        </slot>
      </n-button>
    </template>
    <slot name="tooltip">
      <div class="tips">
        <div v-for="(tip, tipIndex) in tips" :key="'tip-' + tipIndex">{{ tip }}</div>
      </div>
    </slot>
  </n-popover>
</template>

<style scoped>
</style>