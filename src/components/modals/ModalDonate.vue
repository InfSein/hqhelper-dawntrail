<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import {
  NAlert, NButton, NDivider, NIcon, NInputGroup, NInputGroupLabel, NGradientText, NQrCode, NSelect,
} from 'naive-ui'
import { 
  HandshakeOutlined,
  ChecklistRtlSharp,
  DoneOutlined, SettingsBackupRestoreSharp,
} from '@vicons/material'
import HelpButton from '../custom/general/HelpButton.vue'
import StaffGroup from '../custom/general/StaffGroup.vue'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import ModalSponsorsList from './ModalSponsorsList.vue'
import { getStaffMebers } from '@/models/about-app'

const t = inject<(message: string, args?: any) => string>('t')!
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const members = getStaffMebers(t)

const showModal = defineModel<boolean>('show', { required: true })

const cautionsConfirmed = ref(false)
const selectedStaff = ref(0)
const selectedDonateWay = ref(0)
const showSponsorsList = ref(false)

const onLoad = () => {
  cautionsConfirmed.value = false
}

const pageData = {
  qGroupInfo: {
    groupNumber: '721051298',
    groupUrl: 'https://jq.qq.com/?_wv=1027&k=LIfWPbZg',
  }
}

const donatableStaffs = computed(() => {
  return Object.values(members.value).filter((member) => {
    return member.donate_info?.donate_ways?.length
  }).map((data, index) => {
    return {
      label: data.name,
      value: index,
      data: data,
    }
  })
})
const availableDonateWays = computed(() => {
  return currentDonateStaff.value.donate_info!.donate_ways!.map((data, index) => {
    let donateWayLabel = ''
    switch (data.type) {
      case 'afd':
        donateWayLabel = t('donate_us.way.aifadian')
        break
      case 'qq':
        donateWayLabel = 'QQ'
        break
      default:
        donateWayLabel = data.type
    }
    return {
      label: donateWayLabel,
      value: index,
      data: data,
    }
  })
})
const currentDonateStaff = computed(() => {
  return donatableStaffs.value[selectedStaff.value].data
})
const currentDonateWay = computed(() => {
  return availableDonateWays.value[selectedDonateWay.value].data
})

const extraHeaderButtons = computed(() => {
  return [
    {
      icon: ChecklistRtlSharp,
      text: t('common.appfunc.thank_list'),
      onClick: () => {
        showSponsorsList.value = true
      }
    },
  ]
})

const handleStaffSelectionUpdate = () => {
  selectedDonateWay.value = 0
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="HandshakeOutlined"
    :title="t('common.appfunc.donate_us')"
    max-width="500px"
    :extra-header-buttons="extraHeaderButtons"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <div v-if="cautionsConfirmed" class="donate-container">
        <GroupBox :title="t('common.options')" title-background-color="var(--n-color-modal)">
          <n-input-group>
            <n-input-group-label size="small">{{ t('donate_us.target.title') }}</n-input-group-label>
            <n-select size="small"
              v-model:value="selectedStaff"
              :options="donatableStaffs"
              :placeholder="t('donate_us.target.placeholder')"
              @update:value="handleStaffSelectionUpdate"
            />
          </n-input-group>
          <n-input-group style="margin-top: -1px;">
            <n-input-group-label size="small">{{ t('donate_us.way.title') }}</n-input-group-label>
            <n-select size="small"
              v-model:value="selectedDonateWay"
              :options="availableDonateWays"
              :placeholder="t('donate_us.way.placeholder')"
            />
          </n-input-group>
        </GroupBox>
        <GroupBox :title="t('donate_us.final_confirm.title')" title-background-color="var(--n-color-modal)">
          <div>
            <div style="float: left;">{{ t('donate_us.final_confirm.desc.desc_1') }}</div>
            <StaffGroup :group-members="[currentDonateStaff]" style="float: left;" />
            <span>{{ t('donate_us.final_confirm.desc.desc_2', currentDonateStaff.donate_info!.donate_desc) }}</span>
          </div>
          <div v-if="!currentDonateStaff.donate_info!.self" class="donate-warn-container">
            <span>{{ t('donate_us.final_confirm.desc.desc_5') }}</span>
            <HelpButton
              icon="question"
              placement="bottom"
              :size="16"
              :descriptions="[
                t('donate_us.final_confirm.desc.desc_6'),
                t('donate_us.final_confirm.desc.desc_7')
              ]"
            />
          </div>
        </GroupBox>
        <GroupBox :title="t('donate_us.start_donate.title')" title-background-color="var(--n-color-modal)">
          <div v-if="currentDonateWay.data_type === 'url'">
            <p>{{ t('donate_us.start_donate.desc.desc_1') }}</p>
            <a :href="currentDonateWay.data" target="_blank">{{ currentDonateWay.data }}</a>
          </div>
          <div v-else-if="currentDonateWay.data_type === 'qrcode'">
            <p v-if="currentDonateWay.type === 'qq'">{{ t('donate_us.start_donate.desc.desc_2') }}</p>
            <n-qr-code class="staff-qrcode" :value="currentDonateWay.data" :size="88" :padding="4" />
          </div>
        </GroupBox>
      </div>
      <div v-else class="cautions-container">
        <p class="bold">{{ t('donate_us.desc.desc_1') }}</p>
        <p class="bold">{{ t('donate_us.desc.desc_2') }}</p>
        <n-divider style="margin: 1px 5px 3px 5px" />
        <ul>
          <li>{{ t('donate_us.desc.desc_3') }}</li>
          <li>{{ t('donate_us.desc.desc_4') }}</li>
          <li class="orangered">{{ t('donate_us.desc.desc_5') }}</li>
        </ul>
        <n-alert :title="t('donate_us.desc.desc_7')" type="info" style="margin-top: auto; line-height: 1.2;">
          <p>
            <span>{{ t('contact_us.feedback.desc.desc_3') }}</span>
            <a :href="pageData.qGroupInfo.groupUrl" target="_blank">{{ t('common.click_here') }}</a>
            <span>{{ t('contact_us.feedback.desc.desc_4') }}</span>
          </p>
          <p>
            <span>{{ t('contact_us.feedback.desc.desc_5') }}</span>
            <n-gradient-text type="info" style="padding: 0 5px;">{{ pageData.qGroupInfo.groupNumber }}</n-gradient-text>
            <span>{{ t('contact_us.feedback.desc.desc_6') }}</span>
          </p>
        </n-alert>
      </div>
    </div>
    
    <template #action>
      <div class="modal-submit-container">
        <n-button
          :type="cautionsConfirmed ? 'default' : 'primary'"
          @click="cautionsConfirmed = !cautionsConfirmed"
        >
          <template #icon>
            <n-icon v-if="cautionsConfirmed"><SettingsBackupRestoreSharp /></n-icon>
            <n-icon v-else><DoneOutlined /></n-icon>
          </template>
          {{ cautionsConfirmed ? t('common.go_back') : t('common.confirm') }}
        </n-button>
      </div>
    </template>

    <ModalSponsorsList
      v-model:show="showSponsorsList"
    />
  </MyModal>
</template>

<style scoped>
:deep(.group-box-content) {
  padding: 0 4px;
}
:deep(.staff-qrcode canvas) {
  /* The size of canvas in `n-qr-code` is wrong. So it is nececssary to override it. */
  width: 80px !important;
  height: 80px !important;
}

.donate-warn-container :deep(.n-icon) {
  display: inline-block !important;
  vertical-align: text-top;
}
.wrapper {
  height: 260px;
  display: flex;
  flex-direction: column;

  p, li {
    line-height: 1.2;
  }

  .donate-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;

    .donate-warn-container {
      color: orangered;
    }
  }
  .cautions-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  ul {
    padding-left: 1.5em;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .wrapper {
    height: 300px;
  }
}
</style>