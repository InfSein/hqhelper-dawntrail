<script lang="ts" setup>
import {
  NBadge, NButton
} from 'naive-ui'
import XivFARImage from './XivFARImage.vue'

interface JobButtonProps {
  /** 被选中 */
  selected: boolean;
  /** 职能 */
  role: string;
  /** 职业 */
  job: string;
  /** 职业图标 */
  jobIcon: string;
  /** UI尺寸预设 */
  imgSize: number;
  /** 按钮颜色 */
  btnColor: string;
  /** 徽标计数 */
  count: number;
  /** 按钮是否禁用(可选,默认false) */
  disabled?: boolean;
}

const props = defineProps<JobButtonProps>()

const btnSize = props.imgSize + 5

</script>

<template>
  <n-badge :value="count" :max="99" :color="props.btnColor">
    <n-button
      :ghost="!props.selected"
      :disabled="props.disabled"
      class="job-button"
      :color="props.btnColor"
      :style="{ width: `${btnSize}px`, height: `${btnSize}px` }"
    >
      <XivFARImage
        :src="jobIcon"
        :size="imgSize"
      />
    </n-button>
  </n-badge>
</template>

<style scoped>
:deep(.n-badge-sup) {
  border-radius: 3px;
  transform: none !important;
  right: 0;
  bottom: 0;
  left: initial;
  cursor: pointer;
  user-select: none;
}
.job-button {
  padding: 1px;
}
</style>