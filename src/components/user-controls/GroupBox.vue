<script setup>
const props = defineProps({
  borderColor: {
    type: String,
    default: 'black',
  }
})
</script>

<template>
  <div class="group-box" :style="{border: `1px dashed ${props.borderColor}`}">
    <div class="group-box-title">
      <slot name="title" />
    </div>
    <div class="group-box-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.group-box {
  padding: 10px;
  border-radius: var(--n-border-radius);

  .group-box-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin-top: -22px;
    margin-left: 1px;
    width: fit-content;
    text-align: center;
    color: var(--n-text-color);
    background-color: var(--n-color);
  }
}
</style>