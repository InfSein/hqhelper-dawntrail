<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import { CheckroomSharp, SaveOutlined } from '@vicons/material'
import type { GearSelections, AttireAffix, AccessoryAffix } from '@/models/gears'
import { attireAffixes, accessoryAffixes } from '@/models/gears'
import { defaultUserConfig, type UserConfigModel } from '@/models/user-config'
import { deepCopy } from '@/tools'
import XivRoles from '@/assets/data/xiv-roles.json'
import XivJobs from '@/assets/data/xiv-jobs.json'
import XivGearAffixes from '@/assets/data/xiv-gear-affixes.json'
import XivFARImage from '../custom-controls/XivFARImage.vue'
import GroupBox from '../custom-controls/GroupBox.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)
const uiLanguage = userConfig.value?.language_ui ?? 'zh'
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const jobIds = Object.keys(XivJobs).map(jobId => parseInt(jobId))
const getAffixName = (affix: AttireAffix | AccessoryAffix) => {
  return XivGearAffixes[affix][`affix_name_${uiLanguage}`]
}
const attires = computed(() => {
  const _attires : {
    affix: AttireAffix
    name: string
  }[] = []
  attireAffixes.forEach(affix => {
    _attires.push({ affix, name: getAffixName(affix) })
  })
  return _attires
})
const accessories = computed(() => {
  const _accessories : {
    affix: AccessoryAffix
    name: string
  }[] = []
  accessoryAffixes.forEach(affix => {
    _accessories.push({ affix, name: getAffixName(affix) })
  })
  return _accessories
})

const modelShow = defineModel<boolean>('show', { required: true })
const gearSelections = defineModel<GearSelections>('gearSelections', { required: true })

const localSelections = ref<GearSelections>(deepCopy(gearSelections.value))
watch(modelShow, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    localSelections.value = deepCopy(gearSelections.value)
  }
})


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
  const _job = (XivJobs as any)[jobId]
  switch (uiLanguage) {
    case 'ja':
      return _job.job_name_ja
    case 'en':
      return _job.job_name_en
    default:
      return _job.job_name_zh
  }
}

const handleClose = () => {
  modelShow.value = false
}

const handleSave = () => {
  gearSelections.value = deepCopy(localSelections.value)
  handleClose()
}
</script>

<template>
  <n-modal v-model:show="modelShow">
    <n-card
      closable
      role="dialog"
      class="no-select"
      style="width: 98%; max-width: 1500px;"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><CheckroomSharp /></n-icon>
          <span class="title">{{ t('已选部件') }}</span>
        </div>
      </template>

      <div class="wrapper">
        <div class="weapons">
          <n-card size="small" :title="t('主副手')">
            <div class="weapons-container">
              <GroupBox
                class="weapon-group"
                v-for="(role, roleIndex) in XivRoles"
                :key="roleIndex"
                :border-color="role.role_color"
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
                      :min="0"
                      :max="99999"
                      :title="getJobName(job)"
                      :show-button="!isMobile"
                    >
                      <template #prefix>
                        <XivFARImage 
                          :src="(XivJobs as any)[job].job_icon_url"
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
        <div class="subs">
          <div class="attires">
            <n-card size="small" :title="t('防具')">
              <n-table class="attires-table" size="small" :single-line="false">
                <thead>
                  <tr>
                    <th>{{ t('词缀') }}</th>
                    <th>
                      <div class="th-inner">
                        <XivFARImage :size="15" src="~ApiBase/image/game-gear-slot/head.png" />
                        <span>{{ t('头部') }}</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-inner">
                        <XivFARImage :size="15" src="~ApiBase/image/game-gear-slot/body.png" />
                        <span>{{ t('身体') }}</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-inner">
                        <XivFARImage :size="15" src="~ApiBase/image/game-gear-slot/hands.png" />
                        <span>{{ t('手部') }}</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-inner">
                        <XivFARImage :size="15" src="~ApiBase/image/game-gear-slot/legs.png" />
                        <span>{{ t('腿部') }}</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-inner">
                        <XivFARImage :size="15" src="~ApiBase/image/game-gear-slot/feet.png" />
                        <span>{{ t('脚部') }}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
              </n-table>
              <n-scrollbar trigger="none" :style="{ height: isMobile ? '120px' : '250px'}">
                <n-table class="attires-table" size="small" :single-line="false">
                  <tbody>
                    <tr v-for="attire in attires" :key="'row-attire-' + attire.name">
                      <td>{{ attire.name }}</td>
                      <td>
                        <n-input-number
                          v-model:value="localSelections.HeadAttire[attire.affix]"
                          :min="0"
                          :max="99999"
                          button-placement="both"
                          :show-button="!isMobile"
                        />
                      </td>
                      <td>
                        <n-input-number
                          v-model:value="localSelections.BodyAttire[attire.affix]"
                          :min="0"
                          :max="99999"
                          button-placement="both"
                          :show-button="!isMobile"
                        />
                      </td>
                      <td>
                        <n-input-number
                          v-model:value="localSelections.HandsAttire[attire.affix]"
                          :min="0"
                          :max="99999"
                          button-placement="both"
                          :show-button="!isMobile"
                        />
                      </td>
                      <td>
                        <n-input-number
                          v-model:value="localSelections.LegsAttire[attire.affix]"
                          :min="0"
                          :max="99999"
                          button-placement="both"
                          :show-button="!isMobile"
                        />
                      </td>
                      <td>
                        <n-input-number
                          v-model:value="localSelections.FeetAttire[attire.affix]"
                          :min="0"
                          :max="99999"
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
                        <XivFARImage :size="15" src="~ApiBase/image/game-gear-slot/ear.png" />
                        <span>{{ t('耳坠') }}</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-inner">
                        <XivFARImage :size="15" src="~ApiBase/image/game-gear-slot/neck.png" />
                        <span>{{ t('项链') }}</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-inner">
                        <XivFARImage :size="15" src="~ApiBase/image/game-gear-slot/wrist.png" />
                        <span>{{ t('手镯') }}</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-inner">
                        <XivFARImage :size="15" src="~ApiBase/image/game-gear-slot/ring.png" />
                        <span>{{ t('戒指') }}</span>
                      </div>
                    </th>
                    <th></th>
                  </tr>
                </thead>
              </n-table>
              <n-scrollbar trigger="none" :style="{ height: isMobile ? '120px' : '205px'}">
                <n-table class="accessories-table" size="small" :single-line="false">
                  <tbody>
                    <tr v-for="accessory in accessories" :key="'row-accessory-' + accessory.name">
                      <td>{{ accessory.name }}</td>
                      <td>
                        <n-input-number
                          v-model:value="localSelections.Earrings[accessory.affix]"
                          :min="0"
                          :max="99999"
                          button-placement="both"
                          :show-button="!isMobile"
                        />
                      </td>
                      <td>
                        <n-input-number
                          v-model:value="localSelections.Necklace[accessory.affix]"
                          :min="0"
                          :max="99999"
                          button-placement="both"
                          :show-button="!isMobile"
                        />
                      </td>
                      <td>
                        <n-input-number
                          v-model:value="localSelections.Wrist[accessory.affix]"
                          :min="0"
                          :max="99999"
                          button-placement="both"
                          :show-button="!isMobile"
                        />
                      </td>
                      <td>
                        <n-input-number
                          v-model:value="localSelections.Rings[accessory.affix]"
                          :min="0"
                          :max="99999"
                          button-placement="both"
                          :show-button="!isMobile"
                        />
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </n-table>
              </n-scrollbar>
            </n-card>
          </div>
        </div>
      </div>
      
      <template #action>
        <div class="submit-container">
          <n-button type="primary" size="large" @click="handleSave">
            <template #icon>
              <n-icon><SaveOutlined /></n-icon>
            </template>
            {{ t('保存') }}
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
/* All */
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
    margin-top: 1px;
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
    padding: 3px 6px;
  }
}

.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile only */
@media (max-width: 768px) {
  .wrapper {
    grid-template-columns: 1fr;

    .weapons-container {
      max-height: 150px;
      overflow-y: auto;
      padding-top: 10px;
    }

    .input-container {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>