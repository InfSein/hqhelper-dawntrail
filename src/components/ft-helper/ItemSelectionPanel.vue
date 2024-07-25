<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  NCard, NTabs, NTabPane
} from 'naive-ui'
import FoldableCard from '@/components/custom-controls/FoldableCard.vue'
import XivFARImage from '../custom-controls/XivFARImage.vue'
import ItemSelector from '../custom-controls/ItemSelector.vue'
import { useNbbCal } from '@/tools/use-nbb-cal'
import { getItemInfo } from '@/tools/item'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

const patch = defineModel<string>('patch', { required: true })
const itemSelected = defineModel<Record<number, number>>('itemSelected', { required: true })

const { getFoodAndTincs } = useNbbCal()
const foodAndTincs = computed(() => getFoodAndTincs())

</script>

<template>
  <div>
    <FoldableCard card-key="ft-item-selection">
      <template #header>
        <i class="xiv square-1"></i>
        <span class="card-title-text">{{ t('挑选食药') }}</span>
      </template>

      <n-tabs v-model:value="patch" type="line" animated>
        <n-tab-pane
          v-for="(foodAndTinc, tabIndex) in foodAndTincs.data"
          :key="'foodAndTincs-' + tabIndex"
          :name="foodAndTinc.patch"
          :tab="t('版本{}', foodAndTinc.patch)"
          :disabled="!foodAndTinc.count"
        >
          <div class="item-selection-container">
            <n-card size="small">
              <template #header>
                <div class="card-title">
                  <XivFARImage
                    :size="16"
                    src="./image/game-job/companion/culinarian.png"
                  />
                  <span class="title">{{ t('食物') }}</span>
                </div>
              </template>
              
              <div class="item-btn-container">
                <ItemSelector
                  class="item"
                  v-for="(item, index) in foodAndTinc.foods"
                  :key="`food-${tabIndex}-${index}`"
                  :item-info="getItemInfo(item)"
                  v-model:value="itemSelected[item]"
                />
              </div>
            </n-card>
            <n-card size="small">
              <template #header>
                <div class="card-title">
                  <XivFARImage
                    :size="16"
                    src="./image/game-job/companion/alchemist.png"
                  />
                  <span class="title">{{ t('爆发药') }}</span>
                </div>
              </template>
              
              <div class="item-btn-container">
                <ItemSelector
                  class="item"
                  v-for="(item, index) in foodAndTinc.tincs"
                  :key="`tinc-${tabIndex}-${index}`"
                  :item-info="getItemInfo(item)"
                  v-model:value="itemSelected[item]"
                />
              </div>
            </n-card>
          </div>
        </n-tab-pane>
      </n-tabs>

      
    </FoldableCard>
  </div>
</template>

<style scoped>
/* All */
.item-selection-container {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .item-btn-container {
    display: flex;
    flex-direction: column;
  }
}

/* PC only */
@media screen and (min-width: 768px) {
  .item-selection-container {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .item-btn-container {
      gap: 5px;
    }
  }
}

/* Mobile only */
@media screen and (max-width: 767px) {
  .item-selection-container {
    display: flex;
    flex-direction: column;

    .item-btn-container {
      gap: 10px;
    }
  }
}
</style>