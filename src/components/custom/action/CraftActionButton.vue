<script setup lang="ts">
import { inject, ref, computed, type Ref } from 'vue'
import {
  NButton, NPopover,
  type PopoverTrigger
} from 'naive-ui'
import XivFARImage from '../general/XivFARImage.vue'
import type { XivCraftAction } from '@/assets/data'
import { getImgCdnUrl } from '@/tools/item'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface CraftActionButtonProps {
  craftAction: XivCraftAction,
  btnSize?: number,
  popPlacement?: import("vueuc/lib/binder/src/interface").Placement,
  popTrigger?: PopoverTrigger,
}
const props = defineProps<CraftActionButtonProps>()
const emits = defineEmits(['click'])

const btnSize = computed(() => props.btnSize ?? 42)
const imgSize = computed(() => btnSize.value - 6)
const imgUrl = computed(() => getImgCdnUrl(props.craftAction.icon))
const popTrigger = computed(() => props.popTrigger ?? (isMobile.value ? 'manual' : 'hover'))

const btnClass = computed(() => {
  return [
    'n-square-button'
  ].join(' ')
})
const btnStyle = computed(() => {
  return [
    `--n-height: ${btnSize.value}px`,
  ].join('; ')
})

const handleButtonClick = () => {
  emits('click')
}
</script>

<template>
  <n-popover :trigger="popTrigger" :placement="popPlacement">
    <template #trigger>
      <n-button :class="btnClass" :style="btnStyle" @click="handleButtonClick">
        <XivFARImage
          :src="imgUrl"
          :size="imgSize"
        />
      </n-button>
    </template>
    <div class="tips">
      {{ craftAction.id }}
      {{ craftAction.name_zh }}
    </div>
  </n-popover>
</template>

<style scoped>
</style>