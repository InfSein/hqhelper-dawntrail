<script setup lang="ts">
import { computed, inject, onMounted, ref, watch, type Ref } from 'vue'
import {
  NBackTop, NButton, NForm, NFormItem, NIcon, NInput, NInputGroup, NInputGroupLabel, NSelect, NSwitch,
  useMessage
} from 'naive-ui'
import {
  SearchOutlined
} from '@vicons/material'
import FoldableCard from '@/components/templates/FoldableCard.vue'
import { useStore } from '@/store'
import { fixWorkState, type WorkState } from '@/models/macromanage'
import type { UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const workState = ref(fixWorkState())

const cachedWorkState = userConfig.value.macromanage_cache_work_state
if (cachedWorkState && JSON.stringify(cachedWorkState).length > 2) {
  workState.value = fixWorkState(cachedWorkState)
  // Compatible with older version caching
}

// todo - 留意性能：深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大
watch(workState, async () => {
  if (workState.value && userConfig) {
    try {
      await Promise.resolve()
      userConfig.value.macromanage_cache_work_state = workState.value
      store.commit('setUserConfig', userConfig.value)
    } catch (error) {
      console.error('Error handling workState change:', error)
    }
  } else {
    console.warn('workState or userConfig is not defined')
  }
}, {deep: true})

onMounted(async () => {
})

</script>

<template>
  <div id="main-container">
    <FoldableCard card-key="macromanage-queryoptions">
      <template #header>
        <i class="xiv square-1"></i>
        <span class="card-title-text">{{ t('筛选/管理') }}</span>
      </template>
      <div class="query-form">
        <n-input-group>
          <n-input-group-label>{{ t('筛选') }}</n-input-group-label>
          <n-input
            v-model:value="workState.searchKeyword"
            :placeholder="t('支持按宏名称/备注/标签以及关联物品的名称/ID/品级/版本进行检索')"
            style="max-width: 600px;"
          >
            <template #suffix>
              <n-icon :component="SearchOutlined" />
            </template>
          </n-input>
        </n-input-group>
      </div>
    </FoldableCard>
    <FoldableCard card-key="macromanage-table">
      <template #header>
        <i class="xiv square-2"></i>
        <span class="card-title-text">{{ t('数据') }}</span>
      </template>
      <div class="content-block">
        test222
      </div>
    </FoldableCard>
    
    <n-back-top />
  </div>
</template>

<style scoped>
#main-container {
  max-width: 100%;
  gap: 0.6rem;
  display: flex;
  flex-direction: column;
}
.query-form {
  padding: 0 1.5em;
}

/* Desktop */
@media screen and (min-width: 768px) {
}

/* Mobile */
@media screen and (max-width: 767px) {
}
</style>