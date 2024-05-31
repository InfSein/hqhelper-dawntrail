<script setup lang="ts">
import { ref, computed, inject, h,  } from 'vue'
import type { Ref, PropType, VNode } from 'vue'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import Stepper from '../custom-controls/Stepper.vue'
import GearSlot from '../custom-controls/GearSlot.vue'
import type { AttireAffix, AccessoryAffix, GearSelections } from '@/models/gears'
import { getDefaultGearSelections } from '@/models/gears'
import GearAffixes from '@/assets/data/xiv-gear-affixes.json'
import XivJobs from '@/assets/data/xiv-jobs.json'
import { defaultUserConfig, type UserConfigModel } from '@/models/user-config'
import { NTooltip, useMessage, type DropdownGroupOption, type DropdownOption } from 'naive-ui'
import { KeyboardArrowDownRound } from '@vicons/material'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)
const NAIVE_UI_MESSAGE = useMessage()

const gearSelections = defineModel<GearSelections>('gearSelections', { required: true })
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
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
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
const addMainOffHand = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  MainHand.value++
  OffHand.value++
}
const addAttire = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  HeadAttire.value++
  BodyAttire.value++
  HandsAttire.value++
  LegsAttire.value++
  FeetAttire.value++
}
const addAccessory = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  Earrings.value++
  Necklace.value++
  Wrist.value++
  Rings.value += 2
}
const addAttireAndAccessory = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  addAttire()
  addAccessory()
}
const addAll = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  addMainOffHand()
  addAttireAndAccessory()
}
// #endregion

// #region Dropdown Options
const renderOption = ({ node, option }: { node: VNode, option: DropdownOption | DropdownGroupOption }) => {
  return h(
    NTooltip,
    { keepAliveOnHover: false, style: { width: 'max-content', display: isMobile.value ? 'none' : 'inherit' } },
    {
      trigger: () => [node],
      default: () => option.description
    }
  )
}

const showClearOptions = ref(false)
const handleClearDropdownMouseEnter = (event: MouseEvent) => {
  if (isMobile.value) return
  if ((event.target as HTMLButtonElement).disabled) return
  showClearOptions.value = true
}
const handleClearDropdownMouseLeave = (event: MouseEvent) => {
  if (isMobile.value) return
  if ((event.target as HTMLButtonElement).disabled) return
  showClearOptions.value = false
}
const clearOptions: DropdownOption[] = [
  { key: 'clear-current', label: t('清空当前'), description: t('清空当前职业的已选择部件') },
  { key: 'clear-all', label: t('清空全部'), description: t('清空所有职业的已选择部件') },
]
const handleClearSelect = (key: string) => {
  if (key === 'clear-current') {
    clearCurrent()
  } else if (key === 'clear-all') {
    clearAll()
  }
}

const showAddsuitOptions = ref(false)
const handleAddsuitDropdownMouseEnter = (event: MouseEvent) => {
  if (isMobile.value) return
  if ((event.target as HTMLButtonElement).disabled) return
  showAddsuitOptions.value = true
}
const handleAddsuitDropdownMouseLeave = (event: MouseEvent) => {
  if (isMobile.value) return
  if ((event.target as HTMLButtonElement).disabled) return
  showAddsuitOptions.value = false
}
const addsuitOptions: DropdownOption[] = [
  { key: 'add-weapon', label: t('添加一套主副手'), description: t('为当前职业添加一套主副手') },
  { key: 'add-attire', label: t('添加一套防具'), description: t('为当前职业添加一套防具') },
  { key: 'add-accessory', label: t('添加一套首饰'), description: t('为当前职业添加一套首饰') },
  { key: 'add-attire-and-accessory', label: t('添加一套防具和首饰'), description: t('为当前职业添加一套防具和首饰') },
  { key: 'add-suit', label: t('添加整套'), description: t('为当前职业添加一套主副手、防具和首饰') },
  { key: 'add-selfdef', label: t('添加(自定义)'), description: t('打开单独的窗口，自定义地添加套装') },
]
const handleAddsuitSelect = (key: string) => {
  if (key === 'add-weapon') {
    addMainOffHand()
  } else if (key === 'add-attire') {
    addAttire()
  } else if (key === 'add-accessory') {
    addAccessory()
  } else if (key === 'add-attire-and-accessory') {
    addAttireAndAccessory()
  } else if (key === 'add-suit') {
    addAll()
  } else if (key === 'add-selfdef') {
    // TODO: Add Self-defined Suit
  }
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
          <n-dropdown
            :show="showClearOptions"
            :options="clearOptions"
            :render-option="renderOption"
            class="no-select"
            @select="handleClearSelect"
            @mouseenter="handleClearDropdownMouseEnter"
            @mouseleave="handleClearDropdownMouseLeave"
          >
            <n-button
              icon-placement="right"
              :disabled="jobNotSelected"
              @click="showClearOptions = !showClearOptions"
              @mouseenter="handleClearDropdownMouseEnter"
              @mouseleave="handleClearDropdownMouseLeave"
            >
              <template #icon>
                <n-icon><KeyboardArrowDownRound /></n-icon>
              </template>
              {{ t('清空') }}
            </n-button>
          </n-dropdown>
          <n-dropdown
            :show="showAddsuitOptions"
            :options="addsuitOptions"
            :render-option="renderOption"
            class="no-select"
            @select="handleAddsuitSelect"
            @mouseenter="handleAddsuitDropdownMouseEnter"
            @mouseleave="handleAddsuitDropdownMouseLeave"
          >
            <n-button
              icon-placement="right"
              :disabled="jobNotSelected"
              @click="showAddsuitOptions = !showAddsuitOptions"
              @mouseenter="handleAddsuitDropdownMouseEnter"
              @mouseleave="handleAddsuitDropdownMouseLeave"
            >
              <template #icon>
                <n-icon><KeyboardArrowDownRound /></n-icon>
              </template>
              {{ t('添加') }}
            </n-button>
          </n-dropdown>
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
