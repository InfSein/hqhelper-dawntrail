<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import Contributors from '../../assets/data/app-contributors.json'
import {
  InfoSharp,
  CreateSharp, CopyrightSharp, EngineeringSharp, AttachMoneySharp
} from '@vicons/material'
import type { Staff, StaffGroup } from '@/models/about-app'
import { defaultUserConfig, type UserConfigModel } from '@/models/user-config';

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)

const modelShow = defineModel<boolean>('show', { required: true })

const staffs = Contributors.staffs as Staff[]
const getTitle = (obj: Staff | StaffGroup) => {
  switch (userConfig.value.language_ui) {
    case 'en': return obj.group_name_en
    case 'ja': return obj.group_name_ja
  }
  return obj.group_name_zh
}

const handleClose = () => {
  modelShow.value = false
}
</script>

<template>
  <n-modal v-model:show="modelShow">
    <n-card
      closable
      role="dialog"
      style="width: 98%; max-width: 600px;"
      :style="{ height: isMobile ? '550px' : '500px' }"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><InfoSharp /></n-icon>
          <span class="title">{{ t('关于本作') }}</span>
        </div>
      </template>

      <n-card embedded class="wrapper" :style="{ height: isMobile ? '450px' : '400px' }">
        <div class="about-header">
          <i class="xiv hq logo-about"></i>
          <p class="about-title">HQ Helper</p>
        </div>
        <n-divider />
        <div id="staffs">
          <div class="title">{{ t('创作人员') }}</div>
          <div class="content">
            <div
              v-for="(group, index) in staffs"
              :key="'staff-group-' + index"
              class="staff-group"
            >
              <div class="group-title">{{ getTitle(group) }}</div>
              <div class="group-content">
                <div
                  v-for="(subgroup, sgIndex) in group.sub_groups"
                  :key="'staff-subgroup-' + index + '-' + sgIndex"
                  class="staff-subgroup"
                >
                  <div class="subgroup-title">{{ getTitle(subgroup) }}</div>
                  <div class="subgroup-content">
                    <div
                      v-for="(member, mIndex) in subgroup.members"
                      :key="'staff-member-' + index + '-' + sgIndex + '-' + mIndex"
                      class="subgroup-item"
                    >
                      <n-divider vertical v-if="mIndex" />
                      <div class="member-avatar">
                        <n-avatar
                          round
                          :size="15"
                          :src="member.avatar_url"
                          fallback-src="./image/game-job/companion/none.png"
                        />
                      </div>
                      <div class="member-name">
                        <a href="javascript:void(0);">{{ member.name }}</a>
                      </div>
                    </div>
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
            <p>{{ t('本作程序源代码遵循MIT协议开源，但使用的协议在正式发布之前随时可能被更改。') }}</p>
            <p>{{ t('本作涉及《最终幻想XIV》之内容，版权归于SQUARE ENIX所有。') }}</p>
            <p>{{ t('本作仅供学习交流使用，不得以任何方式用于商业用途。') }}</p>
            <p>{{ t('转载、搬运须注明作者及出处。') }}</p>
          </div>
        </div>
        <n-divider />
        <div id="thanks-donate">
          <div class="title">{{ t('致谢：赞助') }}</div>
          <div class="content">
            <p>{{ t('HqHelper的诞生与持续开发离不开用户的支持。') }}</p>
            <p class="bold">{{ t('特别感谢以下用户对前代HqHelper项目的赞助：') }}</p>
            <n-flex style="margin-top: 5px;">
              <n-button
                v-for="(sponsor, i) in Contributors.sponsors_gen1"
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
  overflow-y: auto;
  flex-direction: column;

  .title {
    font-size: 16px;
    font-weight: bold;
  }
  .content {
    display: flex;
    flex-direction: column;
    margin-left: 2em;
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
          gap: 5px;
          .subgroup-title {
            font-weight: bold;
          }
          .subgroup-title::after {
            content: " - ";
          }
          .subgroup-item {
            display: flex;
            align-items: center;
            line-height: 20px;
            .member-avatar {
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>