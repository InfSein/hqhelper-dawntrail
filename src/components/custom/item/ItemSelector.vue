<script setup lang="ts">
import { inject, ref, type PropType, type Ref } from 'vue'
import Stepper from '../general/Stepper.vue'
import ItemButton from './ItemButton.vue'
import type { ItemInfo } from '@/tools/item'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const value = defineModel<number>('value', { required: true })
defineProps({
  itemInfo: {
    type: Object as PropType<ItemInfo>,
    required: true
  }
})
</script>

<template>
  <div class="item-selector">
    <ItemButton
      class="item-button"
      :item-info="itemInfo"
      show-icon show-name
      :btn-height="30"
      pop-use-custom-width
      :pop-custom-width="isMobile ? 300 : undefined"
    />
    <Stepper
      class="item-stepper"
      v-model:value="value"
    />
  </div>
</template>

<style scoped>
/* All */
.item-selector {
  display: grid;
  gap: 5px 10px;
  grid-template-columns: minmax(0, 4fr) minmax(0, 3fr);

  .item-button {
    width: 100%;
  }
}

/* Desktop */
@media screen and (min-width: 768px) {
  .item-selector {
    display: grid;
    grid-template-columns: minmax(0, 8fr) minmax(0, 6fr);
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
}
</style>