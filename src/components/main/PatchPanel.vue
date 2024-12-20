<script setup lang="ts">
import { ref, inject, type Ref, computed } from 'vue'
import {
  NButton, NFlex, NPopover
} from 'naive-ui'
import FoldableCard from '../templates/FoldableCard.vue'
import { type UserConfigModel } from '@/models/config-user'
import { XivPatches, type XivPatch } from "@/assets/data"
import { fixGearSelections, isGearEmpty, type GearSelections } from '@/models/gears'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const patchSelected = defineModel<string>('patchSelected', { required: true })
const gearsSelected = defineModel<GearSelections>('gearsSelected', { required: true })

const cardDescription = computed(() => {
  if (!patchSelected.value) return t('还未选择')
  else return t('已选择版本: {}', patchSelected.value)
})

const containerCard = ref<InstanceType<typeof FoldableCard>>()

const handlePatchSelect = (patch: XivPatch) => {
  if (
    patchSelected.value && patch.v !== patchSelected.value
    && !isGearEmpty(gearsSelected.value)
  ) {
    if (window.confirm(
      t('切换版本会清空你已选择的装备部件。')
      + '\n' + t('要继续吗?')
    )) {
      gearsSelected.value = fixGearSelections()
    } else {
      return
    }
  }
  patchSelected.value = patch.v
  const autoFold = !(userConfig.value?.disable_patchcard_autofold ?? false)
  if (isMobile.value && autoFold) {
    containerCard.value?.handleFoldOrExpand()
  }
}

const getPatchName = (patch: XivPatch) => {
  const uiLanguage = userConfig.value?.language_ui ?? 'zh'

  let patchName = patch.name_zh
  if (uiLanguage === 'en') {
    patchName = patch.name_en
  } else if (uiLanguage === 'ja') {
    patchName = patch.name_ja
  }

  return t('版本{v}: {name}', { v: patch.v, name: patchName })
}

const getPatchBackground = (patch: XivPatch) => {
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
      <n-popover
        v-for="(patch, index) in XivPatches"
        :key="index"
        placement="bottom"
        :trigger="isMobile ? 'manual' : 'hover'"
      >
        <template #trigger>
          <n-button
            class="patch-button"
            :class="patch.v === patchSelected ? 'selected' : ''"
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
        </template>
        <div class="popover-container">
          <p>{{ t('此版本实装新的HQ制作装：') }}</p>
          <p class="sub" v-if="patch.life_hq_il">{{ t('生活职业{il}HQ', patch.life_hq_il) }}</p>
          <p class="sub" v-if="patch.combat_hq_il">{{ t('战斗职业{il}HQ', patch.combat_hq_il) }}</p>
        </div>
      </n-popover>
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
    .patch-button-text {
      color: white;
      text-shadow: 2px 2px 4px #000000;
    }
  }
}
.popover-container .sub {
  margin-left: 1em;
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