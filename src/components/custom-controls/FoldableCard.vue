<script setup lang="ts">
import { ref, type Ref, shallowRef, inject } from 'vue'
import { useStore } from '@/store/index'
import { type UserConfigModel, defaultUserConfig } from '@/models/user-config'
import { KeyboardArrowUpRound, KeyboardArrowDownRound } from '@vicons/material'

const store = useStore()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig') ?? ref(defaultUserConfig)

const props = defineProps({
  cardKey: {
    type: String,
    required: true
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
  'onCardFoldedChange'
])

const ui_fold_cache = userConfig.value.cache_ui_fold ?? {}
const foldOnDefault : boolean = ui_fold_cache[props.cardKey] ?? false

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
  emit('onCardFoldedChange', folded.value)
}

</script>

<template>
  <n-card :id="'card-'+cardKey" :title="title" :content-style="cardContentStyle" embedded :bordered="false">
    <template #header>
      <slot name="header" />
      <span class="description">{{ description }}</span>
    </template>
    <template #header-extra>
      <n-button text style="font-size: 16px;" @click="handleFoldOrExpand">
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