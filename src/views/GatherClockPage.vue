<script setup lang="ts">
import { computed, inject, ref, watch, type Ref } from 'vue'
import {
  NButton, NCard, NDivider, NDropdown, NForm, NFormItem, NIcon, NPopover, NProgress, NSelect, NSwitch, NTabs, NTabPane
} from 'naive-ui'
import {
  AccessAlarmsOutlined,
  StarBorderRound, StarRound,
} from '@vicons/material'
import RouterCard from '@/components/subs/RouterCard.vue'
import FoldableCard from '@/components/custom-controls/FoldableCard.vue'
import ItemButton from '@/components/custom-controls/ItemButton.vue'
import XivFARImage from '@/components/custom-controls/XivFARImage.vue'
import XivMap from '@/components/custom-controls/XivMap.vue'
import LocationSpan from '@/components/custom-controls/LocationSpan.vue'
import { XivMaps } from '@/assets/data'
import { useStore } from '@/store'
import { jobMap, type JobInfo } from '@/data'
import { useNbbCal } from '@/tools/use-nbb-cal'
import { getNearestAetheryte } from '@/tools/map'
import type { ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config'
import EorzeaTime from '@/tools/eorzea-time'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const currentET = inject<Ref<EorzeaTime>>('currentET')!
const appMode = inject<Ref<"overlay" | "" | undefined>>('appMode') ?? ref('')

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
  const stars : ItemInfo[] = []
  workState.value.starItems.forEach(itemID => {
    if (allItems[itemID]) {
      stars.push(allItems[itemID])
    } else {
      console.warn(`物品 ${itemID} 在采集时钟数据集中不存在`)
    }
  })
  data.push({
    title: t('已收藏'),
    key: 'stars',
    items: stars
  })

  for (const key in limitedGatherings) {
    const [patch, il] = key.split('-')
    data.push({
      title: t('版本{patch} ({il}品级)', {
        patch: patch,
        il: il
      }),
      key: key,
      items: limitedGatherings[key]
    })
  }

  return data
})
const uiLanguage = computed(() => {
  return userConfig.value.language_ui
})
const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})
const useMobileUi = computed(() => {
  return isMobile.value || appMode.value === 'overlay'
})
const canPinWindow = computed(() => {
  return appMode.value === 'overlay' && !!window.electronAPI?.toggleAlwaysOnTop
})

const workState = ref({
  patch: '7.0-710',
  /** 是否将整个窗口置顶 (限v5及以上的客户端使用) */
  pinWindow: false,
  /** 排序依据 */
  orderBy: 'itemId' as "itemId" | "gatherStartTimeAsc",
  /** 是否将目前可以采集的道具置顶 */
  pinGatherableItems: false,
  /** 禁用物品按钮悬浮窗 */
  banItemPop: false,
  /** 是否直接在采集卡片内展示地图 */
  showMap: false,
  starItems: [] as number[],
})
const itemSortOptions = computed(() => {
  return [
    {
      label: t('物品编号'),
      value: 'itemId'
    },
    {
      label: t('采集开始时间'),
      value: 'gatherStartTimeAsc'
    },
  ]
})

watch(
  () => workState.value.pinWindow,
  (newVal, oldVal) => {
    console.log('watch pinWindow: oldVal:' + oldVal + ', newVal:' + newVal)
    if (oldVal !== undefined && newVal !== undefined && window.electronAPI?.toggleAlwaysOnTop) { // 兼容旧版本数据
      window.electronAPI!.toggleAlwaysOnTop()
    }
  }
)

const disable_workstate_cache = userConfig.value.disable_workstate_cache ?? false
if (!disable_workstate_cache) {
  const cachedWorkState = userConfig.value.gatherclock_cache_work_state
  if (cachedWorkState && JSON.stringify(cachedWorkState).length > 2) {
    workState.value = cachedWorkState
    // 在这里处理后续添加的成员默认值
    workState.value.orderBy ??= 'itemId'
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
  let progressStatus : 'info' | 'warning' | 'error' = 'info'
  let progressPercentage = 0
  let canGather = false
  let remainLT : string | undefined = undefined
  let ltClass = 'font-small'
  try {
    const parseTime = (time: string) => time.split(':').reduce((acc, val, idx) => acc + parseInt(val) * [60, 1][idx], 0)
    const s = parseTime(start)
    const e = parseTime(end)
    const c = currentET.value.hour * 60 + currentET.value.minute
    if (c >= s && c < e) {
      canGather = true
      progressPercentage = (c - s) / (e - s) * 100
      const ls = Math.floor(EorzeaTime.EorzeaMinute2LocalSecond(e - c))
      if (ls < 30) {
        ltClass += ' red'
      } else if (ls < 60) {
        ltClass += ' color-warning'
      }
      remainLT = t('剩余:')
      if (ls >= 60) {
        remainLT += t('{minute}分', Math.floor(ls / 60))
      }
      remainLT += t('{second}秒', ls % 60)
    } else {
      progressPercentage = 0
    }
  } catch (err) {
    console.error(err)
    progressStatus = 'error'; progressPercentage = 100
  }
  return {
    canGather: canGather,
    status: progressStatus,
    percentage: progressPercentage,
    remainLT, ltClass
  }
}

const handleStarButtonClick = (itemInfo : ItemInfo) => {
  if (workState.value.starItems.includes(itemInfo.id)) {
    workState.value.starItems = workState.value.starItems.filter(id => id !== itemInfo.id)
  } else {
    workState.value.starItems.push(itemInfo.id)
  }
}
const getBatchStarOptions = () => {
  return [
    ...gatherData.value.filter(item => item.key !== 'stars').map(data => {
      const itemsAllStared = data.items.every(item => workState.value.starItems.includes(item.id))
      return {
        label: itemsAllStared ? t('取消收藏“{}”', data.title) : t('收藏“{}”', data.title),
        key: data.key,
        click: () => {
          if (itemsAllStared) {
            workState.value.starItems = workState.value.starItems.filter(id => !data.items.map(item => item.id).includes(id))
          } else {
            data.items.forEach(item => {
              if (!workState.value.starItems.includes(item.id)) {
                workState.value.starItems.push(item.id)
              }
            })
          }
        }
      }
    }),
    {
      label: t('全部取消收藏'),
      key: 'removeAll',
      disabled: workState.value.starItems.length === 0,
      click: () => {
        workState.value.starItems = []
      }
    }
  ]
}
const handleBatchStarSelect = (key: string | number, option: any) => {
  if (option?.click) {
    option.click()
  } else {
    console.warn(`Unknown key: ${key}`)
  }
}

const getSortedItems = (items: ItemInfo[]) => {
  switch (workState.value.orderBy) {
    case 'gatherStartTimeAsc': // 根据最小的开始时间增序排序
      return items.sort((a, b) => {
        let startA = 99, startB = 99
        a.gatherInfo.timeLimitInfo.forEach(limit => {
          startA = Math.min(startA, Number(limit.start.split(':')[0]))
        })
        b.gatherInfo.timeLimitInfo.forEach(limit => {
          startB = Math.min(startB, Number(limit.start.split(':')[0]))
        })
        if (workState.value.pinGatherableItems) {
          if (isItemGatherable(a)) startA -= 999
          if (isItemGatherable(b)) startB -= 999
        }
        return startA - startB
      })
    default: // 默认为itemID增序排序
      return items.sort((a, b) => {
        if (workState.value.pinGatherableItems) {
          let _a = a.id, _b = b.id
          if (isItemGatherable(a)) _a -= 999
          if (isItemGatherable(b)) _b -= 999
          return _a - _b
        } else {
          return a.id - b.id
        }
      })
  }
  function isItemGatherable(item: ItemInfo) {
    let gatherable = false
    item.gatherInfo.timeLimitInfo.forEach(limit => {
      gatherable ||= dealTimeLimit(limit.start, limit.end).canGather
    })
    return gatherable
  }
}

const getJobName = (jobInfo: JobInfo) => {
  switch (uiLanguage.value) {
    case 'ja':
      return jobInfo?.job_name_ja || t('未知')
    case 'en':
      return jobInfo?.job_name_en || t('未知')
    case 'zh':
    default:
      return jobInfo?.job_name_zh || t('未知')
  }
}
const getPlaceName = (itemInfo : ItemInfo) => {
  switch (itemLanguage.value) {
    case 'ja':
      return itemInfo.gatherInfo?.placeNameJA
    case 'en':
      return itemInfo.gatherInfo?.placeNameEN
    case 'zh':
    default:
      return itemInfo.gatherInfo?.placeNameZH
  }
}
</script>

<template>
  <div id="main-container">
    <RouterCard
      v-if="appMode !== 'overlay'"
      id="router-card"
      :page-name="t('采集时钟')"
      :page-icon="AccessAlarmsOutlined"
    />
    <FoldableCard card-key="gatherclock-filter">
      <template #header>
        <i class="xiv sync-invert"></i>	
        <span class="card-title-text">{{ t('配置时钟') }}</span>
      </template>

      <div class="query-form">
        <n-form
          :inline="!useMobileUi"
          :label-placement="useMobileUi ? 'left' : 'top'"
          :show-feedback="false"
          :style="{
            maxWidth: useMobileUi ? '100%' : 'fit-content'
          }"
        >
          <n-form-item :label="t('窗口置顶')" v-show="canPinWindow">
            <n-switch v-model:value="workState.pinWindow" />
          </n-form-item>
          <n-form-item :label="t('排序依据')" style="min-width: 200px;">
            <n-select v-model:value="workState.orderBy" :options="itemSortOptions" />
          </n-form-item>
          <n-form-item :label="t('将现可采集的物品置顶')">
            <n-switch v-model:value="workState.pinGatherableItems" />
          </n-form-item>
          <n-form-item :label="t('禁用物品按钮悬浮窗')">
            <n-switch v-model:value="workState.banItemPop" />
          </n-form-item>
          <n-form-item :label="t('展示采集地图')">
            <n-switch v-model:value="workState.showMap" />
          </n-form-item>
          <n-form-item :label="t('快速操作')">
            <n-dropdown
              placement="bottom-start"
              :options="getBatchStarOptions()"
              @select="handleBatchStarSelect"
            >
              <n-button>{{ t('点此展开菜单') }}</n-button>
            </n-dropdown>
          </n-form-item>
        </n-form>
      </div>
    </FoldableCard>
    <n-card embedded :bordered="false">
      <n-tabs v-model:value="workState.patch" type="card" animated>
        <n-tab-pane
          v-for="patch in gatherData"
          :key="patch.key"
          :name="patch.key"
          :tab="patch.title"
        >
          <template #tab>
            <div class="tab-title">
              <span v-if="patch.key === 'stars'">
                <i class="xiv e05d"></i>
              </span>
              <span v-else-if="patch.key.includes('~690')">
                <i class="xiv collectables"></i>
              </span>
              <span v-else>
                <i class="xiv timer"></i>
              </span>
              <span>{{ patch.title }}</span>
            </div>
          </template>
          <div class="items-container">
            <div
              v-for="item in getSortedItems(patch.items)"
              :key="item.id"
              class="item-card"
            >
              <div class="title">
                <ItemButton
                  :item-info="item"
                  show-icon show-name
                  btn-extra-style="flex-grow: 1;"
                  :disable-pop="workState.banItemPop"
                />
                <n-popover placement="top" :trigger="isMobile ? 'manual' : 'hover'" :keep-alive-on-hover="false">
                  <template #trigger>
                    <n-button class="btn-star" @click="handleStarButtonClick(item)">
                      <template #icon>
                        <n-icon v-if="workState.starItems.includes(item.id)" color="#F6CA45">
                          <StarRound />
                        </n-icon>
                        <n-icon v-else color="#F6CA45">
                          <StarBorderRound />
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                  <div>{{ t('点击此按钮来收藏/取消收藏这个采集品。') }}</div>
                  <div>{{ t('被收藏的采集品将在“已收藏”栏目单独展示。') }}</div>
                </n-popover>
              </div>
              <n-divider class="no-margin" />
              <div class="content">
                <div class="standard-info">
                  <div class="gather-job">
                    <XivFARImage
                      class="icon"
                      :src="jobMap[item.gatherInfo.jobId].job_icon_url"
                    />
                    <p>{{ getJobName(jobMap[item.gatherInfo.jobId]) }}</p>
                  </div>
                  <div class="recommended-aetheryte" v-if="XivMaps[item.gatherInfo.placeID]">
                    <span>{{ t('推荐') }}</span>
                    <span style="vertical-align: middle;">
                      <XivFARImage
                        :size="14"
                        src="./ui/aetheryte.png"
                      />
                    </span>
                    <span>
                      {{
                        getNearestAetheryte(
                          XivMaps[item.gatherInfo.placeID],
                          item.gatherInfo.posX, item.gatherInfo.posY,
                          itemLanguage
                        )
                      }}
                    </span>
                  </div>
                  <div class="gather-place">
                    <LocationSpan
                      :place-id="item.gatherInfo.placeID"
                      :place-name="getPlaceName(item)"
                      :coordinate-x="item.gatherInfo.posX"
                      :coordinate-y="item.gatherInfo.posY"
                      hide-coordinates
                    />
                    <div>{{ t('(X:{x}, Y:{y})', { x: item.gatherInfo.posX, y: item.gatherInfo.posY }) }}</div>
                  </div>
                </div>
                <XivMap
                  v-if="workState.showMap && XivMaps[item.gatherInfo.placeID]"
                  :map-data="XivMaps[item.gatherInfo.placeID]"
                  :map-size="isMobile ? 225 : 125"
                  :flag-x="item.gatherInfo.posX"
                  :flag-y="item.gatherInfo.posY"
                  style="justify-content: end;"
                />
                <div class="progresses">
                  <div
                    v-for="(timelimit, tlIndex) in item.gatherInfo.timeLimitInfo"
                    :key="item.id + '-' + tlIndex"
                  >
                    <div>
                      {{ timelimit.start }} ~ {{ timelimit.end }}
                      <span v-if="dealTimeLimit(timelimit.start, timelimit.end).canGather" class="green" style="margin-left: 5px;">
                        {{ t('现可采集') }}
                      </span>
                      <span v-if="dealTimeLimit(timelimit.start, timelimit.end).remainLT" :class="dealTimeLimit(timelimit.start, timelimit.end).ltClass" style="margin-left: 5px;">
                        {{ dealTimeLimit(timelimit.start, timelimit.end).remainLT }}
                      </span>
                    </div>
                    <n-progress
                      type="line"
                      processing
                      :show-indicator="false"
                      :status="dealTimeLimit(timelimit.start, timelimit.end).status"
                      :percentage="dealTimeLimit(timelimit.start, timelimit.end).percentage"
                    />
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
.query-form {
  width: fit-content;
  border-radius: 5px;
  margin-bottom: 1rem;
  box-shadow: 0 0 10px var(--n-border-color);

  .n-form-item {
    border-radius: 5px;
    padding: 0.5rem 0.6rem;
  }
}
.tab-title > *:not(:first-child) {
  margin-left: 3px;
}
.items-container {
  gap: 0.3rem;
  padding: 0.5rem;

  .item-card:hover {
    box-shadow: 0 0 10px var(--n-bar-color);
    border-color: var(--n-bar-color);
  }
  .item-card {
    border-radius: 5px;
    border: 1px solid var(--n-bar-color);
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    
    .title {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.2rem;

      .btn-star {
        padding: 0px 8px;
      }
    }
    .content {
      .standard-info {
        position: relative;
        line-height: 1.2;
        margin: 0 0.1rem 0.2rem 0.1rem;
        --font-size: var(--n-font-size);

        .gather-job {
          font-size: var(--font-size);
          text-align: left;
          width: 70%;
          line-height: var(--font-size);

          img {
            float: left;
            height: var(--font-size);
            display: block;
            user-select: none;
          }
          p {
            font-size: var(--font-size);
            padding-left: var(--textgap-left);
          }
        }
        .recommended-aetheryte {
          margin-top: 3px;
          max-width: 60%;
        }
        .gather-place {
          position: absolute;
          text-align: right;
          top: 0;
          right: 0;
        }
      }
      .progresses {
        margin: 0 0.1rem;
      }
    }
  }
}

/* Desktop */
@media screen and (min-width: 768px) {
  .query-form .n-form-item:hover {
    box-shadow: 0 0 10px var(--n-color-target);
  }
  .items-container {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));

    .item-card .title .btn-star {
      height: 100%;
    }
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .query-form {
    width: 100%;
  }
  .items-container {
    display: flex;
    flex-direction: column;
    
    .item-card {
      width: 100%;
    }
  }
}
</style>