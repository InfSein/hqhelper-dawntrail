<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { Ref } from 'vue'
import {
  NAlert, NButton, NButtonGroup, NDivider, NFlex, NIcon, NPopover,
  useMessage,
} from 'naive-ui'
import { 
  JoinLeftOutlined,
  KeyboardArrowDownRound
} from '@vicons/material'
import FoldableCard from '../templates/FoldableCard.vue'
import Stepper from '../custom/general/Stepper.vue'
import GearSlot from '../custom/gear/GearSlot.vue'
import TooltipButton from '../custom/general/TooltipButton.vue'
import ModalSelectedGears from '../modals/ModalSelectedGears.vue'
import {
  XivGearAffixes,
  XivJobs,
  XivRoles
} from '@/assets/data'
import type { AttireAffix, AccessoryAffix, GearSelections } from '@/models/gears'
import { getDefaultGearSelections } from '@/models/gears'
import { type UserConfigModel } from '@/models/config-user'
import type { IHqVer } from '@/tools/nbb-cal-v5'
import { useGearAdder } from '@/tools/gears'

const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const NAIVE_UI_MESSAGE = useMessage()

const gearSelections = defineModel<GearSelections>('gearSelections', { required: true })
export interface GearSelectionPanelProps {
  patchSelected: string
  jobId: number
  patchData?: IHqVer
  attireAffix: AttireAffix
  accessoryAffix: AccessoryAffix
}
const props = defineProps<GearSelectionPanelProps>()
const emits = defineEmits(['joinWorkflow'])

const showSelectedGears = ref(false)

const selectedAffixes = computed(() => {
  const { jobName, attireName, accessoryName } = getAffixesName()
  return `[${jobName}/${attireName}/${accessoryName}]`
})
const affixesTips = computed(() => {
  const { jobName, attireName, accessoryName } = getAffixesName()
  return [
    t('main.select_gear.info.info_1'),
    t('main.select_gear.info.info_2', jobName),
    t('main.select_gear.info.info_3', attireName),
    t('main.select_gear.info.info_4', accessoryName)
  ]
})
const getAffixesName = () => {
  const uiLanguage = userConfig.value?.language_ui ?? 'zh'
  const jobName = XivJobs?.[props.jobId]?.[`job_name_${uiLanguage}`] || t('main.select_gear.desc.un_selected')
  const attireName = XivGearAffixes?.[props.attireAffix]?.[`name_${uiLanguage}`] || t('main.select_gear.desc.un_selected')
  const accessoryName = XivGearAffixes?.[props.accessoryAffix]?.[`name_${uiLanguage}`] || t('main.select_gear.desc.un_selected')
  return { jobName, attireName, accessoryName }
}

const jobNotSelected = computed(() => {
  return !XivJobs?.[props.jobId]
})
const disableMainhand = computed(() => {
  return jobNotSelected.value || !props.patchData?.jobs?.MainHand?.[props.jobId]?.[0]
})
const disableOffhand = computed(() => {
  return jobNotSelected.value || !props.patchData?.jobs?.OffHand?.[props.jobId]?.[0]
})
const disableAttire = computed(() => {
  return !XivGearAffixes?.[props.attireAffix]
})
const disableAccessory = computed(() => {
  return !XivGearAffixes?.[props.accessoryAffix]
})
const disableAllAttires = computed(() => {
  return disableAttire.value || (
    !props.patchData?.jobs?.HeadAttire?.[props.attireAffix]?.[0]
    && !props.patchData?.jobs?.BodyAttire?.[props.attireAffix]?.[0]
    && !props.patchData?.jobs?.HandsAttire?.[props.attireAffix]?.[0]
    && !props.patchData?.jobs?.LegsAttire?.[props.attireAffix]?.[0]
    && !props.patchData?.jobs?.FeetAttire?.[props.attireAffix]?.[0]
  )
})
const disableAllAccessories = computed(() => {
  return disableAccessory.value || (
    !props.patchData?.jobs?.Earrings?.[props.accessoryAffix]?.[0]
    && !props.patchData?.jobs?.Necklace?.[props.accessoryAffix]?.[0]
    && !props.patchData?.jobs?.Wrist?.[props.accessoryAffix]?.[0]
    && !props.patchData?.jobs?.Rings?.[props.accessoryAffix]?.[0]
  )
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
    NAIVE_UI_MESSAGE.error(t('main.select_gear.warn.select_job_first')); return
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
const {
  addMainOffHand,
  addAttire,
  addAccessory
} = useGearAdder()
const addCurrMainOffHand = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('main.select_gear.warn.select_job_first')); return
  }
  addMainOffHand(gearSelections, props.patchData, props.jobId)
}
const addCurrAttire = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('main.select_gear.warn.select_job_first')); return
  }
  addAttire(gearSelections, props.patchData, props.attireAffix)
}
const addCurrAccessory = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('main.select_gear.warn.select_job_first')); return
  }
  addAccessory(gearSelections, props.patchData, props.accessoryAffix)
}
const addAttireAndAccessory = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('main.select_gear.warn.select_job_first')); return
  }
  addCurrAttire()
  addCurrAccessory()
}
const addAll = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('main.select_gear.warn.select_job_first')); return
  }
  addCurrMainOffHand()
  addAttireAndAccessory()
}
const handleJoinWorkflow = () => {
  emits('joinWorkflow')
}
// #endregion

// #region Dropdown Options
const displayQuickOperates = computed(() => {
  // * 简单算法，有刻木主手代表是有生产采集新装的版本
  return !!props.patchData?.jobs?.MainHand?.[8]?.[0]
})

const quickOperatesOptions = computed(() => {
  return [
    {
      key: 'add-crafter-mainoff',
      label: t('main.select_gear.quick_operate.add_crafter_tool.title'),
      description: t('main.select_gear.quick_operate.add_crafter_tool.tooltip.tooltip_1')
    },
    {
      key: 'add-gatherer-mainoff',
      label: t('main.select_gear.quick_operate.add_gatherer_tool.title'),
      description: t('main.select_gear.quick_operate.add_gatherer_tool.tooltip.tooltip_1')
    },
    {
      key: 'add-crafter-aaa', 
      label: t('main.select_gear.quick_operate.add_crafter_suit.title'), 
      description: t('main.select_gear.quick_operate.add_crafter_suit.tooltip.tooltip_1'),
    },
    { 
      key: 'add-gatherer-aaa', 
      label: t('main.select_gear.quick_operate.add_gatherer_suit.title'), 
      description: t('main.select_gear.quick_operate.add_gatherer_suit.tooltip.tooltip_1'),
    },
  ]
})
const handleQuickOperatesSelect = (key: string) => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('main.select_gear.warn.select_job_first')); return
  }
  if (key === 'add-crafter-mainoff') {
    XivRoles.crafter.jobs.forEach(jobId => {
      addMainOffHand(gearSelections, props.patchData, jobId)
    })
  } else if (key === 'add-gatherer-mainoff') {
    XivRoles.gatherer.jobs.forEach(jobId => {
      addMainOffHand(gearSelections, props.patchData, jobId)
    })
  } else if (key === 'add-crafter-aaa') {
    addAttire(gearSelections, props.patchData, XivRoles.crafter.attire as AttireAffix)
    addAccessory(gearSelections, props.patchData, XivRoles.crafter.accessory as AccessoryAffix)
  } else if (key === 'add-gatherer-aaa') {
    addAttire(gearSelections, props.patchData, XivRoles.gatherer.attire as AttireAffix)
    addAccessory(gearSelections, props.patchData, XivRoles.gatherer.accessory as AccessoryAffix)
  }
}

const clearOptions = computed(() => {
  return [
    { key: 'clear-current', label: t('main.select_gear.clear.current.title'), description: t('main.select_gear.clear.current.tooltip.tooltip_1') },
    { key: 'clear-all', label: t('main.select_gear.clear.all.title'), description: t('main.select_gear.clear.all.tooltip.tooltip_1') },
  ]
})
const handleClearSelect = (key: string) => {
  if (key === 'clear-current') {
    clearCurrent()
  } else if (key === 'clear-all') {
    clearAll()
  }
}

const addsuitOptions = computed(() => {
  return [
    {
      key: 'add-weapon',
      label: t('main.select_gear.add.mainoff_hand'),
      disabled: disableMainhand.value && disableOffhand.value
    },
    {
      key: 'add-attire',
      label: t('main.select_gear.add.attire'),
      disabled: disableAllAttires.value
    },
    {
      key: 'add-accessory',
      label: t('main.select_gear.add.accessory'),
      disabled: disableAllAccessories.value
    },
    {
      key: 'add-attire-and-accessory',
      label: t('main.select_gear.add.attire_and_accessory'),
      disabled: disableAllAttires.value || disableAllAccessories.value
    },
    {
      key: 'add-suit',
      label: t('main.select_gear.add.whole_suit'),
      disabled: disableMainhand.value && disableOffhand.value && disableAllAttires.value && disableAllAccessories.value
    },
  ]
})
const handleAddsuitSelect = (key: string) => {
  if (key === 'add-weapon') {
    addCurrMainOffHand()
  } else if (key === 'add-attire') {
    addCurrAttire()
  } else if (key === 'add-accessory') {
    addCurrAccessory()
  } else if (key === 'add-attire-and-accessory') {
    addAttireAndAccessory()
  } else if (key === 'add-suit') {
    addAll()
  }
}

defineExpose({
  addCurrMainOffHand
})
</script>

<template>
  <FoldableCard card-key="game-gear-selection">
    <template #header>
      <i class="xiv square-3"></i>
      <span class="card-title-text">{{ t('main.select_gear.title') }}</span>
      <n-popover placement="bottom-start" :trigger="isMobile ? 'click' : 'hover'">
        <template #trigger>
          <span class="card-title-desc">{{ selectedAffixes }}</span>
        </template>
        <div>
          <p v-for="(tip, index) in affixesTips" :key="'title-tip' + index">
            {{ tip }}
          </p>
        </div>
      </n-popover>
    </template>
    
    <div class="gear-selection-containter">
      <n-alert
        v-if="jobNotSelected"
        type="warning"
        style="margin-bottom: 10px;"
      >
        {{ t('main.select_gear.warn.select_job_first') }}
      </n-alert>

      <table>
        <tbody>
          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/mainhand.png"
                :slot-description="t('game.gear.tool.mainhand.detailed')"
                :related-item="patchData?.jobs.MainHand?.[jobId]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="MainHand" :disabled="disableMainhand" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/offhand.png"
                :slot-description="t('game.gear.tool.offhand.detailed')"
                :related-item="patchData?.jobs.OffHand?.[jobId]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="OffHand" :disabled="disableOffhand" /></td>
          </tr>

          <tr class="divider">
            <td colspan="4"><n-divider dashed /></td>
          </tr>

          <tr>
            <td style="min-width: 40px;">
              <GearSlot
                slot-icon-src="./image/game-gear-slot/head.png"
                :slot-description="t('game.gear.attire.head.detailed')"
                :related-item="patchData?.jobs.HeadAttire?.[attireAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="HeadAttire" :disabled="disableAttire || !patchData?.jobs?.HeadAttire?.[attireAffix]?.[0]" /></td>
            <td style="min-width: 40px;">
              <GearSlot
                slot-icon-src="./image/game-gear-slot/ear.png"
                :slot-description="t('game.gear.accessory.earring.detailed')"
                :related-item="patchData?.jobs.Earrings?.[accessoryAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="Earrings" :disabled="disableAccessory || !patchData?.jobs?.Earrings?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/body.png"
                :slot-description="t('game.gear.attire.body.detailed')"
                :related-item="patchData?.jobs.BodyAttire?.[attireAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="BodyAttire" :disabled="disableAttire || !patchData?.jobs?.BodyAttire?.[attireAffix]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/neck.png"
                :slot-description="t('game.gear.accessory.necklace.detailed')"
                :related-item="patchData?.jobs.Necklace?.[accessoryAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="Necklace" :disabled="disableAccessory || !patchData?.jobs?.Necklace?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/hands.png"
                :slot-description="t('game.gear.attire.hands.detailed')"
                :related-item="patchData?.jobs.HandsAttire?.[attireAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="HandsAttire" :disabled="disableAttire || !patchData?.jobs?.HandsAttire?.[attireAffix]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/wrist.png"
                :slot-description="t('game.gear.accessory.wrist.detailed')"
                :related-item="patchData?.jobs.Wrist?.[accessoryAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="Wrist" :disabled="disableAccessory || !patchData?.jobs?.Wrist?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/legs.png"
                :slot-description="t('game.gear.attire.legs.detailed')"
                :related-item="patchData?.jobs.LegsAttire?.[attireAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="LegsAttire" :disabled="disableAttire || !patchData?.jobs?.LegsAttire?.[attireAffix]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/ring.png"
                :slot-description="t('game.gear.accessory.rings.detailed')"
                :related-item="patchData?.jobs.Rings?.[accessoryAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="Rings" :disabled="disableAccessory || !patchData?.jobs?.Rings?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/feet.png"
                :slot-description="t('game.gear.attire.feet.detailed')"
                :related-item="patchData?.jobs.FeetAttire?.[attireAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="FeetAttire" :disabled="disableAttire || !patchData?.jobs?.FeetAttire?.[attireAffix]?.[0]" /></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="bottom-buttons">
        <div class="content">
          <n-button-group class="end">
            <n-button
              :disabled="jobNotSelected"
              @click="showSelectedGears = true"
            >
              {{ t('main.select_gear.view_selected') }}
            </n-button>
            <n-popover :trigger="isMobile ? 'manual' : 'hover'" placement="top">
              <template #trigger>
                <n-button
                  class="n-square-button"
                  :disabled="jobNotSelected"
                  @click="handleJoinWorkflow"
                >
                  <n-icon :size="16"><JoinLeftOutlined /></n-icon>
                </n-button>
              </template>
              <div class="descriptions">
                <div>{{ t('workflow.join_in_workflow.entry_btn.tooltip') }}</div>
              </div>
            </n-popover>
          </n-button-group>
        </div>
        <n-divider dashed />
        <n-flex class="foot" justify="end">
          <n-popover
            v-if="displayQuickOperates"
            placement="bottom"
            :trigger="isMobile ? 'click' : 'hover'"
            :show-arrow="false"
            class="no-select"
            style="--n-padding: 4px;"
          >
            <template #trigger>
              <n-button
                icon-placement="right"
                :disabled="jobNotSelected"
              >
                <template #icon>
                  <n-icon><KeyboardArrowDownRound /></n-icon>
                </template>
                {{ t('main.select_gear.quick_operate.title') }}
              </n-button>
            </template>
            <div class="flex-col gap-2">
              <TooltipButton
                v-for="option in quickOperatesOptions"
                :key="option.key"
                quaternary
                :text="option.label"
                :tip="option.description"
                tip-type="n-tooltip"
                placement="right"
                btn-style="justify-content: start; --n-padding: 8px 16px; --n-height: auto;"
                pop-style="width: max-content;"
                @click="handleQuickOperatesSelect(option.key)"
              />
            </div>
          </n-popover>
          <n-popover
            placement="bottom"
            :trigger="isMobile ? 'click' : 'hover'"
            :show-arrow="false"
            class="no-select"
            style="--n-padding: 4px;"
          >
            <template #trigger>
              <n-button
                icon-placement="right"
                :disabled="jobNotSelected"
              >
                <template #icon>
                  <n-icon><KeyboardArrowDownRound /></n-icon>
                </template>
                {{ t('common.clear') }}
              </n-button>
            </template>
            <div class="flex-col gap-2">
              <TooltipButton
                v-for="option in clearOptions"
                :key="option.key"
                quaternary
                :text="option.label"
                :tip="option.description"
                tip-type="n-tooltip"
                placement="right"
                pop-style="width: max-content;"
                @click="handleClearSelect(option.key)"
              />
            </div>
          </n-popover>
          <n-popover
            placement="bottom"
            :trigger="isMobile ? 'click' : 'hover'"
            :show-arrow="false"
            class="no-select"
            style="--n-padding: 4px;"
          >
            <template #trigger>
              <n-button
                icon-placement="right"
                :disabled="jobNotSelected"
              >
                <template #icon>
                  <n-icon><KeyboardArrowDownRound /></n-icon>
                </template>
                {{ t('common.add') }}
              </n-button>
            </template>
            <div class="flex-col gap-2">
              <n-button
                v-for="option in addsuitOptions"
                :key="option.key"
                quaternary
                :disabled="option.disabled"
                style="justify-content: start;"
                @click="handleAddsuitSelect(option.key)"
              >
                {{ option.label }}
              </n-button>
            </div>
          </n-popover>
        </n-flex>
      </div>
    </div>

    <ModalSelectedGears
      v-model:show="showSelectedGears"
      v-model:gear-selections="gearSelections"
      :patch-data="patchData"
    />

  </FoldableCard>
</template>

<style scoped>
.gear-selection-containter {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-title-desc {
  margin-left: 10px;
  font-size: 14px;
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
  margin-top: 1em;
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

/* Mobile */
@media screen and (max-width: 767px) {
  .bottom-buttons {
    margin-top: auto;
  }
}
</style>
