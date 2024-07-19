<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NButton, NCard, NFlex
} from 'naive-ui'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import GroupBox from '../custom-controls/GroupBox.vue'
import XivFARImage from '../custom-controls/XivFARImage.vue'
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
        <n-flex :size="[12,12]" style="height: 100%;">
          <GroupBox class="class-btns-container">
            <template #title>{{ t('选择职类') }}</template>
            <n-flex justify="space-between" :size="[4,8]">
              <n-button
                class="class-btn"
                v-for="(_class, index) in XivClasses"
                :key="index"
                :color="_class.color"
              >
                <template #icon><XivFARImage :src="_class.icon" :size="20" /></template>
                <span class="text">{{ getClassName(_class) }}</span>
              </n-button>
            </n-flex>
          </GroupBox>
          <GroupBox class="qo-btns-container">
            <template #title>{{ t('实行操作') }}</template>
            <n-flex vertical style="height: 100%;">
              <n-button>
                <span class="auto-text">{{ t('添加一套防具') }}</span>
              </n-button>
              <n-button>
                <span class="auto-text">{{ t('添加一套首饰') }}</span>
              </n-button>
              <n-button class="last-btn">
                <span class="auto-text">{{ t('添加一套{}防具与首饰', '\n') }}</span>
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
/* All */
.text {
  color: white;
}
.class-btn {
  width: 31%;
  padding: 0 8px;
}
.lang-ja .class-btn {
  width: 49%;
}

/* PC */
@media screen and (min-width: 768px) {
  .flex-battle {
    width: 60%;

    .class-btns-container {
      width: 60%;
      margin-left: 5px;
    }
    .qo-btns-container {
      width: calc(40% - 17px);

      .last-btn {
        height: calc(100% - 84px);
      }
    }
  }
  .flex-cg {
    width: calc(40% - 12px);

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