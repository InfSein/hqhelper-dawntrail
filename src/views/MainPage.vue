<script lang="ts" setup>
import { inject, provide, ref, watch, type Ref } from 'vue';
import AppHeader from '@/components/main/AppHeader.vue'
import PatchPanel from '@/components/main/PatchPanel.vue'
import JobPanel from '@/components/main/JobPanel.vue'
import GearSelectionPanel from '@/components/main/GearSelectionPanel.vue'
import QuickOperatePanel from '@/components/main/QuickOperatePanel.vue'
import StatisticsPanel from '@/components/main/StatisticsPanel.vue'
import ModalUserPreferences from '@/components/modals/ModalUserPreferences.vue'
import ModalContactUs from '@/components/modals/ModalContactUs.vue'
import ModalChangeLogs from '@/components/modals/ModalChangeLogs.vue'
import ModalAboutApp from '@/components/modals/ModalAboutApp.vue'
import { useMessage } from 'naive-ui';
import { defaultUserConfig, type UserConfigModel } from '@/models/user-config';
import type { AttireAffix, AccessoryAffix } from '@/models/gears'
import { attireAffixes, accessoryAffixes, getDefaultGearSelections } from '@/models/gears'
import { useStore } from '@/store'
import XivJobs from '@/assets/data/xiv-jobs.json'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const XivJobIds = Object.keys(XivJobs).map(jobId => parseInt(jobId))

const gearSelectionPanel = ref<InstanceType<typeof GearSelectionPanel>>()

// #region Provides & Injections

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showUserPreferencesModal = ref(false)
const showAboutAppModal = ref(false)
const showContactUsModal = ref(false)
const showChangeLogsModal = ref(false)

const onUserPreferencesSubmitted = () => {
  showUserPreferencesModal.value = false
  appForceUpdate()
  NAIVE_UI_MESSAGE.success(t('保存成功！部分改动需要刷新页面才能生效'))
}

// * Provide Show Modals
provide('showUserPreferencesModal', () => {
  showUserPreferencesModal.value = true
})
provide('showAboutAppModal', () => {
  showAboutAppModal.value = true
})
provide('showContactModal', () => {
  showContactUsModal.value = true
})
provide('showChangeLogsModal', () => {
  showChangeLogsModal.value = true
})

// #endregion

const workState = ref({
  patch: '',
  job: 0,
  affixes: {
    attire: '',
    accessory: ''
  },
  gears: getDefaultGearSelections(),
})

/** fill gears with default values to prevent get/set `undefined` when using `v-model` */
const fixGears = () => {
  // * Whole object
  workState.value.gears = workState.value.gears || getDefaultGearSelections()
  // * Weapon
  workState.value.gears.MainHand = workState.value.gears.MainHand || {}
  workState.value.gears.OffHand = workState.value.gears.OffHand || {}
  XivJobIds.forEach(jobId => {
    workState.value.gears.MainHand[jobId] = workState.value.gears.MainHand[jobId] || 0
    workState.value.gears.OffHand[jobId] = workState.value.gears.OffHand[jobId] || 0
  })
  // * Attire
  workState.value.gears.HeadAttire = workState.value.gears.HeadAttire || {}
  workState.value.gears.BodyAttire = workState.value.gears.BodyAttire || {}
  workState.value.gears.HandsAttire = workState.value.gears.HandsAttire || {}
  workState.value.gears.LegsAttire = workState.value.gears.LegsAttire || {}
  workState.value.gears.FeetAttire = workState.value.gears.FeetAttire || {}
  attireAffixes.forEach(affix => {
    workState.value.gears.HeadAttire[affix] = workState.value.gears.HeadAttire[affix] || 0
    workState.value.gears.BodyAttire[affix] = workState.value.gears.BodyAttire[affix] || 0
    workState.value.gears.HandsAttire[affix] = workState.value.gears.HandsAttire[affix] || 0
    workState.value.gears.LegsAttire[affix] = workState.value.gears.LegsAttire[affix] || 0
    workState.value.gears.FeetAttire[affix] = workState.value.gears.FeetAttire[affix] || 0
  })
  // * Accessory
  workState.value.gears.Earrings = workState.value.gears.Earrings || {}
  workState.value.gears.Necklace = workState.value.gears.Necklace || {}
  workState.value.gears.Wrist = workState.value.gears.Wrist || {}
  workState.value.gears.Rings = workState.value.gears.Rings || {}
  accessoryAffixes.forEach(affix => {
    workState.value.gears.Earrings[affix] = workState.value.gears.Earrings[affix] || 0
    workState.value.gears.Necklace[affix] = workState.value.gears.Necklace[affix] || 0
    workState.value.gears.Wrist[affix] = workState.value.gears.Wrist[affix] || 0
    workState.value.gears.Rings[affix] = workState.value.gears.Rings[affix] || 0
  })
}

const disable_workstate_cache = userConfig.value.disable_workstate_cache ?? false
if (!disable_workstate_cache) {
  const cachedWorkState = userConfig.value.cache_work_state
  if (cachedWorkState) {
    workState.value = cachedWorkState
    // todo - Compatible with older version caching
  }
  fixGears()

  // todo - 留意性能：深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大
  watch(workState, () => {
    console.log('workState changed', workState.value)
    userConfig.value.cache_work_state = workState.value
    store.commit('setUserConfig', userConfig.value)

    console.log('gear selections:\n' + JSON.stringify(workState.value.gears))
  }, {deep: true})
} else {
  fixGears()
}

const handleJobButtonDupliClick = () => {
  if (!userConfig.value.disable_jobbtn_doubleclick) {
    gearSelectionPanel.value?.addMainOffHand()
  }
}

</script>

<template>
  <n-layout id="main-layout" position="absolute" :native-scrollbar="false">
    <n-layout-header bordered position="absolute">
      <AppHeader />
    </n-layout-header>

    <n-layout-content id="main-content" position="absolute" :native-scrollbar="false">
      <n-flex vertical id="main-container">
        <PatchPanel v-model:patch-selected="workState.patch" />
        <n-flex>
          <n-flex vertical id="sub-container-1">
            <n-flex>
              <JobPanel
                v-model:job-selected="workState.job"
                v-model:affixes-selected="workState.affixes"
                class="job-panel"
                :patch-selected="workState.patch"
                :main-hand-selections="workState.gears?.MainHand"
                @on-job-button-dupli-click="handleJobButtonDupliClick"
              />
              <GearSelectionPanel
                v-model:gear-selections="workState.gears"
                ref="gearSelectionPanel"
                class="gear-panel"
                :job-id="workState.job"
                :attire-affix="workState.affixes?.attire as AttireAffix"
                :accessory-affix="workState.affixes?.accessory as AccessoryAffix"
              />
            </n-flex>
            <QuickOperatePanel
              class="quick-operate-panel"
              v-show="false"
            />
          </n-flex>
          <n-flex vertical id="sub-container-2">
            <StatisticsPanel class="statistics-panel" />
          </n-flex>
        </n-flex>
      </n-flex>
  
      <n-back-top />
    </n-layout-content>
  </n-layout>

  <ModalUserPreferences
    v-model:show="showUserPreferencesModal"
    @after-submit="onUserPreferencesSubmitted"
  />
  <ModalAboutApp v-model:show="showAboutAppModal" />
  <ModalContactUs v-model:show="showContactUsModal" />
  <ModalChangeLogs v-model:show="showChangeLogsModal" />
</template>

<style scoped>
/* All */
:deep(#main-content .n-scrollbar-container) {
  padding: 1rem;
}
.n-layout-header {
  height: 64px;
  padding: 10px 20px;
  z-index: 1000;
}
.n-layout-content {
  margin-top: 65px;
}
#main-container {
  max-width: 100%;
  font-weight: 400;
}

/* PC only */
@media screen and (min-width: 768px) {
  #main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    overflow: auto;

    #sub-container-1 {
      width: 50%;

      .job-panel {
        width: 50%;
      }
      .gear-panel {
        width: calc(50% - 12px);
      }
      .quick-operate-panel {
        width: 100%;
      }
    }
    #sub-container-2 {
      width: calc(50% - 12px);

      .statistics-panel {
        width: 100%;
      }
    }
  }
}

/* Mobile only */
@media screen and (max-width: 767px) {
  #main-container {
    #sub-container-1 {
      width: 100%;

      .job-panel {
        width: 100%;
      }
      .gear-panel {
        width: 100%;
      }
    }
    #sub-container-2 {
      width: 100%;

      .statistics-panel {
        width: 100%;
      }
    }
  }
}
</style>