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
import { accessoryAffixes, attireAffixes, fixGearSelections, type AccessoryAffix, type AttireAffix, type GearSelections } from '@/models/gears'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const handleImportState = inject<(patch: string, gearSelections?: GearSelections) => void>('handleImportState')!

const uiLanguage = computed(() => {
  return userConfig.value.language_ui
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
  { key: 'MainHand', text: t('主手'), icon: './image/game-gear-slot/mainhand.png' },
  { key: 'OffHand', text: t('副手'), icon: './image/game-gear-slot/offhand.png' },
  { key: 'HeadAttire', text: t('头部'), icon: './image/game-gear-slot/head.png' },
  { key: 'BodyAttire', text: t('身体'), icon: './image/game-gear-slot/body.png' },
  { key: 'HandsAttire', text: t('手部'), icon: './image/game-gear-slot/hands.png' },
  { key: 'LegsAttire', text: t('腿部'), icon: './image/game-gear-slot/legs.png' },
  { key: 'FeetAttire', text: t('脚部'), icon: './image/game-gear-slot/feet.png' },
  { key: 'Earrings', text: t('耳坠'), icon: './image/game-gear-slot/ear.png' },
  { key: 'Necklace', text: t('项链'), icon: './image/game-gear-slot/neck.png' },
  { key: 'Wrist', text: t('手镯'), icon: './image/game-gear-slot/wrist.png' },
  { key: 'Rings', text: t('戒指'), icon: './image/game-gear-slot/ring.png' },
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
      label: t('版本{v}: {name}', { v: patch.v, name: patch[`name_${uiLanguage.value}`] }),
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
    :title="t('确认导入内容')"
    max-width="900px"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <GroupBox v-if="isMobile" :title="t('导入部件')">
        <n-scrollbar trigger="none" x-scrollable :style="{ width: '100%', height: '300px', 'margin-top': '-2px' }">
          <n-table class="table" size="small" :single-line="false">
            <thead>
              <tr>
                <th>{{ t('职业/词缀') }}</th>
                <th>{{ t('主手') }}</th>
                <th>{{ t('副手') }}</th>
                <th>{{ t('头部') }}</th>
                <th>{{ t('身体') }}</th>
                <th>{{ t('手部') }}</th>
                <th>{{ t('腿部') }}</th>
                <th>{{ t('脚部') }}</th>
                <th>{{ t('耳坠') }}</th>
                <th>{{ t('项链') }}</th>
                <th>{{ t('手镯') }}</th>
                <th>{{ t('戒指') }}</th>
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
      <GroupBox v-else :title="t('导入部件')">
        <n-table class="table" size="small" :single-line="false">
          <thead>
            <tr>
              <th>{{ t('职业/词缀') }}</th>
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
      <GroupBox :title="t('选择版本')">
        <n-select v-model:value="patchSelected" :placeholder="t('选择导入的版本')" :options="patchOptions" />
      </GroupBox>
    </div>

    <template #action>
      <div class="submit-container">
        <n-button type="primary" @click="handleSubmit">
          <template #icon>
            <n-icon><DoneOutlined /></n-icon>
          </template>
          {{ t('确认') }}
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
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>