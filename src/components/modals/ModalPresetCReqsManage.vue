<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NButton, NIcon, NInputGroup, NInputNumber,
  useMessage
} from 'naive-ui'
import { 
  SettingsSharp,
  SaveOutlined
} from '@vicons/material'
import DraggableTable from '../custom/general/DraggableTable.vue'
import MyModal from '../templates/MyModal.vue'
import { useStore } from '@/store'
import { _VAR_PRESET_CREQ_MAXAMOUNT, type StrictCraftRequirements } from '@/models/macromanage'
import type { UserConfigModel } from '@/models/config-user'
import { deepCopy } from '@/tools'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(message: string, args?: any) => string>('t')!
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const showModal = defineModel<boolean>('show', { required: true })

const creqs = ref<StrictCraftRequirements[]>([])
const dataTable = ref<any>()

const onLoad = () => {
  creqs.value = userConfig.value.macromanage_cache_work_state.presetCReqs ?? []
}

const getDefaultCReq = () : StrictCraftRequirements => {
  return {
    craftsmanship: 0,
    control: 0,
    cp: 0,
  }
}
const handleCheck = (new_data: StrictCraftRequirements[]) => {
  if (hasDuplicate()) {
    return t('macro_manage.message.cannot_set_duplicate_creqs')
  }
  if (new_data.some(item => !item.craftsmanship && !item.control && !item.cp)) {
    return t('macro_manage.message.cannot_set_all_zero_creqs')
  }
  return ''

  function hasDuplicate() {
    const seen = new Set<string>()
    return new_data.some(item => {
      const key = `${item.craftsmanship}|${item.control}|${item.cp}`
      if (seen.has(key)) return true
      seen.add(key)
      return false
    })
  }
}
const handleSave = () => {
  if (!dataTable.value?.handleSave) {
    NAIVE_UI_MESSAGE.error('Unexpected error: dataTable not defined')
    return
  }
  const saveSuccess = dataTable.value.handleSave()
  if (!saveSuccess) {
    return
  }
  const newUserConfig = deepCopy(userConfig.value)
  newUserConfig.macromanage_cache_work_state.presetCReqs = creqs.value
  store.commit('setUserConfig', newUserConfig)
  appForceUpdate()
  showModal.value = false
  NAIVE_UI_MESSAGE.success(t('common.save_succeed'))
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="SettingsSharp"
    :title="t('macro_manage.text.preset_creqs_manage')"
    max-width="600px"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <DraggableTable
        v-model:data="creqs"
        ref="dataTable"
        can-add
        :max="_VAR_PRESET_CREQ_MAXAMOUNT"
        :max-tip="t('macro_manage.message.preset_creq_max_len', _VAR_PRESET_CREQ_MAXAMOUNT)"
        :get-default-data-row="getDefaultCReq"
        :check-rows-before-save="handleCheck"
      >
        <template #tableTitle>
          <div class="bold">{{ t('macro_manage.text.preset_creqs_manage_table_head') }}</div>
        </template>
        <template #default="{ row }">
          <n-input-group>
            <n-input-number
              v-model:value="row.craftsmanship"
              :precision="0"
              :min="0" :max="9999"
              :placeholder="t('common.craft.craftsmanship')"
            />
            <n-input-number
              v-model:value="row.control"
              :precision="0"
              :min="0" :max="9999"
              :placeholder="t('common.craft.control')"
            />
            <n-input-number
              v-model:value="row.cp"
              :precision="0"
              :min="0" :max="999"
              :placeholder="t('common.craft.cp')"
            />
          </n-input-group>
        </template>
      </DraggableTable>
      <p>{{ t('common.all_changes_effects_after_save') }}</p>
    </div>

    <template #action>
      <div class="modal-submit-container">
        <n-button type="primary" size="large" @click="handleSave">
          <template #icon>
            <n-icon><SaveOutlined /></n-icon>
          </template>
          {{ t('common.save') }}
        </n-button>
      </div>
    </template>
  </MyModal>
</template>

<style scoped>
.wrapper {
  line-height: 1.2;
}
</style>