<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import FoldableCard from './custom-controls/FoldableCard.vue'
import GroupBox from './custom-controls/GroupBox.vue'
import XivFARImage from './custom-controls/XivFARImage.vue'
import XivClasses from '@/assets/data/xiv-classes.json'

const locale = inject<Ref<"zh" | "en" | "ja">>('locale') ?? ref('zh');
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

const getClassName = (_class: any) => {
  switch (locale.value) {
    case 'en':
      return _class.name_en
    case 'ja':
      return _class.name_ja
  }
  return _class.name_zh
}
</script>

<template>
  <FoldableCard card-key="main-quick-operate">
    <template #header>
      <i class="xiv special-hotbar"></i>
      <span class="card-title-text">{{ t('快速操作') }}</span>
    </template>
    <n-flex>
      <n-card size="small" class="flex-battle" :title="t('战斗职业专用')">
        <n-flex :size="[12,12]">
          <GroupBox border-color="#919191" style="margin-left: 5px;">
            <template #title>{{ t('选择职能') }}</template>
            <n-flex :size="[4,4]" class="_class-btns-container">
              <n-button
                v-for="(_class, index) in XivClasses"
                :key="index"
                :color="_class.color"
              >
                <template #icon>
                  <XivFARImage :src="_class.icon" :size="20" />
                </template>
                {{ getClassName(_class) }}
              </n-button>
            </n-flex>
          </GroupBox>
          <GroupBox border-color="#919191" style="margin-left: 5px; height: fit-content;">
            <template #title>{{ t('实行操作') }}</template>
            <n-flex vertical class="qo-btns-container">
              <n-button>
                <span class="auto-text">{{ t('添加一套防具') }}</span>
              </n-button>
              <n-button>
                <span class="auto-text">{{ t('添加一套首饰') }}</span>
              </n-button>
              <n-button class="auto-btn">
                <span class="auto-text">{{ t('添加一套防具与首饰') }}</span>
              </n-button>
            </n-flex>
          </GroupBox>
        </n-flex>
      </n-card>
      <n-card size="small" class="flex-cg" :title="t('生产采集专用')">
        <n-flex>
          <n-button class="cg-btn">
            <span class="auto-text">{{ t('添加一套生产防具&首饰') }}</span>
          </n-button>
          <n-button class="cg-btn">
            <span class="auto-text">{{ t('添加一套采集防具&首饰') }}</span>
          </n-button>
          <n-button class="cg-btn">
            <span class="auto-text">{{ t('添加一套生产主副手') }}</span>
          </n-button>
          <n-button class="cg-btn">
            <span class="auto-text">{{ t('添加一套采集主副手') }}</span>
          </n-button>
        </n-flex>
      </n-card>
    </n-flex>
  </FoldableCard>
</template>

<style scoped>
/* PC */
@media screen and (min-width: 768px) {
  .flex-battle {
    max-width: 480px;

    ._class-btns-container {
      max-width: 200px;
    }
    .qo-btns-container {
      max-width: 180px;
    }
  }
  .flex-cg {
    max-width: 350px;

    .cg-btn {
      width: 47%;
      height: 75px;
    }
  }
  .auto-btn {
    padding: 14px;
    height: fit-content;
  }
  .auto-text {
    display: inline-block;
    width: 100%;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .flex-battle {
    width: 100%;

    .group-box {
      width: 100%;
    }
  }
  .flex-cg {
    width: 100%;

    .cg-btn {
      width: 100%;
    }
  }
}
</style>