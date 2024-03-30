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
    style="max-width: 600px;"
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
        <n-form-item :label="t('禁用国际加速')">
          <n-popover trigger="hover" max-width="300px">
            <template #trigger>
              <n-switch v-model:value="formData.disable_xivapi_mirror" />
            </template>
            <div class="flex-column flex-center">
              <p class="font-center">{{ t('国内用户不建议打开。') }}</p>
              <p class="font-center">{{ t('不过如果图片加载特别慢，也可以试试。') }}</p>
            </div>
          </n-popover>
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