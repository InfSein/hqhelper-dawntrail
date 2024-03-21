<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '@/store/index'
import { type UserConfigModel, defaultUserConfig } from '@/variables/UserConfig'

const emit = defineEmits(['close', 'afterSubmit'])

const store = useStore()

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
    :title="$t('ui.settings.user_preferences')"
    @close="handleClose"
  >
    <n-form
      label-placement="left"
      label-width="auto"
    >
      <n-form-item :label="$t('ui.settings.theme')">
        <n-radio-group v-model:value="formData.theme" name="theme">
          <n-radio-button value="system" :label="$t('themes.system')" />
          <n-radio-button value="light" :label="$t('themes.light')" />
          <n-radio-button value="dark" :label="$t('themes.dark')" />
        </n-radio-group>
      </n-form-item>
      <n-form-item :label="$t('ui.settings.language_ui')">
        <n-radio-group v-model:value="formData.language_ui" name="language_ui">
          <n-radio-button value="zh" label="简体中文" />
          <n-radio-button value="en" label="English" />
          <n-radio-button value="ja" label="日本語" />
        </n-radio-group>
      </n-form-item>

      <div class="submit-container">
        <n-button type="primary" @click="handleSave">{{ $t('ui.save') }}</n-button>
      </div>
    </n-form>
  </n-card>
</template>

<style scoped>
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>