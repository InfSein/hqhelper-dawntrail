<script setup lang="ts">
import { computed, inject, ref, type PropType, type Ref } from 'vue'
import {
  NIcon
} from 'naive-ui'
import {
  InfoOutlined
} from '@vicons/material'
import XivFARImage from './XivFARImage.vue'
import ItemPop from './ItemPop.vue'
import type { ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config';

const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

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
      <n-icon v-if="!hidePopIcon" class="pop-icon" size="14" color="#3b7fef"><InfoOutlined /></n-icon>
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