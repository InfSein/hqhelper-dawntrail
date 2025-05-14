<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NCheckbox, NDynamicTags, NInput, NInputNumber, NInputGroup, NInputGroupLabel, NSelect, NTabs, NTabPane,
  useMessage
} from 'naive-ui'
import { 
  CodeSharp, ContentCopyRound
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import GroupBox from '../templates/GroupBox.vue'
import MacroViewer from '../custom/macro/MacroViewer.vue'
import TooltipButton from '@/components/custom/general/TooltipButton.vue'
import { useStore } from '@/store'
import { type RecordedCraftMacro } from '@/models/macromanage'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const showModal = defineModel<boolean>('show', { required: true })
const macro = defineModel<RecordedCraftMacro>('macro', { required: true })

interface ModalCraftMacroEditProps {
  action: "add" | "edit";
}
const props = defineProps<ModalCraftMacroEditProps>()
const emits = defineEmits(['onSubmit'])

const onLoad = () => {
  macro.value.requirements.craftsmanship ??= 0
  macro.value.requirements.control ??= 0
  macro.value.requirements.cp ??= 0
}

const modalTitle = computed(() => {
  return props.action === 'add' ? t('添加宏') : t('编辑宏')
})

const remarkInputChecker = (value: string) => {
  return value.split('\n').length <= 3
}

const handleSave = async () => {
  // 进行校验

  // 处理一些属性
  if (!macro.value.requirements.craftsmanship) delete macro.value.requirements.craftsmanship
  if (!macro.value.requirements.control) delete macro.value.requirements.control
  if (!macro.value.requirements.cp) delete macro.value.requirements.cp

  emits('onSubmit', macro)
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
          <div class="base-info-wrapper">
            <div class="form-block">
              <div class="form-title">{{ t('宏名称') }}</div>
              <div class="form-input">
                <n-input
                  v-model:value="macro.name"
                  maxlength="20"
                  show-count
                  clearable
                  :placeholder="t('{id}号宏', macro.id)"
                />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('备注') }}</div>
              <div class="form-input">
                <n-input
                  v-model:value="macro.remark"
                  type="textarea"
                  maxlength="50"
                  show-count
                  :allow-input="remarkInputChecker"
                  :placeholder="t('最多{limit}行', 3)"
                />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('标签') }}</div>
              <div class="form-input">
                <n-dynamic-tags v-model:value="macro.tags" />
              </div>
            </div>
            <div class="form-block">
              <div class="form-title">{{ t('属性要求') }}</div>
              <div class="form-tip">
                <p>{{ t('记录此宏的属性要求。') }}</p>
                <p>{{ t('若没有填写制作力的属性要求，则会根据宏内技能自动计算。') }}</p>
              </div>
              <div class="form-input">
                <n-input-group>
                  <n-input-group-label style="width: 20%;">{{ t('作业精度') }}</n-input-group-label>
                  <n-input-number
                    v-model:value="macro.requirements.craftsmanship!"
                    :precision="0"
                    :min="0" :max="9999"
                  />
                </n-input-group>
                <n-input-group>
                  <n-input-group-label style="width: 20%;">{{ t('加工精度') }}</n-input-group-label>
                  <n-input-number
                    v-model:value="macro.requirements.control!"
                    :precision="0"
                    :min="0" :max="9999"
                  />
                </n-input-group>
                <n-input-group>
                  <n-input-group-label style="width: 20%;">{{ t('制作力') }}</n-input-group-label>
                  <n-input-number
                    v-model:value="macro.requirements.cp!"
                    :precision="0"
                    :min="0" :max="999"
                    :placeholder="t('此属性填0时会自动计算')"
                  />
                </n-input-group>
              </div>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane name="relateItems" :tab="t('关联物品')">
        </n-tab-pane>
        <n-tab-pane name="craftActions" :tab="t('宏内容')">
        </n-tab-pane>
      </n-tabs>
    </div>

    <template #action>
      <div class="submit-container">
        <TooltipButton
          type="primary"
          :icon="ContentCopyRound"
          :text="t('保存')"
          placement="bottom"
          @click="handleSave"
        />
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

  .base-info-wrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0 0.5em;

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
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>