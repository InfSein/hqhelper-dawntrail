<script setup lang="ts">
import { inject, ref, type PropType, type Ref } from 'vue'
import {
  NButton, NCard, NIcon, NInputNumber, NScrollbar, NTable, NTabs, NTabPane
} from 'naive-ui'
import { 
  CheckroomSharp, SaveOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import XivFARImage from '../custom/general/XivFARImage.vue'
import {
  XivGearAffixes,
  XivRoles, type XivRole,
  XivJobs
} from '@/assets/data'
import type { GearSelections, AttireAffix, AccessoryAffix } from '@/models/gears'
import { attireAffixes, accessoryAffixes } from '@/models/gears'
import { type UserConfigModel } from '@/models/config-user'
import { deepCopy } from '@/tools'
import type { IHqVer } from '@/tools/nbb-cal-v5'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const uiLanguage = userConfig.value?.language_ui ?? 'zh'
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
  
const props = defineProps({
  patchData: {
    type: Object as PropType<IHqVer | undefined>,
    required: false // prevent vue warn `Expected Object, got Undefined`
  }
})
// const jobIds = Object.keys(XivJobs).map(jobId => parseInt(jobId))
const getAffixName = (affix: AttireAffix | AccessoryAffix) => {
  return XivGearAffixes[affix][`name_${uiLanguage}`]
}
const attireGearSlots = [
  { key: 'HeadAttire', text: t('头部'), icon: './image/game-gear-slot/head.png' },
  { key: 'BodyAttire', text: t('身体'), icon: './image/game-gear-slot/body.png' },
  { key: 'HandsAttire', text: t('手部'), icon: './image/game-gear-slot/hands.png' },
  { key: 'LegsAttire', text: t('腿部'), icon: './image/game-gear-slot/legs.png' },
  { key: 'FeetAttire', text: t('脚部'), icon: './image/game-gear-slot/feet.png' },
]
const accessoryGearSlots = [
  { key: 'Earrings', text: t('耳坠'), icon: './image/game-gear-slot/ear.png' },
  { key: 'Necklace', text: t('项链'), icon: './image/game-gear-slot/neck.png' },
  { key: 'Wrist', text: t('手镯'), icon: './image/game-gear-slot/wrist.png' },
  { key: 'Rings', text: t('戒指'), icon: './image/game-gear-slot/ring.png' },
]

const showModal = defineModel<boolean>('show', { required: true })
const gearSelections = defineModel<GearSelections>('gearSelections', { required: true })

const pageHeight = ref(window.innerHeight)
const localSelections = ref<GearSelections>(gearSelections.value)

const onLoad = () => {
  localSelections.value = deepCopy(gearSelections.value)
  pageHeight.value = window.innerHeight
}

const getRoleName = (role: any) => {
  switch (uiLanguage) {
    case 'ja':
      return role.role_name_ja
    case 'en':
      return role.role_name_en
    default:
      return role.role_name_zh
  }
}
const getJobName = (jobId: number) => {
  const _job = XivJobs[jobId]
  switch (uiLanguage) {
    case 'ja':
      return _job.job_name_ja
    case 'en':
      return _job.job_name_en
    default:
      return _job.job_name_zh
  }
}

const getVShowOfMainoffHandGroup = (role: XivRole) => {
  return role.jobs.some(jobId => props.patchData?.jobs?.MainHand?.[jobId]?.[0] || props.patchData?.jobs?.OffHand?.[jobId]?.[0])
}
const getVShowOfAttireAffixRow = (attire: AttireAffix) => {
  return props.patchData?.jobs?.HeadAttire?.[attire]?.[0]
    || props.patchData?.jobs?.BodyAttire?.[attire]?.[0]
    || props.patchData?.jobs?.HandsAttire?.[attire]?.[0]
    || props.patchData?.jobs?.LegsAttire?.[attire]?.[0]
    || props.patchData?.jobs?.FeetAttire?.[attire]?.[0]
}
const getVShowOfAccessoryAffixRow = (accessory: AccessoryAffix) => {
  return props.patchData?.jobs?.Earrings?.[accessory]?.[0]
    || props.patchData?.jobs?.Necklace?.[accessory]?.[0]
    || props.patchData?.jobs?.Wrist?.[accessory]?.[0]
    || props.patchData?.jobs?.Rings?.[accessory]?.[0]
}

const handleClose = () => {
  showModal.value = false
}

const handleSave = () => {
  for (const _id in localSelections.value.MainHand) {
    const id = Number(_id)
    if (props.patchData?.jobs?.OffHand?.[id]?.[0]) {
      localSelections.value.OffHand[id] = localSelections.value.MainHand[id]
    }
  }
  gearSelections.value = deepCopy(localSelections.value)
  handleClose()
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="CheckroomSharp"
    :title="t('已选部件')"
    max-width="1500px"
    :height="(pageHeight - 80) + 'px'"
    content-extra-style="overflow-y: auto;"
    @on-load="onLoad"
  >
    <div class="wrapper" v-if="!isMobile">
      <div class="weapons">
        <n-card size="small" :title="t('主副手')">
          <div class="weapons-container">
            <GroupBox
              class="weapon-group"
              v-for="(role, roleIndex) in XivRoles"
              :key="roleIndex"
              v-show="getVShowOfMainoffHandGroup(role)"
              :border-color="role.role_color"
              title-background-color="var(--n-color-modal)"
              container-extra-style="padding: 8px;"
            >
              <template #title>
                <XivFARImage
                  :src="role.role_icon_url"
                  :size="14"
                />
                <span>
                  {{ getRoleName(role) }}
                </span>
              </template>

              <div class="input-container">
                <p v-for="job in role.jobs" :key="'weapon-mainhand-' + job">
                  <n-input-number
                    v-model:value="localSelections.MainHand[job]"
                    :input-props="{ type: 'number' }"
                    :min="0"
                    :max="99999"
                    :precision="0"
                    :title="getJobName(job)"
                    :show-button="!isMobile"
                    :disabled="!patchData?.jobs?.MainHand?.[job]?.[0] && !patchData?.jobs?.OffHand?.[job]?.[0]"
                  >
                    <template #prefix>
                      <XivFARImage 
                        :src="XivJobs[job].job_icon_url"
                        :size="15"
                      />
                    </template>
                  </n-input-number>
                </p>
              </div>
            </GroupBox>
          </div>
        </n-card>
      </div>
      <div class="attires">
        <n-card size="small" :title="t('防具')">
          <n-table class="attires-table" size="small" :single-line="false">
            <thead>
              <tr>
                <th>{{ t('词缀') }}</th>
                <th>
                  <div class="th-inner">
                    <XivFARImage v-show="!isMobile" :size="15" src="./image/game-gear-slot/head.png" />
                    <span>{{ t('头部') }}</span>
                  </div>
                </th>
                <th>
                  <div class="th-inner">
                    <XivFARImage v-show="!isMobile" :size="15" src="./image/game-gear-slot/body.png" />
                    <span>{{ t('身体') }}</span>
                  </div>
                </th>
                <th>
                  <div class="th-inner">
                    <XivFARImage v-show="!isMobile" :size="15" src="./image/game-gear-slot/hands.png" />
                    <span>{{ t('手部') }}</span>
                  </div>
                </th>
                <th>
                  <div class="th-inner">
                    <XivFARImage v-show="!isMobile" :size="15" src="./image/game-gear-slot/legs.png" />
                    <span>{{ t('腿部') }}</span>
                  </div>
                </th>
                <th>
                  <div class="th-inner">
                    <XivFARImage v-show="!isMobile" :size="15" src="./image/game-gear-slot/feet.png" />
                    <span>{{ t('脚部') }}</span>
                  </div>
                </th>
              </tr>
            </thead>
          </n-table>
          <n-scrollbar trigger="none" :style="{ height: isMobile ? '90px' : '240px', 'margin-top': '-2px' }">
            <n-table class="attires-table" size="small" :single-line="false">
              <tbody>
                <tr
                  v-for="attire in attireAffixes"
                  :key="'row-attire-' + attire"
                  v-show="getVShowOfAttireAffixRow(attire)"
                >
                  <td>{{ getAffixName(attire) }}</td>
                  <td>
                    <n-input-number
                      v-model:value="localSelections.HeadAttire[attire]"
                      :disabled="!patchData?.jobs?.HeadAttire?.[attire]?.[0]"
                      :input-props="{ type: 'number' }"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      button-placement="both"
                      :show-button="!isMobile"
                    />
                  </td>
                  <td>
                    <n-input-number
                      v-model:value="localSelections.BodyAttire[attire]"
                      :disabled="!patchData?.jobs?.BodyAttire?.[attire]?.[0]"
                      :input-props="{ type: 'number' }"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      button-placement="both"
                      :show-button="!isMobile"
                    />
                  </td>
                  <td>
                    <n-input-number
                      v-model:value="localSelections.HandsAttire[attire]"
                      :disabled="!patchData?.jobs?.HandsAttire?.[attire]?.[0]"
                      :input-props="{ type: 'number' }"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      button-placement="both"
                      :show-button="!isMobile"
                    />
                  </td>
                  <td>
                    <n-input-number
                      v-model:value="localSelections.LegsAttire[attire]"
                      :disabled="!patchData?.jobs?.LegsAttire?.[attire]?.[0]"
                      :input-props="{ type: 'number' }"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      button-placement="both"
                      :show-button="!isMobile"
                    />
                  </td>
                  <td>
                    <n-input-number
                      v-model:value="localSelections.FeetAttire[attire]"
                      :disabled="!patchData?.jobs?.FeetAttire?.[attire]?.[0]"
                      :input-props="{ type: 'number' }"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      button-placement="both"
                      :show-button="!isMobile"
                    />
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-scrollbar>
        </n-card>
      </div>
      <div class="accessories">
        <n-card size="small" :title="t('首饰')">
          <n-table class="accessories-table" size="small" :single-line="false">
            <thead>
              <tr>
                <th>{{ t('词缀') }}</th>
                <th>
                  <div class="th-inner">
                    <XivFARImage v-show="!isMobile" :size="15" src="./image/game-gear-slot/ear.png" />
                    <span>{{ t('耳坠') }}</span>
                  </div>
                </th>
                <th>
                  <div class="th-inner">
                    <XivFARImage v-show="!isMobile" :size="15" src="./image/game-gear-slot/neck.png" />
                    <span>{{ t('项链') }}</span>
                  </div>
                </th>
                <th>
                  <div class="th-inner">
                    <XivFARImage v-show="!isMobile" :size="15" src="./image/game-gear-slot/wrist.png" />
                    <span>{{ t('手镯') }}</span>
                  </div>
                </th>
                <th>
                  <div class="th-inner">
                    <XivFARImage v-show="!isMobile" :size="15" src="./image/game-gear-slot/ring.png" />
                    <span>{{ t('戒指') }}</span>
                  </div>
                </th>
                <th v-if="!isMobile"></th>
              </tr>
            </thead>
          </n-table>
          <n-scrollbar trigger="none" :style="{ height: isMobile ? '90px' : '200px', 'margin-top': '-2px' }">
            <n-table class="accessories-table" size="small" :single-line="false">
              <tbody>
                <tr
                  v-for="accessory in accessoryAffixes"
                  :key="'row-accessory-' + accessory"
                  v-show="getVShowOfAccessoryAffixRow(accessory)"
                >
                  <td>{{ getAffixName(accessory) }}</td>
                  <td>
                    <n-input-number
                      v-model:value="localSelections.Earrings[accessory]"
                      :disabled="!patchData?.jobs?.Earrings?.[accessory]?.[0]"
                      :input-props="{ type: 'number' }"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      button-placement="both"
                      :show-button="!isMobile"
                    />
                  </td>
                  <td>
                    <n-input-number
                      v-model:value="localSelections.Necklace[accessory]"
                      :disabled="!patchData?.jobs?.Necklace?.[accessory]?.[0]"
                      :input-props="{ type: 'number' }"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      button-placement="both"
                      :show-button="!isMobile"
                    />
                  </td>
                  <td>
                    <n-input-number
                      v-model:value="localSelections.Wrist[accessory]"
                      :disabled="!patchData?.jobs?.Wrist?.[accessory]?.[0]"
                      :input-props="{ type: 'number' }"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      button-placement="both"
                      :show-button="!isMobile"
                    />
                  </td>
                  <td>
                    <n-input-number
                      v-model:value="localSelections.Rings[accessory]"
                      :disabled="!patchData?.jobs?.Rings?.[accessory]?.[0]"
                      :input-props="{ type: 'number' }"
                      :min="0"
                      :max="99999"
                      :precision="0"
                      button-placement="both"
                      :show-button="!isMobile"
                    />
                  </td>
                  <td v-if="!isMobile"></td>
                </tr>
              </tbody>
            </n-table>
          </n-scrollbar>
        </n-card>
      </div>
    </div>
    <div class="wrapper" v-else>
      <n-tabs v-if="isMobile" type="segment" animated>
        <n-tab-pane name="weapon" :tab="t('主副手')">
          <div class="weapons-container">
            <GroupBox
              class="weapon-group"
              v-for="(role, roleIndex) in XivRoles"
              :key="'m-'+roleIndex"
              v-show="getVShowOfMainoffHandGroup(role)"
              :border-color="role.role_color"
              title-background-color="var(--n-color-modal)"
              container-extra-style="padding: 8px;"
            >
              <template #title>
                <XivFARImage
                  :src="role.role_icon_url"
                  :size="14"
                />
                <span>
                  {{ getRoleName(role) }}
                </span>
              </template>

              <div class="input-container">
                <p v-for="job in role.jobs" :key="'m-weapon-mainhand-' + job">
                  <n-input-number
                    v-model:value="localSelections.MainHand[job]"
                    :input-props="{ type: 'number' }"
                    :min="0"
                    :max="99999"
                    :precision="0"
                    :title="getJobName(job)"
                    :disabled="!patchData?.jobs?.MainHand?.[job]?.[0] && !patchData?.jobs?.OffHand?.[job]?.[0]"
                  >
                    <template #prefix>
                      <XivFARImage 
                        :src="XivJobs[job].job_icon_url"
                        :size="15"
                      />
                    </template>
                  </n-input-number>
                </p>
              </div>
            </GroupBox>
          </div>
        </n-tab-pane>
        <n-tab-pane name="attire" :tab="t('防具')">
          <div class="weapons-container">
            <GroupBox
              class="weapon-group"
              v-for="(attire, attireIndex) in attireAffixes"
              :key="'m-at'+attireIndex"
              v-show="getVShowOfAttireAffixRow(attire)"
              title-background-color="var(--n-color-modal)"
              container-extra-style="padding: 8px;"
            >
              <template #title>
                <span>
                  {{ getAffixName(attire) }}
                </span>
              </template>

              <div class="input-container">
                <p v-for="gear in attireGearSlots" :key="'m-attire' + attireIndex + '-' + gear.key">
                  <n-input-number
                    v-model:value="(localSelections as any)[gear.key][attire]"
                    :input-props="{ type: 'number' }"
                    :min="0"
                    :max="99999"
                    :precision="0"
                    :title="gear.text"
                  >
                    <template #prefix>
                      <XivFARImage 
                        :src="gear.icon"
                        :size="15"
                      />
                    </template>
                  </n-input-number>
                </p>
              </div>
            </GroupBox>
          </div>
        </n-tab-pane>
        <n-tab-pane name="accessory" :tab="t('首饰')">
          <div class="weapons-container">
            <GroupBox
              class="weapon-group"
              v-for="(accessory, accessoryIndex) in accessoryAffixes"
              :key="'m-ac'+accessoryIndex"
              v-show="getVShowOfAccessoryAffixRow(accessory)"
              title-background-color="var(--n-color-modal)"
              container-extra-style="padding: 8px;"
            >
              <template #title>
                <span>
                  {{ getAffixName(accessory) }}
                </span>
              </template>

              <div class="input-container">
                <p v-for="gear in accessoryGearSlots" :key="'m-accessory' + accessoryIndex + '-' + gear.key">
                  <n-input-number
                    v-model:value="(localSelections as any)[gear.key][accessory]"
                    :input-props="{ type: 'number' }"
                    :min="0"
                    :max="99999"
                    :precision="0"
                    :title="gear.text"
                  >
                    <template #prefix>
                      <XivFARImage 
                        :src="gear.icon"
                        :size="15"
                      />
                    </template>
                  </n-input-number>
                </p>
              </div>
            </GroupBox>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
    
    <template #action>
      <div class="modal-submit-container">
        <n-button type="primary" size="large" @click="handleSave">
          <template #icon>
            <n-icon><SaveOutlined /></n-icon>
          </template>
          {{ t('保存') }}
        </n-button>
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
/* All */
:deep(.n-input) {
  --n-height: 30px !important;
}
.wrapper {
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-gap: 10px;

  .weapons-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .input-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 5px;
  }
  .accessories {
    margin-top: 3px;
  }
  th {
    text-align: center;
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
  td {
    text-align: center;
  }
}
.attires-table, .accessories-table {
  th:first-child, td:first-child {
    width: 15%;
  }
  th:nth-child(2), td:nth-child(2),
  th:nth-child(3), td:nth-child(3),
  th:nth-child(4), td:nth-child(4),
  th:nth-child(5), td:nth-child(5),
  th:nth-child(6), td:nth-child(6) {
    width: 17%;
    padding: 3px 10px;
  }
}

/* Desktop */
@media (min-width: 769px) {
  .weapons {
    grid-row: 1 / 3;
    height: 100%;

    .n-card {
      height: 100%;
    }
  }
}

/* Mobile */
@media (max-width: 768px) {
  .wrapper {
    display: flex;
    flex-direction: column;

    .weapons-container {
      max-height: 450px;
      padding-top: 10px;
      overflow-y: auto;
    }

    .input-container {
      grid-template-columns: 1fr 1fr;
    }

    .accessories-table {
      th:first-child, td:first-child {
        width: 15%;
      }
      th:nth-child(2), td:nth-child(2),
      th:nth-child(3), td:nth-child(3),
      th:nth-child(4), td:nth-child(4),
      th:nth-child(5), td:nth-child(5) {
        width: 21.25%;
        padding: 3px 6px;
      }
    }
  }
}
</style>