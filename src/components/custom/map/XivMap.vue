<script setup lang="ts">
import XivFARImage from '../general/XivFARImage.vue'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'
import { type XivMapAetheryteInfo, type XivMapInfo } from '@/tools/map'
import UseConfig from '@/tools/use-config'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const {
  uiLanguage,
} = UseConfig(userConfig, funcConfig)

interface MapButtonProps {
  mapData: XivMapInfo,
  mapSize: number,
  flagX: number,
  flagY: number
}
const props = defineProps<MapButtonProps>()

const mapScale = computed(() => props.mapSize / 40)

const getPositionStyle = (x: number, y: number) => {
  return {
    left: `${(x - 1) * mapScale.value}px`,
    top: `${(y - 1) * mapScale.value}px`,
    width: '16px',
    height: '16px'
  }
}
const getAetheryteName = (aetheryte: XivMapAetheryteInfo) => {
  return aetheryte[`name_${uiLanguage.value}`]
}
</script>

<template>
  <div class="map-wrapper">
    <div class="map-content" :style="{ width: mapSize + 'px', height: mapSize + 'px' }">
      <!-- 地图 -->
      <XivFARImage
        class="map-image"
        :size="mapSize"
        :src="mapData.map_src"
      />
      <div class="markers-overlay">
        <!-- 目的地旗帜 -->
        <XivFARImage 
          class="marker flag"
          src="./ui/flag.png"
          :style="getPositionStyle(flagX, flagY)"
        />
        <!-- 以太之光 -->
        <template v-for="aetheryte in mapData.aetherytes" :key="aetheryte.x + '-' + aetheryte.y">
          <n-tooltip
            :trigger="isMobile ? 'click' : 'hover'"
            :show-arrow="false"
            :keep-alive-on-hover="false"
            style="padding: 4px 8px;"
            content-style="padding: 0;"
          >
            <template #trigger>
              <XivFARImage 
                class="marker aetheryte"
                src="./ui/aetheryte.png"
                :style="getPositionStyle(aetheryte.x, aetheryte.y)"
              />
            </template>
            <div class="aetheryte-tooltip">
              <p>{{ getAetheryteName(aetheryte) }}</p>
            </div>
          </n-tooltip>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .map-content {
    position: relative;
    
    .map-image {
      pointer-events: none;
    }
    .markers-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      
      .marker {
        position: absolute;
        transform: translate(-50%, -50%);
        z-index: 1;
        pointer-events: auto;
      }
    }
  }
}

.aetheryte-tooltip {
  text-align: center;
  font-size: 12px;
}
</style>