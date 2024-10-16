<script setup lang="ts">
import { computed } from 'vue'
import { XivMaps } from '@/assets/data'
import MapButton from './MapButton.vue'

interface LocationSpanProps {
  placeId: number,
  placeName: string,
  coordinateX: number,
  coordinateY: number,

  size?: number,
  hideMapName?: boolean,
  hideCoordinates?: boolean,
  hideMapButton?: boolean
}
const props = defineProps<LocationSpanProps>()

const mapData = computed(() => {
  return XivMaps[props.placeId]
})
const showMapButton = computed(() => {
  return !props.hideMapButton && mapData.value
})
const mapButtonSize = computed(() => {
  return props.size ?? 14
})
</script>

<template>
  <div class="container">
    <span>{{ placeName }}</span>
    <span>{{ t('(X:{x}, Y:{y})', { x: coordinateX, y: coordinateY }) }}</span>
    <span
      v-if="showMapButton"
      class="map-button"
      :style="{
        lineHeight: mapButtonSize + 'px'
      }"
    >
      <MapButton
        :size="mapButtonSize"
        :map-data="mapData"
        :flag-x="coordinateX"
        :flag-y="coordinateY"
      />
    </span>
  </div>
</template>

<style scoped>
.container > *:not(:first-child) {
  margin-left: 3px;
}
.map-button {
  vertical-align: middle;
}
</style>