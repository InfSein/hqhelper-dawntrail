<script setup lang='ts'>
import { computed, inject, ref, type PropType, type Ref } from 'vue'
import {
  NButton, NEmpty, NIcon, NInput
} from 'naive-ui'
import {
  ViewListSharp, SettingsBackupRestoreSharp
} from '@vicons/material'
import ItemButton from './ItemButton.vue'
import ButtonCopyAsMacro from '../macro/ButtonCopyAsMacro.vue'
import { type ItemInfo } from '@/tools/item'
import UseConfig from '@/tools/use-config'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const {
  itemLanguage,
} = UseConfig(userConfig, funcConfig)

const getItemName = (itemInfo: ItemInfo) => {
  switch (itemLanguage.value) {
    case 'zh':
      return itemInfo.name_zh || '未翻译的物品'
    default:
      return itemInfo[`name_${itemLanguage.value}`]
  }
}
  
const props = defineProps({
  items: {
    type: Array as PropType<ItemInfo[]>,
    required: true
  },
  /** 为物品容器指定额外的样式 */
  displayStyle: {
    type: String,
    default: ''
  },
  /** 为滚动容器指定额外的样式 */
  scrollStyle: {
    type: String,
    default: ''
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
  },
  /** 物品悬浮窗使用自定义宽度 */
  btnPopUseCustomWidth: {
    type: Boolean,
    default: false
  },
  /** 物品悬浮窗的自定义宽度，必须同时设置`btnPopUseCustomWidth`才能生效 */
  btnPopCustomWidth: {
    type: Number,
    default: undefined
  },
  /** 是否在物品名前展示生产/采集职业的图标 */
  showCollectorIcon: {
    type: Boolean,
    default: false
  },
  /** 物品按钮所处容器的ID，在模态框等场景时必须传递，否则无法正常复制物品名 */
  containerId: {
    type: String,
    default: ''
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
    props.scrollStyle
  ].join(';')
}

const mode = ref<"default" | "list">('default')

const listValue = computed(() => {
  const result : string[] = []
  props.items.forEach(item => {
    if (item.amount) {
      if (userConfig.value.item_list_style === 'teamcraft') {
        result.push(`${item.amount}x ${getItemName(item)}`)
      } else if (userConfig.value.item_list_style === 'modern') {
        result.push(`${getItemName(item)} x${item.amount}`)
      } else if (userConfig.value.item_list_style === 'tight') {
        result.push(`${getItemName(item)}x${item.amount}`)
      } else {
        result.push(`${getItemName(item)} x ${item.amount}`)
      }
    }
  })
  return result.join('\n')
})

const listContainer = ref<HTMLElement>()
</script>

<template>
  <div v-if="items.length" class="list-container" ref="listContainer" :style="getContainerStyles()">
    <div v-if="!hideActions" class="actions">
      <ButtonCopyAsMacro
        :items="items"
        :container="listContainer"
      />
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
      <div class="items-container" :style="displayStyle">
        <ItemButton
          v-for="(item, index) in items"
          :key="'item-' + index"
          :item-info="item"
          show-icon show-name show-amount
          :pop-max-width="btnPopMaxWidth"
          :show-collector-icon="showCollectorIcon"
          :container-id="containerId"
          :pop-use-custom-width="btnPopUseCustomWidth"
          :pop-custom-width="btnPopCustomWidth"
        >
        </ItemButton>
      </div>
    </div>
    <n-input
      v-else-if="mode === 'list'"
      v-model:value="listValue"
      readonly
      autosize
      type="textarea"
      :placeholder="t('没有需要的道具')"
      style="max-height: calc(100% - 25px);"
    />
  </div>
  <div v-else-if="!hideEmpty" class="empty-container" :style="getContainerStyles()">
    <n-empty :description="t('没有需要的道具')" />
  </div>
</template>
  
<style scoped>
:deep(.n-empty__description) {
  text-align: center;
}
.scroll-container {
  overflow-y: scroll;

  .items-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
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