<script setup lang="ts">

interface CompactFormProps {
  labelMaxWidth?: string
  size?: "small" | "medium"
}
const props = withDefaults(defineProps<CompactFormProps>(), {
  labelMaxWidth: '35%',
  size: 'medium',
})

const styleVars = computed(() => {
  return {
    '--cf-grid-cols': `fit-content(${props.labelMaxWidth}) 1fr`
  }
})

provide('formSize', toRef(props, 'size'))
</script>

<template>
  <div class="compact-form" :style="styleVars">
    <slot></slot>
  </div>
</template>

<style scoped>
.compact-form {
  display: grid;
  grid-template-columns: var(--cf-grid-cols);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  gap: 0;
  user-select: none;
}

/* 处理行间边框 */
.compact-form :deep(.compact-form-item-wrapper:not(:last-child)) {
  .n-input-group-label__border,
  .n-base-selection__border {
    border-bottom: none; /* 在浅色模式下移除多余边框 */
  }
}
.theme-dark .compact-form :deep(.compact-form-item-wrapper:not(:last-child)) {
  .n-input-group-label__border,
  .n-base-selection__border {
    border-bottom: 1px solid #55555A; /* 在深色模式下则反而要添加边框 */
  }
}

/* 抹平多行之间对外的边框 */
.compact-form :deep(.compact-form-item-wrapper:nth-child(even):not(:first-child)) {
  .n-input-group-label {
    border-top-left-radius: 0 !important;
  }
  .n-base-selection,
  .n-base-selection__border,
  .n-base-selection__state-border,
  .n-input__border, .n-input__state-border,
  .n-button__border, .n-button__state-border {
    border-top-right-radius: 0 !important;
  }
}
.compact-form :deep(.compact-form-item-wrapper:nth-child(odd):not(:last-child)) {
  .n-input-group-label {
    border-bottom-left-radius: 0 !important;
  }
  .n-base-selection,
  .n-base-selection__border,
  .n-base-selection__state-border,
  .n-input__border, .n-input__state-border,
  .n-button__border, .n-button__state-border {
    border-bottom-right-radius: 0 !important;
  }
}

/* 修正因自定义封装组件而出现的一些UI细节 */
.compact-form :deep(.compact-form-item-wrapper>.cf-input) {
  .n-button, .n-input, .n-select {
    .n-base-selection,
    .n-base-selection__border,
    .n-base-selection__state-border,
    .n-input__border, .n-input__state-border,
    .n-button__border, .n-button__state-border {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }
  .n-button:not(:last-child),
  .n-input:not(:last-child),
  .n-select:not(:last-child) {
    .n-base-selection,
    .n-base-selection__border,
    .n-base-selection__state-border,
    .n-input__border, .n-input__state-border,
    .n-button__border, .n-button__state-border {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
  }
}
</style>