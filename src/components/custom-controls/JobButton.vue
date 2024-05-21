<script lang="ts" setup>
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
}

const props = defineProps<JobButtonProps>()

const btnSize = props.imgSize + 5

</script>

<template>
  <n-button
    :ghost="!props.selected"
    class="job-button"
    :color="props.btnColor"
    :style="{ width: `${btnSize}px`, height: `${btnSize}px` }"
  >
    <XivFARImage
      :src="jobIcon"
      :size="imgSize"
    />
  </n-button>
</template>

<style scoped>
.job-button {
  padding: 1px;
}
</style>