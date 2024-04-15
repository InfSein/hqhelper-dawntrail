<script lang="ts" setup>
import XivFARImage from './XivFARImage.vue'

interface JobButtonProps {
  /** 职能 */
  role: string;
  /** 职业 */
  job: string;
  /** 职业图标 */
  jobIcon: string;
  /** UI尺寸预设 */
  imgSize: number;
  /** 图片API地址 */
  apiBase: string;
  /** 备用API地址 */
  apiBaseSpare: string;
}

const props = defineProps<JobButtonProps>()

const btnSize = props.imgSize + 5

const getType = () => {
  switch (props.role) {
    case "tank":
      return 'info'
    case "healer":
      return 'success'
    case "dps_melee":
    case "dps_ranged":
    case "dps_magic":
      return 'error'
  }
  return 'default'
}

</script>

<template>
  <n-button
    ghost
    :type="getType()"
    :style="{ width: `${btnSize}px`, height: `${btnSize}px` }"
  >
    <template #icon>
      <XivFARImage
        :src="jobIcon"
        :size="imgSize"
        :apiBase="apiBase"
        :apiBaseSpare="apiBaseSpare"
      />
    </template>
  </n-button>
</template>

<style scoped>
</style>