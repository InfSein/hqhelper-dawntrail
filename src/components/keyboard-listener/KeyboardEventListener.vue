<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  event: {
    type: String,
    default: 'keydown'
  }
})
const emit = defineEmits(['keydown'])

const onKeyDown = ((event: KeyboardEvent) => {
  emit('keydown', event)
}) as EventListener

onMounted(() => {
  window.addEventListener(props.event, onKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener(props.event, onKeyDown);
});
</script>

<template>
  <div :name="'kel-'+event" />
</template>
