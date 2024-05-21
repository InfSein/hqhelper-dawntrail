<script setup lang="ts">
import { ref, inject, type Ref, computed } from 'vue'
import { type UserConfigModel, defaultUserConfig } from '@/models/user-config'
import XivPatches from "@/assets/data/xiv-patches.json"
import FoldableCard from '../custom-controls/FoldableCard.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)

const patchSelected = defineModel<string>('patchSelected')
const cardDescription = computed(() => {
  if (!patchSelected.value) return t('还未选择')
  else return t('已选择版本: {}', patchSelected.value)
})

const handlePatchSelect = (patch: any) => {
  patchSelected.value = patch.v
}

const getPatchName = (patch: any) => {
  const uiLanguage = userConfig.value?.language_ui ?? 'zh'

  let patchName = patch.name_cn
  if (uiLanguage === 'en') {
    patchName = patch.name_en
  } else if (uiLanguage === 'ja') {
    patchName = patch.name_ja
  }

  return t('版本{v}: {name}', { v: patch.v, name: patchName })
}

const getButtonSize = () => {
  switch (userConfig.value?.ui_size_preset ?? '2k') {
    case '1080p':
      return { width: 260, height: 110 }
    case '4k':
      return { width: 340, height: 130 }
  }
  return { width: 300, height: 120 } // 2k
}

const buildButtonStyle = (patch: any) => {
  const size = getButtonSize()
  return [
    `width: ${size.width}px;`,
    `height: ${size.height}px;`,
    `background-image: url(${patch.logo});`
  ].join(' ')
}
const buildButtonContentStyle = () => {
  const size = getButtonSize()
  return [
    `width: ${size.width - 10}px;`,
    `height: ${size.height - 10}px;`
  ].join(' ')
}
</script>

<template>
  <FoldableCard card-key="game-patches" :description="cardDescription" class="game-patches-panel">
    <template #header>
      <i class="xiv square-1"></i>
      <span class="card-title-text">{{ t('选择版本') }}</span>
    </template>
    <n-flex justify="center">
      <n-button
        class="patch-button"
        :class="patch.v === patchSelected ? 'selected' : ''"
        v-for="(patch, index) in XivPatches"
        :key="index"
        :disabled="!patch.updated"
        :style="buildButtonStyle(patch)"
        @click="handlePatchSelect(patch)"
      >
        <div
          class="patch-button-content"
          :style="buildButtonContentStyle()"
        >
          <div class="patch-button-text">
            {{ getPatchName(patch) }}
          </div>
        </div>
      </n-button>
    </n-flex>
  </FoldableCard>
</template>

<style scoped>
.game-patches-panel {
  width: 100%;

  .patch-button {
    padding: 5px;
    background-position-x: center;
    background-position-y: center;
    background-repeat: no-repeat;
    background-size: auto 100%;

    .patch-button-content {
      display: flex;
      justify-content: center;
      align-items: end;
    }
  }
  .patch-button.selected {
    border: var(--n-border-pressed);
    color: var(--n-text-color-hover);
  }
}
</style>