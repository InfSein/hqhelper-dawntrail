<script setup lang="ts">
import { inject, ref, computed, type Ref } from 'vue'
import {
  NButton, NPopover,
  type PopoverTrigger
} from 'naive-ui'
import XivFARImage from '../general/XivFARImage.vue'
import type { XivCraftAction } from '@/assets/data'
import { type UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import { getImgCdnUrl } from '@/tools/item'
import UseConfig from '@/tools/use-config'

const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const {
  itemLanguage,
} = UseConfig(userConfig, funcConfig)

interface CraftActionButtonProps {
  craftAction: XivCraftAction,
  btnSize?: number,
  popPlacement?: import("vueuc/lib/binder/src/interface").Placement,
  popTrigger?: PopoverTrigger,
}
const props = defineProps<CraftActionButtonProps>()
const emits = defineEmits(['click'])

const btnSize = computed(() => props.btnSize ?? 42)
const imgSize = computed(() => btnSize.value - 6)
const imgUrl = computed(() => getImgCdnUrl(props.craftAction.icon))
const popPlacement = computed(() => props.popPlacement ?? 'top')
const popTrigger = computed(() => props.popTrigger ?? (isMobile.value ? 'manual' : 'hover'))

const btnClass = computed(() => {
  return [
    'n-square-button'
  ].join(' ')
})
const btnStyle = computed(() => {
  return [
    `--n-height: ${btnSize.value}px`,
  ].join('; ')
})

const getSubName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.craftAction.name_en
    case 'en':
      return props.craftAction.name_ja
    case 'zh':
    default:
      return props.craftAction.name_ja + ' / ' + props.craftAction.name_en
  }
}

const handleButtonClick = () => {
  emits('click')
}
</script>

<template>
  <n-popover :trigger="popTrigger" :placement="popPlacement">
    <template #trigger>
      <n-button :class="btnClass" :style="btnStyle" @click="handleButtonClick">
        <XivFARImage
          :src="imgUrl"
          :size="imgSize"
        />
      </n-button>
    </template>
    <div class="action-popover">
      <div class="base-info">
        <XivFARImage
          :src="imgUrl"
          :size="34"
        />
        <div class="item-names">
          <div class="main">
            <span>{{ craftAction[`name_${itemLanguage}`] }}</span>
          </div>
          <div class="sub">{{ getSubName() }}</div>
        </div>
      </div>
    </div>
  </n-popover>
</template>

<style scoped>
.action-popover {
  user-select: text;

  .base-info {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    margin-top: 2%;

    .item-names {
      .main span {
        line-height: 1;
        font-size: calc(var(--n-font-size) + 2px);
      }
      .sub,
      .main span.extra-name {
        line-height: 1;
        font-size: calc(var(--n-font-size) - 2px);
      }
    }
  }
}
</style>