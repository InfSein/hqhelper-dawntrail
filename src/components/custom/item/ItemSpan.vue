<script setup lang="ts">
import { computed, inject, nextTick, ref, type Ref } from 'vue'
import {
  NDropdown, NIcon,
  useMessage
} from 'naive-ui'
import {
  InfoOutlined
} from '@vicons/material'
import ItemPop from './ItemPop.vue'
import XivFARImage from '../general/XivFARImage.vue'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'
import { CopyToClipboard } from '@/tools'
import { getItemContexts, type ItemInfo } from '@/tools/item'
import UseConfig from '@/tools/use-config'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const NAIVE_UI_MESSAGE = useMessage()
const {
  itemLanguage,
} = UseConfig(userConfig, funcConfig)

interface ItemSpanProps {
  itemInfo: ItemInfo
  amount?: number
  showAmount?: boolean
  imgSize?: number
  spanMaxWidth?: string
  hideIcon?: boolean
  hideName?: boolean
  hidePopIcon?: boolean
  containerId?: string
  containerStyle?: string
}
const props = defineProps<ItemSpanProps>()

const itemAmountNode = ref<HTMLElement>()

const getItemName = () => {
  switch (itemLanguage.value) {
    case 'zh':
      return props.itemInfo.name_zh || '未翻译的物品'
    default:
      return props.itemInfo[`name_${itemLanguage.value}`]
  }
}
const itemAmount = computed(() => {
  const _amount = props.amount ?? 0
  return userConfig.value.item_amount_use_comma
    ? _amount.toLocaleString()
    : _amount
})

// #region 右键菜单相关

const showDropdownRef = ref(false)
const xRef = ref(0)
const yRef = ref(0)

const handleCopy = async (content: string, successMessage?: string) => {
  let container : HTMLElement | undefined | null
  if (props.containerId) {
    container = document.getElementById(props.containerId)
  }
  const response = await CopyToClipboard(content, container)
  if (response) {
    NAIVE_UI_MESSAGE.error(t('复制失败：发生意外错误'))
  } else {
    NAIVE_UI_MESSAGE.success(successMessage ?? t('已复制到剪贴板'))
  }
}
const { options, handleKeyEvent } = getItemContexts(props.itemInfo, itemLanguage.value, t, handleCopy)
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  showDropdownRef.value = false
  nextTick().then(() => {
    showDropdownRef.value = true
    xRef.value = e.clientX
    yRef.value = e.clientY
  })
}
const handleSelect = async (key: string | number, option: any) => {
  showDropdownRef.value = false
  if (option?.click) {
    option.click()
  } else {
    handleKeyEvent(key, option)
  }
}
const onClickoutside = () => {
  showDropdownRef.value = false
}

// * 移动端通过长按来弹出右键菜单
// 注：这些事件也只会在移动端触发，不用担心在电脑端的兼容性
const touchTimeoutEvent = ref<number | undefined>(undefined)
const handleItemButtonTouchStart = (e: TouchEvent) => {
  touchTimeoutEvent.value = setTimeout(() => {
    if (e?.touches?.length) {
      xRef.value = e.touches[0].clientX
      yRef.value = e.touches[0].clientY
      showDropdownRef.value = true
    } else {
      console.error('No touches found in handleItemButtonTouchStart. event:', e)
    }
  }, 500) // 长按500毫秒触发长按事件
}
const handleItemButtonTouchMove = (/*e: TouchEvent*/) => {
  // 如果有移动则取消所有事件
  clearTimeout(touchTimeoutEvent.value)
  touchTimeoutEvent.value = 0
}
const handleItemButtonTouchEnd = (/*e: TouchEvent*/) => {
  // 按下时长不足以触发长按事件时,触发点击事件
  clearTimeout(touchTimeoutEvent.value)
  if (touchTimeoutEvent.value !== 0) {
    // do click if event added later
  }
}

// #endregion

const popTrigger = computed(() => {
  if (!isMobile.value && userConfig.value.click_to_show_pop_in_span) {
    return 'click'
  } else {
    return undefined
  }
})
const containerStyle = computed(() => {
  let itemAmountwidth = 0
  if (props.showAmount && !!itemAmountNode.value) {
    const itemAmountWidth = itemAmountNode.value.getBoundingClientRect().width
    itemAmountwidth = Math.ceil(itemAmountWidth) + 8
  }
  return [
    (props.containerStyle ?? ''),
    `max-width: ${props.spanMaxWidth ?? 'unset'}`,
    props.spanMaxWidth ? `--item-name-maxwidth: calc(100% - ${itemAmountwidth}px)` : '--item-name-maxwidth: unset',
  ].join('; ')
})

const handleItemIconClick = async () => {
  const action = userConfig.value.item_info_icon_click_event
  const itemName = getItemName()
  let copyContent = ''
  if (action === 'copy_name') {
    copyContent = itemName
  } else if (action === 'copy_isearch') {
    copyContent = `/isearch "${itemName}"`
  } else {
    // do nothing
  }

  if (copyContent) {
    await handleCopy(copyContent, t('已复制 {content}', copyContent))
  }
}
</script>

<template>
  <div class="container" :style="containerStyle">
    <XivFARImage
      v-show="!hideIcon"
      class="img no-select"
      :size="imgSize ?? 14"
      :src="itemInfo.iconUrl"
      :title="(hideName && hidePopIcon) ? getItemName() : ''"
    />
    <div class="item-text-container">
      <span v-show="!hideName" class="item-name">
        {{ hideName ? '' : getItemName() }}
      </span>
      <span v-if="!hideName && showAmount">&nbsp;</span>
      <span v-show="showAmount" ref="itemAmountNode" class="item-amount">
        {{ showAmount ? (' x' + itemAmount) : '' }}
      </span>
    </div>
    <ItemPop
      v-if="!hidePopIcon"
      :item-info="itemInfo"
      pop-use-custom-width
      :pop-custom-width="275"
      :pop-trigger="popTrigger"
    >
      <n-icon v-if="!hidePopIcon" class="pop-icon" size="14" color="#3b7fef"
        @contextmenu="handleContextMenu"
        @touchstart.passive="handleItemButtonTouchStart" 
        @touchmove.passive="handleItemButtonTouchMove" 
        @touchend.passive="handleItemButtonTouchEnd"
        @click="handleItemIconClick"
      >
        <InfoOutlined />
        <n-dropdown
          size="small"
          placement="bottom-start"
          trigger="manual"
          :x="xRef"
          :y="yRef"
          :options="options"
          :show="showDropdownRef"
          :on-clickoutside="onClickoutside"
          @select="handleSelect"
        />
      </n-icon>
    </ItemPop>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  gap: 3px;

  .item-text-container {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .item-name {
      display: inline-block;
      max-width: var(--item-name-maxwidth);
      vertical-align: top;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-amount {
      display: inline-block;
      vertical-align: top;
      white-space: nowrap;
    }
  }
}
</style>