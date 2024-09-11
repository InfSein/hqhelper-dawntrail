<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import {
  NAvatar, NButton, NCard, NDivider, NFlex, NIcon, NModal, NPopover
} from 'naive-ui'
import { InfoSharp } from '@vicons/material'
import { DataAboutApp } from '@/data/about-app'
import AppStatus from '@/variables/app-status'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const showModal = defineModel<boolean>('show', { required: true })

watch(showModal, async (newVal, oldVal) => {
  if (newVal && !oldVal) {
    if (window.electronAPI?.clientVersion) {
      currentElectronVersion.value = await window.electronAPI?.clientVersion
    }
  }
})

const currentElectronVersion = ref('')

const cnVersionText = computed(() => {
  return t('国服数据版本：{}', AppStatus.SupportedGameVersion.CN)
})

const handleClose = () => {
  showModal.value = false
}
</script>

<template>
  <n-modal v-model:show="showModal">
    <n-card
      closable
      role="dialog"
      class="no-select"
      style="width: 98%; max-width: 600px;"
      :style="{ height: isMobile ? '650px' : '600px' }"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon>
            <InfoSharp />
          </n-icon>
          <span class="title">{{ t('关于本作') }}</span>
        </div>
      </template>

      <n-card embedded class="wrapper" :style="{ height: isMobile ? '550px' : '500px' }">
        <div class="title flex">
          <i class="xiv hq logo-about"></i>
          <p class="about-title">HQ Helper</p>
        </div>
        <div class="version-info">
          <div>{{ t('当前网页版本：{v}', AppStatus.Version) }}</div>
          <div v-if="currentElectronVersion">{{ t('当前客户端版本：{v}', currentElectronVersion) }}</div>
          <div v-else />
          <div v-if="cnVersionText">{{ cnVersionText }}</div>
          <div>{{ t('国际服数据版本：{}', AppStatus.SupportedGameVersion.GLOBAL) }}</div>
        </div>
        <n-divider />
        <div id="staffs">
          <div class="title">{{ t('创作人员') }}</div>
          <div class="content">
            <div
              v-for="(group, index) in DataAboutApp.staffs"
              :key="'staff-group-' + index"
              class="staff-group"
            >
              <div class="group-title">{{ t(group.group_name) }}</div>
              <div class="group-content">
                <div
                  v-for="(subgroup, sgIndex) in group.sub_groups"
                  :key="'staff-subgroup-' + index + '-' + sgIndex"
                  class="staff-subgroup"
                >
                  <div class="subgroup-title">{{ t(subgroup.group_name) }}</div>
                  <div class="subgroup-content">
                    <n-popover :placement="isMobile ? 'bottom' : 'right'" v-for="(member, mIndex) in subgroup.members"
                    :key="'staff-member-' + index + '-' + sgIndex + '-' + mIndex">
                      <template #trigger>
                        <div class="subgroup-item">
                          <div class="member-avatar">
                            <n-avatar round :size="15" :src="member.avatar_url"
                              fallback-src="./image/game-job/companion/none.png" />
                          </div>
                          <div class="member-name">
                            <a href="javascript:void(0);">{{ member.name }}</a>
                          </div>
                        </div>
                      </template>
                      <div class="intro-popover">
                        <div class="base-info">
                          <div class="avatar">
                            <n-avatar round size="medium" :src="member.avatar_url"
                              fallback-src="./image/game-job/companion/none.png" />
                          </div>
                          <div class="name title">{{ member.name }}</div>
                        </div>
                        <n-divider />
                        <div class="intro">
                          <p v-for="(intro, i) in member.introductions" :key="member.name + '-intro-' + i">
                            {{ intro }}
                          </p>
                        </div>
                        <div class="tail">
                          <div class="title">{{ t('个人主页：') }}</div>
                          <div class="pages">
                            <a target="_blank" v-for="(page, pIndex) in member.pages"
                              :key="member.name + '-page-' + pIndex" :href="page.url">
                              {{ page.name }}
                            </a>
                          </div>
                        </div>
                      </div>
                    </n-popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <n-divider />
        <div id="copyright">
          <div class="title">{{ t('版权信息') }}</div>
          <div class="content">
            <p v-for="(cr, crIndex) in DataAboutApp.copyrights" :key="'copyright-' + crIndex">{{ t(cr) }}</p>
          </div>
        </div>
        <n-divider />
        <div id="thanks-donate">
          <div class="title">{{ t('致谢：赞助') }}</div>
          <div class="content">
            <p>{{ t('HqHelper的诞生与持续开发离不开用户的支持。') }}</p>
            <p class="bold">{{ t('特别感谢以下用户对前代HqHelper项目的赞助：') }}</p>
            <n-flex size="small" style="margin: 5px 0 0 2em;">
              <n-button
                v-for="(sponsor, i) in DataAboutApp.sponsors_gen1"
                :key="'sponsor-g1-'+i"
                type="warning"
                dashed
                size="tiny"
              >
                {{ sponsor }}
              </n-button>
            </n-flex>
          </div>
        </div>
      </n-card>
    </n-card>
  </n-modal>
</template>

<style scoped>
:deep(.n-tabs-pane-wrapper) {
  height: 100%;
  .n-tab-pane {
    height: 100%;
  }
}
.n-divider {
  margin: 10px 0;
}

.wrapper {
  display: flex;
  flex-direction: column;
  user-select: text;
  overflow-y: auto;

  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .version-info {
    line-height: 1.3;
    margin-left: 1.2em;
    width: fit-content;
  }
  .content {
    display: flex;
    flex-direction: column;
    text-indent: 1.2em;
  }

  #staffs {
    .content .staff-group {
      .group-title {
        font-size: 15px;
        font-weight: bold;
      }
      .group-content {
        display: flex;
        flex-direction: column;
        margin-left: 1em;

        .staff-subgroup {
          display: flex;
          align-items: center;
          gap: 3px;

          .subgroup-title {
            font-weight: bold;
          }
          .subgroup-title::after {
            content: " -";
          }
          .subgroup-content {
            display: flex;
            gap: 5px;

            .subgroup-item {
              display: flex;
              align-items: center;
              line-height: 20px;
              
              .member-avatar {
                display: flex;
                align-items: center;
              }
              .member-name {
                text-indent: initial;
              }
            }
          }
        }
      }
    }
  }
}

.intro-popover {
  width: 220px;
  max-width: 98%;

  .base-info {
    display: flex;
    align-items: center;
    gap: 5px;
    line-height: 15px;

    .name {
      font-size: 20px;
    }
  }
  .tail {
    margin-top: 5px;
  }
  .title {
    font-weight: bold;
  }
}

/* Desktop */
@media screen and (min-width: 768px) {
  .version-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 10px;
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