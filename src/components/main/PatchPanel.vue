<script setup lang="ts">
import { ref, inject, type Ref, computed } from 'vue'
import {
  NButton, NFlex
} from 'naive-ui'
import { type UserConfigModel } from '@/models/user-config'
import XivPatches from "@/assets/data/xiv-patches.json"
import FoldableCard from '../custom-controls/FoldableCard.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const patchSelected = defineModel<string>('patchSelected', { required: true })
const cardDescription = computed(() => {
  if (!patchSelected.value) return t('还未选择')
  else return t('已选择版本: {}', patchSelected.value)
})

const containerCard = ref<InstanceType<typeof FoldableCard>>()

const handlePatchSelect = (patch: any) => {
  patchSelected.value = patch.v
  const autoFold = !(userConfig.value?.disable_patchcard_autofold ?? false)
  if (isMobile.value && autoFold) {
    containerCard.value?.handleFoldOrExpand()
  }
}

const getPatchName = (patch: any) => {
  const uiLanguage = userConfig.value?.language_ui ?? 'zh'

  let patchName = patch.name_zh
  if (uiLanguage === 'en') {
    patchName = patch.name_en
  } else if (uiLanguage === 'ja') {
    patchName = patch.name_ja
  }

  return t('版本{v}: {name}', { v: patch.v, name: patchName })
}

const getPatchBackground = (patch: any) => {
  if (patch.v === patchSelected.value) {
    if (patch.background) {
      return patch.background
    }
  }
  return ''
}
</script>

<template>
  <FoldableCard card-key="game-patches" ref="containerCard" :description="cardDescription" class="game-patches-panel">
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
        @click="handlePatchSelect(patch)"
        :style="`background-image: url(${getPatchBackground(patch)});`"
      >
        <div
          class="patch-button-content"
          :style="`background-image: url(${patch.logo});`"
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
:deep(.n-button__content) {
  width: 100%;
  height: 100%;
}
.game-patches-panel {
  width: 100%;

  .patch-button {
    padding: 5px 10px;
    width: 19%;
    height: 120px;
      background-position-x: center;
      background-position-y: center;
      background-repeat: no-repeat;
      background-size: auto 100%;

    .patch-button-content {
      display: flex;
      justify-content: center;
      align-items: end;
      width: 100%;
      height: 100%;
      background-position-x: center;
      background-position-y: center;
      background-repeat: no-repeat;
      background-size: auto 100%;
    }
  }
  .patch-button.selected {
    border: var(--n-border-pressed);
    color: var(--n-text-color-hover);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .game-patches-panel {
    .patch-button {
      width: 100%;
    }
  }
}
</style>