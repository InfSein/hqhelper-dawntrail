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
    <table>
      <tbody>
        <tr>
          <td>{{ t('主手') }}</td>
          <td><Stepper v-model:value="selections.MainHand" /></td>
          <td>{{ t('副手') }}</td>
          <td><Stepper v-model:value="selections.OffHand" /></td>
        </tr>

        <tr class="divider">
          <td colspan="4"><n-divider dashed /></td>
        </tr>

        <tr>
          <td style="min-width: 40px;">{{ t('头部') }}</td>
          <td><Stepper v-model:value="selections.HeadArmor" /></td>
          <td style="min-width: 40px;">{{ t('耳坠') }}</td>
          <td><Stepper v-model:value="selections.Earrings" /></td>
        </tr>

        <tr>
          <td>{{ t('身体') }}</td>
          <td><Stepper v-model:value="selections.BodyArmor" /></td>
          <td>{{ t('项链') }}</td>
          <td><Stepper v-model:value="selections.Necklace" /></td>
        </tr>

        <tr>
          <td>{{ t('手部') }}</td>
          <td><Stepper v-model:value="selections.HandsArmor" /></td>
          <td>{{ t('手镯') }}</td>
          <td><Stepper v-model:value="selections.Wrist" /></td>
        </tr>

        <tr>
          <td>{{ t('腿部') }}</td>
          <td><Stepper v-model:value="selections.LegsArmor" /></td>
          <td>{{ t('戒指') }}</td>
          <td><Stepper v-model:value="selections.Rings" /></td>
        </tr>

        <tr>
          <td>{{ t('脚部') }}</td>
          <td><Stepper v-model:value="selections.FeetArmor" /></td>
          <td></td>
          <td>
            <div style="display: flex; justify-content: end;">
              <n-button size="small" style="width: 85%;">{{ t('已选部件') }}</n-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <n-divider dashed />

    <n-flex class="bottom-buttons" justify="end">
      <n-button size="small">{{ t('清空全部') }}</n-button>
      <n-button size="small">{{ t('清空当前') }}</n-button>
      <n-button size="small">{{ t('添加整套') }}</n-button>
    </n-flex>

  </FoldableCard>
</template>

<style scoped>
table {
  width: 100%;

  td {
    text-align: center;
  }
}
.n-divider {
  margin: 3px 0;
}
.bottom-buttons {
  margin-top: 6px;
  margin-right: 3px;
}
</style>
