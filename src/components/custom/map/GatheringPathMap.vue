<script setup lang="ts">
import XivFARImage from '@/components/custom/general/XivFARImage.vue'
import type { XivMapInfo } from '@/tools/map'
import UseConfig from '@/tools/use-config'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const {
  itemLanguage,
} = UseConfig(userConfig, funcConfig)

export interface PathPoint {
  x: number;
  y: number;
  type: 'aetheryte' | 'gathering' | 'teleport';
  name_zh?: string;
  name_en?: string;
  name_ja?: string;
  isTeleportDestination?: boolean;
}

interface GatheringPathMapProps {
  mapData: XivMapInfo,
  mapSize: number,
  path: PathPoint[]
}
const props = defineProps<GatheringPathMapProps>()

const mapScale = computed(() => props.mapSize / 40)

const getPositionStyle = (x: number, y: number) => {
  return {
    left: `${(x - 1) * mapScale.value}px`,
    top: `${(y - 1) * mapScale.value}px`,
  }
}

const lines = computed(() => {
  const result: { 
    x1: number, y1: number, x2: number, y2: number, 
    showArrow: boolean,
  }[] = []
  const arrowDistThreshold = 18 // 距离少于此数值px时不显示箭头
  
  for (let i = 0; i < props.path.length - 1; i++) {
    const p1 = props.path[i]
    const p2 = props.path[i + 1]

    if (p2.isTeleportDestination) continue

    const x1 = (p1.x - 1) * mapScale.value
    const y1 = (p1.y - 1) * mapScale.value
    const x2 = (p2.x - 1) * mapScale.value
    const y2 = (p2.y - 1) * mapScale.value

    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)

    result.push({
      x1, y1,
      x2, y2,
      showArrow: len > arrowDistThreshold,
    })
  }
  return result
})
</script>

<template>
  <div class="gathering-path-map">
    <div class="map-title" v-if="mapData">
      {{ mapData[`name_${itemLanguage}`] }}
    </div>
    <div class="map-container" :style="{ width: mapSize + 'px', height: mapSize + 'px' }">
      <XivFARImage
        class="map-image"
        :size="mapSize"
        :src="mapData.map_src"
      />

      <svg class="path-svg" :width="mapSize" :height="mapSize">
        <defs>
          <marker 
            id="arrowhead" 
            markerWidth="6" 
            markerHeight="6" 
            refX="6" 
            refY="3" 
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#9B4545" />
          </marker>
        </defs>
        <line
          v-for="(line, index) in lines"
          :key="index"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          stroke="#9B4545"
          :stroke-width="1.5"
          :marker-end="line.showArrow ? 'url(#arrowhead)' : 'none'"
        />
      </svg>

      <div class="markers-overlay">
        <template v-for="(point, index) in path" :key="'p-' + index">
          <n-tooltip
            :trigger="isMobile ? 'click' : 'hover'"
            :show-arrow="false"
            style="padding: 4px 8px;"
            content-style="padding: 0;"
          >
            <template #trigger>
              <div
                class="marker-item"
                :style="getPositionStyle(point.x, point.y)"
              >
                <div class="marker-icon" :class="point.type">
                  <XivFARImage 
                    v-if="point.type === 'aetheryte' || point.type === 'teleport'"
                    src="./ui/aetheryte.png"
                    :size="16"
                  />
                  <div v-else class="gathering-flag-wrapper">
                    <XivFARImage 
                      src="./ui/flag.png"
                      :size="16"
                    />
                  </div>
                </div>
              </div>
            </template>
            <div class="marker-tooltip">
              {{ point[`name_${itemLanguage}`] || '???' }}
            </div>
          </n-tooltip>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gathering-path-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
}
.map-title {
  margin-bottom: 3px;
  font-size: 12px;
}
.map-container {
  position: relative;
  border: 1px solid var(--n-border-color);
  border-radius: 4px;
  overflow: hidden;
}
.map-image {
  display: block;
}
.path-svg {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 5;
}
.markers-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.marker-item {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  pointer-events: auto;
}
.marker-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.gathering-flag-wrapper {
  position: relative;
}
.node-index {
  position: absolute;
  top: 8px;
  left: 10px;
  color: #9B4545;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-shadow: 1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white;
}
.marker-tooltip {
  font-size: 11px;
  padding: 2px 4px;
}
</style>
