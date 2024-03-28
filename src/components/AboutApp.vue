<script setup lang="ts">
import { inject } from 'vue';
import sponsors from '../assets/data/sponsors.json';

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
    style="max-width: 80%; max-height: 80%;"
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
          <n-collapse-item :title="t('版权信息')" name="1">
            <p>{{ t('本作程序源代码遵循MIT协议开源，但使用的协议在正式发布之前随时可能被更改。') }}</p>
            <p>{{ t('本作涉及《最终幻想XIV》之内容，版权归于SQUARE ENIX所有。') }}</p>
            <p>{{ t('本作仅供学习交流使用，不得以任何方式用于商业用途。') }}</p>
            <p>{{ t('转载、搬运须注明作者及出处。') }}</p>
          </n-collapse-item>
          <n-collapse-item :title="t('致谢：开发协助')" name="2">
            <p>{{ t('特别感谢以下人员或组织为本作提供技术层面的支持：') }}</p>
            <p class="bold">{{ t('程序内容贡献者：') }}</p>
            <n-flex>
              <a href="https://github.com/InfSein" target="_blank">InfSein</a>
            </n-flex>
            <p class="bold">{{ t('技术支持或指导：') }}</p>
            <n-flex>
              <a href="https://www.xivdb.com/" target="_blank">XIVDB</a>
              <a href="https://www.ffcafe.cn/" target="_blank">FF-CAFE</a>
            </n-flex>
          </n-collapse-item>
          <n-collapse-item :title="t('致谢：赞助者')" name="3">
            <p>{{ t('HqHelper的诞生与持续开发离不开用户的支持。') }}</p>
            <p class="bold">{{ t('特别感谢以下用户对前代HqHelper项目的赞助：') }}</p>
            <n-flex>
              <n-button
                v-for="(sponsor, i) in sponsors.sponsors_gen1"
                :key="i"
                type="warning"
                dashed
                size="tiny"
              >
                {{ sponsor }}
              </n-button>
            </n-flex>
          </n-collapse-item>
        </n-collapse>
      </div>
    </n-flex>
  </n-card>
</template>

<style scoped>
.n-collapse-item__header-main {
  font-size: 16px !important;
  font-weight: bold !important;
}

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