<script lang="ts" setup>
import { computed } from 'vue';
import XivFARImage from './XivFARImage.vue'
import { getCharsUntilLastN } from '@/tools'

interface ItemButtonProps {
  /** 按钮尺寸，格式：`[宽,高]` */
  btnSize: string[];
  /** 物品ID */
  itemID?: number;
  /** 物品数量 */
  itemAmount?: number;
  /** 物品图标url(可选,覆盖默认网络图标) */
  itemIcon?: string;
  /** 是否显示物品图标(可选,默认false) */
  showIcon?: boolean;
  /** 是否显示物品名称(可选,默认false) */
  showName?: boolean;
  /** 是否显示物品数量(可选,默认false) */
  showAmount?: boolean;
  /** 按钮是否禁用(可选,默认false) */
  disabled?: boolean;
}
const props = defineProps<ItemButtonProps>()

const getItemIcon = (itemID?: number) => {
  if (props.itemIcon) return props.itemIcon
  console.log(itemID) // todo: get item icon
  return `./image/game-job/companion/none.png`
}
const iconSize = computed(() => {
  console.log(props.btnSize?.[1], props.btnSize?.[1]?.slice(-2))
  return Number(getCharsUntilLastN(props.btnSize?.[1] || '32px', 2)) - 5
})

const getItemName = (itemID?: number) => {
  console.log(itemID) // todo: get item name
  if (!itemID) return ''
  return '光芒大丁草'
}
const getItemNameChinese = (itemID?: number) => {
  console.log(itemID) // todo: get item name in Chinese
  return '光芒大丁草'
}
const getItemNameSubLang = (itemID?: number) => {
  console.log(itemID) // todo: get item name in other languages
  return ''
}

const getItemDescriptions = (itemID?: number) => {
  console.log(itemID) // todo: get item description
  return '<div></div>'
}

/** 在灰机wiki中打开物品页面 */
const openInHuijiWiki = (itemID?: number) => {
  const itemNameChinese = getItemNameChinese(itemID)
  const url = `https://ff14.huijiwiki.com/wiki/物品:${itemNameChinese}`
  window.open(url)
}
/** 在 Garland Data 中打开物品页面 */
const openInGarland = (itemID?: number) => {
  const url = `https://www.garlandtools.org/db/#item/${itemID}`
  window.open(url)
}

</script>

<template>
  <n-popover trigger="hover" style="max-width: 600px;">
    <template #trigger>
      <n-button
        ghost
        class="item-button"
        :style="{ width: btnSize?.[0] || 'auto', height: btnSize?.[1] || 'auto' }"
        :disabled="disabled"
      >
        <slot>
          <div class="item-container">
            <div v-if="showIcon" class="item-icon">
              <XivFARImage
                :src="getItemIcon(itemID)"
                :size="iconSize"
              />
            </div>

            <div v-if="showName" class="item-info">
              <div class="item-name">
                {{ getItemName(itemID) }}
              </div>
              <div class="item-amount">
                x {{ itemAmount || '?' }}
              </div>
            </div>
          </div>
        </slot>
      </n-button>
    </template>
    <div v-if="itemID" class="item-popover">
      <div class="base-info">
        <div class="item-icon">
          <XivFARImage
            :src="getItemIcon(itemID)"
            :size="32"
          />
        </div>
        <div class="item-info">
          <div class="item-names">
            <div class="main-lang">{{ getItemName(itemID) }}</div>
            <div class="sub-lang">{{ getItemNameSubLang(itemID) }}</div>
          </div>
        </div>
      </div>
      <div class="item-descriptions">
        <div v-html="getItemDescriptions(itemID)"></div>
        <slot name="extra-descriptions" />
      </div>
      <n-flex class="item-actions">
        <n-button type="text" size="small" @click="openInHuijiWiki(itemID)">
          t('在灰机wiki中打开')
        </n-button>
        <n-button type="text" size="small" @click="openInGarland(itemID)">
          t('在Garland中打开')
        </n-button>
        <slot name="extra-actions" />
      </n-flex>
    </div>
  </n-popover>
</template>

<style scoped>
.item-button {
  padding: 1px;
}
</style>