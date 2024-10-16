<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NPopover
} from 'naive-ui'
import XivFARImage from './XivFARImage.vue'
import type { XivMapInfo } from '@/assets/data'
import { drawMap } from '@/tools/map'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface MapButtonProps {
  size: number,
  mapData: XivMapInfo,
  flagX: number,
  flagY: number
}
const props = defineProps<MapButtonProps>()

const mapSrc = ref(props.mapData.map_src)

drawMap(
  props.mapData.map_src,
  222,
  [
    { src: './ui/flag.png', x: props.flagX, y: props.flagY, size: 16 }
  ]
)
  .then((dataUrl) => {
    mapSrc.value = dataUrl
  })
  .catch((error) => {
    console.error('Error generating image:', error);
  })
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
      <XivFARImage
        :size="222"
        :src="mapSrc"
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