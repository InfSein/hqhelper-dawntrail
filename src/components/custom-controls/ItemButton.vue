<script lang="ts" setup>
import { computed, inject, ref, type Ref } from 'vue';
import XivFARImage from './XivFARImage.vue'
import type { ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})

interface ItemButtonProps {
  /** 道具信息 */
  itemInfo: ItemInfo

  /** 按钮尺寸，格式：`[宽,高]` */
  btnSize?: number[];
  /** 按钮颜色 */
  btnColor?: string;

  /** 是否显示物品图标(可选,默认false) */
  showIcon?: boolean;
  /** 是否显示物品名称(可选,默认false) */
  showName?: boolean;
  /** 是否显示物品数量(可选,默认false) */
  showAmount?: boolean;
  /** 按钮是否禁用(可选,默认false) */
  disabled?: boolean;
  /** 是否禁用物品信息提示框(可选,默认false) */
  disablePop?: boolean;
}
const props = defineProps<ItemButtonProps>()

const getItemName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.itemInfo.nameJA
    case 'en':
      return props.itemInfo.nameEN
    case 'zh':
    default:
      return props.itemInfo.nameZH
  }
}
/** 获取物品副名称(即其他语言的名称) */
const getItemNameSubLang = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.itemInfo.nameEN
    case 'en':
      return props.itemInfo.nameJA
    case 'zh':
    default:
      return props.itemInfo.nameJA + ' / ' + props.itemInfo.nameEN
  }
}
const getItemDescriptions = () => {
  let description = ''
  switch (itemLanguage.value) {
    case 'ja':
      description = props.itemInfo.descJA; break
    case 'en':
      description = props.itemInfo.descEN; break
    case 'zh':
    default:
      description = props.itemInfo.descZH
  }
  return `<div>${description}</div>`
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

/** 在灰机wiki中打开物品页面 */
const openInHuijiWiki = () => {
  const url = `https://ff14.huijiwiki.com/wiki/物品:${props.itemInfo.nameZH}`
  window.open(url)
}
/** 在 Garland Data 中打开物品页面 */
const openInGarland = () => {
  const url = `https://www.garlandtools.org/db/#item/${props.itemInfo.id}`
  window.open(url)
}

</script>

<template>
  <n-popover v-if="itemInfo.id && !disablePop" :placement="isMobile ? 'bottom' : 'right-start'" style="max-width: 600px;">
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
                :src="itemInfo.iconUrl"
                :size="iconSize"
              />
            </div>

            <div v-if="showName" class="item-info">
              <div class="item-name">
                {{ getItemName() }}
              </div>
              <div v-if="showAmount" class="item-amount">
                x {{ itemInfo.amount }}
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
          :src="itemInfo.iconUrl"
          :size="40"
        />
        <div class="item-names">
          <div class="main-lang">{{ getItemName() }}</div>
          <div class="sub-lang">
            <p>{{ getItemNameSubLang() }}</p>
            <p>
              <span>[{{ itemInfo.patch }}] </span>
              <span>[{{ itemInfo.id }}] </span>
            </p>
          </div>
        </div>
      </div>
      <div class="item-descriptions">
        <div v-html="getItemDescriptions()"></div>
        <slot name="extra-descriptions" />
      </div>
      <n-flex class="item-actions">
        <n-button size="small" @click="openInHuijiWiki()">
          {{ t('在灰机wiki中打开') }}
        </n-button>
        <n-button size="small" @click="openInGarland()">
          {{ t('在Garland中打开') }}
        </n-button>
        <slot name="extra-actions" />
      </n-flex>
    </div>
  </n-popover>
  <n-button v-else-if="itemInfo.id"
    class="item-button"
    :style="{ width: btnWidth, height: btnHeight }"
    :disabled="disabled"
    :color="btnColor"
  >
    <slot>
      <div class="item-container">
        <div v-if="showIcon && itemInfo.id" class="item-icon">
          <XivFARImage
            :src="itemInfo.iconUrl"
            :size="iconSize"
          />
        </div>

        <div v-if="showName" class="item-info">
          <div class="item-name">
            {{ getItemName() }}
          </div>
          <div v-if="showAmount" class="item-amount">
            x {{ itemInfo.amount }}
          </div>
        </div>
      </div>
    </slot>
  </n-button>
  <n-button v-else
    class="item-button"
    :style="{ width: btnWidth, height: btnHeight }"
    :disabled="disabled"
    :color="btnColor"
  >
    <slot>
      <div class="item-container">
        <div class="item-icon">
        </div>

        <div v-if="showName" class="item-info">
          <div class="item-name">
            &nbsp;
          </div>
          <div v-if="showAmount" class="item-amount">
            &nbsp;
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