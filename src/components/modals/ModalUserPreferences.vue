<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NButton, NIcon, NTabs, NTabPane
} from 'naive-ui'
import {
  SettingsSharp,
  TravelExploreRound,
  TrendingUpRound,
  ColorLensRound,
  MemoryRound,
  UpdateRound,
  // WifiRound,
  SaveOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import SettingItem from '../custom/general/SettingItem.vue'
import { useStore } from '@/store/index'
import { type UserConfigKey, type UserConfigModel, fixUserConfig } from '@/models/config-user'
import { deepCopy } from '@/tools'
import type { SettingGroup } from '@/models'

const store = useStore()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })
const emit = defineEmits(['close', 'afterSubmit'])

// #region data
const dealDescriptions = (descriptions: string[]) => {
  return descriptions.map(description => {
    return {
      value: description,
      class: '',
      style: ''
    }
  })
}
const UserPreferenceGroups : SettingGroup[] = [
  /* General */
  {
    key: 'general',
    icon: TravelExploreRound,
    text: t('通用'),
    children: [
      {
        key: 'language_ui',
        label: t('界面语言'),
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
        descriptions: dealDescriptions([
          t('选择程序中道具的语言。此设置还会影响一部分其他信息(例如地图名)的语言。'),
          t('如果选择“自动”，物品语言将跟随“界面语言”的设置。'),
        ]),
        type: 'radio-group',
        options: [
          { value: 'auto', label: t('自动') },
          { value: 'zh', label: '简体中文' },
          { value: 'en', label: 'English' },
          { value: 'ja', label: '日本語' }
        ]
      },
      {
        key: 'item_server',
        label: t('服务器'),
        descriptions: dealDescriptions([
          t('选择您游戏账号所属的服务器。此设置还会影响一部分统计数据(例如点数道具的兑换价格)的计算方式。'),
          t('如果选择“自动”，程序会根据您在“界面语言”的设置自动判断。'),
        ]),
        type: 'radio-group',
        options: [
          { value: 'auto', label: t('自动') },
          { value: 'chs', label: t('国服') },
          { value: 'global', label: t('国际服') }
        ]
      },
    ]
  },
  /* Appearance */
  {
    key: 'appearance',
    icon: ColorLensRound,
    text: t('外观'),
    children: [
      {
        key: 'theme',
        label: t('主题'),
        type: 'radio-group',
        options: [
          { value: 'system', label: t('跟随系统') },
          { value: 'light', label: t('浅色') },
          { value: 'dark', label: t('深色') }
        ]
      },
      {
        key: 'custom_font_size',
        label: t('字体大小'),
        descriptions: dealDescriptions([
          t('全局性地修改程序/网站的字体大小。'),
          t('部分区域的字体大小不受此设置的影响。此外，还会受到浏览器“最小字号”设置的限制。'),
          t('暂时无法保证“标准”大小之外的显示效果。除非有特殊需要，否则不建议修改。'),
        ]),
        type: 'radio-group',
        options: [
          { value: '12px', label: t('更小') },
          { value: '13px', label: t('较小') },
          { value: '14px', label: t('标准') },
          { value: '15px', label: t('较大') },
          { value: '16px', label: t('更大') },
        ]
      },
      {
        key: 'custom_font',
        label: t('自定义字体'),
        descriptions: dealDescriptions([
          t('全局性地修改程序/网站的字体。'),
          t('可以设置多个字体，用英文逗号分隔。当前一个字体字库未包括要显示的文字时，程序会使用下一个字体；如果均不包括，程序会使用设置前的字体。'),
          t('字体名称出现空格时，建议用英文的单引号或双引号来将其包裹，例如"思源黑体 CN Medium"。'),
          t('如果你对CSS有所了解，可以直接参照font-family的语法来填写。'),
        ]),
        type: 'string'
      },
      {
        key: 'hide_collector_icons',
        label: t('隐藏物品按钮的职业图标'),
        descriptions: dealDescriptions([
          t('部分物品按钮会在物品名处展示该物品对应的生产/采集职业图标。'),
          t('虽然会更方便，但显示效果可能就不太尽如人意。'),
          t('如果你觉得这样太过碍眼，请考虑打开此选项。'),
        ]),
        type: 'switch'
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
        descriptions: dealDescriptions([
          t('"选择版本"在手机端有些太占地方，而且一般也不会被高频率地修改，所以我们默认在你选择版本之后就自动折叠它。'),
          t('如果你觉得不自动折叠会更好，请打开此选项。'),
        ]),
        type: 'switch'
      },
      {
        key: 'disable_jobbtn_doubleclick',
        label: t('禁用重复点击已选择的职业按钮时添加主副手'),
        descriptions: dealDescriptions([
          t('在选择了职业之后再度点击职业按钮，将会默认添加一套主副手武器或工具。'),
          t('这一功能在第一代HqHelper是默认关闭的，而本代默认开启。如果这与您的习惯相悖，请打开此选项。'),
        ]),
        type: 'switch'
      },
      {
        key: 'use_traditional_statement',
        label: t('使用旧版本制作报表'),
        descriptions: dealDescriptions([
          t('在2.0.10版本，我们添加了专业版制作报表，提供更详细的物品信息表格，并支持根据已准备素材计算尚需素材。'),
          t('如果你并不需要这些功能，或是更喜欢旧版本制作报表的风格，可以考虑打开此选项。'),
        ]),
        type: 'switch'
      },
      {
        key: 'click_to_show_pop_in_span',
        label: t('手动控制二级悬浮窗'),
        hide: isMobile.value,
        descriptions: dealDescriptions([
          t('在物品按钮悬浮窗内可能有一些可以打开子悬浮窗的元素，比如制作素材和地图按钮。'),
          t('在默认情况下，光标悬停在元素上时就会立即打开子悬浮窗。如果你觉得这样太容易误触，可以打开此选项，只通过左键单击来控制子悬浮窗的显示与否。'),
        ]),
        type: 'switch'
      },
      {
        key: 'macro_direct_copy',
        label: t('点击“复制宏”时直接复制'),
        descriptions: dealDescriptions([
          t('在默认情况下，每次您点击“复制宏”按钮，程序都会弹窗询问您要复制哪种宏。'),
          t('如果您希望提升效率，可以启用此选项，让程序直接按照默认的宏前缀来复制宏。'),
        ]),
        type: 'switch'
      },
      {
        key: 'macro_copy_prefix',
        label: t('默认宏前缀'),
        type: 'select',
        options: [
          { value: '', label: t('直接复制(无前缀)') },
          { value: '/e ', label: t('自提醒宏(/e)') },
          { value: '/p ', label: t('小队宏(/p)') },
          { value: '/fc ', label: t('部队宏(/fc)') },
          { value: '/b ', label: t('新频宏(/b)') },
        ]
      },
      {
        key: 'item_button_click_event',
        label: t('点击物品按钮时的行为'),
        type: 'select',
        options: [
          { value: 'none', label: t('什么都不做') },
          { value: 'copy_name', label: t('复制物品名') },
          { value: 'copy_isearch', label: t('复制物品检索宏') },
        ]
      },
      {
        key: 'item_info_icon_click_event',
        label: t('点击物品信息图标时的行为'),
        descriptions: dealDescriptions([
          t('控制点击部分区域物品名称右侧蓝色信息图标时触发的事件。'),
          t('“{option}”与此项目的设置可能会有冲突。', t('手动控制二级悬浮窗')),
        ]),
        type: 'select',
        options: [
          { value: 'none', label: t('什么都不做') },
          { value: 'copy_name', label: t('复制物品名') },
          { value: 'copy_isearch', label: t('复制物品检索宏') },
        ]
      },
      {
        key: 'item_list_style',
        label: t('材料清单格式'),
        descriptions: dealDescriptions([
          t('决定在点击材料区域物品按钮组上方的“清单”按钮后，展示的物品清单格式。'),
          t('部分程序可能可以识别并导入特定格式的清单。'),
        ]),
        type: 'select',
        options: [
          { value: 'standard', label: t('标准 (物品名称 x 数量)') },
          { value: 'tight', label: t('紧凑 (物品名称x数量)') },
          { value: 'teamcraft', label: t('Teamcraft风格 (数量x 物品名称)') },
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
        descriptions: dealDescriptions([
          t('应用默认记录您的版本、职业和部件选择，从而让应用长期保持上次关闭时的的工作状态。'),
          t('如果您希望每次打开应用都从头开始，或是在使用过程中出现较严重的卡顿，则可以考虑打开此选项。'),
        ]),
        warnings: [
          {
            value: t('注意：禁用工作状态记忆后，已记录的工作状态将被立即删除！'),
            class: 'font-center red',
            style: ''
          }
        ],
        type: 'switch'
      },
      {
        key: 'enable_dev_mode',
        label: t('启用开发者模式'),
        hide: !window.electronAPI?.openDevTools,
        type: 'switch'
      }
    ]
  },
  /* Update */
  {
    key: 'update',
    icon: UpdateRound,
    text: t('更新'),
    children: [
      {
        key: 'disable_auto_update',
        label: t('禁用自动更新'),
        descriptions: [
          ...dealDescriptions([
            t('我们默认在您启动应用时检查一次最新版本，并提示您进行更新。'),
            t('如果您不希望接收到更新提示，则可以考虑打开此选项。'),
          ]),
          {
            value: t('在使用网页端时，即使打开了这一选项，浏览器也仍会因为缓存而自动更新。'),
            class: 'color-info',
            style: ''
          }
        ],
        type: 'switch'
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

const currentTab = ref<UserConfigKey>('general')
const formData = ref<UserConfigModel>(deepCopy(fixUserConfig(store.state.userConfig)))

const onLoad = () => {
  formData.value = deepCopy(fixUserConfig(store.state.userConfig))
}

const handleSave = () => {
  formData.value.theme ??= 'system'
  formData.value.language_ui ??= 'zh'
  formData.value.language_item ??= 'auto'
  formData.value.disable_workstate_cache ??= false

  if (formData.value.disable_workstate_cache) {
    formData.value.cache_work_state = {}
    formData.value.fthelper_cache_work_state = {}
    formData.value.gatherclock_cache_work_state = {}
  }

  const newConfig = fixUserConfig(formData.value)
  store.commit('setUserConfig', newConfig)

  emit('afterSubmit')
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    max-width="700px"
    :height="isMobile ? '550px' : '450px'"
    @on-load="onLoad"
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
      :style="
        !isMobile
          ? { height: '275px' }
          : undefined
      "
      v-model:value="currentTab"
    >
      <n-tab-pane
        v-for="(group, index) in UserPreferenceGroups"
        :key="index"
        :name="group.key"
      >
        <template #tab>
          <div class="tab-title">
            <n-icon :size="isMobile ? 20 : 14"><component :is="group.icon" /></n-icon>
            <span v-if="!isMobile">{{ group.text }}</span>
          </div>
        </template>
        <div class="items-container" :style="{ maxHeight: isMobile ? '320px' : '275px' }">
          <SettingItem
            v-for="item in group.children"
            :key="item.key"
            v-model:form-data="formData"
            :setting-item="item"
          />
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
  </MyModal>
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
.submit-container {
  display: flex;
  justify-content: flex-end;
}
</style>