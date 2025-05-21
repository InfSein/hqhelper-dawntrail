<script setup lang="ts">
import { computed, h, inject, onBeforeUnmount, onMounted, ref, watch, type Ref, type VNode } from 'vue'
import {
  NBackTop, NButton, NDataTable, NDivider, NEmpty, NIcon, NInput, NInputGroup, NInputGroupLabel, NSelect, NTag,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'
import {
  SearchOutlined,
  SettingsSuggestFilled,
  AddTaskOutlined,
  EditNoteOutlined, DeleteFilled,
} from '@vicons/material'
import FoldableCard from '@/components/templates/FoldableCard.vue'
import ItemSpan from '@/components/custom/item/ItemSpan.vue'
import ModalCraftMacroEdit from '@/components/modals/ModalCraftMacroEdit.vue'
import ModalPreferences from '@/components/modals/ModalPreferences.vue'
import { XivCraftActions } from '@/assets/data'
import { useStore } from '@/store'
import {
  _VAR_MACRO_MAXAMOUNT,
  fixWorkState, getDefaultCraftMacro,
  type WorkState, type RecordedCraftMacro, type CraftMacroRow,
} from '@/models/macromanage'
import type { UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import { CopyToClipboard } from '@/tools'
import useUiTools from '@/tools/ui'
import useMacroHelper from '@/tools/macro-helper'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const { renderIcon } = useUiTools(isMobile)
const {
  exportCraftMacroText, unarchiveMacroRow,
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
workState.value.recordIndex = Math.max(0, ...workState.value.recordedCraftMacros.map(macro => macro.id)) + 1

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

const tableHeight = ref(300)
const updateHeights = () => {
  tableHeight.value = window.innerHeight - 280
}
onMounted(() => {
  updateHeights()
  window.addEventListener('resize', updateHeights)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeights)
})

const macroItemLanguageOptions = computed(() => {
  return [
    { label: t('中文'), value: 'zh' },
    { label: t('英文'), value: 'en' },
    { label: t('日文'), value: 'ja' },
  ]
})

const tableData = computed(() => {
  return workState.value.recordedCraftMacros.map(macro => unarchiveMacroRow(macro)).filter(macro => {
    if (workState.value.searchKeyword) {
      const keyword = workState.value.searchKeyword
      const keywordIsDigit = /^\d+$/.test(keyword)
      return (
        macro.name.includes(keyword) ||
        macro.remark.includes(keyword) ||
        macro.tags.some(tag => tag.includes(keyword)) ||
        macro.relateItems.some(item => {
          if (typeof item === 'string') {
            return item.includes(keyword)
          } else {
            return (
              item.name_zh.includes(keyword) ||
              item.name_en.includes(keyword) ||
              item.name_ja.includes(keyword)
            ) || (keywordIsDigit && (
              item.id.toString() === keyword ||
              item.itemLevel.toString() === keyword ||
              item.patch === keyword
            ))
          }
        })
      )
    }
    return true
  })
})
const tableColumns = computed(() => {
  const columns: DataTableColumns<CraftMacroRow> = [
    {
      title: t('编号'),
      key: 'id',
      className: '',
      width: 80,
      align: 'center',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('宏名称'),
      key: 'name',
      className: '',
      width: 350,
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
            h(
              'div',
              { class: 'macro-remark' },
              row.remark.split('\n').map(line => {
                return h('div', { class: 'macro-remark-line' }, line)
              })
            ),
          ],
        )
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('关联物品'),
      key: 'itemId',
      className: '',
      width: 200,
      render(row) {
        return h(
          'div',
          { class: 'flex-col' },
          row.relateItems.slice(0, 3).map(item => {
            if (typeof item === 'string') {
              return h(NTag, {
                size: 'small',
                style: 'width: fit-content;',
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
      title: t('属性要求'),
      key: 'requirements',
      className: '',
      align: 'center',
      width: 120,
      render(row) {
        const children : VNode[] = []
        if (row.requirements.craftsmanship) {
          children.push(h('div', null, t('{craftsmanship_val}作业', row.requirements.craftsmanship)))
        }
        if (row.requirements.control) {
          children.push(h('div', null, t('{control_val}加工', row.requirements.craftsmanship)))
        }
        if (row.requirements.cp) {
          children.push(h('div', null, row.requirements.cp + 'CP'))
        }
        return h(
          'div',
          { class: 'lh-120 font-small' },
          children
        )
      }
    },
    {
      title: t('内容'),
      key: 'content',
      render(row) {
        const macros = exportCraftMacroText(row.craftActions)[`macros_${workState.value.macroItemLanguage}`]
        return h(
          'div',
          { style: 'width: fit-content;' },
          [
            h(
              'div',
              null,
              t('{step_count}步{time_count}秒', {
                step_count: row.craftActions.length,
                time_count: row.craftActions.reduce((total, action) => {
                  return total + (XivCraftActions[action.id]?.wait_time ?? 0)
                }, 0)
              })
            ),
            h(
              NDivider,
              { style: 'margin: -3px 0 2px 0;' },
              ''
            ),
            h(
              'div',
              { class: 'flex-vac gap-2' },
              macros.map((macro, index) => {
                return h(
                  NButton,
                  {
                    tertiary: true,
                    size: 'tiny',
                    title: t('点击以复制'),
                    onClick: () => handleCopyMacro(macro)
                  },
                  {
                    default: () => t('宏#{index}', index + 1)
                  }
                )
              })
            ),
          ]
        )
      }
    },
    {
      title: t('管理'),
      key: 'manage',
      width: 180,
      render(row) {
        return h(
          'div',
          { class: 'flex gap-4' },
          [
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: 'small',
                style: 'width: fit-content;',
                onClick: () => handleEditRow(row)
              },
              {
                icon: renderIcon(EditNoteOutlined),
                default: () => t('编辑')
              }
            ),
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                type: 'error',
                size: 'small',
                style: 'width: fit-content;',
                onClick: () => handleDeleteRow(row)
              },
              {
                icon: renderIcon(DeleteFilled),
                default: () => t('删除')
              }
            ),
          ]
        )
      },
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

const handleAddRow = () => {
  if (workState.value.recordedCraftMacros.length >= _VAR_MACRO_MAXAMOUNT) {
    NAIVE_UI_MESSAGE.error(t('宏数量已达上限'))
    return
  }
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
const handleCopyMacro = async (macro: string) => {
  const response = await CopyToClipboard(macro)
  if (response) {
    NAIVE_UI_MESSAGE.error(t('复制失败：发生意外错误'))
  } else {
    NAIVE_UI_MESSAGE.success(t('已复制到剪贴板'))
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
const showPreferencesModal = ref(false)
const handleSettingButtonClick = () => {
  showPreferencesModal.value = true
}
</script>

<template>
  <div id="main-container">
    <FoldableCard card-key="macromanage-main">
      <template #header>
        <i class="xiv e0ba"></i>
        <span class="card-title-text">{{ t('生产宏管理') }}</span>
      </template>
      <div class="main-content">
        <div class="query-options">
          <n-input-group id="querier-search">
            <n-input-group-label>{{ t('筛选／检索') }}</n-input-group-label>
            <n-input
              v-model:value="workState.searchKeyword"
              :placeholder="t('支持按宏名称/备注/标签以及关联物品的名称/ID/品级/版本进行检索')"
              
            >
              <template #suffix>
                <n-icon :component="SearchOutlined" />
              </template>
            </n-input>
          </n-input-group>
          <n-input-group id="querier-itemlang">
            <n-input-group-label>{{ t('宏语言') }}</n-input-group-label>
            <n-select
              v-model:value="workState.macroItemLanguage"
              :options="macroItemLanguageOptions"
            />
          </n-input-group>
          <div id="querier-actions">
            <n-button
              ghost
              @click="handleSettingButtonClick"
            >
              <template #icon>
                <n-icon :component="SettingsSuggestFilled" />
              </template>
              {{ t('设置') }}
            </n-button>
            <n-button
              type="primary"
              @click="handleAddRow"
            >
              <template #icon>
                <n-icon :component="AddTaskOutlined" />
              </template>
              {{ t('新增') }}
            </n-button>
          </div>
        </div>
        <n-data-table
          bordered
          scroll-x="100%"
          :columns="tableColumns"
          :data="tableData"
          :pagination="false"
          :max-height="tableHeight"
          :virtual-scroll="tableData.length > 200"
        >
          <template #empty>
            <n-empty
              :description="workState.searchKeyword ? t('无匹配内容') : t('无数据')"
            />
          </template>
        </n-data-table>
      </div>
    </FoldableCard>
    
    <n-back-top />

    <ModalCraftMacroEdit
      v-model:show="showModalCraftMacroEdit"
      v-model:macro="macroEditTarget"
      :action="macroEditAction"
      @on-submit="handleMacroEditSubmit"
    />
    <ModalPreferences
      v-model:show="showPreferencesModal"
      setting-group="craft_macro"
      app-show-fp
    />
  </div>
</template>

<style scoped>
#main-container {
  max-width: 100%;
  gap: 0.6rem;
  display: flex;
  flex-direction: column;

  .main-content {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .query-options {
      display: flex;
      gap: 4px;

      #querier-actions {
        margin-left: auto;
        display: flex;
        gap: 4px;
      }
    }
  }
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
  .query-options {
    #querier-search {
      max-width: 560px;
    }
    #querier-itemlang {
      max-width: 200px;
    }
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .query-options {
    flex-direction: column;
    
    #querier-search {
      width: 100%;
    }
    #querier-itemlang {
      width: 100%;
    }
  }
}
</style>