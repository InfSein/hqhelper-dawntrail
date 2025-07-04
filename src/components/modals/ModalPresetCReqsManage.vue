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

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
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
    return t('不能设置重复的常用属性组')
  }
  if (new_data.some(item => !item.craftsmanship && !item.control && !item.cp)) {
    return t('不能设置属性值全是0的常用属性组')
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
  NAIVE_UI_MESSAGE.success(t('保存成功'))
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="SettingsSharp"
    :title="t('管理常用属性组')"
    max-width="600px"
    @on-load="onLoad"
  >
    <div class="wrapper">
      <DraggableTable
        v-model:data="creqs"
        ref="dataTable"
        can-add
        :max="_VAR_PRESET_CREQ_MAXAMOUNT"
        :max-tip="t('最多只能添加{num}组常用属性', _VAR_PRESET_CREQ_MAXAMOUNT)"
        :get-default-data-row="getDefaultCReq"
        :check-rows-before-save="handleCheck"
      >
        <template #tableTitle>
          <div class="bold">{{ t('常用属性组 (作业/加工/CP)') }}</div>
        </template>
        <template #default="{ row }">
          <n-input-group>
            <n-input-number
              v-model:value="row.craftsmanship"
              :precision="0"
              :min="0" :max="9999"
            />
            <n-input-number
              v-model:value="row.control"
              :precision="0"
              :min="0" :max="9999"
            />
            <n-input-number
              v-model:value="row.cp"
              :precision="0"
              :min="0" :max="999"
            />
          </n-input-group>
        </template>
      </DraggableTable>
      <p>{{ t('所有修改都只在点击保存之后才会生效。') }}</p>
    </div>

    <template #action>
      <div class="modal-submit-container">
        <n-button type="primary" size="large" @click="handleSave">
          <template #icon>
            <n-icon><SaveOutlined /></n-icon>
          </template>
          {{ t('保存') }}
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