<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { useStore } from '@/store/index'
import { type UserConfigModel, defaultUserConfig } from '@/variables/UserConfig'
import {
  SettingsSharp,
  TravelExploreRound,
  MemoryRound,
  WifiRound
} from '@vicons/material'

const store = useStore()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const modelShow = defineModel<boolean>('show')
const emit = defineEmits(['close', 'afterSubmit'])

// #region data
interface UserPreferenceGroup {
  key: string
  icon: typeof TravelExploreRound
  text: string
  children: UserPreferenceItem[]
}
interface UserPreferenceItem {
  key: string
  label: string
  descriptions: {
    value: string
    class: string
    style: string
  }[]
  warnings: {
    value: string
    class: string
    style: string
  }[]
  type: 'radio-group' | 'switch'
  options: {
    value: string
    label: string
  }[]
}
const UserPreferenceGroups : UserPreferenceGroup[] = [
  /* General */
  {
    key: 'general',
    icon: TravelExploreRound,
    text: t('通用'),
    children: [
      {
        key: 'ui_size_preset',
        label: t('UI大小'),
        descriptions: [],
        warnings: [],
        type: 'radio-group',
        options: [
          { value: '1080p', label: t('中等(1080P)') },
          { value: '2k', label: t('较大(2K/手机)') },
          { value: '4k', label: t('超大(4K)') }
        ]
      },
      {
        key: 'theme',
        label: t('主题'),
        descriptions: [],
        warnings: [],
        type: 'radio-group',
        options: [
          { value: 'system', label: t('跟随系统') },
          { value: 'light', label: t('浅色') },
          { value: 'dark', label: t('深色') }
        ]
      },
      {
        key: 'language_ui',
        label: t('界面语言'),
        descriptions: [],
        warnings: [],
        type: 'radio-group',
        options: [
          { value: 'zh', label: '简体中文' },
          { value: 'en', label: 'English' },
          { value: 'ja', label: '日本語' }
        ]
      },
    ]
  },
  /* Performance */
  {
    key: 'performance',
    icon: MemoryRound,
    text: t('性能'),
    children: [
      {
        key: 'disable_workstate_cache',
        label: t('禁用工作状态记忆'),
        descriptions: [
          {
            value: t('应用默认记录您的版本、职业和部件选择，从而让应用长期保持上次关闭时的的工作状态。'),
            class: '',
            style: ''
          },
          {
            value: t('如果您希望每次打开应用都从头开始，或是在使用过程中出现较严重的卡顿，则可以考虑禁用此项。'),
            class: '',
            style: ''
          }
        ],
        warnings: [
          {
            value: t('注意：禁用工作状态记忆后，已记录的工作状态将被立即删除！'),
            class: 'font-center red',
            style: ''
          }
        ],
        type: 'switch',
        options: []
      }
    ]
  },
  /* Network */
  {
    key: 'network',
    icon: WifiRound,
    text: t('网络'),
    children: [
      {
        key: 'disable_api_mirror',
        label: t('禁用国际加速'),
        descriptions: [],
        warnings: [
          {
            value: t('国内用户不建议打开。'),
            class: 'font-center',
            style: ''
          },
          {
            value: t('不过如果图片加载特别慢，也可以试试。'),
            class: 'font-center',
            style: ''
          }
        ],
        type: 'switch',
        options: []
      }
    ]
  }
]
const getGroupName = (key: string) => {
  for (const group of UserPreferenceGroups) {
    if (group.key === key) {
      return group.text
    }
  }
  return ''
}
// #endregion

const handleClose = () => {
  modelShow.value = false
}

const currentTab = ref('general')
const formData = ref<UserConfigModel>(store.state.userConfig ?? defaultUserConfig)

const handleSave = () => {
  console.log('formData', formData.value)

  const ui_size_preset = formData.value.ui_size_preset ?? '2k'
  const theme = formData.value.theme ?? 'system'
  const language_ui = formData.value.language_ui ?? 'zh'
  const disable_workstate_cache = formData.value.disable_workstate_cache ?? false
  const disable_api_mirror = formData.value.disable_api_mirror ?? false

  if (disable_workstate_cache) {
    formData.value.cache_work_state = {}
  }

  const newConfig = store.state.userConfig ?? {}
  newConfig.ui_size_preset = ui_size_preset
  newConfig.theme = theme
  newConfig.language_ui = language_ui
  newConfig.disable_api_mirror = disable_api_mirror
  store.commit('setUserConfig', newConfig)

  emit('afterSubmit')
}
</script>

<template>
  <n-modal v-model:show="modelShow">
    <n-card
      closable
      role="dialog"
      style="max-width: 600px; height: 375px;"
      :title="t('偏好设置')"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><SettingsSharp /></n-icon>
          <span class="title">{{ t('偏好设置') }}</span>
          <span v-if="isMobile" class="description">{{ getGroupName(currentTab) }}</span>
        </div>
      </template>
      <n-tabs
        animated
        type="line"
        placement="left"
        default-value="general"
        style="height: 100%;"
        v-model:value="currentTab"
      >
        <n-tab-pane
          v-for="(group, index) in UserPreferenceGroups"
          :key="index"
          :name="group.key"
        >
          <template #tab>
            <div class="tab-title">
              <n-icon><component :is="group.icon" /></n-icon>
              <span v-if="!isMobile">{{ group.text }}</span>
            </div>
          </template>
          <div class="items-container">
            <div class="items" v-for="item in group.children" :key="item.key">
              <div class="item-title">{{ item.label }}</div>
              <div class="item-descriptions">
                <div
                  v-for="(description, index) in item.descriptions"
                  :key="item.key + '-description-' + index"
                  :class="description.class"
                  :style="description.style"
                >
                  {{ description.value }}
                </div>
              </div>
              <div class="item-input">
                <n-popover
                  v-if="item.warnings.length"
                  trigger="hover"
                  placement="bottom"
                  :style="item.type === 'switch' ? 'max-width: 300px;' : ''"
                >
                  <template #trigger>
                    <n-switch
                      v-if="item.type ==='switch'"
                      v-model:value="(formData as any)[item.key]"
                    />
                    <n-radio-group
                      v-if="item.type === 'radio-group'"
                      v-model:value="(formData as any)[item.key]"
                      :name="item.key"
                    >
                      <n-radio-button
                        v-for="(option, index) in item.options"
                        :key="item.key + '-option-' + index"
                        :value="option.value"
                        :label="option.label"
                      />
                    </n-radio-group>
                  </template>
                  <div class="flex-column flex-center">
                    <p
                      v-for="(warning, index) in item.warnings"
                      :key="item.key + '-warning-' + index"
                      :class="warning.class"
                      :style="warning.style"
                    >
                      {{ warning.value }}
                    </p>
                  </div>
                </n-popover>
                <div v-else>
                  <n-switch
                    v-if="item.type ==='switch'"
                    v-model:value="(formData as any)[item.key]"
                  />
                  <n-radio-group
                    v-if="item.type === 'radio-group'"
                    v-model:value="(formData as any)[item.key]"
                    :name="item.key"
                  >
                    <n-radio-button
                      v-for="(option, index) in item.options"
                      :key="item.key + '-option-' + index"
                      :value="option.value"
                      :label="option.label"
                    />
                  </n-radio-group>
                </div>
              </div>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
      <template #footer>
        <div class="submit-container">
          <n-button type="primary" size="large" @click="handleSave">{{ t('保存') }}</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
:deep(.n-tab-pane) {
  height: 100%;
  overflow: auto;
}
.card-title {
  display: flex;
  align-items: center;

  .title {
    margin-left: 5px;
  }
  .description {
    align-self: end;
    margin-bottom: 2px;
  }
}
.tab-title {
  display: flex;
  align-items: center;

  .n-icon {
    margin-top: 1px;
  }
  span {
    margin-left: 1px;
  }
}
.description {
  margin-left: 10px;
  font-size: 14px;
}
.items-container {
  max-width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.items {

  .item-title {
    font-weight: bold;
  }
  .item-input {
    margin-top: 5px;
  }
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>