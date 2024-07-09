<script lang="ts" setup>
import { computed, inject, ref, type Ref } from 'vue';
import XivFARImage from './XivFARImage.vue'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

interface ItemButtonProps {
  /** 按钮尺寸，格式：`[宽,高]` */
  btnSize?: number[];
  /** 按钮颜色 */
  btnColor?: string;
  /** 物品ID */
  itemId?: number;
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
  return (props.btnSize?.[1] || 32) - 5
})
const btnWidth = computed(() => {
  const _w = props.btnSize?.[0]
  if (!_w) return 'auto'
  return `${_w}px`
})
const btnHeight = computed(() => {
  const _h = props.btnSize?.[1]
  if (!_h) return 'auto'
  return `${_h}px`
})

const getItemName = (itemID?: number) => {
  console.log(itemID) // todo: get item name
  //if (!itemID) return ''
  return '光芒大丁草'
}
const getItemNameChinese = (itemID?: number) => {
  console.log(itemID) // todo: get item name in Chinese
  return '光芒大丁草'
}
const getItemNameSubLang = (itemID?: number) => {
  console.log(itemID) // todo: get item name in other languages
  return 'ライトガーベラ / Light Gerbera'
}

const getItemDescriptions = (itemID?: number) => {
  console.log(itemID) // todo: get item description
  return '<div>能够绽放出纯白色花朵的大丁草。</div>'
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
  <n-popover v-if="itemId" :placement="isMobile ? 'bottom' : 'right-start'" style="max-width: 600px;">
    <template #trigger>
      <n-button
        class="item-button"
        :style="{ width: btnWidth, height: btnHeight }"
        :disabled="disabled"
        :color="btnColor"
      >
        <slot>
          <div class="item-container">
            <div v-if="showIcon" class="item-icon">
              <XivFARImage
                :src="getItemIcon(itemId)"
                :size="iconSize"
              />
            </div>

            <div v-if="showName" class="item-info">
              <div class="item-name">
                {{ getItemName(itemId) }}
              </div>
              <div class="item-amount">
                x {{ itemAmount || '?' }}
              </div>
            </div>
          </div>
        </slot>
      </n-button>
    </template>
    <div class="item-popover">
      <div class="base-info">
        <XivFARImage
          class="item-icon"
          :src="getItemIcon(itemId)"
          :size="40"
        />
        <div class="item-names">
          <div class="main-lang">{{ getItemName(itemId) }}</div>
          <div class="sub-lang">{{ getItemNameSubLang(itemId) }}</div>
        </div>
      </div>
      <div class="item-descriptions">
        <div v-html="getItemDescriptions(itemId)"></div>
        <slot name="extra-descriptions" />
      </div>
      <n-flex class="item-actions">
        <n-button size="small" @click="openInHuijiWiki(itemId)">
          {{ t('在灰机wiki中打开') }}
        </n-button>
        <n-button size="small" @click="openInGarland(itemId)">
          {{ t('在Garland中打开') }}
        </n-button>
        <slot name="extra-actions" />
      </n-flex>
    </div>
  </n-popover>
  <n-button v-else
    class="item-button"
    :style="{ width: btnWidth, height: btnHeight }"
    :disabled="disabled"
    :color="btnColor"
  >
    <slot>
      <div class="item-container">
        <div v-if="showIcon" class="item-icon">
          <XivFARImage
            :src="getItemIcon(itemId)"
            :size="iconSize"
          />
        </div>

        <div v-if="showName" class="item-info">
          <div class="item-name">
            {{ getItemName(itemId) }}
          </div>
          <div class="item-amount">
            x {{ itemAmount || '?' }}
          </div>
        </div>
      </div>
    </slot>
  </n-button>
</template>

<style scoped>
:deep(.n-button__content){
  width: 100%;
  height: 100%;
}
.item-button {
  padding: 1px;

  .item-container {
    width: 100%;
    height: 100%;
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 5px;

    .item-info {
      margin-left: auto;
      display: flex;
      flex-direction: column;
      gap: 3px;

      div {
        text-align: end;
      }
    }
  }
}
.item-popover {
  display: flex;
  flex-direction: column;
  gap: 5px;

  .base-info {
    display: flex;
    align-items: center;
    gap: 5px;

    .item-names .sub-lang {
      font-size: calc(var(--n-font-size) - 2px);
    }
  }
}
</style>, inject, ref, type Ref