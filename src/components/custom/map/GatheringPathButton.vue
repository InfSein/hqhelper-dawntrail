<script setup lang="ts">
import type { ItemInfo } from '@/tools/item'
import { XivMaps, type XivMapInfo } from '@/tools/map'

interface GatheringPathButtonProps {
  targetItems: ItemInfo[]
}
const props = defineProps<GatheringPathButtonProps>()

const targetItems = computed(() => props.targetItems.filter(item => item.gatherInfo?.placeID))
const relateMaps = computed(() => {
  const maps : XivMapInfo[] = []
  targetItems.value.forEach(item => {
    if (item.gatherInfo?.placeID) {
      const map = XivMaps[item.gatherInfo.placeID]
      if (map && !maps.includes(map)) {
        maps.push(map)
      }
    }
  })
  return maps
})
</script>

<template>
  <div>
  </div>
</template>

<style scoped>
</style>