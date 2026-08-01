/* eslint-disable */
// @ts-nocheck

// 这个文件用于定义全局组件。

export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    CompactForm: typeof import('./components/templates/CompactForm.vue')['default']
    CompactFormItem: typeof import('./components/templates/CompactFormItem.vue')['default']
    FoldableCard: typeof import('./components/templates/FoldableCard.vue')['default']
    GroupBox: typeof import('./components/templates/GroupBox.vue')['default']
    MyModal: typeof import('./components/templates/MyModal.vue')['default']
  }
}
