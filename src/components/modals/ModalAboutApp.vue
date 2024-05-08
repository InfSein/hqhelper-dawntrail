<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import Contributors from '../../assets/data/app-contributors.json'
import {
  InfoSharp,
  CreateSharp, CopyrightSharp, EngineeringSharp, AttachMoneySharp
} from '@vicons/material'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const modelShow = defineModel<boolean>('show')

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
      :style="{ height: isMobile ? '550px' : '400px' }"
      :title="t('关于本作')"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><InfoSharp /></n-icon>
          <span class="title">{{ t('关于本作') }}</span>
        </div>
      </template>
      <div class="about-header">
        <i class="xiv hq logo-about"></i>
        <p class="about-title">HQ Helper</p>
      </div>
      <n-divider />
      <n-card class="about-content" embedded :bordered="false">
        <n-tabs
          animated
          type="line"
          placement="top"
          default-value="staff"
          style="height: 100%;"
        >
          <n-tab-pane name="staff">
            <template #tab>
              <div class="tab-title">
                <n-icon><CreateSharp /></n-icon>
                <span>{{ t('创作人员') }}</span>
              </div>
            </template>
            <n-flex vertical size="small">
              <p>{{ t('HqHelper的诞生和维护与以下人员直接相关：') }}</p>
              <div>
                <p class="bold">{{ t('主要程序开发：') }}</p>
                <n-flex>
                  <a
                    target="_blank"
                    v-for="(developers, i) in Contributors.major_developers"
                    :key="'major_developers-'+i"
                    :href="developers.page"
                  >
                    {{ developers.name }}
                  </a>
                </n-flex>
              </div>
              <div>
                <p class="bold">{{ t('本地化翻译：') }}</p>
                <n-flex>
                  <a
                    target="_blank"
                    v-for="(developers, i) in Contributors.localization_contributors"
                    :key="'localization_contributors-'+i"
                    :href="developers.page"
                  >
                    {{ developers.name }}
                  </a>
                </n-flex>
              </div>
            </n-flex>
          </n-tab-pane>
          <n-tab-pane name="copyright">
            <template #tab>
              <div class="tab-title">
                <n-icon><CopyrightSharp /></n-icon>
                <span>{{ t('版权信息') }}</span>
              </div>
            </template>
            <n-flex vertical size="small">
              <p>{{ t('本作程序源代码遵循MIT协议开源，但使用的协议在正式发布之前随时可能被更改。') }}</p>
              <p>{{ t('本作涉及《最终幻想XIV》之内容，版权归于SQUARE ENIX所有。') }}</p>
              <p>{{ t('本作仅供学习交流使用，不得以任何方式用于商业用途。') }}</p>
              <p>{{ t('转载、搬运须注明作者及出处。') }}</p>
            </n-flex>
          </n-tab-pane>
          <n-tab-pane name="thanks-dev">
            <template #tab>
              <div class="tab-title">
                <n-icon><EngineeringSharp /></n-icon>
                <span>{{ t('致谢：技术') }}</span>
              </div>
            </template>
            <n-flex vertical size="small">
              <p>{{ t('特别感谢以下人员或组织为本作提供技术层面的支持：') }}</p>
              <div>
                <p class="bold">{{ t('技术支持或指导：') }}</p>
                <n-flex>
                  <a
                    target="_blank"
                    v-for="(t_supporter, i) in Contributors.technical_supporters"
                    :key="'technical_supporters-'+i"
                    :href="t_supporter.page"
                  >
                    {{ t_supporter.name }}
                  </a>
                </n-flex>
              </div>
              <div>
                <p class="bold">{{ t('API/数据提供方：') }}</p>
                <n-flex>
                  <a
                    target="_blank"
                    v-for="(aod_provider, i) in Contributors.a_providers"
                    :key="'APIorDATA_providers-'+i"
                    :href="aod_provider.page"
                  >
                    {{ aod_provider.name }}
                  </a>
                </n-flex>
              </div>
            </n-flex>
          </n-tab-pane>
          <n-tab-pane name="thanks-donate">
            <template #tab>
              <div class="tab-title">
                <n-icon><AttachMoneySharp /></n-icon>
                <span>{{ t('致谢：赞助') }}</span>
              </div>
            </template>
            <n-flex vertical size="small">
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
            </n-flex>
          </n-tab-pane>
        </n-tabs>
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

.about-header {
  height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;

  .logo-about {
    font-size: 50px;
  }
  .about-title {
    font-size: 25px;
    margin-left: 5px;
    margin-top: 10px;
  }
}
.about-content {
  height: calc(100% - 90px);
}
</style>