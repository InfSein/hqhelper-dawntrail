<script setup lang="ts">
import { ref, computed, type Ref, shallowRef, inject } from 'vue'
import {
  NButton, NCard, NIcon
} from 'naive-ui'
import {
  KeyboardArrowUpRound, KeyboardArrowDownRound,
  KeyboardArrowLeftRound, KeyboardArrowRightRound
} from '@vicons/material'
import { useStore } from '@/store/index'
import { type UserConfigModel } from '@/models/config-user'

const store = useStore()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

interface FoldableCardProps {
  cardKey: string
  cardSize?: 'medium' | 'small' | 'large' | 'huge'
  showCardBorder?: boolean
  unfoldable?: boolean
  foldDirection?: 'horizontal' | 'vertical'
  title?: string
  description?: string
}
const props = defineProps<FoldableCardProps>()
const emit = defineEmits([
  'onCardFoldStatusChanged'
])

const ui_fold_cache = userConfig.value.cache_ui_fold ?? {}
const foldOnDefault : boolean = !userConfig.value.disable_workstate_cache && (ui_fold_cache[props.cardKey] ?? false)

const folded = ref(foldOnDefault)
const folderText = ref('')
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

const updateUi = () => {
  if (folded.value) {
    folderText.value = t('展开')
    folderIcon.value = expandIcon.value
    cardContentStyle.value = 'padding: 0;'
  } else {
    folderText.value = t('折叠')
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
  store.commit('setUserConfig', userConfig.value)
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
      <n-button v-if="!unfoldable" text style="font-size: calc(var(--n-title-font-size) - 2px);" @click="handleFoldOrExpand">
        <span>{{ folderText }}</span>
        <n-icon size="16">
          <component :is="folderIcon" />
        </n-icon>
      </n-button>
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
.collapse-button {
  font-size: 16px;
}
</style>