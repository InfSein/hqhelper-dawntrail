<script setup lang="ts">
import { inject } from 'vue';
import FoldableCard from './custom-controls/FoldableCard.vue'
import GroupBox from './custom-controls/GroupBox.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

const roles = [
  { key: 'tank', text: t('坦克'), type: 'info' },
  { key: 'healer', text: t('治疗'), type: 'success' },
  { key: 'fending', text: t('制敌'), type: 'error' },
  { key: 'striking', text: t('强袭'), type: 'error' },
  { key: 'scouting', text: t('游击'), type: 'error' },
  { key: 'aiming', text: t('远敏'), type: 'error' },
  { key: 'casting', text: t('法系'), type: 'error' },
]
</script>

<template>
  <FoldableCard card-key="main-quick-operate">
    <template #header>
      <i class="xiv special-hotbar"></i>
      <span class="card-title-text">{{ t('快速操作') }}</span>
    </template>
    <n-flex>
      <n-card class="flex-battle" :title="t('战斗职业专用')">
        <n-flex :size="[12,12]">
          <GroupBox style="margin-left: 5px;">
            <template #title>{{ t('选择职能') }}</template>
            <n-flex size="small" class="role-btns-container">
              <n-button
                v-for="role in roles"
                :key="role.key"
                :type="role.type"
              >
                {{ role.text }}
              </n-button>
            </n-flex>
          </GroupBox>
          <GroupBox style="margin-left: 5px; height: fit-content;">
            <template #title>{{ t('实行操作') }}</template>
            <n-flex vertical justify="center" class="qo-btns-container">
              <n-button>{{ t('添加一套防具') }}</n-button>
              <n-button>{{ t('添加一套首饰') }}</n-button>
              <n-button>{{ t('添加一套防具与首饰') }}</n-button>
            </n-flex>
          </GroupBox>
        </n-flex>
      </n-card>
      <n-card class="flex-cg" :title="t('生产采集专用')">
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
    max-width: 400px;

    .role-btns-container {
      max-width: 125px;
    }
  }
  .flex-cg {
    max-width: 400px;

    .cg-btn {
      width: 47%;
      height: 75px;

      span.auto-text {
        display: inline-block;
        width: 100%;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    }
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