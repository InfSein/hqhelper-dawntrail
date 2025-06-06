<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import {
  NDivider, NTable
} from 'naive-ui'
// import {
//   RefreshOutlined
// } from '@vicons/material'
import StaffGroup from './StaffGroup.vue'
import ModalSponsorsList from '@/components/modals/ModalSponsorsList.vue'
import AppStatus from '@/variables/app-status'
import { getStaffMebers } from '@/models/about-app'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const members = getStaffMebers(t)

const currentElectronVersion = ref('')

onMounted(async () => {
  if (window.electronAPI?.clientVersion) {
    currentElectronVersion.value = await window.electronAPI?.clientVersion
  }
})

const showSponsors = ref(false)
const viewSponsors = () => {
  showSponsors.value = true
}
</script>

<template>
  <div class="wrapper">
    <div class="logo">
      <div class="logo-content">
        <i class="xiv hq logo-about"></i>
        HqHelper
      </div>
      <div class="patch-text">- DAWNTRAIL -</div>
    </div>
    <n-divider />
    <div class="version-info">
      <div>{{ t('当前网页版本：{v}', AppStatus.Version) }}</div>
      <div>{{ currentElectronVersion ? t('当前客户端版本：{v}', currentElectronVersion) : '' }}</div>
      <div>{{ t('国服数据版本：{}', AppStatus.SupportedGameVersion.CN) }}</div>
      <div>{{ t('国际服数据版本：{}', AppStatus.SupportedGameVersion.GLOBAL) }}</div>
    </div>
    <n-divider />
    <div id="staffs">
      <div class="title">{{ t('创作人员') }}</div>
      <div class="content">
        <n-table class="staff-table" :single-line="false" size="small">
          <tbody>
            <tr>
              <td>{{ t('制作人') }}</td>
              <td>
                <StaffGroup :group-members="[members.infsein, members.nbb, members.yakita]" />
              </td>
            </tr>
            <tr>
              <td>{{ t('贡献者') }}</td>
              <td>
                <StaffGroup :group-members="[members.wcy, members.kimuchi, members.etnatker]" />
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
    <n-divider />
    <div id="thanks-donate">
      <div class="title">{{ t('致谢：赞助') }}</div>
      <div class="content">
        <p>{{ t('HqHelper的诞生与持续开发离不开用户的支持。') }}</p>
        <p>
          <span>{{ t('点击') }}</span>
          <a href="javascript:void(0);" @click="viewSponsors">{{ t('这里') }}</a>
          <span>{{ t('来查看致谢名单。') }}</span>
        </p>
      </div>
    </div>
    <n-divider />
    <div id="copyright">
      <div class="content">
        <div class="extra font-small">
          FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd. <br>
          Copyrighted Materials are extracted from FINAL FANTASY XIV © 2010 - 2019 SQUARE ENIX CO., LTD. All Rights Reserved.
        </div>
      </div>
    </div>

    <ModalSponsorsList
      v-model:show="showSponsors"
    />
  </div>
</template>

<style scoped>
.n-divider {
  margin: 10px 0;
}
:deep(.n-spin) {
  --n-size: 14px !important;
}

.wrapper {
  display: flex;
  flex-direction: column;
  user-select: text;
  overflow-y: auto;
  padding-right: 5px;

  .logo {
    align-self: center;
    text-align: center;
    user-select: none;
    margin: 0.5em 0;
    padding-bottom: 0.6em;
    border-radius: 6px;
    box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
    
    .logo-content {
      display: flex;
      padding: 0.4em 0.5em 0 0.5em;
      line-height: 1;
      font-size: 32px;
      font-weight: 900;
    }
    .patch-text {
      line-height: 1.3;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 1px;
    }
  }
  .title {
    font-weight: bold;
    margin-left: 1.2em;
  }
  .version-info {
    line-height: 1.3;
    margin-left: 1.2em;
    width: fit-content;
  }
  .content {
    display: flex;
    flex-direction: column;
    margin: 0 2.4em;

    .extra {
      line-height: 1.2;
      color: gray;
      text-indent: initial;
      margin-top: 0.5rem;
    }
    .staff-table {
      margin-top: 5px;

      td {
        padding: 3px 6px;
      }
      tr td:first-child {
        font-weight: bold;
        background-color: var(--n-th-color);
        width: fit-content;
        min-width: 60px;
        text-align: center;
      }
    }
  }
}



/* Desktop */
@media screen and (min-width: 768px) {
  .version-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 12px;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .version-info {
    display: flex;
    flex-direction: column;
  }
}
</style>