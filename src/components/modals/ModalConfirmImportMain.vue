<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NIcon, NSelect, NScrollbar, NTable
} from 'naive-ui'
import { 
  UnarchiveOutlined,
  DoneOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import XivFARImage from '../custom/general/XivFARImage.vue'
import { XivGearAffixes, XivJobs, XivPatches } from '@/assets/data'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'
import UseConfig from '@/tools/use-config'
import { accessoryAffixes, attireAffixes, fixGearSelections, type AccessoryAffix, type AttireAffix, type GearSelections } from '@/models/gears'

const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
const handleImportState = inject<(patch: string, gearSelections?: GearSelections) => void>('handleImportState')!

const {
  uiLanguage,
} = UseConfig(userConfig, funcConfig)

const modalMaxWidth = computed(() => {
  switch (userConfig.value.language_ui) {
    case 'en': return '1300px'
    case 'ja': return '1500px'
    default: return '900px'
  }
})

const showModal = defineModel<boolean>('show', { required: true })
const onLoad = () => {
  patchSelected.value = props.defaultPatch
}

interface ModalConfirmImportMainProps {
  gearSelections: GearSelections | undefined
  defaultPatch: string
}
const props = defineProps<ModalConfirmImportMainProps>()
const emit = defineEmits(['onImportConfirmed'])

const patchSelected = ref(props.defaultPatch)

const slots = [
  { key: 'MainHand', text: t('game.gear.tool.mainhand.title'), icon: './image/game-gear-slot/mainhand.png' },
  { key: 'OffHand', text: t('game.gear.tool.offhand.title'), icon: './image/game-gear-slot/offhand.png' },
  { key: 'HeadAttire', text: t('game.gear.attire.head.title'), icon: './image/game-gear-slot/head.png' },
  { key: 'BodyAttire', text: t('game.gear.attire.body.title'), icon: './image/game-gear-slot/body.png' },
  { key: 'HandsAttire', text: t('game.gear.attire.hands.title'), icon: './image/game-gear-slot/hands.png' },
  { key: 'LegsAttire', text: t('game.gear.attire.legs.title'), icon: './image/game-gear-slot/legs.png' },
  { key: 'FeetAttire', text: t('game.gear.attire.feet.title'), icon: './image/game-gear-slot/feet.png' },
  { key: 'Earrings', text: t('game.gear.accessory.earring.title'), icon: './image/game-gear-slot/ear.png' },
  { key: 'Necklace', text: t('game.gear.accessory.necklace.title'), icon: './image/game-gear-slot/neck.png' },
  { key: 'Wrist', text: t('game.gear.accessory.wrist.title'), icon: './image/game-gear-slot/wrist.png' },
  { key: 'Rings', text: t('game.gear.accessory.rings.title'), icon: './image/game-gear-slot/ring.png' },
]
const gearRows = computed(() => {
  const rows : string[][] = []

  const gearSelections = fixGearSelections(props.gearSelections)
  // 处理各职业主副手
  Object.keys(XivJobs).forEach(_jobid => {
    const jobId = Number(_jobid)
    const job = XivJobs[jobId]
    let name = job[`job_name_${uiLanguage.value}`] || '???'
    const mainCount = gearSelections.MainHand[jobId]
    const offCount = gearSelections.OffHand[jobId]
    if (mainCount || offCount) {
      const rowData : string[] = [
        name,
        mainCount.toString(),
        offCount.toString(),
        '', '', '', '', '',
        '', '', '', ''
      ]
      rows.push(rowData)
    }
  })
  // 处理防具/首饰词缀
  const affixes : (AttireAffix | AccessoryAffix)[] = [
    ...new Set([
      ...attireAffixes,
      ...accessoryAffixes
    ])
  ]
  affixes.forEach(affix => {
    const affixData = XivGearAffixes[affix]
    let name = affixData[`name_${uiLanguage.value}`] || '???'
    const attireValid = attireAffixes.includes(affix as AttireAffix)
    const accessoryValid = accessoryAffixes.includes(affix as AccessoryAffix)
    const rowCounts : (string | number)[] = []

    if (attireValid) {
      const attireAffix = affix as AttireAffix
      rowCounts.push(
        gearSelections.HeadAttire[attireAffix] || 0,
        gearSelections.BodyAttire[attireAffix] || 0,
        gearSelections.HandsAttire[attireAffix] || 0,
        gearSelections.LegsAttire[attireAffix] || 0,
        gearSelections.FeetAttire[attireAffix] || 0
      )
    } else {
      rowCounts.push(
        '', '', '', '', ''
      )
    }
    if (accessoryValid) {
      const accessoryAffix = affix as AccessoryAffix
      rowCounts.push(
        gearSelections.Earrings[accessoryAffix] || 0,
        gearSelections.Necklace[accessoryAffix] || 0,
        gearSelections.Wrist[accessoryAffix] || 0,
        gearSelections.Rings[accessoryAffix] || 0
      )
    } else {
      rowCounts.push(
        '', '', '', ''
      )
    }
    
    let rowTotal = 0
    rowCounts.forEach(count => {
      rowTotal += Number(count)
    })

    if (rowTotal > 0) {
      rows.push([
        name,
        '', '',
        ...rowCounts.map(item => String(item))
      ])
    }
  })

  return rows
})
const patchOptions = computed(() => {
  const opt = XivPatches.map(patch => {
    return {
      label: t('main.select_patch.patch_button.text', { v: patch.v, name: patch[`name_${uiLanguage.value}`] }),
      value: patch.v,
      disabled: !patch.updated
    }
  })
  console.log(opt)
  return opt
})

const handleSubmit = () => {
  handleImportState(patchSelected.value, props.gearSelections)
  emit('onImportConfirmed')
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="UnarchiveOutlined"
    :title="t('main.imexport.confirm_import_content')"
    :max-width="modalMaxWidth"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <GroupBox v-if="isMobile" :title="t('main.imexport.import_parts')" title-background-color="var(--n-color-modal)">
        <n-scrollbar trigger="none" x-scrollable :style="{ width: '100%', height: '300px', 'margin-top': '-2px' }">
          <n-table class="table" size="small" :single-line="false">
            <thead>
              <tr>
                <th>{{ t('common.job_or_affix') }}</th>
                <th>{{ t('game.gear.tool.mainhand.title') }}</th>
                <th>{{ t('game.gear.tool.offhand.title') }}</th>
                <th>{{ t('game.gear.attire.head.title') }}</th>
                <th>{{ t('game.gear.attire.body.title') }}</th>
                <th>{{ t('game.gear.attire.hands.title') }}</th>
                <th>{{ t('game.gear.attire.legs.title') }}</th>
                <th>{{ t('game.gear.attire.feet.title') }}</th>
                <th>{{ t('game.gear.accessory.earring.title') }}</th>
                <th>{{ t('game.gear.accessory.necklace.title') }}</th>
                <th>{{ t('game.gear.accessory.wrist.title') }}</th>
                <th>{{ t('game.gear.accessory.rings.title') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in gearRows" :key="index">
                <td>{{ row[0] }}</td>
                <td>{{ row[1] }}</td>
                <td>{{ row[2] }}</td>
                <td>{{ row[3] }}</td>
                <td>{{ row[4] }}</td>
                <td>{{ row[5] }}</td>
                <td>{{ row[6] }}</td>
                <td>{{ row[7] }}</td>
                <td>{{ row[8] }}</td>
                <td>{{ row[9] }}</td>
                <td>{{ row[10] }}</td>
                <td>{{ row[11] }}</td>
              </tr>
            </tbody>
          </n-table>
        </n-scrollbar>
      </GroupBox>
      <GroupBox v-else :title="t('main.imexport.import_parts')" title-background-color="var(--n-color-modal)">
        <n-table class="table" size="small" :single-line="false">
          <thead>
            <tr>
              <th>{{ t('common.job_or_affix') }}</th>
              <th
                v-for="slot in slots"
                :key="slot.key"
              >
                <div class="th-inner">
                  <XivFARImage :size="15" :src="slot.icon" />
                  <span>{{ slot.text }}</span>
                </div>
              </th>
            </tr>
          </thead>
        </n-table>
        <n-scrollbar trigger="none" :style="{ maxHeight: '350px', 'margin-top': '-2px' }">
          <n-table class="table" size="small" :single-line="false">
            <tbody>
              <tr v-for="(row, index) in gearRows" :key="index">
                <td>{{ row[0] }}</td>
                <td>{{ row[1] }}</td>
                <td>{{ row[2] }}</td>
                <td>{{ row[3] }}</td>
                <td>{{ row[4] }}</td>
                <td>{{ row[5] }}</td>
                <td>{{ row[6] }}</td>
                <td>{{ row[7] }}</td>
                <td>{{ row[8] }}</td>
                <td>{{ row[9] }}</td>
                <td>{{ row[10] }}</td>
                <td>{{ row[11] }}</td>
              </tr>
            </tbody>
          </n-table>
        </n-scrollbar>
      </GroupBox>
      <GroupBox :title="t('main.select_patch.title')" title-background-color="var(--n-color-modal)">
        <n-select v-model:value="patchSelected" :placeholder="t('main.imexport.confirm_import_patch')" :options="patchOptions" />
      </GroupBox>
    </div>

    <template #action>
      <div class="modal-submit-container">
        <n-button type="primary" @click="handleSubmit">
          <template #icon>
            <n-icon><DoneOutlined /></n-icon>
          </template>
          {{ t('common.confirm') }}
        </n-button>
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  user-select: text;

  .table {
    width: 100%;

    th {
      font-weight: bold;
      .th-inner {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;

        span {
          font-weight: bold;
        }
      }
    }
    th:first-child, td:first-child {
      width: 12%;
    }
    th:nth-child(2), td:nth-child(2),
    th:nth-child(3), td:nth-child(3),
    th:nth-child(4), td:nth-child(4),
    th:nth-child(5), td:nth-child(5),
    th:nth-child(6), td:nth-child(6),
    th:nth-child(7), td:nth-child(7),
    th:nth-child(8), td:nth-child(8),
    th:nth-child(9), td:nth-child(9),
    th:nth-child(10), td:nth-child(10),
    th:nth-child(11), td:nth-child(11),
    th:nth-child(12), td:nth-child(12) {
      width: 8%;
      text-align: center;
    }
  }
}
</style>