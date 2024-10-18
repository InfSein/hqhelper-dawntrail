<script setup lang="ts">
import { ref } from 'vue'
import XivFARImage from './XivFARImage.vue'
import type { XivMapInfo } from '@/assets/data'
import { drawMap } from '@/tools/map'

// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface MapButtonProps {
  mapData: XivMapInfo,
  mapSize: number,
  flagX: number,
  flagY: number
}
const props = defineProps<MapButtonProps>()

const mapSrc = ref(props.mapData.map_src)

drawMap(
  props.mapData.map_src,
  props.mapSize,
  [
    { src: './ui/flag.png', x: props.flagX, y: props.flagY, size: 16 },
    ...props.mapData.aetherytes.map(aetheryte => ({
      src: './ui/aetheryte.png',
      x: aetheryte.x,
      y: aetheryte.y,
      size: 16
    }))
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
  <div class="map">
    <XivFARImage
      :size="mapSize"
      :src="mapSrc"
    />
  </div>
</template>

<style scoped>
.map {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>