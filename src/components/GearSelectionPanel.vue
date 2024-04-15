<script setup lang="ts">
import { ref, inject } from 'vue'
import FoldableCard from './custom-controls/FoldableCard.vue'
import Stepper from './custom-controls/Stepper.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

defineProps({
  /**
   * Whether to merge the `off-hand` slot with the `main-hand` slot
   * 
   * Represents this job has no `off-hand` weapon or its `main-hand` and `off-hand` can be crafted concurrently.
   * @default true
   * */
  mergeOffHand: {
    type: Boolean,
    default: true
  },
  canEditMainHand: {
    type: Boolean,
    default: true
  }
})

/*
"MainHand": 37000,    // 主手
"OffHand": 37001,     // 副手
"HeadArmor": 0,       // 头部防具
"BodyArmor": 0,       // 身体防具
"HandsArmor": 0,      // 手部防具
"LegsArmor": 0,       // 腿部防具
"FeetArmor": 0,       // 脚部防具
"Earrings": 0,        // 耳坠
"Necklace": 0,        // 项链
"Wrist": 0,           // 手镯
"Rings": 0,           // 戒指
*/
const selections = ref({
  MainHand: 0,
  OffHand: 0,
  HeadArmor: 0,
  BodyArmor: 0,
  HandsArmor: 0,
  LegsArmor: 0,
  FeetArmor: 0,
  Earrings: 0,
  Necklace: 0,
  Wrist: 0,
  Rings: 0
})
</script>

<template>
  <FoldableCard card-key="game-gear-selection">
    <template #header>
      <i class="xiv square-3"></i>
      <span class="card-title-text">{{ t('选择部件') }}</span>
    </template>
    <n-flex>
      <Stepper v-model:value="selections.MainHand" :label="t('主手')" />
      <Stepper v-model:value="selections.OffHand" :label="t('副手')" />
    </n-flex>
    <n-divider />
    <n-flex>
      <n-flex vertical>
        <Stepper v-model:value="selections.HeadArmor" :label="t('头部')" />
        <Stepper v-model:value="selections.BodyArmor" :label="t('身体')" />
        <Stepper v-model:value="selections.HandsArmor" :label="t('手部')" />
        <Stepper v-model:value="selections.LegsArmor" :label="t('腿部')" />
        <Stepper v-model:value="selections.FeetArmor" :label="t('脚部')" />
      </n-flex>
      <n-flex vertical>
        <Stepper v-model:value="selections.Earrings" :label="t('耳坠')" />
        <Stepper v-model:value="selections.Necklace" :label="t('项链')" />
        <Stepper v-model:value="selections.Wrist" :label="t('手镯')" />
        <Stepper v-model:value="selections.Rings" :label="t('戒指')" />
      </n-flex>
    </n-flex>
  </FoldableCard>
</template>

<style scoped>
:deep(input.n-input__input-el) {
  text-align: center;
}
</style>