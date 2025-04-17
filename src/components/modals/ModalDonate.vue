<script setup lang="ts">
import { inject, ref } from 'vue'
import {
  NAlert, NButton, NDivider, NIcon, NGradientText, NQrCode
} from 'naive-ui'
import { 
  HandshakeOutlined,
  DoneOutlined, SettingsBackupRestoreSharp,
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })
interface ModalFestivalEggProps {
}
defineProps<ModalFestivalEggProps>()

const cautionsConfirmed = ref(false)

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
      </div>
      <n-alert :title="t('如果遇到任何问题，请在Q群中联系我们。')" type="info" style="line-height: 1.2;">
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
    flex: 1;
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