<script setup lang="ts">
import { computed, inject, type PropType, type Ref } from 'vue';
import XivFARImage from './XivFARImage.vue'
import type { ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config';

const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

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
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  gap: 3px;
}
</style>