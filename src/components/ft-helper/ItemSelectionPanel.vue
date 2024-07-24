<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  NCard, NTabs, NTabPane
} from 'naive-ui'
import FoldableCard from '@/components/custom-controls/FoldableCard.vue'
import XivFARImage from '../custom-controls/XivFARImage.vue'
import ItemButton from '../custom-controls/ItemButton.vue'
import Stepper from '../custom-controls/Stepper.vue'
import { useNbbCal } from '@/tools/use-nbb-cal'
import { getItemInfo, type ItemInfo } from '@/tools/item'

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
          v-for="(foodAndTinc, index) in foodAndTincs"
          :key="'foodAndTincs-' + index"
          :name="foodAndTinc.patch"
          :tab="t('版本{}', foodAndTinc.patch)"
        >
          <div class="item-selection-container">
            <n-card size="small">
              <template #header>
                <XivFARImage
                  :size="14"
                  src="./image/game-job/companion/culinarian.png"
                />
                <span class="card-title-text">{{ t('食物') }}</span>
              </template>
              
              <div class="item-btn-container">
                <div
                  class="item"
                  v-for="(item, index) in foodAndTinc.foods"
                  :key="'food-' + index"
                >
                  <ItemButton
                    :item-info="getItemInfo(item)"
                    show-icon show-name
                  />
                  <Stepper
                    v-model:value="itemSelected[item]"
                  />
                </div>
              </div>
            </n-card>
            <n-card size="small">
              <template #header>
                <XivFARImage
                  :size="14"
                  src="./image/game-job/companion/alchemist.png"
                />
                <span class="card-title-text">{{ t('爆发药') }}</span>
              </template>
              卡片内容
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
}

/* PC only */
@media screen and (min-width: 768px) {
  .item-selection-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

/* Mobile only */
@media screen and (max-width: 767px) {
  .item-selection-container {
    display: flex;
    flex-direction: column;
  }
}
</style>