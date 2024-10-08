<script setup lang="ts">
import { computed, inject, nextTick, ref, type PropType, type Ref } from 'vue'
import {
  NDropdown, NIcon,
  useMessage
} from 'naive-ui'
import {
  InfoOutlined
} from '@vicons/material'
import XivFARImage from './XivFARImage.vue'
import ItemPop from './ItemPop.vue'
import { getItemContexts, type ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config';
import { CopyToClipboard } from '@/tools'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const NAIVE_UI_MESSAGE = useMessage()

const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})

const props = defineProps({
  itemInfo: {
    type: Object as PropType<ItemInfo>,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  showAmount: {
    type: Boolean,
    default: false
  },
  imgSize: {
    type: Number,
    default: 14
  },
  hideIcon: {
    type: Boolean,
    default: false
  },
  hideName: {
    type: Boolean,
    default: false
  },
  hidePopIcon: {
    type: Boolean,
    default: false
  },
  containerId: {
    type: String,
    default: ''
  }
})

const getItemName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.itemInfo.nameJA
    case 'en':
      return props.itemInfo.nameEN
    case 'zh':
    default:
      return props.itemInfo.nameZH || '未翻译的物品'
  }
}

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
const { options, handleKeyEvent } = getItemContexts(props.itemInfo, t, handleCopy)
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
  console.log(key)
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

</script>

<template>
  <div class="container">
    <XivFARImage
      v-show="!hideIcon"
      class="img"
      :size="imgSize"
      :src="itemInfo.iconUrl"
    />
    <span v-show="!hideName" class="name">
      {{ getItemName() }}
    </span>
    <div v-if="showAmount" class="count">
      <span> x{{ amount }}</span>
    </div>
    <ItemPop v-if="!hidePopIcon" :item-info="itemInfo" :pop-use-custom-width="isMobile" :pop-custom-width="isMobile ? 275 : undefined">
      <n-icon v-if="!hidePopIcon" class="pop-icon" size="14" color="#3b7fef"
        @contextmenu="handleContextMenu"
        @touchstart.passive="handleItemButtonTouchStart" 
        @touchmove.passive="handleItemButtonTouchMove" 
        @touchend.passive="handleItemButtonTouchEnd"
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

  .count {
    min-width: fit-content;
  }
}
</style>