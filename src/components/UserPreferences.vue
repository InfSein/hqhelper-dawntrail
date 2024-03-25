<script setup lang="ts">
import { inject, ref } from 'vue'
import { useStore } from '@/store/index'
import { type UserConfigModel, defaultUserConfig } from '@/variables/UserConfig'

const emit = defineEmits(['close', 'afterSubmit'])

const store = useStore()
const t = inject<(i18nKey: string) => string>('t') ?? (() => { return '' })

const formData = ref<UserConfigModel>(store.state.userConfig ?? defaultUserConfig)

const handleSave = () => {
  console.log('formData', formData.value)

  const theme = formData.value.theme ?? 'system'
  const language_ui = formData.value.language_ui ?? 'zh'

  const newConfig = store.state.userConfig ?? {}
  newConfig.theme = theme
  newConfig.language_ui = language_ui
  store.commit('setUserConfig', newConfig)

  emit('afterSubmit')
}
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <n-card
    closable
    role="dialog"
    style="max-width: 600px; max-height: 60%;"
    :title="t('偏好设置')"
    @close="handleClose"
  >
    <n-form
      label-placement="left"
      label-width="auto"
    >
      <div class="items-container">
        <n-form-item :label="t('主题')">
          <n-radio-group v-model:value="formData.theme" name="theme">
            <n-radio-button value="system" :label="t('跟随系统')" />
            <n-radio-button value="light" :label="t('浅色')" />
            <n-radio-button value="dark" :label="t('深色')" />
          </n-radio-group>
        </n-form-item>
        <n-form-item :label="t('界面语言')">
          <n-radio-group v-model:value="formData.language_ui" name="language_ui">
            <n-radio-button value="zh" label="简体中文" />
            <n-radio-button value="en" label="English" />
            <n-radio-button value="ja" label="日本語" />
          </n-radio-group>
        </n-form-item>
      </div>

      <div class="submit-container">
        <n-button type="primary" @click="handleSave">{{ t('保存') }}</n-button>
      </div>
    </n-form>
  </n-card>
</template>

<style scoped>
.items-container {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: auto;
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>