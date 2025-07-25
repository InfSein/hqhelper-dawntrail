<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  NCard, NTabs, NTabPane
} from 'naive-ui'
import {
  JoinLeftOutlined,
  DeleteSweepRound
} from '@vicons/material'
import FoldableCard from '../templates/FoldableCard.vue'
import XivFARImage from '../custom/general/XivFARImage.vue'
import ItemStepper from '../custom/item/ItemStepper.vue'
import { useNbbCal } from '@/tools/use-nbb-cal'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import TooltipButton from '../custom/general/TooltipButton.vue'

const t = inject<(message: string, args?: any) => string>('t')!

const patchModel = defineModel<string>('patch', { required: true })
const itemSelected = defineModel<Record<number, number>>('itemSelected', { required: true })

const emits = defineEmits(['joinWorkflow'])

const { getFoodAndTincs_v2 } = useNbbCal()
const foodAndTincs = computed(() => getFoodAndTincs_v2())

const handleClearSelections = () => {
  for (const id in itemSelected.value) {
    itemSelected.value[id] = 0
  }
}
const fixPatch = (patch: string) => {
  return patch.replace('LEVELING', t('common.quoted_leveling'))
}

const handleJoinWorkflow = () => {
  emits('joinWorkflow')
}

const handleExportToNgaBbsCode = (items : ItemInfo[]) => {
  const lines : string[] = []
  items.forEach(item => {
    let line = ''
    line += `[img]${item.iconUrl}[/img]` + '\t'
    line += item.name_zh
    line += `[size=70%][color=gray]${item.name_ja} / ${item.name_en}[/color][/size]` + '\t'
    const requires : string[] = []
    item.craftRequires.forEach(require => {
      const rqItemName = getItemInfo(require.id).name_zh
      requires.push(`${rqItemName}x${require.count}`)
    })
    line += requires.join('、')
    lines.push(line)
  })
  console.log(lines.join('\n'))
}
</script>

<template>
  <div>
    <FoldableCard card-key="ft-item-selection">
      <template #header>
        <i class="xiv square-1"></i>
        <span class="card-title-text">{{ t('ft_helper.select_food_and_tinc') }}</span>
      </template>

      <n-tabs v-model:value="patchModel" type="line" animated>
        <n-tab-pane
          v-for="(foodAndTinc, patch) in foodAndTincs"
          :key="'foodAndTincs-' + patch"
          :name="patch"
          :tab="t('common.patch_x', fixPatch(patch))"
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
                  <span class="title">{{ t('common.food') }}</span>
                  <a v-if="false" href="javascript:void(0)" @click="handleExportToNgaBbsCode(foodAndTinc.foods)">[EXPORT]</a>
                </div>
              </template>
              
              <div class="item-btn-container">
                <ItemStepper
                  class="item"
                  v-for="(item, index) in foodAndTinc.foods"
                  :key="`food-${patch}-${index}`"
                  :item-info="item"
                  v-model:value="itemSelected[item.id]"
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
                  <span class="title">{{ t('common.tinc') }}</span>
                  <a v-if="false" href="javascript:void(0)" @click="handleExportToNgaBbsCode(foodAndTinc.tincs)">[EXPORT]</a>
                </div>
              </template>
              
              <div class="item-btn-container">
                <ItemStepper
                  class="item"
                  v-for="(item, index) in foodAndTinc.tincs"
                  :key="`tinc-${patch}-${index}`"
                  :item-info="item"
                  v-model:value="itemSelected[item.id]"
                />
              </div>
            </n-card>
          </div>
        </n-tab-pane>
      </n-tabs>

      <div class="actions">
        <TooltipButton
          :icon="JoinLeftOutlined"
          :text="t('workflow.text.join_in_workflow')"
          :tip="t('workflow.text.join_selected_food_and_tinc_in_workflow')"
          @click="handleJoinWorkflow"
        />
        <TooltipButton
          :icon="DeleteSweepRound"
          :text="t('common.clear')"
          :tip="t('ft_helper.tooltip.clear_selected')"
          @click="handleClearSelections"
        />
      </div>
      
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
.actions {
  display: flex;
  justify-content: end;
  margin-top: 1em;
  gap: 5px;
}

/* PC only */
@media screen and (min-width: 768px) {
  .item-selection-container {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

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