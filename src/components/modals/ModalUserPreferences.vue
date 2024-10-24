<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue'
import {
  NButton, NCard, NCascader, NCollapse, NCollapseItem, NIcon, NInput, NModal, NPopover, NRadioButton, NRadioGroup, NSelect, NSwitch, NTabs, NTabPane,
  type CascaderOption
} from 'naive-ui'
import { useStore } from '@/store/index'
import { type UserConfigModel, fixUserConfig } from '@/models/user-config'
import {
  HelpOutlineRound,
  SettingsSharp,
  TravelExploreRound,
  TrendingUpRound,
  ColorLensRound,
  MemoryRound,
  UpdateRound,
  StarsRound,
  // WifiRound,
  SaveOutlined
} from '@vicons/material'
import { deepCopy } from '@/tools'

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
  type: 'radio-group' | 'switch' | 'select' | 'cascader' | 'string'
  options: CascaderOption[]
}
const dealSimOptions = (options: string[]) => {
  return options.map(option => {
    return {
      label: option,
      value: option
    }
  })
}
const UserPreferenceGroups : UserPreferenceGroup[] = [
  /* General */
  {
    key: 'general',
    icon: TravelExploreRound,
    text: t('通用'),
    children: [
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
        descriptions: [
          {
            value: t('选择程序中道具的语言。此设置还会影响一部分其他信息(例如地图名)的语言。'),
            class: '',
            style: ''
          },
          {
            value: t('如果选择“自动”，物品语言将跟随“界面语言”的设置。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
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
        descriptions: [
          {
            value: t('选择您游戏账号所属的服务器。此设置还会影响一部分统计数据(例如点数道具的兑换价格)的计算方式。'),
            class: '',
            style: ''
          },
          {
            value: t('如果选择“自动”，程序会根据您在“界面语言”的设置自动判断。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
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
        key: 'custom_font_size',
        label: t('字体大小'),
        descriptions: [
          {
            value: t('全局性地修改程序/网站的字体大小。'),
            class: '',
            style: ''
          },
          {
            value: t('部分区域的字体大小不受此设置的影响。此外，还会受到浏览器“最小字号”设置的限制。'),
            class: '',
            style: ''
          },
          {
            value: t('暂时无法保证“标准”大小之外的显示效果。除非有特殊需要，否则不建议修改。'),
            class: '',
            style: ''
          },
        ],
        warnings: [],
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
        descriptions: [
          {
            value: t('全局性地修改程序/网站的字体。'),
            class: '',
            style: ''
          },
          {
            value: t('可以设置多个字体，用英文逗号分隔。当前一个字体字库未包括要显示的文字时，程序会使用下一个字体；如果均不包括，程序会使用设置前的字体。'),
            class: '',
            style: ''
          },
          {
            value: t('字体名称出现空格时，建议用英文的单引号或双引号来将其包裹，例如"思源黑体 CN Medium"。'),
            class: '',
            style: ''
          },
          {
            value: t('如果你对CSS有所了解，可以直接参照font-family的语法来填写。'),
            class: '',
            style: ''
          }
        ],
        warnings: [
        ],
        type: 'string',
        options: []
      },
      {
        key: 'hide_collector_icons',
        label: t('隐藏物品按钮的职业图标'),
        descriptions: [
          {
            value: t('部分物品按钮会在物品名处展示该物品对应的生产/采集职业图标。'),
            class: '',
            style: ''
          },
          {
            value: t('虽然会更方便，但显示效果可能就不太尽如人意。'),
            class: '',
            style: ''
          },
          {
            value: t('如果你觉得这样太过碍眼，请考虑打开此选项。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
        type: 'switch',
        options: []
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
      },
      {
        key: 'use_traditional_statement',
        label: t('使用旧版本制作报表'),
        hide: isMobile.value,
        descriptions: [
          {
            value: t('在2.0.10版本，我们添加了专业版制作报表，提供更详细的物品信息表格，并支持根据已准备素材计算尚需素材。'),
            class: '',
            style: ''
          },
          {
            value: t('如果你并不需要这些功能，或是更喜欢旧版本制作报表的风格，可以考虑打开此选项。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
        type: 'switch',
        options: []
      },
      {
        key: 'click_to_show_pop_in_span',
        label: t('手动控制二级悬浮窗'),
        hide: isMobile.value,
        descriptions: [
          {
            value: t('在物品按钮悬浮窗内可能有一些可以打开子悬浮窗的元素，比如制作素材和地图按钮。'),
            class: '',
            style: ''
          },
          {
            value: t('在默认情况下，光标悬停在元素上时就会立即打开子悬浮窗。如果你觉得这样太容易误触，可以打开此选项，只通过左键单击来控制子悬浮窗的显示与否。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
        type: 'switch',
        options: []
      },
      {
        key: 'macro_direct_copy',
        label: t('点击“复制宏”时直接复制'),
        descriptions: [
          {
            value: t('在默认情况下，每次您点击“复制宏”按钮，程序都会弹窗询问您要复制哪种宏。'),
            class: '',
            style: ''
          },
          {
            value: t('如果您希望提升效率，可以启用此选项，让程序直接按照默认的宏前缀来复制宏。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
        type: 'switch',
        options: []
      },
      {
        key: 'macro_copy_prefix',
        label: t('默认宏前缀'),
        descriptions: [],
        warnings: [],
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
        descriptions: [],
        warnings: [],
        type: 'select',
        options: [
          { value: 'none', label: t('什么都不做') },
          { value: 'copy_name', label: t('复制物品名') },
          { value: 'copy_isearch', label: t('复制物品检索宏') },
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
  /*
  {
    key: 'network',
    icon: WifiRound,
    text: t('网络'),
    children: [
    ]
  }
  */
  /* Special Options */
  {
    key: 'special',
    icon: StarsRound,
    text: t('特殊'),
    children: [
      {
        key: 'universalis_server',
        label: t('物品价格服务器'),
        descriptions: [
          {
            value: t('适用于“{f}”功能。', t('成本/收益预估')),
            class: '',
            style: ''
          },
          {
            value: t('下方的输入框支持通过输入关键词来检索选项。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
        type: 'cascader',
        options: [
        {
            value: 'chs',
            label: '中国',
            children: [
              {
                value: '陆行鸟',
                label: '陆行鸟',
                children: dealSimOptions([
                  "红玉海","神意之地","拉诺西亚","幻影群岛","萌芽池","宇宙和音","沃仙曦染","晨曦王座"
                ])
              },
              {
                value: '莫古力',
                label: '莫古力',
                children: dealSimOptions([
                  "白银乡","白金幻象","神拳痕","潮风亭","旅人栈桥","拂晓之间","龙巢神殿","梦羽宝境"
                ])
              },
              {
                value: '猫小胖',
                label: '猫小胖',
                children: dealSimOptions([
                  "紫水栈桥","延夏","静语庄园","摩杜纳","海猫茶屋","柔风海湾","琥珀原"
                ])
              },
              {
                value: '豆豆柴',
                label: '豆豆柴',
                children: dealSimOptions([
                  "水晶塔","银泪湖","太阳海岸","伊修加德","红茶川","黄金谷","月牙湾","雪松原"
                ])
              }
            ]
          },
          {
            value: 'japan',
            label: '日本',
            children: [
              {
                value: 'Elemental',
                label: 'Elemental',
                children: dealSimOptions([
                  "Carbuncle","Kujata","Typhon","Garuda","Atomos","Tonberry","Aegis","Gungnir"
                ])
              },
              {
                value: 'Gaia',
                label: 'Gaia',
                children: dealSimOptions([
                  "Alexander","Fenrir","Ultima","Ifrit","Bahamut","Tiamat","Durandal","Ridill"
                ])
              },
              {
                value: 'Mana',
                label: 'Mana',
                children: dealSimOptions([
                  "Asura","Pandaemonium","Anima","Hades","Ixion","Titan","Chocobo","Masamune"
                ])
              },
              {
                value: 'Meteor',
                label: 'Meteor',
                children: dealSimOptions([
                  "Belias","Shinryu","Unicorn","Yojimbo","Zeromus","Valefor","Ramuh","Mandragora"
                ])
              }
            ]
          },
          {
            value: 'na',
            label: 'North-America',
            children: [
              {
                value: 'Aether',
                label: 'Aether',
                children: dealSimOptions([
                  "Jenova","Faerie","Siren","Gilgamesh","Midgardsormr","Adamantoise","Cactuar","Sargatanas"
                ])
              },
              {
                value: 'Primal',
                label: 'Primal',
                children: dealSimOptions([
                  "Famfrit","Exodus","Lamia","Leviathan","Ultros","Behemoth","Excalibur","Hyperion"
                ])
              },
              {
                value: 'Crystal',
                label: 'Crystal',
                children: dealSimOptions([
                  "Brynhildr","Mateus","Zalera","Diabolos","Coeurl","Malboro","Goblin","Balmung"
                ])
              },
              {
                value: 'Dynamis',
                label: 'Dynamis',
                children: dealSimOptions([
                  "Marilith","Seraph","Halicarnassus","Maduin","Cuchulainn","Kraken","Rafflesia","Golem"
                ])
              }
            ]
          },
          {
            value: 'eu',
            label: 'Europe',
            children: [
              {
                value: 'Chaos',
                label: 'Chaos',
                children: dealSimOptions([
                  "Omega","Moogle","Cerberus","Louisoix","Spriggan","Ragnarok","Sagittarius","Phantom"
                ])
              },
              {
                value: 'Light',
                label: 'Light',
                children: dealSimOptions([
                  "Twintania","Lich","Zodiark","Phoenix","Odin","Shiva","Alpha","Raiden"
                ])
              },
            ]
          },
          {
            value: 'ocean',
            label: 'Oceania',
            children: [
              {
                value: 'Materia',
                label: 'Materia',
                children: dealSimOptions([
                  "Ravana","Bismarck","Sephirot","Sophia","Zurvan"
                ])
              },
            ]
          },
          {
            value: 'kr',
            label: '한국',
            children: [
              {
                value: '한국',
                label: '한국',
                children: dealSimOptions([
                  "카벙클","초코보","모그리","톤베리","펜리르"
                ])
              },
            ]
          },
        ]
      },
      {
        key: 'universalis_priceType',
        label: t('物品价格类型'),
        descriptions: [
          {
            value: t('适用于“{f}”功能。', t('成本/收益预估')),
            class: '',
            style: ''
          },
          {
            value: t('计算成本时，默认计算制作材料NQ的价格；计算收益时，默认计算成品道具HQ的价格。'),
            class: '',
            style: ''
          },
          {
            value: t('部分选项说明：'),
            class: '',
            style: 'margin-top: 5px;'
          },
          {
            value: t('近期成交价格：选取最近5条成交记录计算平均价格。'),
            class: '',
            style: ''
          },
          {
            value: t('当前寄售最低价：在交易板前10条在售记录中选取最低价格。'),
            class: '',
            style: ''
          },
          {
            value: t('当前寄售平均价：选取交易板前10条在售记录计算平均价格。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
        type: 'select',
        options: [
          {
            value: 'averagePrice',
            label: t('平均价格')
          },
          {
            value: 'currentAveragePrice',
            label: t('当前平均价格')
          },
          {
            value: 'minPrice',
            label: t('最低价格')
          },
          {
            value: 'maxPrice',
            label: t('最高价格')
          },
          {
            value: 'purchasePrice',
            label: t('近期成交价格')
          },
          {
            value: 'marketLowestPrice',
            label: t('当前寄售最低价')
          },
          {
            value: 'marketPrice',
            label: t('当前寄售平均价')
          }
        ]
      },
      {
        key: 'universalis_expireTime',
        label: t('物品价格有效期'),
        descriptions: [
          {
            value: t('适用于“{f}”功能。', t('成本/收益预估')),
            class: '',
            style: ''
          },
          {
            value: t('程序会将获取到的物品价格缓存。一旦超出设置的有效期，就需要重新获取价格信息。'),
            class: '',
            style: ''
          },
          {
            value: t('设定时间过短，会导致计算价格的效率降低；设置时间过长，则会导致结果过时。'),
            class: '',
            style: ''
          }
        ],
        warnings: [],
        type: 'select',
        options: [
          {
            value: 3 * 60 * 60 * 1000,
            label: t('{val}小时', 3)
          },
          {
            value: 6 * 60 * 60 * 1000,
            label: t('{val}小时', 6)
          },
          {
            value: 24 * 60 * 60 * 1000,
            label: t('{val}小时', 24)
          },
          {
            value: 3 * 24 * 60 * 60 * 1000,
            label:t('{val}天', 3)
          },
          {
            value: 7 * 24 * 60 * 60 * 1000,
            label:t('{val}天', 7)
          },
          {
            value: 999999999999999,
            label: t('永不过期')
          }
        ]
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
          {
            value: t('我们默认在您启动应用时检查一次最新版本，并提示您进行更新。'),
            class: '',
            style: ''
          },
          {
            value: t('如果您不希望接收到更新提示，则可以考虑打开此选项。'),
            class: '',
            style: ''
          },
          {
            value: t('在使用网页端时，即使打开了这一选项，浏览器也仍会因为缓存而自动更新。'),
            class: 'color-info',
            style: ''
          }
        ],
        warnings: [],
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
const formData = ref<UserConfigModel>(deepCopy(fixUserConfig(store.state.userConfig)))

watch(showModal, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    formData.value = deepCopy(fixUserConfig(store.state.userConfig))
  }
})

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

  if (formData.value.universalis_server !== store.state.userConfig?.universalis_server) {
    if (confirm(t('由于修改了服务器，将清除已获取的物品价格缓存。') + '\n' + t('要继续吗?'))) {
      formData.value.cache_item_prices = {}
    } else {
      return
    }
  }

  const newConfig = fixUserConfig(formData.value)
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
      style="width: 98%; max-width: 700px;"
      :style="{ height: isMobile ? '550px' : '450px' }"
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
              <n-icon :size="isMobile ? 20 : 14"><component :is="group.icon" /></n-icon>
              <span v-if="!isMobile">{{ group.text }}</span>
            </div>
          </template>
          <div class="items-container" :style="{ maxHeight: isMobile ? '320px' : '275px' }">
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
                  :trigger="isMobile ? 'click' : 'hover'"
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
                    <n-select
                      v-if="item.type === 'select'"
                      v-model:value="(formData as any)[item.key]"
                      :options="item.options"
                      :style="{ width: isMobile ? '75%' : '60%' }"
                    />
                    <n-cascader
                      v-if="item.type === 'cascader'"
                      v-model:value="(formData as any)[item.key]"
                      :expand-trigger="!isMobile ? 'hover' : 'click'"
                      :options="item.options"
                      check-strategy="child"
                      show-path
                      filterable
                      :style="{ width: isMobile ? '85%' : '70%' }"
                    />
                    <n-input
                      v-if="item.type === 'string'"
                      v-model:value="(formData as any)[item.key]"
                      type="text"
                      :style="{ width: isMobile ? '85%' : '70%' }"
                    />
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
                  <n-select
                    v-if="item.type === 'select'"
                    v-model:value="(formData as any)[item.key]"
                    :options="item.options"
                    :style="{ width: isMobile ? '75%' : '60%' }"
                  />
                  <n-cascader
                    v-if="item.type === 'cascader'"
                    v-model:value="(formData as any)[item.key]"
                    :expand-trigger="!isMobile ? 'hover' : 'click'"
                    :options="item.options"
                    check-strategy="child"
                    show-path
                    filterable
                    :style="{ width: isMobile ? '85%' : '70%' }"
                  />
                  <n-input
                    v-if="item.type === 'string'"
                    v-model:value="(formData as any)[item.key]"
                    type="text"
                    :style="{ width: isMobile ? '85%' : '70%' }"
                  />
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