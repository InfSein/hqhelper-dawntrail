<script setup lang="ts">
import { ref, computed, inject, h, watch,  } from 'vue'
import type { Ref, PropType, VNode } from 'vue'
import {
  NAlert, NButton, NDropdown, NDivider, NFlex, NIcon, NPopover, NTooltip,
  useMessage, type DropdownGroupOption, type DropdownOption
} from 'naive-ui'
import { 
  KeyboardArrowDownRound
} from '@vicons/material'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import Stepper from '../custom-controls/Stepper.vue'
import GearSlot from '../custom-controls/GearSlot.vue'
import ModalSelectedGears from '../modals/ModalSelectedGears.vue'
import type { AttireAffix, AccessoryAffix, GearSelections } from '@/models/gears'
import { getDefaultGearSelections } from '@/models/gears'
import GearAffixes from '@/assets/data/xiv-gear-affixes.json'
import XivJobs from '@/assets/data/xiv-jobs.json'
import XivRoles from '@/assets/data/xiv-roles.json'
import { type UserConfigModel } from '@/models/user-config'
import { useNbbCal } from '@/tools/use-nbb-cal'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const NAIVE_UI_MESSAGE = useMessage()
const { getPatchData } = useNbbCal()

const gearSelections = defineModel<GearSelections>('gearSelections', { required: true })
const props = defineProps({
  patchSelected: {
    type: String,
    required: true
  },
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

const showSelectedGears = ref(false)

const patchData = computed(() => {
  return getPatchData(props.patchSelected)
})

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
  const jobName = (XivJobs as any)?.[props.jobId]?.['job_name_' + uiLanguage] || t('未选择')
  const attireName = (GearAffixes as any)?.[props.attireAffix]?.['affix_name_' + uiLanguage] || t('未选择')
  const accessoryName = (GearAffixes as any)?.[props.accessoryAffix]?.['affix_name_' + uiLanguage] || t('未选择')
  return { jobName, attireName, accessoryName }
}

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
const addMainOffHand = (jobId: number) => {
  if (patchData.value.jobs.MainHand?.[jobId]?.[0]) {
    gearSelections.value.MainHand[jobId]++
  }
  if (patchData.value.jobs.OffHand?.[jobId]?.[0]) {
    gearSelections.value.OffHand[jobId]++
  }
}
const addAttire = (affix: AttireAffix) => {
  if (patchData.value.jobs.HeadAttire?.[affix]?.[0]) {
    gearSelections.value.HeadAttire[affix]++
  }
  if (patchData.value.jobs.BodyAttire?.[affix]?.[0]) {
    gearSelections.value.BodyAttire[affix]++
  }
  if (patchData.value.jobs.HandsAttire?.[affix]?.[0]) {
    gearSelections.value.HandsAttire[affix]++
  }
  if (patchData.value.jobs.LegsAttire?.[affix]?.[0]) {
    gearSelections.value.LegsAttire[affix]++
  }
  if (patchData.value.jobs.FeetAttire?.[affix]?.[0]) {
    gearSelections.value.FeetAttire[affix]++
  }
}
const addAccessory = (affix: AccessoryAffix) => {
  if (patchData.value.jobs.Earrings?.[affix]?.[0]) {
    gearSelections.value.Earrings[affix]++
  }
  if (patchData.value.jobs.Necklace?.[affix]?.[0]) {
    gearSelections.value.Necklace[affix]++
  }
  if (patchData.value.jobs.Wrist?.[affix]?.[0]) {
    gearSelections.value.Wrist[affix]++
  }
  if (patchData.value.jobs.Rings?.[affix]?.[0]) {
    gearSelections.value.Rings[affix] += 2
  }
}
const addCurrMainOffHand = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  addMainOffHand(props.jobId)
}
const addCurrAttire = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  addAttire(props.attireAffix)
}
const addCurrAccessory = () => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  addAccessory(props.accessoryAffix)
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
// #endregion

// #region Dropdown Options
const renderOption = ({ node, option }: { node: VNode, option: DropdownOption | DropdownGroupOption }) => {
  return option.description ? h(
    NTooltip,
    { keepAliveOnHover: false, placement: 'right', style: { width: 'max-content', display: isMobile.value ? 'none' : 'inherit' } },
    {
      trigger: () => [node],
      default: () => option.description
    }
  ) : h(
    node
  )
}

const showQuickOperatesOptions = ref(false)
const handleQuickOperatesDropdownMouseEnter = (event: MouseEvent) => {
  if (isMobile.value) return
  if ((event.target as HTMLButtonElement).disabled) return
  showQuickOperatesOptions.value = true
}
const handleQuickOperatesDropdownMouseLeave = (event: MouseEvent) => {
  if (isMobile.value) return
  if ((event.target as HTMLButtonElement).disabled) return
  showQuickOperatesOptions.value = false
}
const handleCloseQuickOperatesOptions = () => {
  showQuickOperatesOptions.value = false
}
const quickOperatesOptions: DropdownOption[] = [
  { key: 'add-crafter-mainoff', label: t('添加一套生产主副手'), description: t('添加所有能工巧匠职业的主手工具、副手工具各1件') },
  { key: 'add-gatherer-mainoff', label: t('添加一套采集主副手'), description: t('添加所有大地使者职业的主手工具、副手工具各1件') },
  { key: 'add-crafter-aaa', label: t('添加一套生产防具&首饰'), description: t('添加一套能工巧匠职业共用的防具与首饰。如果没有首饰则不会添加。') },
  { key: 'add-gatherer-aaa', label: t('添加一套采集防具&首饰'), description: t('添加一套大地使者职业共用的防具与首饰。如果没有首饰则不会添加。') },
  // `aaa` means `attire-and-accessory`, does it droll?
]
const handleQuickOperatesSelect = (key: string) => {
  if (jobNotSelected.value) {
    NAIVE_UI_MESSAGE.error(t('请先选择职业')); return
  }
  if (key === 'add-crafter-mainoff') {
    XivRoles.crafter.jobs.forEach(jobId => {
      addMainOffHand(jobId)
    })
  } else if (key === 'add-gatherer-mainoff') {
    XivRoles.gatherer.jobs.forEach(jobId => {
      addMainOffHand(jobId)
    })
  } else if (key === 'add-crafter-aaa') {
    addAttire(XivRoles.crafter.attire as AttireAffix)
    addAccessory(XivRoles.crafter.accessory as AccessoryAffix)
  } else if (key === 'add-gatherer-aaa') {
    addAttire(XivRoles.gatherer.attire as AttireAffix)
    addAccessory(XivRoles.gatherer.accessory as AccessoryAffix)
  }
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
const handleCloseClearOptions = () => {
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
const handleCloseAddsuitOptions = () => {
  showAddsuitOptions.value = false
}
const addsuitOptions: DropdownOption[] = [
  { key: 'add-weapon', label: t('添加一套主副手') },
  { key: 'add-attire', label: t('添加一套防具') },
  { key: 'add-accessory', label: t('添加一套首饰') },
  { key: 'add-attire-and-accessory', label: t('添加一套防具和首饰') },
  { key: 'add-suit', label: t('添加整套') },
  // { key: 'add-selfdef', label: t('添加(自定义)'), description: t('打开单独的窗口，自定义地添加套装') },
]
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
  } else if (key === 'add-selfdef') {
    // // TODO: Add Self-defined Suit
  }
}

// keep only one dropdown open at a time
watch(showQuickOperatesOptions, (newValue) => {
  if (newValue) {
    showClearOptions.value = false
    showAddsuitOptions.value = false
  }
})
watch(showClearOptions, (newValue) => {
  if (newValue) {
    showQuickOperatesOptions.value = false
    showAddsuitOptions.value = false
  }
})
watch(showAddsuitOptions, (newValue) => {
  if (newValue) {
    showQuickOperatesOptions.value = false
    showClearOptions.value = false
  }
})

// #endregion

defineExpose({
  addCurrMainOffHand
})
</script>

<template>
  <FoldableCard card-key="game-gear-selection">
    <template #header>
      <i class="xiv square-3"></i>
      <span class="card-title-text">{{ t('选择部件') }}</span>
      <n-popover placement="bottom-start">
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
              />
            </td>
            <td><Stepper v-model:value="MainHand" :disabled="disableWeapon || !patchData.jobs.MainHand?.[jobId]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/offhand.png"
                :slot-description="t('武器/工具：副手')"
              />
            </td>
            <td><Stepper v-model:value="OffHand" :disabled="disableWeapon || !patchData.jobs.OffHand?.[jobId]?.[0]" /></td>
          </tr>

          <tr class="divider">
            <td colspan="4"><n-divider dashed /></td>
          </tr>

          <tr>
            <td style="min-width: 40px;">
              <GearSlot
                slot-icon-src="./image/game-gear-slot/head.png"
                :slot-description="t('防具：头部')"
              />
            </td>
            <td><Stepper v-model:value="HeadAttire" :disabled="disableAttire || !patchData.jobs.HeadAttire?.[attireAffix]?.[0]" /></td>
            <td style="min-width: 40px;">
              <GearSlot
                slot-icon-src="./image/game-gear-slot/ear.png"
                :slot-description="t('首饰：耳坠')"
              />
            </td>
            <td><Stepper v-model:value="Earrings" :disabled="disableAccessory || !patchData.jobs.Earrings?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/body.png"
                :slot-description="t('防具：身体')"
              />
            </td>
            <td><Stepper v-model:value="BodyAttire" :disabled="disableAttire || !patchData.jobs.BodyAttire?.[attireAffix]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/neck.png"
                :slot-description="t('首饰：项链')"
              />
            </td>
            <td><Stepper v-model:value="Necklace" :disabled="disableAccessory || !patchData.jobs.Necklace?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/hands.png"
                :slot-description="t('防具：手部')"
              />
            </td>
            <td><Stepper v-model:value="HandsAttire" :disabled="disableAttire || !patchData.jobs.HandsAttire?.[attireAffix]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/wrist.png"
                :slot-description="t('首饰：手镯')"
              />
            </td>
            <td><Stepper v-model:value="Wrist" :disabled="disableAccessory || !patchData.jobs.Wrist?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/legs.png"
                :slot-description="t('防具：腿部')"
              />
            </td>
            <td><Stepper v-model:value="LegsAttire" :disabled="disableAttire || !patchData.jobs.LegsAttire?.[attireAffix]?.[0]" /></td>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/ring.png"
                :slot-description="t('首饰：戒指')"
              />
            </td>
            <td><Stepper v-model:value="Rings" :disabled="disableAccessory || !patchData.jobs.Rings?.[accessoryAffix]?.[0]" /></td>
          </tr>

          <tr>
            <td>
              <GearSlot
                slot-icon-src="./image/game-gear-slot/feet.png"
                :slot-description="t('防具：脚部')"
              />
            </td>
            <td><Stepper v-model:value="FeetAttire" :disabled="disableAttire || !patchData.jobs.FeetAttire?.[attireAffix]?.[0]" /></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div class="bottom-buttons">
        <div class="content">
          <n-button
            class="end"
            :disabled="jobNotSelected"
            @click="showSelectedGears = true"
          >
            {{ t('已选部件') }}
          </n-button>
        </div>
        <n-divider dashed />
        <n-flex class="foot" justify="end">
          <n-dropdown
            :show="showQuickOperatesOptions"
            :options="quickOperatesOptions"
            :render-option="renderOption"
            class="no-select"
            placement="bottom"
            @select="handleQuickOperatesSelect"
            @mouseenter="handleQuickOperatesDropdownMouseEnter"
            @mouseleave="handleQuickOperatesDropdownMouseLeave"
            :on-clickoutside="handleCloseQuickOperatesOptions"
          >
            <n-button
              icon-placement="right"
              :disabled="jobNotSelected"
              @click="showQuickOperatesOptions = !showQuickOperatesOptions"
              @mouseenter="handleQuickOperatesDropdownMouseEnter"
              @mouseleave="handleQuickOperatesDropdownMouseLeave"
            >
              <template #icon>
                <n-icon><KeyboardArrowDownRound /></n-icon>
              </template>
              {{ t('快速操作') }}
            </n-button>
          </n-dropdown>
          <n-dropdown
            :show="showClearOptions"
            :options="clearOptions"
            :render-option="renderOption"
            class="no-select"
            placement="bottom"
            @select="handleClearSelect"
            @mouseenter="handleClearDropdownMouseEnter"
            @mouseleave="handleClearDropdownMouseLeave"
            :on-clickoutside="handleCloseClearOptions"
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
            placement="bottom"
            @select="handleAddsuitSelect"
            @mouseenter="handleAddsuitDropdownMouseEnter"
            @mouseleave="handleAddsuitDropdownMouseLeave"
            :on-clickoutside="handleCloseAddsuitOptions"
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
