<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { XivMaps } from '@/assets/data'
import MapButton from './MapButton.vue'
import type { UserConfigModel } from '@/models/user-config'

const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface LocationSpanProps {
  placeId: number,
  placeName?: string,
  coordinateX: number,
  coordinateY: number,

  size?: number,
  hideMapName?: boolean,
  hideCoordinates?: boolean,
  hideMapButton?: boolean
  /** 手动指定地图按钮悬浮窗的触发方式 */
  popTrigger?: 'hover' | 'click' | 'manual'
}
const props = defineProps<LocationSpanProps>()

const placeName = computed(() => {
  if (props.placeName) {
    return props.placeName
  }
  switch (userConfig.value.language_item) {
    case 'ja': return XivMaps[props.placeId]?.name_ja
    case 'en': return XivMaps[props.placeId]?.name_en
    default:  return XivMaps[props.placeId]?.name_zh
  }
})

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
    <span v-if="!hideMapName">{{ placeName }}</span>
    <span v-if="!hideCoordinates">{{ t('(X:{x}, Y:{y})', { x: coordinateX.toFixed(1), y: coordinateY.toFixed(1) }) }}</span>
    <span
      v-if="showMapButton"
      class="map-button no-select"
      :style="{
        lineHeight: mapButtonSize + 'px'
      }"
    >
      <MapButton
        :size="mapButtonSize"
        :map-data="mapData"
        :flag-x="coordinateX"
        :flag-y="coordinateY"
        :pop-trigger="popTrigger"
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