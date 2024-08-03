<script setup lang='ts'>
import { computed, inject, ref, type PropType, type Ref } from 'vue'
import {
  NButton, NEmpty, NFlex, NIcon, NInput
} from 'naive-ui'
import {
  CodeSharp, ViewListSharp, SettingsBackupRestoreSharp
} from '@vicons/material'
import ItemButton from './ItemButton.vue'
import { type ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
  
const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})
const getItemName = (itemInfo: ItemInfo) => {
  switch (itemLanguage.value) {
    case 'ja':
      return itemInfo.nameJA
    case 'en':
      return itemInfo.nameEN
    case 'zh':
    default:
      return itemInfo.nameZH
  }
}
  
const props = defineProps({
  items: {
    type: Array as PropType<ItemInfo[]>,
    required: true
  },
  /** 清单区域的高度(不计入操作按钮) */
  listHeight: {
    type: Number
  },
  /** 是否隐藏清单顶部的操作按钮 */
  hideActions: {
    type: Boolean,
    default: false
  },
  /** 是否隐藏物品清单为空时的提示 */
  hideEmpty: {
    type: Boolean,
    default: false
  },
  /** 物品按钮悬浮窗的最大宽度 */
  btnPopMaxWidth: {
    type: String,
    default: undefined
  }
})

const getContainerStyles = () => {
  return [
    props.listHeight? `height: ${props.listHeight + 20}px` : '',
  ].join(';')
}
const getScrollbarStyles = () => {
  return [
    props.listHeight? `height: ${props.listHeight}px` : '',
  ].join(';')
}

const mode = ref<"default" | "list">('default')

const listValue = computed(() => {
  const result : string[] = []
  props.items.forEach(item => {
    result.push(`${getItemName(item)} x ${item.amount}`)
  })
  return result.join('\n')
})

const clickFuncPlaceholder = () => { alert('不好意思这个还没做好') }
</script>

<template>
  <div v-if="items.length" class="list-container" :style="getContainerStyles()">
    <div v-if="!hideActions" class="actions">
      <n-button size="tiny" @click="clickFuncPlaceholder" v-show="false">
        <template #icon>
          <n-icon><CodeSharp /></n-icon>
        </template>
        {{ t('复制宏') }}
      </n-button>
      <n-button size="tiny" v-if="mode === 'default'" @click="mode = 'list'">
        <template #icon>
          <n-icon><ViewListSharp /></n-icon>
        </template>
        {{ t('清单') }}
      </n-button>
      <n-button size="tiny" v-else @click="mode = 'default'">
        <template #icon>
          <n-icon><SettingsBackupRestoreSharp /></n-icon>
        </template>
        {{ t('返回') }}
      </n-button>
    </div>
    <div v-if="mode === 'default'" class="scroll-container" :style="getScrollbarStyles()">
      <n-flex vertical :size="[5,5]">
        <ItemButton
          v-for="(item, index) in items"
          :key="'item-' + index"
          :item-info="item"
          show-icon show-name show-amount
          :pop-max-width="btnPopMaxWidth"
        >
        </ItemButton>
      </n-flex>
    </div>
    <n-input
      v-else-if="mode === 'list'"
      v-model:value="listValue"
      readonly
      autosize
      type="textarea"
      :style="getScrollbarStyles()"
    />
  </div>
  <div v-else-if="!hideEmpty" class="empty-container" :style="getContainerStyles()">
    <n-empty :description="t('本组没有需要的道具')" />
  </div>
  
</template>
  
<style scoped>
:deep(.n-empty__description) {
  text-align: center;
}
.scroll-container {
  overflow-y: scroll;
}
.list-container {
  display: flex;
  flex-direction: column;
  gap: 3px;

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 2px;
  }
}
.empty-container {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

/* Desktop only */
@media screen and (min-width: 768px) {
  .scroll-container {
    padding: 0 0.5em !important;
  }
}

/* Mobile only */
@media screen and (max-width: 767px) {
  .scroll-container {
    padding: 0 !important;
  }
}
</style>