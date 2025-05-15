<script setup lang="ts">
import { computed, h, inject, onMounted, ref, watch, type Ref } from 'vue'
import {
  NBackTop, NButton, NDataTable, NIcon, NInput, NInputGroup, NTag,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'
import {
  SearchOutlined
} from '@vicons/material'
import FoldableCard from '@/components/templates/FoldableCard.vue'
import ItemSpan from '@/components/custom/item/ItemSpan.vue'
import ModalCraftMacroEdit from '@/components/modals/ModalCraftMacroEdit.vue'
import { XivUnpackedItems, XivCraftActions, type XivCraftAction } from '@/assets/data'
import { useStore } from '@/store'
import { fixWorkState, type WorkState, type RecordedCraftMacro, getDefaultCraftMacro } from '@/models/macromanage'
import type { UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import useMacroHelper from '@/tools/macro-helper'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const {
  calMacroCpCost,
} = useMacroHelper(userConfig, funcConfig)

const workState = ref<WorkState>(fixWorkState())
const showModalCraftMacroEdit = ref(false)
const macroEditTarget = ref(getDefaultCraftMacro(-1))
const macroEditAction = ref<"add" | "edit">('add')

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const archiveMacroRow = (row: CraftMacroRow, customCpRequirement?: number) : RecordedCraftMacro => {
  const { id, name, remark, relateItems, tags, requirements, craftActions } = row
  return {
    id,
    name,
    remark,
    relateItems: relateItems.map(item => {
      if (typeof item === 'string') {
        return item
      } else {
        return item.id
      }
    }),
    tags,
    requirements: {
      craftsmanship: requirements.craftsmanship,
      control: requirements.control,
      cp: customCpRequirement ?? calMacroCpCost(craftActions),
    },
    craftActions: craftActions.map(action => action.id),
  }
}
const unarchiveMacroRow = (macro: RecordedCraftMacro) : CraftMacroRow => {
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
  }
}
const tableData = computed(() => {
  return workState.value.recordedCraftMacros.map(macro => unarchiveMacroRow(macro))
})
const tableColumns = computed(() => {
  const columns: DataTableColumns<CraftMacroRow> = [
    {
      title: t('编号'),
      key: 'id',
      className: '',
      width: 60,
      minWidth: 60,
      resizable: true,
      align: 'center',
    },
    {
      title: t('宏名称'),
      key: 'name',
      className: '',
      resizable: true,
      width: 300,
      minWidth: 150,
      maxWidth: 500,
      render(row) {
        return h(
          'div',
          { class: 'macro-name-container' },
          [
            h('div', { class: 'macro-name' }, row.name),
            h(
              'div',
              { class: 'macro-tags-container' },
              [
                t('标签：'),
                row.tags.length ? row.tags.map(tag => h(NTag, {
                  size: 'small',
                }, () => tag)) : t('无'),
              ]
            ),
            h('div', { class: 'macro-remark' }, row.remark),
          ],
        )
      }
    },
    {
      title: t('关联物品'),
      key: 'itemId',
      className: '',
      resizable: true,
      width: 300,
      minWidth: 150,
      maxWidth: 500,
      render(row) {
        return h(
          'div',
          { class: 'flex-col' },
          row.relateItems.slice(0, 3).map(item => {
            if (typeof item === 'string') {
              return h(NTag, {
                size: 'small',
              }, () => item)
            } else {
              return h(ItemSpan, {
                itemInfo: item
              }, () => [])
            }
          })
        )
      }
    },
    {
      title: '管理',
      key: 'manage',
      render(row) {
        return h(
          'div',
          { class: 'flex-vac gap-4' },
          [
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: 'small',
                onClick: () => handleEditRow(row)
              },
              { default: () => t('编辑') }
            ),
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: 'small',
                onClick: () => handleDeleteRow(row)
              },
              { default: () => t('删除') }
            ),
          ]
        )
      }
    }
  ]
  return columns
})

const handleReportDataMissing = (macro: RecordedCraftMacro | number) => {
  NAIVE_UI_MESSAGE.error(t('数据丢失'))
  console.error(
    'edited macro not found! \nmacro:',
    macro,
    '\nrecordedCraftMacros:',
    workState.value.recordedCraftMacros
  )
}

const getMacroId = () => {
  let macroid = workState.value.recordIndex
  while (workState.value.recordedCraftMacros.find(macro => macro.id === macroid)) {
    macroid++
  }
  if (workState.value.recordIndex !== macroid) {
    workState.value.recordIndex = macroid
  }
  return macroid
}

const handleDebug = () => {
  const itemIds = Object.keys(XivUnpackedItems)
  const actionIds = Object.keys(XivCraftActions)

  const records : RecordedCraftMacro[] = []
  let id = 1
  while (id < 499) {
    const name = `测试宏 #${id}`

    // 关联物品
    const itemAmount = Math.floor(Math.random() * 5)
    const relateItems: (number|string)[] = []
    for (let i = 0; i < itemAmount; i++) {
      const itemIdIndex = Math.floor(Math.random() * itemIds.length)
      const itemId = itemIds[itemIdIndex]
      relateItems.push(Number(itemId))
    }

    // 技能
    const actionAmount = Math.floor(Math.random() * 30) + 1
    const craftActions: number[] = []
    for (let i = 0; i < actionAmount; i++) {
      const actionIdIndex = Math.floor(Math.random() * actionIds.length)
      const actionId = actionIds[actionIdIndex]
      craftActions.push(Number(actionId))
    }

    records.push({
      id: id++,
      name,
      remark: '',
      relateItems,
      tags: [],
      requirements: {},
      craftActions,
    })
  }

  workState.value.recordedCraftMacros = records
  alert('done!')
}

const handleAddRow = () => {
  const macroid = getMacroId()
  macroEditTarget.value = getDefaultCraftMacro(macroid)
  macroEditAction.value = 'add'
  showModalCraftMacroEdit.value = true
}
const handleEditRow = (row: CraftMacroRow) => {
  const index = workState.value.recordedCraftMacros.findIndex(macro => macro.id === row.id)
  if (index !== -1) {
    macroEditTarget.value = workState.value.recordedCraftMacros[index]
    macroEditAction.value = 'edit'
    showModalCraftMacroEdit.value = true
  } else {
    handleReportDataMissing(row.id)
  }
}
const handleDeleteRow = (row: CraftMacroRow) => {
  if (!window.confirm(t('确定要删除 {name} 吗?', row.name) + '\n' + t('此操作不可逆。'))){
    return
  }
  const index = workState.value.recordedCraftMacros.findIndex(macro => macro.id === row.id)
  if (index !== -1) {
    workState.value.recordedCraftMacros.splice(index, 1)
    NAIVE_UI_MESSAGE.success(t('已删除'))
  } else {
    handleReportDataMissing(row.id)
  }
}

const handleMacroEditSubmit = (macro: RecordedCraftMacro) => {
  const macroid = macro.id
  if (macroEditAction.value === 'edit') {
  const index = workState.value.recordedCraftMacros.findIndex(macro => macro.id === macroid)
    if (index !== -1) {
      workState.value.recordedCraftMacros[index] = macro
      NAIVE_UI_MESSAGE.success(t('已保存更改'))
    } else {
      handleReportDataMissing(macro)
    }
  } else if (macroEditAction.value === 'add') {
    workState.value.recordedCraftMacros.push(macro)
    NAIVE_UI_MESSAGE.success(t('{dataname} 已保存', macro.name))
  } else {
    console.warn('unexpected action')
  }
  showModalCraftMacroEdit.value = false
}
</script>

<template>
  <div id="main-container">
    <FoldableCard card-key="macromanage-queryoptions">
      <template #header>
        <i class="xiv square-1"></i>
        <span class="card-title-text">{{ t('筛选／设置') }}</span>
      </template>
      <div class="query-form">
        <div id="query-filter" class="form-item">
          <div class="form-title">{{ t('筛选') }}</div>
          <n-input-group>
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
        <div class="form-item">
          <div class="form-title">{{ t('调试') }}</div>
          <n-button @click="handleDebug">
            {{ t('点击此处') }}
          </n-button>
        </div>
        <div class="form-item">
          <div class="form-title">{{ t('添加') }}</div>
          <n-button @click="handleAddRow">
            {{ t('点击此处') }}
          </n-button>
        </div>
      </div>
    </FoldableCard>
    <FoldableCard card-key="macromanage-table">
      <template #header>
        <i class="xiv square-2"></i>
        <span class="card-title-text">{{ t('数据') }}</span>
      </template>
      <div class="content-block">
        <n-data-table
          bordered
          :columns="tableColumns"
          :data="tableData"
          :pagination="false"
          :max-height="500"
          :virtual-scroll="tableData.length > 200"
        />
      </div>
    </FoldableCard>
    
    <n-back-top />

    <ModalCraftMacroEdit
      v-model:show="showModalCraftMacroEdit"
      v-model:macro="macroEditTarget"
      :action="macroEditAction"
      @on-submit="handleMacroEditSubmit"
    />
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
  padding: 0 0.8em;
  gap: 4px;
  display: flex;

  .form-item {
    border-radius: 5px;
    padding: 0.5rem 0.6rem;
    border: 1px solid transparent;

    .form-title {
      padding: 0 0 6px 2px;
    }
  }
}

/* Desktop */
@media screen and (min-width: 768px) {
  .query-form {
    .form-item:hover {
      border: 1px solid var(--n-color-target);
    }
    #query-filter {
      width: 510px;
    }
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .query-form {
    flex-direction: column;
  }
}
</style>