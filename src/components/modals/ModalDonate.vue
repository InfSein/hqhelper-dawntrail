<script setup lang="ts">
import { computed, h, inject, ref } from 'vue'
import {
  NAlert, NButton, NDivider, NIcon, NInputGroup, NInputGroupLabel, NGradientText, NQrCode, NSelect,
type SelectRenderLabel, 
} from 'naive-ui'
import { 
  HandshakeOutlined,
  DoneOutlined, SettingsBackupRestoreSharp,
} from '@vicons/material'
import StaffGroup from '../custom/general/StaffGroup.vue'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import { getStaffMebers, type StaffMember } from '@/models/about-app'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const members = getStaffMebers(t)

const showModal = defineModel<boolean>('show', { required: true })
interface ModalFestivalEggProps {
}
defineProps<ModalFestivalEggProps>()

const cautionsConfirmed = ref(false)
const selectedStaff = ref(0)
const selectedDonateWay = ref(0)

const onLoad = () => {
  cautionsConfirmed.value = false
}

const pageData = {
  qqDonateUrl: 'https://i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&f=wallet&a=1&ac=CAEQlJC58QoYw9aqoAZCIDNmNDlkNDI3ZmI2ZjY2Yjg2ZGJmNGQ2YTk2MjA5ZDFl_xxx_sign&u=2922268692&n=float',
  qGroupInfo: {
    groupNumber: '721051298',
    groupUrl: 'https://jq.qq.com/?_wv=1027&k=LIfWPbZg',
  }
}
const donatableStaffs = computed(() => {
  return Object.values(members.value).filter((member) => {
    return member.donate_ways?.length
  }).map((data, index) => {
    return {
      label: data.name,
      value: index,
      data: data,
    }
  })
})
const availableDonateWays = computed(() => {
  return donatableStaffs.value[selectedStaff.value].data.donate_ways!.map((data, index) => {
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
    @on-load="onLoad"
  >
    <div class="wrapper">
      <div v-if="cautionsConfirmed" class="qrcode-container">
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
          <n-input-group>
            <n-input-group-label size="small">{{ t('赞助方式') }}</n-input-group-label>
            <n-select size="small"
              v-model:value="selectedDonateWay"
              :options="availableDonateWays"
              :placeholder="t('请选择赞助方式')"
            />
          </n-input-group>
        </GroupBox>
        <p class="bold">{{ t('请使用移动端的QQ或TIM扫描下方二维码：') }}</p>
        <n-qr-code :value="pageData.qqDonateUrl" :size="120" :padding="4" />
      </div>
      <div v-else class="cautions-container">
        <p class="bold">{{ t('万分感谢您对HqHelper的支持。') }}</p>
        <p class="bold">{{ t('不过在开始赞助之前，请先阅读以下注意事项：') }}</p>
        <n-divider style="margin: 1px 5px 3px 5px" />
        <ul>
          <li>{{ t('进行赞助之后，您的ID与留言会更新入致谢名单。致谢名单为人工统计、可能有数日延迟。') }}</li>
          <li>{{ t('您可以在转账备注中说明您希望显示的赞助者ID名和留言。') }}</li>
          <li>{{ t('加入致谢名单后也可以修改自己的名称。不过这需要人工录入，因此无法频繁地修改。') }}</li>
          <li class="color-info">{{ t('赞助行为重在心意，不求数额，但也没有回报。请务必量力而行。') }}</li>
        </ul>
        <n-alert :title="t('如果遇到任何问题，请在Q群中联系我们。')" type="info" style="margin-top: 8px; line-height: 1.2;">
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
  </MyModal>
</template>

<style scoped>
.wrapper {
  height: 250px;
  line-height: 1.2;
  display: flex;
  flex-direction: column;

  .qrcode-container,
  .cautions-container {
    height: 100%;
  }

  ul {
    padding-left: 1.5em;
  }
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>