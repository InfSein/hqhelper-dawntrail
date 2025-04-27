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

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
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
        donateWayLabel = t('爱发电')
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
      text: t('致谢名单'),
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
    :title="t('赞助我们')"
    max-width="500px"
    :extra-header-buttons="extraHeaderButtons"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <div v-if="cautionsConfirmed" class="donate-container">
        <GroupBox :title="t('选项')" title-background-color="var(--n-color-modal)">
          <n-input-group>
            <n-input-group-label size="small">{{ t('赞助目标') }}</n-input-group-label>
            <n-select size="small"
              v-model:value="selectedStaff"
              :options="donatableStaffs"
              :placeholder="t('请选择要赞助的创作人员')"
              @update:value="handleStaffSelectionUpdate"
            />
          </n-input-group>
          <n-input-group style="margin-top: -1px;">
            <n-input-group-label size="small">{{ t('赞助方式') }}</n-input-group-label>
            <n-select size="small"
              v-model:value="selectedDonateWay"
              :options="availableDonateWays"
              :placeholder="t('请选择赞助方式')"
            />
          </n-input-group>
        </GroupBox>
        <GroupBox :title="t('最终确认')" title-background-color="var(--n-color-modal)">
          <div>
            <div style="float: left;">{{ t('您将开始赞助') }}</div>
            <StaffGroup :group-members="[currentDonateStaff]" style="float: left;" />
            <span>{{ t('，以支持HqHelper的{contents}。', currentDonateStaff.donate_info!.donate_desc) }}</span>
          </div>
          <div v-if="!currentDonateStaff.donate_info!.self" class="orangered flex-vac flex-wrap">
            <span>{{ t('※请在赞助留言中注明您是因HqHelper而进行了赞助。') }}</span>
            <HelpButton
              icon="question"
              placement="bottom"
              :size="16"
              :descriptions="[
                t('该成员还有其他的项目正接受赞助。'),
                t('如果您不特意注明，则我们在统计致谢名单时可能会忽略您。')
              ]"
            />
          </div>
        </GroupBox>
        <GroupBox :title="t('开始赞助')" title-background-color="var(--n-color-modal)">
          <div v-if="currentDonateWay.data_type === 'url'">
            <p>{{ t('请点击下方链接进行赞助：') }}</p>
            <a :href="currentDonateWay.data" target="_blank">{{ currentDonateWay.data }}</a>
          </div>
          <div v-else-if="currentDonateWay.data_type === 'qrcode'">
            <p v-if="currentDonateWay.type === 'qq'">{{ t('请使用移动端的QQ或TIM扫描下方二维码：') }}</p>
            <n-qr-code :value="currentDonateWay.data" :size="80" :padding="4" />
          </div>
        </GroupBox>
      </div>
      <div v-else class="cautions-container">
        <p class="bold">{{ t('万分感谢您对HqHelper的支持。') }}</p>
        <p class="bold">{{ t('不过在开始赞助之前，请先阅读以下注意事项：') }}</p>
        <n-divider style="margin: 1px 5px 3px 5px" />
        <ul>
          <li>{{ t('进行赞助之后，您的ID与留言会更新入致谢名单。致谢名单为人工统计、可能有数日延迟。') }}</li>
          <li>{{ t('您可以在转账备注/赞助留言中说明您希望显示的赞助者ID和留言。') }}</li>
          <li class="color-info">{{ t('赞助行为重在心意，不求数额，但也没有回报。请务必量力而行。') }}</li>
        </ul>
        <n-alert :title="t('如果遇到任何问题，请在Q群中联系我们。')" type="info" style="margin-top: auto; line-height: 1.2;">
          <p>
            <span>{{ t('如果你已经登录了QQ，那么') }}</span>
            <a :href="pageData.qGroupInfo.groupUrl" target="_blank">{{ t('点击此处') }}</a>
            <span>{{ t('就可以直接加入QQ群。') }}</span>
          </p>
          <p>
            <span>{{ t('你也可以搜索群号') }}</span>
            <n-gradient-text type="info" style="padding: 0 5px;">{{ pageData.qGroupInfo.groupNumber }}</n-gradient-text>
            <span>{{ t('来加入群聊。') }}</span>
          </p>
        </n-alert>
      </div>
    </div>
    
    <template #action>
      <div class="submit-container">
        <n-button
          :type="cautionsConfirmed ? 'default' : 'primary'"
          @click="cautionsConfirmed = !cautionsConfirmed"
        >
          <template #icon>
            <n-icon v-if="cautionsConfirmed"><SettingsBackupRestoreSharp /></n-icon>
            <n-icon v-else><DoneOutlined /></n-icon>
          </template>
          {{ cautionsConfirmed ? t('返回') : t('确认') }}
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
.wrapper {
  height: 250px;
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
.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile */
@media screen and (max-width: 767px) {
  .wrapper {
    height: 300px;
  }
}
</style>