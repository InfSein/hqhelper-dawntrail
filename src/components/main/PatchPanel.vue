<script setup lang="ts">
import { ref, inject, type Ref, computed } from 'vue'
import {
  NButton, NDivider, NFlex, NPopover
} from 'naive-ui'
// import {
//   InfoOutlined,
// } from '@vicons/material'
import FoldableCard from '../templates/FoldableCard.vue'
import { type UserConfigModel } from '@/models/config-user'
import { XivPatches, type XivPatch } from "@/assets/data"
import { fixGearSelections, isGearEmpty, type GearSelections } from '@/models/gears'
import HelpButton from '../custom/general/HelpButton.vue'

const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const patchSelected = defineModel<string>('patchSelected', { required: true })
const gearsSelected = defineModel<GearSelections>('gearsSelected', { required: true })

const cardDescription = computed(() => {
  if (!patchSelected.value) return t('main.shared.desc.not_selected')
  else return t('main.select_patch.desc.selected', patchSelected.value)
})

const containerCard = ref<InstanceType<typeof FoldableCard>>()

const handlePatchSelect = (patch: XivPatch) => {
  if (
    patchSelected.value && patch.v !== patchSelected.value
    && !isGearEmpty(gearsSelected.value)
  ) {
    if (window.confirm(
      t('main.message.switch_patch_will_clean_gears')
      + '\n' + t('common.message.ask_continue')
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

  return t('main.select_patch.patch_button.text', { v: patch.v, name: patchName })
}

const getPatchBackground = (patch: XivPatch) => {
  if (patch.v === patchSelected.value) {
    if (patch.background) {
      return patch.background
    }
  }
  return ''
}

const patchPatterns = computed(() => {
  return [
    t('main.select_patch.info.info_2', {
      patch: XivPatches[0].v, ilv: XivPatches[0].life_hq_il
    }),
    t('main.select_patch.info.info_3', {
      patch: XivPatches[0].v_sub, ilv: XivPatches[0].combat_hq_il
    })    ,
    t('main.select_patch.info.info_4', {
      patch: XivPatches[1].v, ilv: XivPatches[1].life_hq_il
    }),
    t('main.select_patch.info.info_3', {
      patch: XivPatches[2].v, ilv: XivPatches[2].combat_hq_il
    }),
    t('main.select_patch.info.info_5', {
      patch: XivPatches[3].v, ilv: XivPatches[3].life_hq_il
    }),
    t('main.select_patch.info.info_3', {
      patch: XivPatches[4].v, ilv: XivPatches[4].combat_hq_il
    }),
    t('main.select_patch.info.info_6', {
      patch: '7.5',
    }),
  ]
})
</script>

<template>
  <FoldableCard card-key="game-patches" ref="containerCard" class="game-patches-panel">
    <template #header>
      <div class="card-title">
        <i class="xiv square-1"></i>
        <span class="card-title-text">{{ t('main.select_patch.title') }}</span>
        <div style="margin-left: 1px;">
          <HelpButton icon="info" :size="22" :placement="isMobile ? 'bottom' : 'right-start'" pop-type="popover" style="margin-left: 0.5em;">
            <div class="pop-wrapper">
              <div>{{ t('main.select_patch.info.info_1') }}</div>
              <n-divider style="margin: 1px 5px 3px 5px" />
              <ul>
                <li v-for="(pattern, patternIndex) in patchPatterns" :key="patternIndex">{{ pattern }}</li>
              </ul>
            </div>
          </HelpButton>
        </div>
        <span class="card-title-extra">{{ cardDescription }}</span>
      </div>
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
          <p>{{ t('main.select_patch.patch_button.tooltip.tooltip_1') }}</p>
          <p class="sub" v-if="patch.life_hq_il">{{ t('main.select_patch.patch_button.tooltip.tooltip_2', patch.life_hq_il) }}</p>
          <p class="sub" v-if="patch.combat_hq_il">{{ t('main.select_patch.patch_button.tooltip.tooltip_3', patch.combat_hq_il) }}</p>
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
.pop-wrapper {
  padding: 0.5em;
  max-width: 520px;

  ul {
    padding-left: 1.5em;
  }
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