<script setup lang="ts">
import { inject, ref, computed, type Ref, type Component } from 'vue'
import {
  NButton, NIcon, NPopover,
  type PopoverTrigger
} from 'naive-ui'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface TooltipButtonProps {
  icon?: Component,
  text?: string,
  tip?: string | string[],
  placement?: import("vueuc/lib/binder/src/interface").Placement,
  popTrigger?: PopoverTrigger,
}
const props = defineProps<TooltipButtonProps>()
const emits = defineEmits(['click'])

const tips = computed(() => {
  if (!props.tip) {
    return []
  } else if (Array.isArray(props.tip)) {
    return props.tip
  } else {
    return [props.tip]
  }
})
const popTrigger = computed(() => props.popTrigger ?? (isMobile.value ? 'click' : 'hover'))

const handleButtonClick = () => {
  emits('click')
}
</script>

<template>
  <n-popover :trigger="popTrigger" :placement="placement">
    <template #trigger>
      <n-button @click="handleButtonClick">
        <template #icon>
          <slot name="icon">
            <n-icon v-if="icon" :component="icon" />
          </slot>
        </template>
        <slot>
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