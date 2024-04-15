<!-- 
  FAR: Fixed Aspect Ratio
-->

<script setup lang="ts">

interface XivFARImageProps {
  /** 图片地址 */
  src: string;
  /** 图片大小(宽/高一致) */
  size: number;
  /** 图片API地址 */
  apiBase: string;
  /** 备用API地址 */
  apiBaseSpare: string;
}
const props = defineProps<XivFARImageProps>();

const getUrl = () => {
  return props.src.replace('~ApiBase', props.apiBase)
}
const onImageLoadError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.src.includes(props.apiBaseSpare)) {
    return
  }
  img.src = img.src.replace(props.apiBase, props.apiBaseSpare)
}
</script>

<template>
  <img
    alt="-"
    :src="getUrl()"
    :width="size"
    :height="size"
    @error="onImageLoadError"
  />
</template>

<style scoped>
</style>