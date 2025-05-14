<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NCheckbox, NInputGroup, NInputGroupLabel, NSelect,
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
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
  
const showModal = defineModel<boolean>('show', { required: true })

interface ModalCraftMacroEditProps {
  modalTitle: string;
}
const props = defineProps<ModalCraftMacroEditProps>()

const onLoad = () => {
}

const handleSave = async () => {
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
    <div class="wrapper" ref="wrapper">
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
  user-select: text;
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>