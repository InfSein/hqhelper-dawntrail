<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NDivider, NDynamicTags, NEmpty, NIcon, NInput, NInputNumber, NInputGroup, NInputGroupLabel, NPopover,
  NTable, NTabs, NTabPane, NTag, NRadio, NRadioGroup, 
  useMessage
} from 'naive-ui'
import {
  BuildFilled,
  CodeSharp,
  AddCircleOutlined,
  RemoveCircleOutlined,
  LocalOfferFilled,
  ListFilled,
  DeleteFilled,
  DoneOutlined,
  SaveOutlined,
  SettingsRound,
} from '@vicons/material'
import { VueDraggable } from 'vue-draggable-plus'
import MyModal from '@/components/templates/MyModal.vue'
import HelpButton from '@/components/custom/general/HelpButton.vue'
import ItemSelector from '@/components/custom/item/ItemSelector.vue'
import ItemSpan from '@/components/custom/item/ItemSpan.vue'
import CraftActionButton from '@/components/custom/action/CraftActionButton.vue'
import MacroViewer from '@/components/custom/macro/MacroViewer.vue'
import ModalPresetTagsManage from './ModalPresetTagsManage.vue'
import ModalPresetCReqsManage from './ModalPresetCReqsManage.vue'
import { XivCraftActions } from '@/assets/data'
import {
  _VAR_TAG_MAXLEN, _VAR_REMARK_MAXLINE,
  _VAR_RELATEITEM_MAXLEN, _VAR_TABLESHOW_RELATEITEM_MAXLEN,
  getDefaultCraftMacro,
  type RecordedCraftMacro,
  type StrictCraftRequirements,
} from '@/models/macromanage'
import { type UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import { deepCopy, findDuplicatesFromArray } from '@/tools'
import { getItemInfo } from '@/tools/item'
import UseConfig from '@/tools/use-config'
import useMacroHelper from '@/tools/macro-helper'

const t = inject<(message: string, args?: any) => string>('t')!
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const NAIVE_UI_MESSAGE = useMessage()
const {
  itemLanguage,
} = UseConfig(userConfig, funcConfig)
const {
  parseCraftMacroText, parseCraftProcedure, exportCraftMacroText,
} = useMacroHelper(userConfig, funcConfig)

const modalId = 'modal-craft-macro-edit'

const showModal = defineModel<boolean>('show', { required: true })
const macro = defineModel<RecordedCraftMacro>('macro', { required: true })

const formData = ref<RecordedCraftMacro>(getDefaultCraftMacro(-1))
const relateItemIndex = ref(0)
const relateItemName = ref('')
const formRelateItems = ref<{
  id: number,
  val: string | number,
}[]>([])
const craftActionIndex = ref(0)
const formCraftActions = ref<{
  id: number,
  val: number,
}[]>([])
const formCraftActionsImportType = ref<"gamemacro" | "simulator">('gamemacro')
const formCraftActionsImport = ref('')
const formCraftActionsExportLang = ref<"zh" | "en" | "ja">('zh')
const showPresetTagsManageModal = ref(false)
const showPresetCReqsManageModal = ref(false)

interface ModalCraftMacroEditProps {
  action: "add" | "edit";
}
const props = defineProps<ModalCraftMacroEditProps>()
const emits = defineEmits(['onSubmit'])

const onLoad = () => {
  formData.value = deepCopy(macro.value)
  formData.value.requirements.craftsmanship ??= 0
  formData.value.requirements.control ??= 0
  formData.value.requirements.cp ??= 0
  relateItemIndex.value = 0
  relateItemName.value = ''
  formRelateItems.value = formData.value.relateItems.map(item => {
    return {
      id: relateItemIndex.value++,
      val: item,
    }
  })
  craftActionIndex.value = 0
  formCraftActions.value = formData.value.craftActions.map(action => {
    return {
      id: craftActionIndex.value++,
      val: action,
    }
  })
  formCraftActionsImportType.value = 'gamemacro'
  formCraftActionsImport.value = ''
  formCraftActionsExportLang.value = itemLanguage.value
}

const modalTitle = computed(() => {
  return props.action === 'add' ? t('macro_manage.text.add_macro') : t('macro_manage.text.edit_macro')
})
const craftActionsMacroLines = computed(() => {
  const macros = exportCraftMacroText(formCraftActions.value.map(action => XivCraftActions[action.val]))
  return [...macros[`macros_${formCraftActionsExportLang.value}`].map(str => str.split('\r\n')).flat()]
})
const groupLabelStyle = computed(() => {
  let width = 25
  if (userConfig.value.language_ui === 'ja') {
    width = 35
  }
  return [
    `width: ${width}%;`,
    'text-align: center;'
  ].join(' ')
})

const handlePresetTagClick = (tag: string) => {
  if (formData.value.tags.includes(tag)){
    formData.value.tags = formData.value.tags.filter(_tag => tag !== _tag)
  } else {
    if (formData.value.tags.length >= _VAR_TAG_MAXLEN) {
      NAIVE_UI_MESSAGE.warning(t('macro_manage.message.tag_max_len', _VAR_TAG_MAXLEN))
      return
    }
    formData.value.tags.push(tag)
  }
}

const isActiveCReq = (creq: StrictCraftRequirements) => {
  return creq.craftsmanship === formData.value.requirements.craftsmanship
    && creq.control === formData.value.requirements.control
    && creq.cp === formData.value.requirements.cp
}
const buildCReqButtonText = (creq: StrictCraftRequirements) => {
  return t('macro_manage.text.preset_creq_info', {
    val1: creq.craftsmanship,
    val2: creq.control,
    val3: creq.cp,
  })
}
const handleCReqButtonClick = (creq: StrictCraftRequirements) => {
  formData.value.requirements.craftsmanship = creq.craftsmanship
  formData.value.requirements.control = creq.control
  formData.value.requirements.cp = creq.cp
}

const remarkInputChecker = (value: string) => {
  return value.split('\n').length <= _VAR_REMARK_MAXLINE
}

const handleAddRelateItem = (itemid: number) => {
  if (!itemid) return
  if (formRelateItems.value.length >= _VAR_RELATEITEM_MAXLEN) {
    NAIVE_UI_MESSAGE.error(t('macro_manage.message.relate_item_max_len')); return
  }
  if (formRelateItems.value.map(item => item.val).includes(itemid)) {
    NAIVE_UI_MESSAGE.error(t('common.message.item_already_have')); return
  }
  formRelateItems.value.push({
    id: relateItemIndex.value++,
    val: itemid,
  })
}
const handleAddRelateItemStr = () => {
  const itemname = relateItemName.value
  if (formRelateItems.value.length >= _VAR_RELATEITEM_MAXLEN) {
    NAIVE_UI_MESSAGE.error(t('macro_manage.message.relate_item_max_len')); return
  }
  if (!itemname) {
    NAIVE_UI_MESSAGE.error(t('common.message.please_input_item_name')); return
  }
  if (formRelateItems.value.map(item => item.val).includes(itemname)) {
    NAIVE_UI_MESSAGE.error(t('common.message.item_already_have')); return
  }
  formRelateItems.value.push({
    id: relateItemIndex.value++,
    val: itemname,
  })
  relateItemName.value = ''
}

const handleImportCraftActions = () => {
  if (!formCraftActionsImport.value) {
    NAIVE_UI_MESSAGE.error(t('macro_manage.text.please_input_content_to_import')); return
  }
  let importedActions : number[] = []
  if (formCraftActionsImportType.value === 'gamemacro') {
    importedActions = parseCraftMacroText(formCraftActionsImport.value).map(action => action.id)
  } else if (formCraftActionsImportType.value === 'simulator') {
    importedActions = parseCraftProcedure(formCraftActionsImport.value).map(action => action.id)
  } else {
    NAIVE_UI_MESSAGE.error('Unexpected formCraftActionsImportType'); return
  }
  if (!importedActions.length) {
    NAIVE_UI_MESSAGE.error(t('macro_manage.message.no_actions_recognized')); return
  }
  formCraftActions.value = importedActions.map(action => {
    return {
      id: craftActionIndex.value++,
      val: action,
    }
  })
  NAIVE_UI_MESSAGE.success(t('common.message.import_succeed'))
}

const handleSave = async () => {
  // 进行校验
  let relateItems = formRelateItems.value.map(item => item.val)
  const duplicateInRelateItems = findDuplicatesFromArray(relateItems)
  if (duplicateInRelateItems.length) {
    const diList = duplicateInRelateItems.map(itemval => {
      if (typeof itemval === 'number') {
        return getItemInfo(itemval)[`name_${itemLanguage.value}`]
      } else {
        return itemval
      }
    }).join(', ')
    if (!window.confirm(
      t('macro_manage.message.relate_item_deduplicate')
      + '\n' + diList
      + '\n' + t('common.message.ask_continue')
    )) return
    relateItems = Array.from(new Set(relateItems))
  }
  if (!formCraftActions.value.length) {
    NAIVE_UI_MESSAGE.error(t('macro_manage.message.macro_content_cannot_empty')); return
  }

  // 处理一些属性
  if (!formData.value.name) formData.value.name = t('common.id_macro', formData.value.id)
  if (!formData.value.requirements.craftsmanship) delete formData.value.requirements.craftsmanship
  if (!formData.value.requirements.control) delete formData.value.requirements.control
  if (!formData.value.requirements.cp) delete formData.value.requirements.cp
  formData.value.relateItems = relateItems
  formData.value.craftActions = formCraftActions.value.map(action => action.val)

  emits('onSubmit', formData.value)
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :id="modalId"
    :icon="CodeSharp"
    :title="modalTitle"
    max-width="600px"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <n-tabs type="segment" animated>
        <n-tab-pane name="baseInfo" :tab="t('common.basic_info')">
          <div class="tabpane-wrapper">
            <div class="form-block">
              <div class="form-title">{{ t('macro_manage.text.macro_name') }}</div>
              <div class="form-input">
                <n-input
                  v-model:value="formData.name"
                  maxlength="20"
                  show-count
                  clearable
                  :placeholder="t('common.id_macro', formData.id)"
                />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">
                {{ t('common.tag') }}
                <span class="sub">
                  <n-popover placement="right-start">
                    <template #trigger>
                      <a>[{{ t('common.preset') }}]</a>
                    </template>

                    <div class="pop-wrapper">
                      <div class="flex-vac font-big gap-4">
                        <n-icon :size="16"><LocalOfferFilled /></n-icon>
                        <span>{{ t('macro_manage.text.preset_tags') }}</span>
                      </div>
                      <n-divider style="margin: 0 0 3px 0;" />
                      <div v-if="userConfig.macromanage_cache_work_state.presetTags.length" class="flex-wrap gap-2">
                        <n-tag
                          v-for="(tag, tagIndex) in userConfig.macromanage_cache_work_state.presetTags"
                          :key="`tag-${tagIndex}`"
                          size="small"
                          :type="formData.tags.includes(tag) ? 'success' : 'default'"
                          class="pop-tag"
                          :title="tag"
                          @click="handlePresetTagClick(tag)"
                        >
                          <template #icon>
                            <n-icon v-if="formData.tags.includes(tag)" :component="RemoveCircleOutlined" />
                            <n-icon v-else :component="AddCircleOutlined" />
                          </template>
                          {{ tag }}
                        </n-tag>
                      </div>
                      <n-empty
                        v-else
                        size="small"
                        class="font-small no-margin-empty"
                        style="align-self: center;"
                        :description="t('macro_manage.message.no_preset_tags')"
                      />
                      <n-divider style="margin: 3px 0 3px 0;" />
                      <div class="flex" style="justify-content: end;">
                        <n-button size="tiny" @click="showPresetTagsManageModal = true">
                          <template #icon>
                            <n-icon><SettingsRound /></n-icon>
                          </template>
                          {{ t('common.manage') }}
                        </n-button>
                      </div>
                    </div>
                  </n-popover>
                </span>
              </div>
              <div class="form-input">
                <n-dynamic-tags v-model:value="formData.tags" :max="_VAR_TAG_MAXLEN" />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('common.comment') }}</div>
              <div class="form-input">
                <n-input
                  v-model:value="formData.remark"
                  type="textarea"
                  maxlength="50"
                  show-count
                  :allow-input="remarkInputChecker"
                  :placeholder="t('common.line_max_len', _VAR_REMARK_MAXLINE)"
                />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">
                {{ t('common.craft_requirements') }}
                <span class="sub">
                  <n-popover placement="right-start">
                    <template #trigger>
                      <a>[{{ t('common.preset') }}]</a>
                    </template>

                    <div>
                      <div class="flex-vac font-big gap-4">
                        <n-icon :size="16"><BuildFilled /></n-icon>
                        <span>{{ t('macro_manage.text.preset_creqs') }}</span>
                      </div>
                      <n-divider style="margin: 0 0 3px 0;" />
                      <div v-if="userConfig.macromanage_cache_work_state.presetCReqs.length" class="flex-col gap-2">
                        <n-button
                          v-for="(creq, creqIndex) in userConfig.macromanage_cache_work_state.presetCReqs"
                          :key="`creq-${creqIndex}`"
                          size="tiny"
                          :ghost="!isActiveCReq(creq)"
                          :type="isActiveCReq(creq) ? 'success' : 'default'"
                          @click="handleCReqButtonClick(creq)"
                        >
                          {{ buildCReqButtonText(creq) }}
                        </n-button>
                      </div>
                      <n-empty
                        v-else
                        size="small"
                        class="font-small no-margin-empty"
                        :description="t('macro_manage.message.no_preset_creqs')"
                      />
                      <n-divider style="margin: 3px 0 3px 0;" />
                      <div class="flex" style="justify-content: end;">
                        <n-button size="tiny" @click="showPresetCReqsManageModal = true">
                          <template #icon>
                            <n-icon><SettingsRound /></n-icon>
                          </template>
                          {{ t('common.manage') }}
                        </n-button>
                      </div>
                    </div>
                  </n-popover>
                </span>
              </div>
              <div class="form-input">
                <n-table id="form-requirements-table" size="small" :single-line="false">
                  <thead>
                    <tr>
                      <th>{{ t('common.craft.craftsmanship') }}</th>
                      <th>{{ t('common.craft.control') }}</th>
                      <th>
                        <div class="flex-center">
                          <div class="bold">{{ t('common.craft.cp') }}</div>
                          <div>
                            <HelpButton
                              icon="info"
                              :descriptions="[
                                t('macro_manage.text.auto_cal_by_macro_when_empty_or_zero'),
                                t('macro_manage.text.cover_auto_val_when_inputed'),
                              ]"
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <n-input-number
                          v-model:value="formData.requirements.craftsmanship!"
                          :precision="0"
                          :min="0" :max="9999"
                        />
                      </td>
                      <td>
                        <n-input-number
                          v-model:value="formData.requirements.control!"
                          :precision="0"
                          :min="0" :max="9999"
                        />
                      </td>
                      <td>
                        <n-input-number
                          v-model:value="formData.requirements.cp!"
                          :precision="0"
                          :min="0" :max="999"
                          :placeholder="t('macro_manage.text.attr_auto_cal_when_zero')"
                        />
                      </td>
                    </tr>
                  </tbody>
                </n-table>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="relateItems" :tab="t('macro_manage.text.relate_item')">
          <div class="tabpane-wrapper">
            <div class="form-block">
              <div class="form-title">{{ t('common.add_item') }}</div>
              <div class="form-tip">
                <p>{{ t('macro_manage.text.can_select_item_or_input_name') }}</p>
              </div>
              <div class="form-input">
                <n-input-group style="margin-top: 2px;">
                  <n-input-group-label :style="groupLabelStyle">{{ t('macro_manage.text.select_from_db') }}</n-input-group-label>
                  <ItemSelector :container-id="modalId" @on-item-selected="handleAddRelateItem"/>
                </n-input-group>
                <n-input-group style="margin-top: 1px;">
                  <n-input-group-label :style="groupLabelStyle">{{ t('macro_manage.text.input_item_name') }}</n-input-group-label>
                  <n-input v-model:value="relateItemName" />
                  <n-button type="primary" @click="handleAddRelateItemStr">
                    {{ t('common.add') }}
                  </n-button>
                </n-input-group>
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('macro_manage.text.existing_items') }}</div>
              <div class="form-tip">
                <p>{{ t('macro_manage.text.relate_item_desc', {
                  limit_1: _VAR_RELATEITEM_MAXLEN, limit_2: _VAR_TABLESHOW_RELATEITEM_MAXLEN
                }) }}</p>
              </div>
              <div class="form-input">
                <VueDraggable
                  v-model="formRelateItems"
                  target=".sort-target"
                  handle=".draggable-box"
                  :animation="150"
                >
                  <n-table id="existed-items-table" size="small" :single-line="false">
                    <thead>
                      <tr>
                        <th>{{ t('common.item') }}</th>
                        <th>{{ t('common.manage') }}</th>
                      </tr>
                    </thead>
                    <tbody class="sort-target">
                      <tr v-for="(item, itemIndex) in formRelateItems" :key="item.id">
                        <td>
                          <n-input-group>
                            <n-input-group-label class="draggable-box" :title="t('common.drag_to_sort')">
                              <n-icon :size="18"><ListFilled /></n-icon>
                            </n-input-group-label>
                            <n-button
                              v-if="typeof item.val === 'number'"
                              class="flex-1"
                              style="justify-content: flex-start;"
                            >
                              <ItemSpan :item-info="getItemInfo(item.val)" :container-id="modalId" />
                            </n-button>
                            <n-input
                              v-else
                              type="text"
                              v-model:value="item.val"
                            />
                          </n-input-group>
                        </td>
                        <td>
                          <n-button ghost type="error" size="small" @click="() => formRelateItems.splice(itemIndex, 1)">
                            <template #icon>
                              <n-icon><DeleteFilled /></n-icon>
                            </template>
                            {{ t('common.delete') }}
                          </n-button>
                        </td>
                      </tr>
                      <tr v-if="!formRelateItems.length">
                        <td colspan="2">
                          <div class="flex-center">
                            <n-empty :description="t('macro_manage.text.no_relate_item_set')" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </n-table>
                </VueDraggable>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="craftActions" :tab="t('common.macro_content')">
          <div class="tabpane-wrapper">
            <div class="form-block">
              <div class="form-title">{{ t('common.current') }}</div>
              <div class="form-tip">
                <p>{{ t('macro_manage.text.drag_to_sort') }}</p>
              </div>
              <div class="form-input">
                <VueDraggable
                  v-if="formCraftActions.length"
                  v-model="formCraftActions"
                  :animation="150"
                  class="actions-container"
                >
                  <CraftActionButton
                    v-for="item in formCraftActions"
                    :key="item.id"
                    :craft-action="XivCraftActions[item.val]"
                    :btn-size="48"
                  />
                </VueDraggable>
                <n-empty
                  v-else
                  style="margin-top: 15px;"
                  :description="t('macro_manage.text.no_macro_content_set')"
                />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('common.import') }}</div>
              <div class="form-input flex-col gap-4">
                <div class="flex-vac gap-4">
                  <p>{{ t('macro_manage.text.import_source') }}</p>
                  <n-radio-group
                    v-model:value="formCraftActionsImportType"
                    name="formCraftActionsImportType"
                    size="small"
                  >
                    <n-radio
                      key="gamemacro"
                      value="gamemacro"
                      :label="t('common.game_macro')"
                    />
                    <n-radio
                      key="simulator"
                      value="simulator"
                      :label="t('common.simulator')"
                    />
                  </n-radio-group>
                </div>
                <div class="lh-120" style="margin-bottom: 4px;">
                  <div v-if="formCraftActionsImportType === 'gamemacro'">
                    <p>{{ t('macro_manage.text.import_action.text_1') }}</p>
                    <p>{{ t('macro_manage.text.import_action.text_2') }}</p>
                    <p>{{ t('macro_manage.text.import_action.text_3') }}</p>
                    <p>{{ t('macro_manage.text.import_action.text_4') }}</p>
                  </div>
                  <div v-else-if="formCraftActionsImportType === 'simulator'">
                    <p>{{ t('macro_manage.text.import_action.text_5') }}</p>
                  </div>
                </div>
                <n-input
                  v-model:value="formCraftActionsImport"
                  type="textarea"
                  :autosize="{
                    minRows: 3,
                  }"
                />
                <n-button
                  ghost
                  type="primary"
                  style="width: fit-content; margin-left: auto;"
                  @click="handleImportCraftActions"
                >
                  <template #icon>
                    <n-icon><DoneOutlined /></n-icon>
                  </template>
                  {{ t('common.confirm') }}
                </n-button>
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('common.export') }}</div>
              <div class="form-input flex-col gap-4">
                <div class="flex-vac gap-4">
                  <p>{{ t('macro_manage.text.macro_lang_with_colon') }}</p>
                  <n-radio-group
                    v-model:value="formCraftActionsExportLang"
                    name="formCraftActionsExportLang"
                    size="small"
                  >
                    <n-radio key="zh" value="zh" :label="t('common.lang_zh')" />
                    <n-radio key="en" value="en" :label="t('common.lang_en')" />
                    <n-radio key="ja" value="ja" :label="t('common.lang_ja')" />
                  </n-radio-group>
                </div>
                <MacroViewer
                  :macro-lines="craftActionsMacroLines"
                  :container-id="modalId"
                  content-height="240px"
                />
              </div>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>

    <template #action>
      <div class="modal-submit-container">
        <n-button type="primary" @click="handleSave">
          <template #icon>
            <n-icon>
              <SaveOutlined />
            </n-icon>
          </template>
          {{ t('common.save') }}
        </n-button>
      </div>
    </template>

    <ModalPresetTagsManage
      v-model:show="showPresetTagsManageModal"
    />
    <ModalPresetCReqsManage
      v-model:show="showPresetCReqsManageModal"
    />
  </MyModal>
</template>

<style scoped>
/* All */
.wrapper {
  width: 100%;
  height: 430px;
  user-select: text;

  .tabpane-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0 0.5em;
    height: 390px;
    overflow-y: auto;

    .form-block {
      .form-title {
        font-weight: bold;
        line-height: 1.5;

        .sub {
          font-size: calc(var(--n-font-size) - 2px);
        }
      }
      .form-tip {
        line-height: 1.2;
      }
    }
  }
}
.pop-wrapper {
  width: 150px;

  .pop-tag {
    width: fit-content;
    max-width: 100%;
    cursor: pointer;
    user-select: none;
  }
}
:deep(.pop-tag span.n-tag__content) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
table {
  th {
    font-weight: bold;
  }
}
#form-requirements-table {
  width: 100%;

  th {
    text-align: center;
  }
  th:first-child, td:first-child,
  th:nth-child(2), td:nth-child(2) {
    width: 35%;
  }
  th:nth-child(3), td:nth-child(3) {
    width: 30%;
  }
}
#existed-items-table {
  margin: 10px 0;

  th:first-child, td:first-child {
    width: 80%;
  }
  th:nth-child(2), td:nth-child(2) {
    width: 20%;
    text-align: center;
  }

  .draggable-box {
    display: flex;
    align-items: center;
    cursor: move;
  }
}
.actions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>