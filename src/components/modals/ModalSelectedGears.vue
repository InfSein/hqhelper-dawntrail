<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { CheckroomSharp, SaveOutlined } from '@vicons/material'
import type { AccessoryAffix, AttireAffix, GearSelections } from '@/models/gears'
import { accessoryAffixes, attireAffixes } from '@/models/gears'
import { getDefaultGearSelections } from '@/models/gears'
import XivJobs from '@/assets/data/xiv-jobs.json'
import XivFARImage from '../custom-controls/XivFARImage.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const modelShow = defineModel<boolean>('show', { required: true })
const gearSelections = defineModel<GearSelections>('gearSelections', { required: true })

const localSelections = ref<GearSelections>(gearSelections.value)
watch(modelShow, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    localSelections.value = Object.assign({}, gearSelections.value)
  }
})

const jobIds = Object.keys(XivJobs).map(jobId => parseInt(jobId))

const getWeaponCount = (jobId: number, key: "MainHand" | "OffHand" = "MainHand") => {
  return localSelections.value?.[key]?.[jobId] || 0
}
const updateWeaponCount = (count: number, jobId: number, key: "MainHand" | "OffHand" = "MainHand") => {
  console.log(count, jobId, key)
  if (!localSelections.value) localSelections.value = getDefaultGearSelections()
  if (!localSelections.value[key]) localSelections.value[key] = {}
  localSelections.value[key][jobId] = count
}

const getAttireCount = (
  key: "HeadAttire" | "BodyAttire" | "HandsAttire" | "LegsAttire" | "FeetAttire",
  attireAffix: AttireAffix
) => {
  return localSelections.value?.[key]?.[attireAffix] || 0
}
const updateAttireCount = (count: number, 
  key: "HeadAttire" | "BodyAttire" | "HandsAttire" | "LegsAttire" | "FeetAttire",
  attireAffix: AttireAffix
) => {
  if (!localSelections.value) localSelections.value = getDefaultGearSelections()
  if (!localSelections.value[key]) localSelections.value[key] = {} as Record<AttireAffix, number>
  localSelections.value[key][attireAffix] = count
}

const getAccessoryCount = (
  key: "Earrings" | "Necklace" | "Wrist" | "Rings",
  accessoryAffix: AccessoryAffix
) => {
  return localSelections.value?.[key]?.[accessoryAffix] || 0
}
const updateAccessoryCount = (count: number,
  key: "Earrings" | "Necklace" | "Wrist" | "Rings",
  accessoryAffix: AccessoryAffix
) => {
  if (!localSelections.value) localSelections.value = getDefaultGearSelections()
  if (!localSelections.value[key]) localSelections.value[key] = {} as Record<AccessoryAffix, number>
  localSelections.value[key][accessoryAffix] = count
}

// #region Computeds
const createWeaponComputed = (
  key: "MainHand" | "OffHand",
  jobId: number
) => {
  return computed({
    get: () => {
      return localSelections.value?.[key]?.[jobId] || 0
    },
    set: (value : number) => {
      if (!localSelections.value) localSelections.value = getDefaultGearSelections()
      if (!localSelections.value[key]) localSelections.value[key] = {}
      localSelections.value[key][jobId] = value
    }
  })
}
const createAttireComputed = (
  key: "HeadAttire" | "BodyAttire" | "HandsAttire" | "LegsAttire" | "FeetAttire",
  attireAffix: AttireAffix
) => {
  return computed({
    get: () => {
      return localSelections.value?.[key]?.[attireAffix] || 0
    },
    set: (value : number) => {
      if (!localSelections.value) localSelections.value = getDefaultGearSelections()
      if (!localSelections.value[key]) localSelections.value[key] = {} as Record<AttireAffix, number>
      localSelections.value[key][attireAffix] = value
    }
  })
}
const createAccessoryComputed = (
  key: "Earrings" | "Necklace" | "Wrist" | "Rings",
  accessoryAffix: AccessoryAffix
) => {
  return computed({
    get: () => {
      return localSelections.value?.[key]?.[accessoryAffix] || 0
    },
    set: (value : number) => {
      if (!localSelections.value) localSelections.value = getDefaultGearSelections()
      if (!localSelections.value[key]) localSelections.value[key] = {} as Record<AccessoryAffix, number>
      localSelections.value[key][accessoryAffix] = value
    }
  })
}

const mainhandComputeds = jobIds.reduce(
  (acc, key) => {
    acc[key] = createWeaponComputed('MainHand', key);
    return acc;
  },
  {} as Record<number, ReturnType<typeof createWeaponComputed>>
)
const offhandComputeds = jobIds.reduce(
  (acc, key) => {
    acc[key] = createWeaponComputed('OffHand', key);
    return acc;
  },  
  {} as Record<number, ReturnType<typeof createWeaponComputed>>
)
const headAttireComputeds = attireAffixes.reduce(
  (acc, key) => {
    acc[key] = createAttireComputed('HeadAttire', key);
    return acc;
  },
  {} as Record<AttireAffix, ReturnType<typeof createAttireComputed>>
)
const bodyAttireComputeds = attireAffixes.reduce(
  (acc, key) => {
    acc[key] = createAttireComputed('BodyAttire', key);
    return acc;
  },
  {} as Record<AttireAffix, ReturnType<typeof createAttireComputed>>
)
const handsAttireComputeds = attireAffixes.reduce(
  (acc, key) => {
    acc[key] = createAttireComputed('HandsAttire', key);
    return acc;
  },
  {} as Record<AttireAffix, ReturnType<typeof createAttireComputed>>
)
const legsAttireComputeds = attireAffixes.reduce(
  (acc, key) => {
    acc[key] = createAttireComputed('LegsAttire', key);
    return acc;
  },
  {} as Record<AttireAffix, ReturnType<typeof createAttireComputed>>
)
const feetAttireComputeds = attireAffixes.reduce(
  (acc, key) => {
    acc[key] = createAttireComputed('FeetAttire', key);
    return acc;
  },
  {} as Record<AttireAffix, ReturnType<typeof createAttireComputed>>
)
const earringsComputeds = accessoryAffixes.reduce(
  (acc, key) => {
    acc[key] = createAccessoryComputed('Earrings', key);
    return acc;
  },
  {} as Record<AccessoryAffix, ReturnType<typeof createAccessoryComputed>>
)
const necklaceComputeds = accessoryAffixes.reduce(
  (acc, key) => {
    acc[key] = createAccessoryComputed('Necklace', key);
    return acc;
  },
  {} as Record<AccessoryAffix, ReturnType<typeof createAccessoryComputed>>
)
const wristComputeds = accessoryAffixes.reduce(
  (acc, key) => {
    acc[key] = createAccessoryComputed('Wrist', key);
    return acc;
  },
  {} as Record<AccessoryAffix, ReturnType<typeof createAccessoryComputed>>
)
const ringsComputeds = accessoryAffixes.reduce(
  (acc, key) => {
    acc[key] = createAccessoryComputed('Rings', key);
    return acc;
  },
  {} as Record<AccessoryAffix, ReturnType<typeof createAccessoryComputed>>
)
// #endregion

const handleClose = () => {
  modelShow.value = false
}

const handleSave = () => {
  gearSelections.value = Object.assign({}, localSelections.value)
  handleClose()
}
</script>

<template>
  <n-modal v-model:show="modelShow">
    <n-card
      closable
      role="dialog"
      class="no-select"
      style="width: 98%; max-width: 750px;"
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
            <div
              v-for="jobId in jobIds"
              :key="'waepon-job-'+jobId"
              class="weapon-item"
            >
                <n-input-number
                  v-model:value="mainhandComputeds[jobId].value"
                  :min="0"
                  :max="99999"
                >
                  <template #prefix>
                    <XivFARImage 
                      :src="(XivJobs as any)[jobId].job_icon_url"
                      :size="12"
                    />
                  </template>
                </n-input-number>
            </div>
          </n-card>
        </div>
        <div class="subs">
          <div class="attires">
            <n-card size="small" :title="t('防具')"></n-card>
          </div>
          <div class="accessories">
            <n-card size="small" :title="t('首饰')"></n-card>
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
}

.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile only */
@media (max-width: 768px) {
.wrapper {
    grid-template-columns: 1fr;
  }
}
</style>