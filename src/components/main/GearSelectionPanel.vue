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

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
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
    t('相同的装备会合并显示。'),
    t('当前主副手对应职业：{}', jobName),
    t('当前防具对应的词缀：{}', attireName),
    t('当前首饰对应的词缀：{}', accessoryName)
  ]
})
const getAffixesName = () => {
  const uiLanguage = userConfig.value?.language_ui ?? 'zh'
  const jobName = XivJobs?.[props.jobId]?.[`job_name_${uiLanguage}`] || t('未选择')
  const attireName = XivGearAffixes?.[props.attireAffix]?.[`name_${uiLanguage}`] || t('未选择')
  const accessoryName = XivGearAffixes?.[props.accessoryAffix]?.[`name_${uiLanguage}`] || t('未选择')
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
const {
  addMainOffHand,
  addAttire,
  addAccessory
} = useGearAdder()
const addCurrMainOffHand = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  addMainOffHand(gearSelections, props.patchData, props.jobId)
}
const addCurrAttire = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  addAttire(gearSelections, props.patchData, props.attireAffix)
}
const addCurrAccessory = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  addAccessory(gearSelections, props.patchData, props.accessoryAffix)
}
const addAttireAndAccessory = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  addCurrAttire()
  addCurrAccessory()
}
const addAll = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
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
      label: t('添加一套生产主副手'),
      description: t('添加所有能工巧匠职业的主手&副手工具各1件。')
    },
    {
      key: 'add-gatherer-mainoff',
      label: t('添加一套采集主副手'),
      description: t('添加所有大地使者职业的主手&副手工具各1件。')
    },
    {
      key: 'add-crafter-aaa', 
      label: t('添加一套生产防具&首饰'), 
      description: t('添加一套能工巧匠职业共用的防具与首饰。'),
    },
    { 
      key: 'add-gatherer-aaa', 
      label: t('添加一套采集防具&首饰'), 
      description: t('添加一套大地使者职业共用的防具与首饰。'),
    },
  ]
})
const handleQuickOperatesSelect = (key: string) => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
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
    { key: 'clear-current', label: t('清空当前'), description: t('清空当前职业的已选择部件。') },
    { key: 'clear-all', label: t('清空全部'), description: t('清空所有职业的已选择部件。') },
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
      label: t('添加一套主副手'),
      disabled: disableMainhand.value && disableOffhand.value
    },
    {
      key: 'add-attire',
      label: t('添加一套防具'),
      disabled: disableAllAttires.value
    },
    {
      key: 'add-accessory',
      label: t('添加一套首饰'),
      disabled: disableAllAccessories.value
    },
    {
      key: 'add-attire-and-accessory',
      label: t('添加一套防具和首饰'),
      disabled: disableAllAttires.value || disableAllAccessories.value
    },
    {
      key: 'add-suit',
      label: t('添加整套'),
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
      <span class="card-title-text">{{ t('选择部件') }}</span>
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
        {{ t('请先选择职业') }}
      </n-alert>

      <table>
        <tbody>
          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/mainhand.png"
                :slot-description="t('武器/工具：主手')"
                :related-item="patchData?.jobs.MainHand?.[jobId]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="MainHand" :disabled="disableMainhand" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/offhand.png"
                :slot-description="t('武器/工具：副手')"
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
                :slot-description="t('防具：头部')"
                :related-item="patchData?.jobs.HeadAttire?.[attireAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="HeadAttire" :disabled="disableAttire || !patchData?.jobs?.HeadAttire?.[attireAffix]?.[0]" /></td>
            <td style="min-width: 40px;">
              <GearSlot
                slot-icon-src="./image/game-gear-slot/ear.png"
                :slot-description="t('首饰：耳坠')"
                :related-item="patchData?.jobs.Earrings?.[accessoryAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="Earrings" :disabled="disableAccessory || !patchData?.jobs?.Earrings?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/body.png"
                :slot-description="t('防具：身体')"
                :related-item="patchData?.jobs.BodyAttire?.[attireAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="BodyAttire" :disabled="disableAttire || !patchData?.jobs?.BodyAttire?.[attireAffix]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/neck.png"
                :slot-description="t('首饰：项链')"
                :related-item="patchData?.jobs.Necklace?.[accessoryAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="Necklace" :disabled="disableAccessory || !patchData?.jobs?.Necklace?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/hands.png"
                :slot-description="t('防具：手部')"
                :related-item="patchData?.jobs.HandsAttire?.[attireAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="HandsAttire" :disabled="disableAttire || !patchData?.jobs?.HandsAttire?.[attireAffix]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/wrist.png"
                :slot-description="t('首饰：手镯')"
                :related-item="patchData?.jobs.Wrist?.[accessoryAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="Wrist" :disabled="disableAccessory || !patchData?.jobs?.Wrist?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/legs.png"
                :slot-description="t('防具：腿部')"
                :related-item="patchData?.jobs.LegsAttire?.[attireAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="LegsAttire" :disabled="disableAttire || !patchData?.jobs?.LegsAttire?.[attireAffix]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/ring.png"
                :slot-description="t('首饰：戒指')"
                :related-item="patchData?.jobs.Rings?.[accessoryAffix]?.[0] ?? 0"
              />
            </td>
            <td><Stepper v-model:value="Rings" :disabled="disableAccessory || !patchData?.jobs?.Rings?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/feet.png"
                :slot-description="t('防具：脚部')"
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
              {{ t('已选部件') }}
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
                <div>{{ t('将已选的装备加入到某条工作流') }}</div>
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
                {{ t('快速操作') }}
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
                {{ t('清空') }}
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
                {{ t('添加') }}
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
