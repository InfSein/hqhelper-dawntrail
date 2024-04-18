<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import {
  AddSharp, MinusSharp
} from '@vicons/material'

const modelValue = defineModel<number>('value')
const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 99999 },
  containerStyle: { type: String, default: '' },
  inputStyle: { type: String, default: '' }
})

const handleMinusClick = () => {
  if (modelValue!.value! > props.min) {
    modelValue!.value! -= 1
  }
}
const handlePlusClick = () => {
  if (modelValue!.value! < props.max) {
    modelValue!.value! += 1
  }
}
</script>

<template>
  <div class="stepper" :style="containerStyle">
    <n-button size="small" class="stepper-button" :disabled="modelValue === min" @click="handleMinusClick">
      <template #icon>
        <n-icon><minus-sharp /></n-icon>
      </template>
    </n-button>
    <div class="stepper-input" :style="inputStyle">
      <n-input-number
        v-model:value="modelValue"
        size="small"
        :min="min"
        :max="max"
        :show-button="false"
      />
    </div>
    <n-button size="small" class="stepper-button" :disabled="modelValue === max" @click="handlePlusClick">
      <template #icon>
        <n-icon><add-sharp /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<style scoped>
.stepper :deep(input.n-input__input-el) {
  text-align: center;
}

.stepper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;

  .stepper-button {
    width: var(--n-height);
  }
  .stepper-input {
    margin: 0 2px;
    max-width: 105px;
  }
}
</style>