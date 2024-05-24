<script setup lang="ts">
import { ref, computed, inject,  } from 'vue'
import type { Ref, PropType } from 'vue'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import Stepper from '../custom-controls/Stepper.vue'
import GearSlot from '../custom-controls/GearSlot.vue'
import type { AttireAffix, AccessoryAffix, GearSelections } from '@/models/gears'
import { getDefaultGearSelections } from '@/models/gears'
import GearAffixes from '@/assets/data/xiv-gear-affixes.json'
import XivJobs from '@/assets/data/xiv-jobs.json'
import { defaultUserConfig, type UserConfigModel } from '@/models/user-config'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)

const gearSelections = defineModel<GearSelections>('gearSelections')
const props = defineProps({
  jobId: {
    type: Number,
    required: true
  },
  attireAffix: {
    type: String as PropType<AttireAffix>,
    required: true
  },
  accessoryAffix: {
    type: String as PropType<AccessoryAffix>,
    required: true
  },
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

const tipText = computed(() => {
  const uiLanguage = userConfig.value?.language_ui ?? 'zh'
  const jobName = (XivJobs as any)?.[props.jobId]?.['job_name_' + uiLanguage] || t('未选择')
  const attireName = (GearAffixes as any)?.[props.attireAffix]?.['affix_name_' + uiLanguage] || t('未选择')
  const accessoryName = (GearAffixes as any)?.[props.accessoryAffix]?.['affix_name_' + uiLanguage] || t('未选择')
  return `[${jobName}/${attireName}/${accessoryName}]`
})

const jobNotSelected = computed(() => {
  return !(XivJobs as any)?.[props.jobId]
})
const disableWeapon = computed(() => {
  return jobNotSelected.value
})
const disableAttire = computed(() => {
  return !(GearAffixes as any)?.[props.attireAffix]
})
const disableAccessory = computed(() => {
  return !(GearAffixes as any)?.[props.accessoryAffix]
})

// #region Slot Computeds
const createWeaponComputed = (key: "MainHand" | "OffHand") => {
  return computed({
    get: () => {
      return gearSelections.value?.[key]?.[props.jobId] || 0
    },
    set: (value : number) => {
      if (!gearSelections.value) gearSelections.value = getDefaultGearSelections()
      if (!gearSelections.value[key]) gearSelections.value[key] = {}
      gearSelections.value[key][props.jobId] = value
    }
  })
}
const createAttireComputed = (key: "HeadAttire" | "BodyAttire" | "HandsAttire" | "LegsAttire" | "FeetAttire") => {
  return computed({
    get: () => {
      return gearSelections.value?.[key]?.[props.attireAffix] || 0
    },
    set: (value : number) => {
      if (!gearSelections.value) gearSelections.value = getDefaultGearSelections()
      if (!gearSelections.value[key]) gearSelections.value[key] = {} as Record<AttireAffix, number>
      gearSelections.value[key][props.attireAffix] = value
    }
  })
}
const createAccessoryComputed = (key: "Earrings" | "Necklace" | "Wrist" | "Rings") => {
  return computed({
    get: () => {
      return gearSelections.value?.[key]?.[props.accessoryAffix] || 0
    },
    set: (value : number) => {
      if (!gearSelections.value) gearSelections.value = getDefaultGearSelections()
      if (!gearSelections.value[key]) gearSelections.value[key] = {} as Record<AccessoryAffix, number>
      gearSelections.value[key][props.accessoryAffix] = value
    }
  })
}
const MainHand = createWeaponComputed('MainHand')
const OffHand = createWeaponComputed('OffHand')
const HeadAttire = createAttireComputed('HeadAttire')
const BodyAttire = createAttireComputed('BodyAttire')
const HandsAttire = createAttireComputed('HandsAttire')
const LegsAttire = createAttireComputed('LegsAttire')
const FeetAttire = createAttireComputed('FeetAttire')
const Earrings = createAccessoryComputed('Earrings')
const Necklace = createAccessoryComputed('Necklace')
const Wrist = createAccessoryComputed('Wrist')
const Rings = createAccessoryComputed('Rings')
// #endregion

// #region Button Functions
const clearAll = () => {
  gearSelections.value = getDefaultGearSelections()
}
const clearCurrent = () => {
  MainHand.value = 0
  OffHand.value = 0
  HeadAttire.value = 0
  BodyAttire.value = 0
  HandsAttire.value = 0
  LegsAttire.value = 0
  FeetAttire.value = 0
  Earrings.value = 0
  Necklace.value = 0
  Wrist.value = 0
  Rings.value = 0
}
// #endregion
</script>

<template>
  <FoldableCard card-key="game-gear-selection" :description="tipText">
    <template #header>
      <i class="xiv square-3"></i>
      <span class="card-title-text">{{ t('选择部件') }}</span>
    </template>
    
    <div class="gear-selection-containter">
      <n-alert
        v-if="jobNotSelected"
        type="warning"
        style="margin-bottom: 10px;"
      >
        {{ t('请先选择职业') }}
      </n-alert>

      <table>
        <tbody>
          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/mainhand.png"
                :slot-description="t('武器/工具：主手')"
              />
            </td>
            <td><Stepper v-model:value="MainHand" :disabled="disableWeapon" /></td>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/offhand.png"
                :slot-description="t('武器/工具：副手')"
              />
            </td>
            <td><Stepper v-model:value="OffHand" :disabled="disableWeapon" /></td>
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
            <td><Stepper v-model:value="HeadAttire" :disabled="disableAttire" /></td>
            <td style="min-width: 40px;">
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/ear.png"
                :slot-description="t('首饰：耳坠')"
              />
            </td>
            <td><Stepper v-model:value="Earrings" :disabled="disableAccessory" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/body.png"
                :slot-description="t('防具：身体')"
              />
            </td>
            <td><Stepper v-model:value="BodyAttire" :disabled="disableAttire" /></td>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/neck.png"
                :slot-description="t('首饰：项链')"
              />
            </td>
            <td><Stepper v-model:value="Necklace" :disabled="disableAccessory" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/hands.png"
                :slot-description="t('防具：手部')"
              />
            </td>
            <td><Stepper v-model:value="HandsAttire" :disabled="disableAttire" /></td>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/wrist.png"
                :slot-description="t('首饰：手镯')"
              />
            </td>
            <td><Stepper v-model:value="Wrist" :disabled="disableAccessory" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/legs.png"
                :slot-description="t('防具：腿部')"
              />
            </td>
            <td><Stepper v-model:value="LegsAttire" :disabled="disableAttire" /></td>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/ring.png"
                :slot-description="t('首饰：戒指')"
              />
            </td>
            <td><Stepper v-model:value="Rings" :disabled="disableAccessory" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/feet.png"
                :slot-description="t('防具：脚部')"
              />
            </td>
            <td><Stepper v-model:value="FeetAttire" :disabled="disableAttire" /></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="bottom-buttons">
        <div class="content">
          <n-button class="end" size="small" :disabled="jobNotSelected">{{ t('已选部件') }}</n-button>
        </div>
        <n-divider dashed />
        <n-flex class="foot" justify="end">
          <n-button size="small" :disabled="jobNotSelected" @click="clearAll">{{ t('清空全部') }}</n-button>
          <n-button size="small" :disabled="jobNotSelected" @click="clearCurrent">{{ t('清空当前') }}</n-button>
          <n-button size="small" :disabled="jobNotSelected">{{ t('添加整套') }}</n-button>
        </n-flex>
      </div>
    </div>

  </FoldableCard>
</template>

<style scoped>
.gear-selection-containter {
  height: 100%;
  display: flex;
  flex-direction: column;
}
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
  margin-top: auto;
  margin-right: 3px;
  
  .content {
    display: flex;
    justify-content: end;
    margin-bottom: 6px;
  }
  .foot {
    margin-top: 6px;
  }
}
</style>
