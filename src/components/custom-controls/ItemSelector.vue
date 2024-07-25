<script setup lang="ts">
import type { PropType } from 'vue'
import type { ItemInfo } from '@/tools/item'
import ItemButton from './ItemButton.vue'
import Stepper from './Stepper.vue'

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
  gap: 5px 10px;

  .item-button {
    width: 100%;
  }
  .item-stepper {
    min-width: 145px;
  }
}

/* Desktop */
@media screen and (min-width: 768px) {
  .item-selector {
    display: grid;
    grid-template-columns: 9fr 5fr;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .item-selector {
    display: flex;
    flex-direction: column;

    .item-stepper {
      margin-left: auto;
      width: 50%;
    }
  }
}
</style>