<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NButton, NDivider, NFlex, NGradientText, NIcon, NPopover, NQrCode, NScrollbar, NTabs, NTabPane
} from 'naive-ui'
import {
  ContactlessSharp, CloseSharp
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import IconQQ from '@/assets/icons/external/IconQQ.vue'
import IconGithub from '@/assets/icons/external/IconGithub.vue'
import IconWeibo from '@/assets/icons/external/IconWeibo.vue'
import IconTwitter from '@/assets/icons/external/IconTwitter.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })

const qGroupInfo = {
  groupNumber: '721051298',
  groupUrl: 'https://jq.qq.com/?_wv=1027&k=LIfWPbZg',
}
const githubInfo = {
  newIssueUrl: 'https://github.com/InfSein/hqhelper-dawntrail/issues/new'
}
const otherSocialInfo = {
  weiboUrl: 'https://weibo.com/u/7870808507',
  twitterUrl: 'https://twitter.com/FF14_HqHelper'
}
const tabContentStyle = [
  'height: 350px;',
  'padding: 10px;',
  'user-select: text;'
].join(' ')

const handleClose = () => {
  showModal.value = false
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="ContactlessSharp"
    :title="t('联系我们')"
  >
    <n-tabs type="segment" animated>
      <n-tab-pane name="feedback" :tab="t('咨询与反馈')">
        <n-scrollbar trigger="none" :style="tabContentStyle">
          <div id="qq" class="item">
            <div class="title">
              <n-icon><IconQQ /></n-icon>
              <span>{{ t('QQ') }}</span>
            </div>
            <div class="content">
              <p>
                <span>{{ t('只要你使用QQ，通过QQ群沟通就会是最便利的方式。') }}</span>
                <span>{{ t('你可以在群内提问，建议，或是单纯的聊天打屁。') }}</span>
              </p>
              <p>
                <span>{{ t('如果你已经登录了QQ，那么') }}</span>
                <a :href="qGroupInfo.groupUrl" target="_blank">{{ t('点击此处') }}</a>
                <span>{{ t('就可以直接加入QQ群。') }}</span>
                <span>{{ t('你也可以搜索群号') }}</span>
                <n-gradient-text type="info" style="padding: 0 5px;">{{ qGroupInfo.groupNumber }}</n-gradient-text>
                <span>{{ t('来加入群聊。') }}</span>
              </p>
            </div>
            <div class="tail" v-if="!isMobile">
              <n-popover trigger="hover" placement="bottom">
                <template #trigger>
                  <n-button size="small">{{ t('也可以手机扫码进群') }}</n-button>
                </template>
                <n-flex justify="center">
                  <n-qr-code class="qgroup-qrcode" :size="110" :value="qGroupInfo.groupUrl" />
                </n-flex>
              </n-popover>
            </div>
          </div>
          <n-divider />
          <div id="github-issue" class="item">
            <div class="title">
              <n-icon><IconGithub /></n-icon>
              <span>{{ t('在Github创建议题 (Issue)') }}</span>
            </div>
            <div class="content">
              <p>
                <span>{{ t('在Github通过创建议题(Issue)来反馈你遇到的BUG，或是提出优化和新功能的需求。') }}</span>
                <span>{{ t('通过这种方式进行反馈的好处是可以随时追踪到问题的处理进度。') }}</span>
              </p>
              <p>
                <span>{{ t('如果你拥有一个Github账号，那么可以') }}</span>
                <a :href="githubInfo.newIssueUrl" target="_blank">{{ t('点击此处') }}</a>
                <span>{{ t('来创建议题。') }}</span>
                <span>{{ t('请注意遵守平台的社区准则，并且仔细阅读议题引导。') }}</span>
              </p>
            </div>
          </div>
        </n-scrollbar>
      </n-tab-pane>
      <n-tab-pane name="follow" :tab="t('关注最新资讯')">
        <n-scrollbar trigger="none" :style="tabContentStyle">
          <div>{{ t('我们随时都欢迎你通过社交平台来追踪HqHelper的最新资讯，只要你不嫌吵闹。') }}</div>
          <n-divider />
          <div id="weibo" class="item">
            <div class="title">
              <n-icon><IconWeibo /></n-icon>
              <span>{{ t('微博') }}</span>
            </div>
            <div class="content">
              <p>
                <span>{{ t('我们的微博账号只会提供中文内容。') }}</span>
                <a :href="otherSocialInfo.weiboUrl" target="_blank">{{ t('点击此处') }}</a>
                <span>{{ t('来关注我们。') }}</span>
              </p>
            </div>
          </div>
          <n-divider />
          <div id="twitter" class="item">
            <div class="title">
              <n-icon><IconTwitter /></n-icon>
              <span>{{ t('推特 (X)') }}</span>
            </div>
            <div class="content">
              <p>
                <span>{{ t('我们的推特(X)账号目前提供有限的英文内容。') }}</span>
                <a :href="otherSocialInfo.twitterUrl" target="_blank">{{ t('点击此处') }}</a>
                <span>{{ t('来关注我们。') }}</span>
              </p>
            </div>
          </div>
        </n-scrollbar>
      </n-tab-pane>
    </n-tabs>
    
    <template #action>
      <div class="submit-container">
        <n-button type="error" size="large" @click="handleClose">
          <template #icon>
            <n-icon><CloseSharp /></n-icon>
          </template>
          {{ t('关闭') }}
        </n-button>
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
/* All */
:deep(.qgroup-qrcode canvas) {
  /* The size of canvas in `n-qr-code` is wrong. So it is nececssary to override it. */
  width: 86px !important;
  height: 86px !important;
}
:deep(.n-divider:not(.n-divider--vertical)) {
  /* Reduce the margin of `n-divider` (default is 24px) */
  margin-top: 12px;
  margin-bottom: 12px;
}
:deep(.n-gradient-text) {
  /* Set display from `inline-block` to `inline` to prevent `text-indent` lose its effect. */
  display: inline;
}
.item {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .title {
    font-size: 21px;
    display: flex;
    gap: 10px;
    line-height: 29px;
  }
  .content {
    text-indent: 2em;
  }
  /*.tail {
    display: flex;
    flex-direction: row-reverse;
  }*/
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Mobile only */
/* @media (max-width: 768px) {
.wrapper {
    grid-template-columns: 1fr;
  }
} */
</style>