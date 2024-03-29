<script lang="ts" setup>
import { computed, ref } from 'vue';

interface JobButtonProps {
  /** 职能 */
  role: "tank" | "healer" | "dps" | "other";
  /** 职业 */
  job: string;
  /** 职业图标 */
  jobIcon: string;
}

const props = defineProps<JobButtonProps>()

const size = ref(32)
const type = computed(() => {
  switch (props.role) {
    case "tank":
      return "info"
    case "healer":
      return "success"
    case "dps":
      return "error"
  }
  return "default"
})
</script>

<template>
  <n-button
    ghost
    :type="type"
    :style="{ width: `${size+5}px`, height: `${size+5}px` }"
  >
    <template #icon>
      <img
        :src="jobIcon"
        :width="size"
        :height="size"
      />
    </template>
  </n-button>
</template>

<style scoped>
</style>