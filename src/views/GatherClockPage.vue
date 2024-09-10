<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import {
  NCard, NDivider, NProgress, NTabs, NTabPane
} from 'naive-ui'
import {
  AccessAlarmsOutlined
} from '@vicons/material'
import RouterCard from '@/components/subs/RouterCard.vue'
import ItemButton from '@/components/custom-controls/ItemButton.vue'
import { useNbbCal } from '@/tools/use-nbb-cal'
import type { ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config'
import { useStore } from '@/store'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const store = useStore()
const { getLimitedGatherings } = useNbbCal()
const gatherData = computed(() => {
  const limitedGatherings = getLimitedGatherings()
  const allItems : Record<number, ItemInfo> = {}
  for (const patch in limitedGatherings) {
    limitedGatherings[patch].forEach(itemInfo => {
      allItems[itemInfo.id] = itemInfo
    })
  }

  const data : {
    title: string,
    key: string,
    items: ItemInfo[]
  }[] = []

  // 收藏的物品
  const favorites : ItemInfo[] = []
  workState.value.favoriteItems.forEach(itemID => {
    if (allItems[itemID]) {
      favorites.push(allItems[itemID])
    } else {
      console.warn(`物品 ${itemID} 在采集时钟数据集中不存在`)
    }
  })
  data.push({
    title: t('收藏'),
    key: 'favorites',
    items: favorites
  })

  for (const patch in limitedGatherings) {
    data.push({
      title: t('版本{}', patch),
      key: patch,
      items: limitedGatherings[patch]
    })
  }

  return data
})

const workState = ref({
  patch: '7.0',
  favoriteItems: [] as number[],
})

const disable_workstate_cache = userConfig.value.disable_workstate_cache ?? false
if (!disable_workstate_cache) {
  const cachedWorkState = userConfig.value.gatherclock_cache_work_state
  if (cachedWorkState && JSON.stringify(cachedWorkState).length > 2) {
    workState.value = cachedWorkState
  }

  // todo - 留意性能：深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大
  watch(workState, async () => {
    if (workState.value && userConfig) {
      try {
        await Promise.resolve()
        userConfig.value.gatherclock_cache_work_state = workState.value
        store.commit('setUserConfig', userConfig.value)
      } catch (error) {
        console.error('Error handling workState change:', error)
      }
    } else {
      console.warn('workState or userConfig is not defined')
    }
  }, {deep: true})
}

const dealTimeLimit = (start: string, end: string) => {
  return {
    percentage: 45,
    text: '正在进行中'
  }
}
</script>

<template>
  <div id="main-container">
    <RouterCard
      id="router-card"
      :page-name="t('采集时钟')"
      :page-icon="AccessAlarmsOutlined"
    />
    <n-card embedded>
      <n-tabs v-model:value="workState.patch" type="line" animated>
        <n-tab-pane
          v-for="patch in gatherData"
          :key="patch.key"
          :name="patch.key"
          :tab="patch.title"
        >
          <div class="items-container">
            <div
              v-for="item in patch.items"
              :key="item.id"
              class="item-card"
            >
              <div class="title">
                <ItemButton
                  :item-info="item"
                  show-icon show-name
                  btn-width="100%"
                />
              </div>
              <n-divider class="no-margin" />
              <div class="content">
                <div class="progresses">
                  <div
                    v-for="(timelimit, tlIndex) in item.gatherInfo.timeLimitInfo"
                    :key="item.id + '-' + tlIndex"
                  >
                    <div>{{ timelimit.start }} ~ {{ timelimit.end }}</div>
                    <n-progress
                      type="line"
                      status="info"
                      processing
                      :show-indicator="false"
                      :percentage="dealTimeLimit(timelimit.start, timelimit.end).percentage"
                    >
                      {{ dealTimeLimit(timelimit.start, timelimit.end).text }}
                    </n-progress>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<style scoped>
/* All */
#main-container {
  max-width: 100%;
  gap: 0.6rem;
  display: flex;
  flex-direction: column;
}
.items-container {
  gap: 0.3rem;

  .item-card {
    border-radius: 5px;
    border: 1px solid var(--n-bar-color);
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
}

/* Desktop */
@media screen and (min-width: 768px) {
  .items-container {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .items-container {
    display: flex;
    flex-direction: column;
    
    .item-card {
      width: 100%;
    }
  }
}
</style>