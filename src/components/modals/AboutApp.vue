<script setup lang="ts">
import { inject } from 'vue';
import AboutData from '../../assets/data/about-app.json';

const t = inject<(i18nKey: string) => string>('t') ?? (() => { return '' })

const emit = defineEmits(['close'])
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <n-card
    closable
    role="dialog"
    style="max-width: 500px;"
    :title="t('关于本作')"
    @close="handleClose"
  >
    <n-flex vertical>
      <div class="about-header">
        <i class="xiv hq logo-about" style=""></i>
        <p class="about-title">HQ Helper</p>
      </div>
      <n-divider />
      <div class="about-content">
        <n-collapse accordion arrow-placement="right">
          <n-collapse-item name="1">
            <template #header>
              <span class="bold">{{ t('版权信息') }}</span>
            </template>
            <n-flex vertical size="small">
              <p>{{ t('本作程序源代码遵循MIT协议开源，但使用的协议在正式发布之前随时可能被更改。') }}</p>
              <p>{{ t('本作涉及《最终幻想XIV》之内容，版权归于SQUARE ENIX所有。') }}</p>
              <p>{{ t('本作仅供学习交流使用，不得以任何方式用于商业用途。') }}</p>
              <p>{{ t('转载、搬运须注明作者及出处。') }}</p>
            </n-flex>
          </n-collapse-item>
          <n-collapse-item name="2">
            <template #header>
              <span class="bold">{{ t('致谢：开发协助') }}</span>
            </template>
            <n-flex vertical size="small">
              <p>{{ t('特别感谢以下人员或组织为本作提供技术层面的支持：') }}</p>
              <div>
                <p class="bold">{{ t('程序内容贡献者：') }}</p>
                <n-flex>
                  <a
                    target="_blank"
                    v-for="(developers, i) in AboutData.app_developers"
                    :key="'developer-'+i"
                    :href="developers.page"
                  >
                    {{ developers.name }}
                  </a>
                </n-flex>
              </div>
              <div>
                <p class="bold">{{ t('技术支持或指导：') }}</p>
                <n-flex>
                  <a
                    target="_blank"
                    v-for="(t_supporters, i) in AboutData.tech_supporters"
                    :key="'t_supporters-'+i"
                    :href="t_supporters.page"
                  >
                    {{ t_supporters.name }}
                  </a>
                </n-flex>
              </div>
            </n-flex>
          </n-collapse-item>
          <n-collapse-item name="3">
            <template #header>
              <span class="bold">{{ t('致谢：赞助者') }}</span>
            </template>
            <n-flex vertical size="small">
              <p>{{ t('HqHelper的诞生与持续开发离不开用户的支持。') }}</p>
              <p class="bold">{{ t('特别感谢以下用户对前代HqHelper项目的赞助：') }}</p>
              <n-flex style="margin-top: 5px;">
                <n-button
                  v-for="(sponsor, i) in AboutData.sponsors_gen1"
                  :key="'sponsor-'+i"
                  type="warning"
                  dashed
                  size="tiny"
                >
                  {{ sponsor }}
                </n-button>
              </n-flex>
            </n-flex>
          </n-collapse-item>
        </n-collapse>
      </div>
    </n-flex>
  </n-card>
</template>

<style scoped>
.about-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo-about {
    font-size: 50px;
  }
  .about-title {
    font-size: 20px;
    margin-top: -15px;
  }
}

.bold {
  font-weight: bold;
}
</style>