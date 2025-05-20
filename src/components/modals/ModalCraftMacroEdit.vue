<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NDynamicTags, NEmpty, NIcon, NInput, NInputNumber, NInputGroup, NInputGroupLabel, NTable, NTabs, NTabPane,
  NRadio, NRadioGroup, 
  useMessage
} from 'naive-ui'
import { 
  CodeSharp,
  ListFilled,
  DeleteFilled,
  DoneOutlined,
  SaveOutlined,
} from '@vicons/material'
import { VueDraggable } from 'vue-draggable-plus'
import MyModal from '@/components/templates/MyModal.vue'
import HelpButton from '@/components/custom/general/HelpButton.vue'
import ItemSelector from '@/components/custom/item/ItemSelector.vue'
import ItemSpan from '@/components/custom/item/ItemSpan.vue'
import CraftActionButton from '@/components/custom/action/CraftActionButton.vue'
import MacroViewer from '@/components/custom/macro/MacroViewer.vue'
import { XivCraftActions } from '@/assets/data'
import {
  _VAR_TAG_MAXLEN, _VAR_REMARK_MAXLINE,
  _VAR_RELATEITEM_MAXLEN, _VAR_TABLESHOW_RELATEITEM_MAXLEN,
  getDefaultCraftMacro,
  type RecordedCraftMacro,
} from '@/models/macromanage'
import { type UserConfigModel } from '@/models/config-user'
import { type FuncConfigModel } from '@/models/config-func'
import { deepCopy, findDuplicatesFromArray } from '@/tools'
import { getItemInfo } from '@/tools/item'
import UseConfig from '@/tools/use-config'
import useMacroHelper from '@/tools/macro-helper'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
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
  return props.action === 'add' ? t('添加宏') : t('编辑宏')
})
const craftActionsMacroLines = computed(() => {
  const macros = exportCraftMacroText(formCraftActions.value.map(action => XivCraftActions[action.val]))
  return [...macros[`macros_${formCraftActionsExportLang.value}`].map(str => str.split('\r\n')).flat()]
})

const remarkInputChecker = (value: string) => {
  return value.split('\n').length <= _VAR_REMARK_MAXLINE
}

const handleAddRelateItem = (itemid: number) => {
  if (!itemid) return
  if (formRelateItems.value.length >= _VAR_RELATEITEM_MAXLEN) {
    NAIVE_UI_MESSAGE.error(t('关联物品数量达到上限')); return
  }
  if (formRelateItems.value.map(item => item.val).includes(itemid)) {
    NAIVE_UI_MESSAGE.error(t('已有该物品')); return
  }
  formRelateItems.value.push({
    id: relateItemIndex.value++,
    val: itemid,
  })
}
const handleAddRelateItemStr = () => {
  const itemname = relateItemName.value
  if (formRelateItems.value.length >= _VAR_RELATEITEM_MAXLEN) {
    NAIVE_UI_MESSAGE.error(t('关联物品数量达到上限')); return
  }
  if (!itemname) {
    NAIVE_UI_MESSAGE.error(t('请输入物品名')); return
  }
  if (formRelateItems.value.map(item => item.val).includes(itemname)) {
    NAIVE_UI_MESSAGE.error(t('已有该物品')); return
  }
  formRelateItems.value.push({
    id: relateItemIndex.value++,
    val: itemname,
  })
  relateItemName.value = ''
}

const handleImportCraftActions = () => {
  if (!formCraftActionsImport.value) {
    NAIVE_UI_MESSAGE.error(t('请输入要导入的内容')); return
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
    NAIVE_UI_MESSAGE.error(t('没有识别到任何技能')); return
  }
  formCraftActions.value = importedActions.map(action => {
    return {
      id: craftActionIndex.value++,
      val: action,
    }
  })
  NAIVE_UI_MESSAGE.success(t('导入成功'))
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
      t('关联物品中的以下物品重复，将被自动去重：')
      + '\n' + diList
      + '\n' + t('要继续吗?')
    )) return
    relateItems = Array.from(new Set(relateItems))
  }

  // 处理一些属性
  if (!formData.value.name) formData.value.name = t('{id}号宏', formData.value.id)
  if (!formData.value.requirements.craftsmanship) delete formData.value.requirements.craftsmanship
  if (!formData.value.requirements.control) delete formData.value.requirements.control
  if (!formData.value.requirements.cp) delete formData.value.requirements.cp
  formData.value.relateItems = relateItems

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
        <n-tab-pane name="baseInfo" :tab="t('基本信息')">
          <div class="tabpane-wrapper">
            <div class="form-block">
              <div class="form-title">{{ t('宏名称') }}</div>
              <div class="form-input">
                <n-input
                  v-model:value="formData.name"
                  maxlength="20"
                  show-count
                  clearable
                  :placeholder="t('{id}号宏', formData.id)"
                />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('标签') }}</div>
              <div class="form-input">
                <n-dynamic-tags v-model:value="formData.tags" :max="_VAR_TAG_MAXLEN" />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('备注') }}</div>
              <div class="form-input">
                <n-input
                  v-model:value="formData.remark"
                  type="textarea"
                  maxlength="50"
                  show-count
                  :allow-input="remarkInputChecker"
                  :placeholder="t('最多{limit}行', _VAR_REMARK_MAXLINE)"
                />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('属性要求') }}</div>
              <div class="form-input">
                <n-table id="form-requirements-table" size="small" :single-line="false">
                  <thead>
                    <tr>
                      <th>{{ t('作业精度') }}</th>
                      <th>{{ t('加工精度') }}</th>
                      <th>
                        <div class="flex-center">
                          <div class="bold">{{ t('制作力') }}</div>
                          <div>
                            <HelpButton
                              icon="info"
                              :descriptions="[
                                t('不填或填0时会根据宏内容自动计算。'),
                                t('相应的，一旦填写就会覆盖掉自动计算的制作力消耗。'),
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
                          :placeholder="t('此属性填0时会自动计算')"
                        />
                      </td>
                    </tr>
                  </tbody>
                </n-table>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="relateItems" :tab="t('关联物品')">
          <div class="tabpane-wrapper">
            <div class="form-block">
              <div class="form-title">{{ t('添加物品') }}</div>
              <div class="form-tip">
                <p>{{ t('可以从HqHelper的数据库中选择物品，也可以自行输入物品名称。') }}</p>
              </div>
              <div class="form-input">
                <n-input-group style="margin-top: 2px;">
                  <n-input-group-label style="width: 25%; text-align: center;">{{ t('从数据库中选择') }}</n-input-group-label>
                  <ItemSelector :container-id="modalId" @on-item-selected="handleAddRelateItem"/>
                </n-input-group>
                <n-input-group>
                  <n-input-group-label style="width: 25%; text-align: center;">{{ t('自行输入物品名') }}</n-input-group-label>
                  <n-input v-model:value="relateItemName" />
                  <n-button type="primary" @click="handleAddRelateItemStr">
                    {{ t('添加') }}
                  </n-button>
                </n-input-group>
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('已有物品') }}</div>
              <div class="form-tip">
                <p>{{ t('关联物品可以设置最多{limit_1}个，不过宏管理页面的表格只会展示前{limit_2}个。', {
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
                        <th>{{ t('物品') }}</th>
                        <th>{{ t('管理') }}</th>
                      </tr>
                    </thead>
                    <tbody class="sort-target">
                      <tr v-for="(item, itemIndex) in formRelateItems" :key="item.id">
                        <td>
                          <n-input-group>
                            <n-input-group-label class="draggable-box" :title="t('拖动以排序')">
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
                            {{ t('删除') }}
                          </n-button>
                        </td>
                      </tr>
                      <tr v-if="!formRelateItems.length">
                        <td colspan="2">
                          <div class="flex-center">
                            <n-empty :description="t('还未设置任何关联物品')" />
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
        <n-tab-pane name="craftActions" :tab="t('宏内容')">
          <div class="tabpane-wrapper">
            <div class="form-block">
              <div class="form-title">{{ t('当前') }}</div>
              <div class="form-tip">
                <p>{{ t('可以长按下方技能按钮拖拽来自定义排序。') }}</p>
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
                  :description="t('还未设置任何宏内容')"
                />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('导入') }}</div>
              <div class="form-input flex-col gap-4">
                <div class="flex-vac gap-4">
                  <p>{{ t('导入来源：') }}</p>
                  <n-radio-group
                    v-model:value="formCraftActionsImportType"
                    name="formCraftActionsImportType"
                    size="small"
                  >
                    <n-radio
                      key="gamemacro"
                      value="gamemacro"
                      :label="t('游戏宏')"
                    />
                    <n-radio
                      key="simulator"
                      value="simulator"
                      :label="t('模拟器')"
                    />
                  </n-radio-group>
                </div>
                <div class="lh-120" style="margin-bottom: 4px;">
                  <div v-if="formCraftActionsImportType === 'gamemacro'">
                    <p>{{ t('将游戏中的生产技能宏复制粘贴到下方输入框即可。') }}</p>
                    <p>{{ t('输入框没有行数限制，组装多个宏时，粘贴完第一个宏之后换行粘贴第二个即可。') }}</p>
                    <p>{{ t('最终需要保证一行一个技能，只会识别以“/ac”、“/action”或“/技能”开头的行，技能名可以加双引号。') }}</p>
                    <p>{{ t('支持中文，英文和日文的宏，可以自由组合。') }}</p>
                  </div>
                  <div v-else-if="formCraftActionsImportType === 'simulator'">
                    <p>{{ t('在FCO模拟器或BestCraft模拟器中编辑手法后，点击“导出工序”，将工序代码粘贴到下方输入框即可。') }}</p>
                  </div>
                </div>
                <n-input
                  v-model:value="formCraftActionsImport"
                  type="textarea"
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
                  {{ t('确认') }}
                </n-button>
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('导出') }}</div>
              <div class="form-input flex-col gap-4">
                <div class="flex-vac gap-4">
                  <p>{{ t('物品语言：') }}</p>
                  <n-radio-group
                    v-model:value="formCraftActionsExportLang"
                    name="formCraftActionsExportLang"
                    size="small"
                  >
                    <n-radio key="zh" value="zh" :label="t('中文')" />
                    <n-radio key="en" value="en" :label="t('英文')" />
                    <n-radio key="ja" value="ja" :label="t('日文')" />
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
      <div class="submit-container">
        <n-button type="primary" @click="handleSave">
          <template #icon>
            <n-icon>
              <SaveOutlined />
            </n-icon>
          </template>
          {{ t('保存') }}
        </n-button>
      </div>
    </template>
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
      }
      .form-tip {
        line-height: 1.2;
      }
    }
  }
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
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>