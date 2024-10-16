<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NPopover
} from 'naive-ui'
import XivFARImage from './XivFARImage.vue'
import XivMap from './XivMap.vue'
import type { XivMapInfo } from '@/assets/data'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface MapButtonProps {
  size: number,
  mapData: XivMapInfo,
  flagX: number,
  flagY: number
}
const props = defineProps<MapButtonProps>()
</script>

<template>
  <n-popover
    :trigger="isMobile ? 'click' : 'hover'"
    :width="isMobile ? 250 : undefined"
    :placement="isMobile ? 'bottom' : 'right-start'"
  >
    <template #trigger>
      <XivFARImage
        :size="size"
        src="./ui/map.png"
      />
    </template>
    <div class="map">
      <XivMap
        :map-data="props.mapData"
        :map-size="222"
        :flag-x="props.flagX"
        :flag-y="props.flagY"
      />
    </div>
  </n-popover>
</template>

<style scoped>
.map {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>