<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NDivider, NPopover
} from 'naive-ui'
import XivFARImage from './XivFARImage.vue'
import ItemButton from './ItemButton.vue'
import { getItemInfo, type CalculatedItem } from '@/tools/item'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const props = defineProps({
  slotIconSrc: {
    type: String,
    required: true
  },
  slotDescription: {
    type: String,
    required: true
  },
  relatedItem: {
    type: Object as () => number | CalculatedItem | undefined,
    required: true
  }
})

const itemInfo = computed(() => {
  if (!props.relatedItem) return false
  return getItemInfo(props.relatedItem)
})
</script>

<template>
  <n-popover :trigger="isMobile ? 'click' : 'hover'" style="max-width: 300px;">
    <template #trigger>
      <div class="flex-center">
        <XivFARImage
          :src="slotIconSrc"
          :size="20"
        />
      </div>
    </template>
    <div>
      <p class="bold">{{ slotDescription }}</p>
      <n-divider class="block-divider" />
      <ItemButton
        v-if="itemInfo"
        :item-info="itemInfo"
        show-icon show-name
        pop-use-custom-width
        :pop-custom-width="300"
      />
      <p v-else>
        {{ t('无') }}
      </p>
    </div>
  </n-popover>
</template>

<style scoped>
.block-divider {
  margin: 1px 0 5px 0 !important;
}
</style>