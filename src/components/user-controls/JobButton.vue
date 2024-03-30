<script lang="ts" setup>
import { computed, ref } from 'vue';

interface JobButtonProps {
  /** 职能 */
  role: string;
  /** 职业 */
  job: string;
  /** 职业图标 */
  jobIcon: string;
}

const props = defineProps<JobButtonProps>()
const emits = defineEmits(['onIconLoadError'])

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

const onIconLoadError = () => {
  emits('onIconLoadError')
}
</script>

<template>
  <n-button
    ghost
    :type="getType()"
    :style="{ width: `${size+5}px`, height: `${size+5}px` }"
  >
    <template #icon>
      <img
        :src="jobIcon"
        :width="size"
        :height="size"
        @error="onIconLoadError"
      />
    </template>
  </n-button>
</template>

<style scoped>
</style>