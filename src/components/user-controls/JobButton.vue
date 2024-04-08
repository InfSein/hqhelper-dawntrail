<script lang="ts" setup>
import { ref } from 'vue';
import XivFARImage from './XivFARImage.vue'

interface JobButtonProps {
  /** 职能 */
  role: string;
  /** 职业 */
  job: string;
  /** 职业图标 */
  jobIcon: string;
  /** 图片API地址 */
  apiBase: string;
  /** 备用API地址 */
  apiBaseSpare: string;
}

const props = defineProps<JobButtonProps>()

const size = ref(32)
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
    :style="{ width: `${size+5}px`, height: `${size+5}px` }"
  >
    <template #icon>
      <XivFARImage
        :src="jobIcon"
        :size="size"
        :apiBase="apiBase"
        :apiBaseSpare="apiBaseSpare"
      />
    </template>
  </n-button>
</template>

<style scoped>
</style>