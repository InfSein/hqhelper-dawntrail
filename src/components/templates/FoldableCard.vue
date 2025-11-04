<script setup lang="ts">
import { type Component } from 'vue'
import {
  KeyboardArrowUpRound, KeyboardArrowDownRound,
  KeyboardArrowLeftRound, KeyboardArrowRightRound
} from '@vicons/material'
import { useStore } from '@/store/index'
import { type UserConfigModel } from '@/models/config-user'

const store = useStore()

const t = inject<(message: string, args?: any) => string>('t')!
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

interface FoldableCardProps {
  cardKey: string
  cardSize?: 'medium' | 'small' | 'large' | 'huge'
  showCardBorder?: boolean
  unfoldable?: boolean
  foldDirection?: 'horizontal' | 'vertical'
  title?: string
  description?: string
  /** 控制 `extra-header` 区域的按钮。 */
  extraHeaderButtons?: {
    text: string
    icon: Component
    onClick: (...args: any[]) => void
  }[]
}
const props = defineProps<FoldableCardProps>()
const emit = defineEmits([
  'onCardFoldStatusChanged'
])

const ui_fold_cache = userConfig.value.cache_ui_fold ?? {}
const foldOnDefault : boolean = !userConfig.value.disable_workstate_cache && (ui_fold_cache[props.cardKey] ?? false)

const folded = ref(foldOnDefault)
const folderIcon = shallowRef(KeyboardArrowUpRound)
const cardContentStyle = ref('')

const cardSize = computed(() => {
  return props.cardSize ?? 'medium'
})
const foldDirection = computed(() => {
  return props.foldDirection ?? 'vertical'
})
const foldIcon = computed(() => {
  return foldDirection.value === 'vertical' ? KeyboardArrowUpRound : KeyboardArrowLeftRound
})
const expandIcon = computed(() => {
  return foldDirection.value === 'vertical' ? KeyboardArrowDownRound : KeyboardArrowRightRound
})
const folderText = computed(() => {
  return folded.value ? t('common.expand') : t('common.fold')
})

const updateUi = () => {
  if (folded.value) {
    folderIcon.value = expandIcon.value
    cardContentStyle.value = 'padding: 0;'
  } else {
    folderIcon.value = foldIcon.value
    cardContentStyle.value = ''
  }
}
updateUi()
emit('onCardFoldStatusChanged', folded.value)

const updateCache = () => {
  const _ui_fold_cache = userConfig.value.cache_ui_fold ?? {} // refresh to avoid mutation
  _ui_fold_cache[props.cardKey] = folded.value
  userConfig.value.cache_ui_fold = _ui_fold_cache
  store.setUserConfig(userConfig.value)
}

const handleFoldOrExpand = () => {
  folded.value = !folded.value
  updateUi()
  updateCache()
  emit('onCardFoldStatusChanged', folded.value)
}

defineExpose({
  handleFoldOrExpand
})
</script>

<template>
  <n-card :id="'card-'+cardKey" :size="cardSize" :title="title" :content-style="cardContentStyle" embedded :bordered="showCardBorder">
    <template #header>
      <slot name="header" />
      <span v-if="description" class="description">{{ description }}</span>
    </template>
    <template #header-extra>
      <div class="extra-header-container">
        <n-button
          v-for="(btn, btnIndex) in extraHeaderButtons"
          :key="btnIndex"
          quaternary size="small"
          class="square-action"
          @click="btn.onClick"
        >
          <n-icon :component="btn.icon" />
          <div class="unshow-text">{{ btn.text }}</div>
        </n-button>
        <n-button v-if="!unfoldable" text style="font-size: calc(var(--n-title-font-size) - 2px);" @click="handleFoldOrExpand">
          <span>{{ folderText }}</span>
          <n-icon size="16">
            <component :is="folderIcon" />
          </n-icon>
        </n-button>
      </div>
    </template>
    <div v-show="!folded" class="h-full">
      <slot />
    </div>
  </n-card>
</template>

<style scoped>
.description {
  margin-left: 10px;
  font-size: 14px;
}
.extra-header-container {
  display: flex;
  align-items: center;
}
</style>