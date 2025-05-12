<script setup lang="ts">
import { computed, h, inject, onMounted, ref, watch, type Ref } from 'vue'
import {
  NBackTop, NButton, NDataTable, NForm, NFormItem, NIcon, NInput, NInputGroup, NInputGroupLabel, NSelect, NSwitch, NTag,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'
import {
  SearchOutlined
} from '@vicons/material'
import FoldableCard from '@/components/templates/FoldableCard.vue'
import ItemSpan from '@/components/custom/item/ItemSpan.vue'
import { XivCraftActions, type XivCraftAction } from '@/assets/data'
import { useStore } from '@/store'
import { fixWorkState, type WorkState, type RecordedCraftMacro } from '@/models/macromanage'
import type { UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import useMacroHelper from '@/tools/macro-helper'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const {
  calMacroCpCost,
} = useMacroHelper(userConfig, funcConfig)

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

interface CraftMacroRow {
  id: number,
  name: string,
  remark: string,
  /** 关联的物品 */
  relateItems: (ItemInfo|string)[],
  /** 用户自定义标签 */
  tags: string[],
  /** 此生产宏的属性要求 */
  requirements: {
    /** 作业精度 */
    craftsmanship?: number,
    /** 加工精度 */
    control?: number,
    /** 制作力 */
    cp: number,
  },
  craftActions: XivCraftAction[],
}
const tableData = computed(() => {
  return workState.value.recordedCraftMacros.map(macro => {
    const relateItems = macro.relateItems.map(item => {
      if (typeof item === 'number') {
        return getItemInfo(item)
      } else {
        return item
      }
    })
    const craftActions = macro.craftActions.map(actionid => XivCraftActions[actionid])
    const cpRequirement = calMacroCpCost(craftActions)

    return {
      id: macro.id,
      name: macro.name,
      remark: macro.remark,
      relateItems: relateItems,
      tags: macro.tags,
      requirements: {
        craftsmanship: macro.requirements?.craftsmanship,
        control: macro.requirements?.control,
        cp: macro.requirements?.cp ?? cpRequirement,
      },
      craftActions: craftActions,
    } as CraftMacroRow
  })
})
const tableColumns = computed(() => {
  const columns: DataTableColumns<CraftMacroRow> = [
    {
      title: t('宏名称'),
      key: 'name',
      className: '',
      render(row) {
        return row.name
      }
    },
    {
      title: t('备注'),
      key: 'remark',
      className: '',
      render(row) {
        return row.remark
      }
    },
    {
      title: t('标签'),
      key: 'tags',
      className: '',
      render(row) {
        return h(
          'div',
          { class: 'flex-wrap gap-2' },
          row.tags.map(tag => h(NTag, {
            size: 'small',
          }, tag))
        )
      }
    },
    {
      title: t('关联物品'),
      key: 'itemId',
      className: '',
      render(row) {
        return h(
          'div',
          { class: 'flex-col' },
          row.relateItems.slice(0, 3).map(item => {
            if (typeof item === 'string') {
              return h(NTag, {
                size: 'small',
              }, item)
            } else {
              return h(ItemSpan, {
                itemInfo: item
              }, [])
            }
          })
        )
      }
    },
  ]
  return columns
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
        <n-data-table
          :columns="tableColumns"
          :data="tableData"
          :pagination="false"
        />
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