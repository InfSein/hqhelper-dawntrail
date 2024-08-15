<script setup>
defineProps({
  borderColor: {
    type: String,
    default: '#919191',
  },
  titleBackgroundColor: {
    type: String,
    default: 'var(--n-color)'
  },
  titleMaxWidth: {
    type: String,
    default: 'unset'
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
      <slot name="title" />
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
  }

  .group-box-content {
    height: 100%;
  }
}
</style>