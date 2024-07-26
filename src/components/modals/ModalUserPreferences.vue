<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NButton, NCard, NCollapse, NCollapseItem, NIcon, NModal, NPopover, NRadioButton, NRadioGroup, NSwitch, NTabs, NTabPane
} from 'naive-ui'
import { useStore } from '@/store/index'
import { type UserConfigModel, fixUserConfig } from '@/models/user-config'
import {
  HelpOutlineRound,
  SettingsSharp,
  TravelExploreRound,
  TrendingUpRound,
  MemoryRound,
  WifiRound,
  SaveOutlined
} from '@vicons/material'

const store = useStore()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })
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
  hide?: boolean
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
      {
        key: 'language_item',
        label: t('物品语言'),
        descriptions: [],
        warnings: [],
        type: 'radio-group',
        options: [
          { value: 'auto', label: t('跟随界面语言') },
          { value: 'zh', label: '简体中文' },
          { value: 'en', label: 'English' },
          { value: 'ja', label: '日本語' }
        ]
      },
    ]
  },
  /* Enhancements */
  {
    key: 'enhancements',
    icon: TrendingUpRound,
    text: t('增强'),
    children: [
      {
        key: 'disable_patchcard_autofold',
        label: t('禁用选择版本后自动折叠'),
        hide: !isMobile.value,
        descriptions: [
          {
            value: t('"选择版本"在手机端有些太占地方，而且一般也不会被高频率地修改，所以我们默认在你选择版本之后就自动折叠它。'),
            class: '',
            style: ''
          },
          {
            value: t('如果你觉得不自动折叠会更好，请打开此选项。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
        type: 'switch',
        options: []
      },
      {
        key: 'disable_jobbtn_doubleclick',
        label: t('禁用重复点击已选择的职业按钮时添加主副手'),
        descriptions: [
          {
            value: t('在选择了职业之后再度点击职业按钮，将会默认添加一套主副手武器或工具。'),
            class: '',
            style: ''
          },
          {
            value: t('这一功能在第一代HqHelper是默认关闭的，而本代默认开启。如果这与您的习惯相悖，请打开此选项。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
        type: 'switch',
        options: []
      }
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
            value: t('如果您希望每次打开应用都从头开始，或是在使用过程中出现较严重的卡顿，则可以考虑打开此选项。'),
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
  showModal.value = false
}

const currentTab = ref('general')
const formData = ref<UserConfigModel>(fixUserConfig(store.state.userConfig))

const handleSave = () => {
  const theme = formData.value.theme ?? 'system'
  const language_ui = formData.value.language_ui ?? 'zh'
  const language_item = formData.value.language_item ?? 'auto'
  const disable_workstate_cache = formData.value.disable_workstate_cache ?? false
  const disable_api_mirror = formData.value.disable_api_mirror ?? false

  if (disable_workstate_cache) {
    formData.value.cache_work_state = {}
  }

  const newConfig = fixUserConfig(store.state.userConfig)
  newConfig.theme = theme
  newConfig.language_ui = language_ui
  newConfig.language_item = language_item
  newConfig.disable_api_mirror = disable_api_mirror
  store.commit('setUserConfig', newConfig)

  emit('afterSubmit')
}
</script>

<template>
  <n-modal v-model:show="showModal">
    <n-card
      closable
      role="dialog"
      class="no-select"
      style="width: 98%; max-width: 650px;"
      :style="{ height: isMobile ? '450px' : '395px' }"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><SettingsSharp /></n-icon>
          <span class="title">{{ t('偏好设置') }}</span>
          <span class="description">[{{ getGroupName(currentTab) }}]</span>
        </div>
      </template>
      <n-tabs
        animated
        type="line"
        :placement="isMobile ? 'top' : 'left'"
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
              <span>{{ group.text }}</span>
            </div>
          </template>
          <div class="items-container" :style="{ maxHeight: isMobile ? '225px' : '220px' }">
            <div class="items" v-for="item in group.children" :key="item.key" v-show="!item.hide">
              <n-collapse arrow-placement="right">
                <n-collapse-item>
                  <template #header>
                    <div class="item-title">{{ item.label }}</div>
                  </template>
                  <template #arrow>
                    <n-icon v-if="item.descriptions.length" :title="t('点击以展开或折叠此设置项的描述')"><HelpOutlineRound /></n-icon>
                    <n-icon v-else></n-icon>
                  </template>

                  <div class="item-descriptions">
                    <p
                      v-for="(description, index) in item.descriptions"
                      :key="item.key + '-description-' + index"
                      :class="description.class"
                      :style="description.style"
                    >
                      {{ description.value }}
                    </p>
                  </div>
                </n-collapse-item>
              </n-collapse>
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
      <template #action>
        <div class="submit-container">
          <n-button type="primary" size="large" @click="handleSave">
            <template #icon>
              <n-icon><SaveOutlined /></n-icon>
            </template>
            {{ t('保存') }}
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
:deep(.n-tabs-pane-wrapper) {
  height: 100%;
  .n-tab-pane {
    height: 100%;
  }
}
:deep(.n-collapse-item__content-inner) {
  padding-top: 0 !important;
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