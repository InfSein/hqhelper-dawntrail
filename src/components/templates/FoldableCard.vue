<script setup lang="ts">
import { ref, type Ref, shallowRef, inject } from 'vue'
import {
  NButton, NCard, NIcon
} from 'naive-ui'
import {
  KeyboardArrowUpRound, KeyboardArrowDownRound
} from '@vicons/material'
import { useStore } from '@/store/index'
import { type UserConfigModel } from '@/models/user-config'

const store = useStore()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const props = defineProps({
  cardKey: {
    type: String,
    required: true
  },
  cardSize: {
    type: String as () => "medium" | "small" | "large" | "huge" | undefined,
    default: 'medium'
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})
const emit = defineEmits([
  'onCardFoldStatusChanged'
])

const ui_fold_cache = userConfig.value.cache_ui_fold ?? {}
const foldOnDefault : boolean = !userConfig.value.disable_workstate_cache && (ui_fold_cache[props.cardKey] ?? false)

const folded = ref(foldOnDefault)
const folderText = ref('')
const folderIcon = shallowRef(KeyboardArrowUpRound)
const cardContentStyle = ref('')

const updateUi = () => {
  if (folded.value) {
    folderText.value = t('展开')
    folderIcon.value = KeyboardArrowDownRound
    cardContentStyle.value = 'padding: 0;'
  } else {
    folderText.value = t('折叠')
    folderIcon.value = KeyboardArrowUpRound
    cardContentStyle.value = ''
  }
}
updateUi()

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
  <n-card :id="'card-'+cardKey" :size="cardSize" :title="title" :content-style="cardContentStyle" embedded :bordered="false">
    <template #header>
      <slot name="header" />
      <span v-if="description" class="description">{{ description }}</span>
    </template>
    <template #header-extra>
      <n-button text style="font-size: calc(var(--n-title-font-size) - 2px);" @click="handleFoldOrExpand">
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