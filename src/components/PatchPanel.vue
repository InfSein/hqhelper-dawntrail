<script setup lang="ts">
import { ref, inject, type Ref } from 'vue'
import { type UserConfigModel, defaultUserConfig } from '@/variables/UserConfig'
import XivPatches from "@/assets/data/xiv-patches.json"

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)

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
const buildButtonStyle = (patch: any) => {
  return [
    `background-image: url(${patch.logo});`
  ].join(' ')
}
</script>

<template>
  <n-card id="patches-panel" embedded :bordered="false">
    <n-flex justify="center">
      <n-button
        class="patch-button"
        v-for="(patch, index) in XivPatches"
        :key="index"
        :disabled="!patch.updated"
        :style="buildButtonStyle(patch)"
      >
        <div
          class="patch-button-content"
        :style="buildButtonStyle(patch)"
        >
          <h1
            class="patch-button-image"
          />
          <div class="patch-button-text">
            {{ getPatchName(patch) }}
          </div>
        </div>
      </n-button>
    </n-flex>
  </n-card>
</template>

<style scoped>
#patches-panel {
  width: 100%;
  
  .patch-button {
    width: 260px;
    height: 110px;
    padding: 5px;
    background-position-x: center;
    background-position-y: center;
    background-repeat: no-repeat;
    background-size: auto 100%;

    .patch-button-content {
      width: 250px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: end;
    }
  }
}
</style>