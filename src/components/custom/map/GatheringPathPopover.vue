<script setup lang="ts">
import { MapOutlined } from '@vicons/material'
import GatheringPathMap, { type PathPoint } from './GatheringPathMap.vue'
import { XivMaps, getNearestAetheryte } from '@/tools/map'
import type { RecommItemGroup } from '@/models/item'
import type { ItemInfo } from '@/tools/item'

const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface GatheringPathPopoverProps {
  group: RecommItemGroup;
  groupIndex: number;
  completedItems: Record<number, boolean>;
}
const props = defineProps<GatheringPathPopoverProps>()

const results = computed(() => {
  if (props.group.type !== 'gather-common') return []
  const maps: Record<number, { items: ItemInfo[], path: PathPoint[] }> = {}
  
  props.group.items.forEach(item => {
    if (props.completedItems[item.id]) return
    if (!item.gatherInfo?.placeID) return
    const pid = item.gatherInfo.placeID
    if (!maps[pid]) maps[pid] = { items: [], path: [] }
    maps[pid].items.push(item)
  })

  const results: { placeId: number, path: PathPoint[] }[] = []

  Object.entries(maps).forEach(([pidStr, data]) => {
    const pid = Number(pidStr)
    const mapInfo = XivMaps[pid]
    if (!mapInfo) return

    const points = data.items.map(item => ({
      x: item.gatherInfo.posX,
      y: item.gatherInfo.posY,
      name_zh: item[`name_zh`],
      name_en: item[`name_en`],
      name_ja: item[`name_ja`],
      type: 'gathering' as const
    }))

    if (points.length < 1) return

    const path: PathPoint[] = []
    const unvisited = [...points]
    
    // 初始起点：离任意以太之光最近的采集点
    let firstPointIdx = -1
    let minAetheryteDist = Infinity
    let startAetheryte : any = null

    unvisited.forEach((p, idx) => {
      const nearestA = getNearestAetheryte(mapInfo, p.x, p.y)
      if (nearestA) {
        const d = Math.sqrt(Math.pow(p.x - nearestA.x, 2) + Math.pow(p.y - nearestA.y, 2))
        if (d < minAetheryteDist) {
          minAetheryteDist = d
          firstPointIdx = idx
          startAetheryte = nearestA
        }
      }
    })

    if (firstPointIdx !== -1) {
      path.push({
        x: startAetheryte.x,
        y: startAetheryte.y,
        name_zh: startAetheryte.name_zh,
        name_en: startAetheryte.name_en,
        name_ja: startAetheryte.name_ja,
        type: 'aetheryte'
      })
      path.push(unvisited.splice(firstPointIdx, 1)[0])

      while (unvisited.length > 0) {
        const currentP = path[path.length - 1]
        let nextIdx = -1
        let minDist = Infinity
        let useTeleport = false
        let targetAetheryte : any = null

        unvisited.forEach((p, idx) => {
          const walkDist = Math.sqrt(Math.pow(p.x - currentP.x, 2) + Math.pow(p.y - currentP.y, 2))
          const nearestA = getNearestAetheryte(mapInfo, p.x, p.y)
          let bestDistForThisPoint = walkDist
          let teleportForThisPoint = false

          if (nearestA) {
            const teleDist = Math.sqrt(Math.pow(p.x - nearestA.x, 2) + Math.pow(p.y - nearestA.y, 2))
            if (teleDist < walkDist) {
              bestDistForThisPoint = teleDist
              teleportForThisPoint = true
            }
          }

          if (bestDistForThisPoint < minDist) {
            minDist = bestDistForThisPoint
            nextIdx = idx
            useTeleport = teleportForThisPoint
            targetAetheryte = nearestA
          }
        })

        if (nextIdx !== -1) {
          const nextP = unvisited.splice(nextIdx, 1)[0]
          if (useTeleport) {
            path.push({
              x: targetAetheryte.x,
              y: targetAetheryte.y,
              name_zh: targetAetheryte.name_zh,
              name_en: targetAetheryte.name_en,
              name_ja: targetAetheryte.name_ja,
              type: 'teleport',
              isTeleportDestination: true
            })
          }
          path.push(nextP)
        } else {
          break
        }
      }
    }

    results.push({ placeId: pid, path })
  })

  return results
})

const popoverWidth = computed(() => isMobile.value ? '90vw' : '500px')
const popoverMaxHeight = computed(() => isMobile.value ? '70vh' : '550px')
</script>

<template>
  <div class="gathering-path-popover-container" v-if="results.length > 0">
    <n-popover 
      :trigger="isMobile ? 'click' : 'hover'" 
      :placement="isMobile ? 'bottom' : 'right-start'" 
      scrollable 
      :style="{ width: popoverWidth, maxHeight: popoverMaxHeight }"
    >
      <template #trigger>
        <n-button quaternary size="tiny" class="n-square-button">
          <template #icon>
            <n-icon :component="MapOutlined" />
          </template>
        </n-button>
      </template>
      <div class="pop-title">{{ t('common.appfunc.gathering_path') }}</div>
      <div class="gathering-maps">
        <div v-for="mapPath in results" :key="mapPath.placeId">
          <GatheringPathMap
            :map-data="XivMaps[mapPath.placeId]"
            :map-size="222"
            :path="mapPath.path"
          />
        </div>
      </div>
    </n-popover>
  </div>
</template>

<style scoped>
.pop-title {
  font-size: 18px;
  text-align: center;
}
.gathering-maps {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px 10px;
  padding: 0 5px;
}
</style>
