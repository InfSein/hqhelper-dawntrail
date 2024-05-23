<script setup lang="ts">
import { ref, computed, inject,  } from 'vue'
import type { Ref, PropType } from 'vue'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import Stepper from '../custom-controls/Stepper.vue'
import GearSlot from '../custom-controls/GearSlot.vue'
import type { AttireAffix, AccessoryAffix, GearSelections } from '@/models/gears'
import { defaultGearSelections } from '@/models/gears'
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

const createWeaponComputed = (key: "MainHand" | "OffHand", jobId: number) => {
  return computed({
    get: () => {
      return gearSelections.value?.[key]?.[jobId] || 0
    },
    set: (value : number) => {
      if (!gearSelections.value) gearSelections.value = defaultGearSelections
      if (!gearSelections.value[key]) gearSelections.value[key] = {}
      gearSelections.value[key][jobId] = value
    }
  })
}
const createAttireComputed = (key: "HeadAttire" | "BodyAttire" | "HandsAttire" | "LegsAttire" | "FeetAttire", affix: AttireAffix) => {
  return computed({
    get: () => {
      return gearSelections.value?.[key]?.[affix] || 0
    },
    set: (value : number) => {
      if (!gearSelections.value) gearSelections.value = defaultGearSelections
      if (!gearSelections.value[key]) gearSelections.value[key] = {} as Record<AttireAffix, number>
      gearSelections.value[key][affix] = value
    }
  })
}
const createAccessoryComputed = (key: "Earrings" | "Necklace" | "Wrist" | "Rings", affix: AccessoryAffix) => {
  return computed({
    get: () => {
      return gearSelections.value?.[key]?.[affix] || 0
    },
    set: (value : number) => {
      if (!gearSelections.value) gearSelections.value = defaultGearSelections
      if (!gearSelections.value[key]) gearSelections.value[key] = {} as Record<AccessoryAffix, number>
      gearSelections.value[key][affix] = value
    }
  })
}
const MainHand = createWeaponComputed('MainHand', props.jobId)
const OffHand = createWeaponComputed('OffHand', props.jobId)
const HeadAttire = createAttireComputed('HeadAttire', props.attireAffix)
const BodyAttire = createAttireComputed('BodyAttire', props.attireAffix)
const HandsAttire = createAttireComputed('HandsAttire', props.attireAffix)
const LegsAttire = createAttireComputed('LegsAttire', props.attireAffix)
const FeetAttire = createAttireComputed('FeetAttire', props.attireAffix)
const Earrings = createAccessoryComputed('Earrings', props.accessoryAffix)
const Necklace = createAccessoryComputed('Necklace', props.accessoryAffix)
const Wrist = createAccessoryComputed('Wrist', props.accessoryAffix)
const Rings = createAccessoryComputed('Rings', props.accessoryAffix)
</script>

<template>
  <FoldableCard card-key="game-gear-selection" :description="tipText">
    <template #header>
      <i class="xiv square-3"></i>
      <span class="card-title-text">{{ t('选择部件') }}</span>
    </template>
    
    <div class="gear-selection-containter">
      <table>
        <tbody>
          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/mainhand.png"
                :slot-description="t('武器/工具：主手')"
              />
            </td>
            <td><Stepper v-model:value="MainHand" /></td>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/offhand.png"
                :slot-description="t('武器/工具：副手')"
              />
            </td>
            <td><Stepper v-model:value="OffHand" /></td>
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
            <td><Stepper v-model:value="HeadAttire" /></td>
            <td style="min-width: 40px;">
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/ear.png"
                :slot-description="t('首饰：耳坠')"
              />
            </td>
            <td><Stepper v-model:value="Earrings" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/body.png"
                :slot-description="t('防具：身体')"
              />
            </td>
            <td><Stepper v-model:value="BodyAttire" /></td>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/neck.png"
                :slot-description="t('首饰：项链')"
              />
            </td>
            <td><Stepper v-model:value="Necklace" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/hands.png"
                :slot-description="t('防具：手部')"
              />
            </td>
            <td><Stepper v-model:value="HandsAttire" /></td>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/wrist.png"
                :slot-description="t('首饰：手镯')"
              />
            </td>
            <td><Stepper v-model:value="Wrist" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/legs.png"
                :slot-description="t('防具：腿部')"
              />
            </td>
            <td><Stepper v-model:value="LegsAttire" /></td>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/ring.png"
                :slot-description="t('首饰：戒指')"
              />
            </td>
            <td><Stepper v-model:value="Rings" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="~ApiBase/image/game-gear-slot/feet.png"
                :slot-description="t('防具：脚部')"
              />
            </td>
            <td><Stepper v-model:value="FeetAttire" /></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="bottom-buttons">
        <div class="content">
          <n-button class="end" size="small">{{ t('已选部件') }}</n-button>
        </div>
        <n-divider dashed />
        <n-flex class="foot" justify="end">
          <n-button size="small">{{ t('清空全部') }}</n-button>
          <n-button size="small">{{ t('清空当前') }}</n-button>
          <n-button size="small">{{ t('添加整套') }}</n-button>
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
