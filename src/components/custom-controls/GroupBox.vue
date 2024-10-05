<script setup lang="ts">
import {
  NIcon, NTooltip
} from 'naive-ui'
import {
  InfoOutlined
} from '@vicons/material'
import { inject, ref, type Ref } from 'vue';

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

defineProps({
  borderColor: {
    type: String,
    default: '#919191',
  },
  title: {
    type: String,
    default: ''
  },
  titleBackgroundColor: {
    type: String,
    default: 'var(--n-color)'
  },
  titleMaxWidth: {
    type: String,
    default: 'unset'
  },
  descriptions: {
    type: Array as () => string[],
    default: () => []
  },
  containerExtraStyle: {
    type: String,
    default: ''
  },
  contentStyle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="group-box" :style="`border: 1px dashed ${borderColor}; ${containerExtraStyle}`">
    <div
      class="group-box-title"
      :style="{ backgroundColor: titleBackgroundColor, maxWidth: titleMaxWidth }"
    >
      <slot name="title">
        <div>{{ title }}</div>
          <div v-if="descriptions?.length">
            <n-tooltip :trigger="isMobile ? 'click' : 'hover'" placement="top" :style="isMobile ? 'max-width: 250px;' : ''">
              <template #trigger>
                <n-icon size="18" style="display: flex;"><InfoOutlined /></n-icon>
              </template>
              <div class="descriptions">
                <div v-for="(desc, dIndex) in descriptions" :key="'desc-' + dIndex">{{ desc }}</div>
              </div>
            </n-tooltip>
          </div>
      </slot>
    </div>
    <div class="group-box-content" :style="contentStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.group-box {
  padding: 8px;
  border-radius: var(--n-border-radius);

  .group-box-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin-top: -22px;
    margin-left: 1px;
    width: fit-content;
    text-align: center;
    color: var(--n-text-color);
    white-space: nowrap;       /* 防止文本换行 */
    overflow: hidden;          /* 隐藏溢出的内容 */
    text-overflow: ellipsis;

    .title-content {
      display: flex;
      align-items: center;
    }
  }

  .group-box-content {
    height: 100%;
  }
}
</style>