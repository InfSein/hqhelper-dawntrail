<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NIcon,
  useMessage
} from 'naive-ui'
import {
  CodeSharp
} from '@vicons/material'
import type { ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/config-user'

const NAIVE_UI_MESSAGE = useMessage()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const copyAsMacro = inject<(macroContent: string, container?: HTMLElement | undefined) => Promise<{
  result: "success" | "info" | "error";
  msg: string;
} | undefined>>('copyAsMacro')!

const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})
const getItemName = (itemInfo: ItemInfo) => {
  switch (itemLanguage.value) {
    case 'zh':
      return itemInfo.name_zh || '未翻译的物品'
    default:
      return itemInfo[`name_${itemLanguage.value}`]
  }
}

interface ButtonCopyAsMacroProps {
  items: ItemInfo[],
  containerId?: string,
  container?: HTMLElement
}
const props = defineProps<ButtonCopyAsMacroProps>()

const copyBtnLoading = ref(false)

const macroValue = computed(() => {
  const result : string[] = []
  props.items.forEach(item => {
    if (item.amount) {
      let itemName = getItemName(item)
      if (itemLanguage.value === 'en') {
        itemName = `"${itemName}"`
      }
      result.push(`${itemName}x${item.amount}`)
    }
  })
  return result.join('; ')
})
const handleCopyAsMacro = async () => {
  copyBtnLoading.value = true
  let container = props.container
  if (props.containerId) {
    container = document.getElementById(props.containerId) ?? undefined
  }
  const response = await copyAsMacro(macroValue.value, container)
  if (response) {
    NAIVE_UI_MESSAGE[response.result](response.msg)
  }
  copyBtnLoading.value = false
}
</script>

<template>
  <n-button size="tiny" :loading="copyBtnLoading" :disabled="copyBtnLoading" @click="handleCopyAsMacro">
    <template #icon>
      <n-icon><CodeSharp /></n-icon>
    </template>
    {{ t('复制宏') }}
  </n-button>
</template>

<style scoped>
</style>