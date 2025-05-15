<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NDynamicTags, NIcon, NInput, NInputNumber, NInputGroup, NInputGroupLabel, NTable, NTabs, NTabPane,
  useMessage
} from 'naive-ui'
import { 
  CodeSharp,
  ListFilled,
  DeleteFilled,
  SaveOutlined,
} from '@vicons/material'
import { VueDraggable } from 'vue-draggable-plus'
import MyModal from '../templates/MyModal.vue'
import HelpButton from '../custom/general/HelpButton.vue'
import ItemSelector from '@/components/custom/item/ItemSelector.vue'
import ItemSpan from '../custom/item/ItemSpan.vue'
import MacroViewer from '../custom/macro/MacroViewer.vue'
import TooltipButton from '@/components/custom/general/TooltipButton.vue'
import { useStore } from '@/store'
import { getDefaultCraftMacro, type RecordedCraftMacro } from '@/models/macromanage'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import { deepCopy } from '@/tools'
import { getItemInfo } from '@/tools/item'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const showModal = defineModel<boolean>('show', { required: true })
const macro = defineModel<RecordedCraftMacro>('macro', { required: true })

const formData = ref<RecordedCraftMacro>(getDefaultCraftMacro(-1))
const relateItemName = ref('')

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
  relateItemName.value = ''
}

const modalTitle = computed(() => {
  return props.action === 'add' ? t('添加宏') : t('编辑宏')
})

const remarkInputChecker = (value: string) => {
  return value.split('\n').length <= 3
}

const handleAddRelateItem = (itemid: number) => {
  if (!itemid) return
  if (formData.value.relateItems.includes(itemid)) {
    NAIVE_UI_MESSAGE.error(t('已有该物品')); return
  }
  formData.value.relateItems.push(itemid)
}
const handleAddRelateItemStr = () => {
  const itemname = relateItemName.value
  if (!itemname) {
    NAIVE_UI_MESSAGE.error(t('请输入物品名')); return
  }
  if (formData.value.relateItems.includes(itemname)) {
    NAIVE_UI_MESSAGE.error(t('已有该物品')); return
  }
  formData.value.relateItems.push(itemname)
  relateItemName.value = ''
}

const handleSave = async () => {
  // 进行校验

  // 处理一些属性
  if (!formData.value.requirements.craftsmanship) delete formData.value.requirements.craftsmanship
  if (!formData.value.requirements.control) delete formData.value.requirements.control
  if (!formData.value.requirements.cp) delete formData.value.requirements.cp

  emits('onSubmit', formData.value)
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
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
                <n-dynamic-tags v-model:value="formData.tags" :max="5" />
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
                  :placeholder="t('最多{limit}行', 3)"
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
                          <p class="bold">{{ t('制作力') }}</p>
                          <HelpButton
                            icon="info"
                            :descriptions="[
                              t('不填或填0时会根据宏内容自动计算。'),
                              t('相应的，一旦填写就会覆盖掉自动计算的制作力消耗。'),
                            ]"
                          />
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
                  <ItemSelector
                    @on-item-selected="handleAddRelateItem"
                  />
                </n-input-group>
                <n-input-group>
                  <n-input-group-label style="width: 25%; text-align: center;">{{ t('自行输入物品名') }}</n-input-group-label>
                  <n-input
                    v-model:value="relateItemName"
                  />
                  <n-button type="primary" @click="handleAddRelateItemStr">
                    {{ t('添加') }}
                  </n-button>
                </n-input-group>
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('已有物品') }}</div>
              <div class="form-tip">
                <p>{{ t('在下方表格查看已有的关联物品，还可以进行排序、重命名、删除等管理操作。') }}</p>
                <p>{{ t('只有自行输入的物品可以重命名。') }}</p>
                <p>{{ t('可以最多添加{limit_1}个关联物品，不过由于空间限制，宏管理页面的表格只会展示前{limit_2}个。', {
                  limit_1: 99, limit_2: 3
                }) }}</p>
              </div>
              <div class="form-input">
                <VueDraggable
                  v-model="formData.relateItems"
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
                      <tr v-for="(item, itemIndex) in formData.relateItems" :key="itemIndex">
                        <td>
                          <n-input-group>
                            <n-input-group-label class="draggable-box" :title="t('拖动以排序')">
                              <n-icon :size="18"><ListFilled /></n-icon>
                            </n-input-group-label>
                            <n-button
                              v-if="typeof item === 'number'"
                            >
                              <ItemSpan :item-info="getItemInfo(item)" />
                            </n-button>
                            <n-input
                              v-else
                              type="text"
                              v-model:value="(formData.relateItems[itemIndex] as string)"
                            />
                          </n-input-group>
                        </td>
                        <td>
                          <n-button ghost type="error" size="small" @click="() => formData.relateItems.splice(itemIndex, 1)">
                            <template #icon>
                              <n-icon><DeleteFilled /></n-icon>
                            </template>
                            {{ t('删除') }}
                          </n-button>
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
    width: 60%;
  }
  th:nth-child(2), td:nth-child(2) {
    width: 15%;
    text-align: center;
  }

  .draggable-box {
    display: flex;
    align-items: center;
    cursor: move;
  }
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>