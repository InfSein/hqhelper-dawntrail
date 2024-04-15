<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
const modelValue = defineModel('value')
defineProps({
  label: { type: String, required: true },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 99999 },
})
</script>

<template>
  <div class="stepper">
    <span>{{ label }}</span>
    <div class="stepper-input">
      <n-input-number
        v-model:value="modelValue"
        size="small"
        button-placement="both"
        :min="min"
        :max="max"
      />
    </div>
  </div>
</template>

<style scoped>
.stepper :deep(input.n-input__input-el) {
  text-align: center;
}

.stepper {
  display: flex;
  align-items: center;
  font-size: 15px;

  .stepper-input {
    margin-left: 5px;
    max-width: 110px;
  }
}
</style>