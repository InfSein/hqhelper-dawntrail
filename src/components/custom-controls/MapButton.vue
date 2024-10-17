<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NPopover
} from 'naive-ui'
import XivFARImage from './XivFARImage.vue'
import XivMap from './XivMap.vue'
import type { XivMapInfo } from '@/assets/data'
import type { UserConfigModel } from '@/models/user-config'
import { getNearestAetheryte } from '@/tools/map'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const itemLanguage = computed(() : "zh" | "en" | "ja" => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})

interface MapButtonProps {
  size: number,
  mapData: XivMapInfo,
  flagX: number,
  flagY: number
}
const props = defineProps<MapButtonProps>()

const getMapName = () => {
  return props.mapData[`name_${itemLanguage.value}`]
}
const getMapSubName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.mapData.name_en
    case 'en':
      return props.mapData.name_ja
    case 'zh':
    default:
      return props.mapData.name_ja + ' / ' + props.mapData.name_en
  }
}
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
      <div class="title">
        <div class="main">{{ getMapName() }}</div>
        <div class="subs">{{ getMapSubName() }}</div>
      </div>
      <XivMap
        :map-data="props.mapData"
        :map-size="222"
        :flag-x="props.flagX"
        :flag-y="props.flagY"
      />
      <div class="footer">
        <div class="recommended-aetheryte">
          <span>{{ t('推荐') }}</span>
          <span style="vertical-align: middle;">
            <XivFARImage
              :size="14"
              src="./ui/aetheryte.png"
            />
          </span>
          <span>
            {{
              getNearestAetheryte(
                props.mapData,
                props.flagX, props.flagY,
                itemLanguage
              )
            }}
          </span>
        </div>
      </div>
    </div>
  </n-popover>
</template>

<style scoped>
.map {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;

  .title {
    line-height: 1;
    text-align: center;

    .main {
      font-size: calc(var(--n-font-size) + 2px);
    }
    .subs {
      font-size: calc(var(--n-font-size) - 2px);
    }
  }
  .footer {
    width: 100%;
    text-align: left;
  }
}
</style>