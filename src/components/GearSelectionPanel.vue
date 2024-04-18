<script setup lang="ts">
import { ref, inject } from 'vue'
import FoldableCard from './custom-controls/FoldableCard.vue'
import Stepper from './custom-controls/Stepper.vue'
import GearSlot from './custom-controls/GearSlot.vue'

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
  HeadAttire: 0,
  BodyAttire: 0,
  HandsAttire: 0,
  LegsAttire: 0,
  FeetAttire: 0,
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
          <td>
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/mainhand.png"
              :slot-description="t('武器/工具：主手')"
            />
          </td>
          <td><Stepper v-model:value="selections.MainHand" /></td>
          <td>
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/offhand.png"
              :slot-description="t('武器/工具：副手')"
            />
          </td>
          <td><Stepper v-model:value="selections.OffHand" /></td>
        </tr>

        <tr class="divider">
          <td colspan="4"><n-divider dashed /></td>
        </tr>

        <tr>
          <td style="min-width: 40px;">
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/head.png"
              :slot-description="t('防具：头部')"
            />
          </td>
          <td><Stepper v-model:value="selections.HeadAttire" /></td>
          <td style="min-width: 40px;">
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/ear.png"
              :slot-description="t('首饰：耳坠')"
            />
          </td>
          <td><Stepper v-model:value="selections.Earrings" /></td>
        </tr>

        <tr>
          <td>
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/body.png"
              :slot-description="t('防具：身体')"
            />
          </td>
          <td><Stepper v-model:value="selections.BodyAttire" /></td>
          <td>
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/neck.png"
              :slot-description="t('首饰：项链')"
            />
          </td>
          <td><Stepper v-model:value="selections.Necklace" /></td>
        </tr>

        <tr>
          <td>
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/hands.png"
              :slot-description="t('防具：手部')"
            />
          </td>
          <td><Stepper v-model:value="selections.HandsAttire" /></td>
          <td>
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/wrist.png"
              :slot-description="t('首饰：手镯')"
            />
          </td>
          <td><Stepper v-model:value="selections.Wrist" /></td>
        </tr>

        <tr>
          <td>
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/legs.png"
              :slot-description="t('防具：腿部')"
            />
          </td>
          <td><Stepper v-model:value="selections.LegsAttire" /></td>
          <td>
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/ring.png"
              :slot-description="t('首饰：戒指')"
            />
          </td>
          <td><Stepper v-model:value="selections.Rings" /></td>
        </tr>

        <tr>
          <td>
            <GearSlot
              slot-icon-src="~ApiBase/image/game-gear-slot/feet.png"
              :slot-description="t('防具：脚部')"
            />
          </td>
          <td><Stepper v-model:value="selections.FeetAttire" /></td>
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
