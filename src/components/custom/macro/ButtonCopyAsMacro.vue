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
import type { MacroGenerateMode } from '@/models/config-func'

const NAIVE_UI_MESSAGE = useMessage()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const copyAsMacro = inject<(macroMap: Record<MacroGenerateMode, string>, container?: HTMLElement | undefined) => Promise<{
  result: "success" | "info" | "error";
  msg: string;
} | undefined>>('copyAsMacro')!

interface ButtonCopyAsMacroProps {
  items: ItemInfo[],
  containerId?: string,
  container?: HTMLElement
}
const props = defineProps<ButtonCopyAsMacroProps>()

const copyBtnLoading = ref(false)

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

const macroMap = computed(() : Record<MacroGenerateMode, string> => {
  const result: Record<MacroGenerateMode, string> = {
    singleLine: '',
    multiLine: ''
  }
  const totalItems = props.items.filter(item => item.amount).length
  const maxLines = 15
  const itemsPerLine = Math.ceil(totalItems / maxLines)

  let currentLine: string[] = []
  let itemCount = 0

  props.items.forEach(item => {
    if (item.amount) {
      let itemName = getItemName(item)
      if (itemLanguage.value === 'en') {
        itemName = `"${itemName}"`
      }
      result.singleLine += `${itemName}x${item.amount}; `

      currentLine.push(`${itemName} x${item.amount}`)
      itemCount++

      if (itemCount >= itemsPerLine) {
        result.multiLine += '・' + currentLine.join(', ') + '\n'
        currentLine = []
        itemCount = 0
      }
    }
  })
  if (currentLine.length) {
    result.multiLine += '・' + currentLine.join(', ') + '\n'
  }

  result.multiLine = result.multiLine.trim()
  return result
})
const handleCopyAsMacro = async () => {
  copyBtnLoading.value = true
  let container = props.container
  if (props.containerId) {
    container = document.getElementById(props.containerId) ?? undefined
  }
  const response = await copyAsMacro(macroMap.value, container)
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