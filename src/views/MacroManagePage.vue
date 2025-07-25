<script setup lang="ts">
import { computed, h, inject, onBeforeUnmount, onMounted, ref, watch, type Ref, type VNode } from 'vue'
import {
  NBackTop, NButton, NButtonGroup, NDataTable, NDivider, NDropdown, NEmpty, NIcon, NInput, NInputGroup, NInputGroupLabel, NSelect, NTag,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'
import {
  SearchOutlined,
  SettingsSuggestFilled,
  KeyboardArrowDownRound,
  ArchiveSharp, UnarchiveSharp,
  AddTaskOutlined,
  EditNoteOutlined, DeleteFilled,
} from '@vicons/material'
import FoldableCard from '@/components/templates/FoldableCard.vue'
import ItemSpan from '@/components/custom/item/ItemSpan.vue'
import ModalCraftMacroEdit from '@/components/modals/ModalCraftMacroEdit.vue'
import ModalPreferences from '@/components/modals/ModalPreferences.vue'
import ModalImExportCraftMacro from '@/components/modals/ModalImExportCraftMacro.vue'
import { XivCraftActions } from '@/assets/data'
import { useStore } from '@/store'
import {
  _VAR_MACRO_MAXAMOUNT,
  fixWorkState, getDefaultCraftMacro,
  type WorkState, type RecordedCraftMacro, type CraftMacroRow,
} from '@/models/macromanage'
import type { UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import { CopyToClipboard, deepCopy } from '@/tools'
import useUiTools from '@/tools/ui'
import useMacroHelper from '@/tools/macro-helper'

const t = inject<(message: string, args?: any) => string>('t')!
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
const showModalImExport = ref(false)
const imexportMode = ref<"import" | "export">('import')
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
    { label: t('common.lang_zh'), value: 'zh' },
    { label: t('common.lang_en'), value: 'en' },
    { label: t('common.lang_ja'), value: 'ja' },
  ]
})
const multiOperateDropdownOptions = computed(() => {
  return [
    {
      label: t('macro_manage.text.delete_all_macros'),
      key: 'delete',
      props: { style: 'color: var(--color-error);' },
      icon: renderIcon(DeleteFilled, { color: 'var(--color-error)' }),
    },
  ]
})
const mainCardExtraButtons = computed(() => {
  return [
    {
      text: t('common.setting'),
      icon: SettingsSuggestFilled,
      onClick: handleSettingButtonClick,
    }
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
              item.name_ja.includes(keyword) ||
              item.patch === keyword
            ) || (keywordIsDigit && (
              item.id.toString() === keyword ||
              item.itemLevel.toString() === keyword
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
      title: t('common.number'),
      key: 'id',
      className: '',
      width: 80,
      align: 'center',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('macro_manage.text.macro_name'),
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
                t('macro_manage.text.tag_with_colon'),
                row.tags.length ? row.tags.map(tag => h(NTag, {
                  size: 'small',
                }, () => tag)) : t('common.nothing'),
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
      title: t('macro_manage.text.relate_item'),
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
      title: t('common.craft_requirements'),
      key: 'requirements',
      className: '',
      align: 'center',
      width: 120,
      render(row) {
        const children : VNode[] = []
        if (row.requirements.craftsmanship) {
          children.push(h('div', null, t('common.val_craftsmanship', row.requirements.craftsmanship)))
        }
        if (row.requirements.control) {
          children.push(h('div', null, t('common.val_control', row.requirements.control)))
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
      title: t('common.content'),
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
              t('common.step_and_sec', {
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
                    title: t('common.click_to_copy'),
                    onClick: () => handleCopyMacro(macro)
                  },
                  {
                    default: () => t('common.macro_with_index', index + 1)
                  }
                )
              })
            ),
          ]
        )
      }
    },
    {
      title: t('common.manage'),
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
                default: () => t('common.edit')
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
                default: () => t('common.delete')
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
  NAIVE_UI_MESSAGE.error(t('common.data_missing'))
  console.error(
    'edited macro not found! \nmacro:',
    macro,
    '\nrecordedCraftMacros:',
    workState.value.recordedCraftMacros
  )
}
const handleMultiOperateDropdownSelect = (key: string | number) => {
  if (key === 'delete') {
    if (!workState.value.recordedCraftMacros.length) {
      NAIVE_UI_MESSAGE.info(t('macro_manage.message.no_macro_added'))
      return
    }
    if (!window.confirm(t('macro_manage.message.confirm_delete_all') + '\n' + t('common.message.operation_irreversible'))) {
      return
    }
    workState.value.recordedCraftMacros = []
    NAIVE_UI_MESSAGE.success(t('common.message.deleted'))
  } else {
    console.warn('unexpected multi operate dropdown key:', key)
  }
}
const handleImportButtonClick = () => {
  imexportMode.value = 'import'
  showModalImExport.value = true
}
const handleExportButtonClick = () => {
  imexportMode.value = 'export'
  showModalImExport.value = true
}

const handleAddRow = () => {
  if (workState.value.recordedCraftMacros.length >= _VAR_MACRO_MAXAMOUNT) {
    NAIVE_UI_MESSAGE.error(t('macro_manage.message.macro_amount_limited'))
    return
  }
  const macroid = getMacroId()
  macroEditTarget.value = getDefaultCraftMacro(macroid)
  macroEditAction.value = 'add'
  showModalCraftMacroEdit.value = true

  function getMacroId () {
    let macroid = workState.value.recordIndex
    while (workState.value.recordedCraftMacros.find(macro => macro.id === macroid)) {
      macroid++
    }
    if (workState.value.recordIndex !== macroid) {
      workState.value.recordIndex = macroid
    }
    return macroid
  }
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
  if (!window.confirm(t('common.message.confirm_delete_with_name', row.name) + '\n' + t('common.message.operation_irreversible'))){
    return
  }
  const index = workState.value.recordedCraftMacros.findIndex(macro => macro.id === row.id)
  if (index !== -1) {
    workState.value.recordedCraftMacros.splice(index, 1)
    NAIVE_UI_MESSAGE.success(t('common.message.deleted'))
  } else {
    handleReportDataMissing(row.id)
  }
}
const handleCopyMacro = async (macro: string) => {
  const response = await CopyToClipboard(macro)
  if (response) {
    NAIVE_UI_MESSAGE.error(t('common.message.copy_failed_unexpected_error'))
  } else {
    NAIVE_UI_MESSAGE.success(t('common.message.copy_succeed'))
  }
}

const handleMacroEditSubmit = (macro: RecordedCraftMacro) => {
  const macroid = macro.id
  const newWorkState = fixWorkState(deepCopy(userConfig.value.macromanage_cache_work_state))
  if (macroEditAction.value === 'edit') {
    const index = newWorkState.recordedCraftMacros.findIndex(macro => macro.id === macroid)
    if (index !== -1) {
      newWorkState.recordedCraftMacros[index] = macro
      workState.value = newWorkState
      NAIVE_UI_MESSAGE.success(t('common.message.changes_saved'))
    } else {
      handleReportDataMissing(macro)
    }
  } else if (macroEditAction.value === 'add') {
    newWorkState.recordedCraftMacros.push(macro)
    workState.value = newWorkState
    NAIVE_UI_MESSAGE.success(t('common.message.dataname_saved', macro.name))
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
    <FoldableCard card-key="macromanage-main" unfoldable :extra-header-buttons="mainCardExtraButtons">
      <template #header>
        <i class="xiv e0ba"></i>
        <span class="card-title-text">{{ t('macro_manage.title') }}</span>
      </template>
      <div class="main-content">
        <div class="query-options">
          <n-input-group id="querier-search">
            <n-input-group-label>{{ t('macro_manage.text.filter_or_search') }}</n-input-group-label>
            <n-input
              v-model:value="workState.searchKeyword"
              :placeholder="t('common.item_search_input_placeholder_2')"
              
            >
              <template #suffix>
                <n-icon :component="SearchOutlined" />
              </template>
            </n-input>
          </n-input-group>
          <n-input-group id="querier-itemlang">
            <n-input-group-label>{{ t('macro_manage.text.macro_lang') }}</n-input-group-label>
            <n-select
              v-model:value="workState.macroItemLanguage"
              :options="macroItemLanguageOptions"
            />
          </n-input-group>
          <div id="querier-actions">
            <n-dropdown
              placement="bottom-end"
              :options="multiOperateDropdownOptions"
              @select="handleMultiOperateDropdownSelect"
            >
              <n-button ghost icon-placement="right">
                <template #icon>
                  <n-icon :component="KeyboardArrowDownRound" />
                </template>
                {{ t('macro_manage.text.batch_operate') }}
              </n-button>
            </n-dropdown>
            <n-button-group>
              <n-button ghost @click="handleExportButtonClick">
                <template #icon>
                  <n-icon :component="ArchiveSharp" />
                </template>
                {{ t('common.export') }}
              </n-button>
              <n-button ghost @click="handleImportButtonClick">
                <template #icon>
                  <n-icon :component="UnarchiveSharp" />
                </template>
                {{ t('common.import') }}
              </n-button>
            </n-button-group>
            <n-button
              type="primary"
              @click="handleAddRow"
            >
              <template #icon>
                <n-icon :component="AddTaskOutlined" />
              </template>
              {{ t('common.add2') }}
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
              :description="workState.searchKeyword ? t('common.no_content_matched') : t('common.no_data')"
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
    <ModalImExportCraftMacro
      v-model:show="showModalImExport"
      v-model:recorded-macros="workState.recordedCraftMacros"
      :mode="imexportMode"
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
  .lang-ja #querier-search {
    max-width: 775px;
  }
  .lang-en #querier-itemlang {
    max-width: 240px;
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
    #querier-actions {
      flex-wrap: wrap;
      justify-content: end;
    }
  }
}
</style>