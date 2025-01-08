<script setup lang="ts">
import { computed, h, inject, ref, type Component, type Ref } from 'vue'
import {
  NButton, NIcon, NMenu, 
  useMessage, 
  type MenuOption
} from 'naive-ui'
import {
  SettingsSharp,
  TravelExploreRound,
  TrendingUpRound,
  ColorLensRound,
  MemoryRound,
  UpdateRound,
  CodeSharp,
  ImportExportOutlined,
  TableViewOutlined,
  AllInclusiveSharp,
  AttachMoneyOutlined,
  // WifiRound,
  SaveOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import SettingItem from '../custom/general/SettingItem.vue'
import { useStore } from '@/store/index'
import { type UserConfigModel, fixUserConfig } from '@/models/config-user'
import { deepCopy } from '@/tools'
import type { PreferenceGroup } from '@/models'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })
const emit = defineEmits(['close', 'afterSubmit'])

// #region data
const dealSimOptions = (options: string[]) => {
  return options.map(option => {
    return {
      label: option,
      value: option
    }
  })
}
const dealDescriptions = (descriptions: string[]) => {
  return descriptions.map(description => {
    return {
      value: description,
      class: '',
      style: ''
    }
  })
}
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}
const preferenceGroups : PreferenceGroup[] = [
  {
    key: 'userConfig',
    text: t('偏好设置'),
    settings: [
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
  },
  {
    key: 'funcConfig',
    text: t('功能设置'),
    settings: [
      /* 复制宏 */
      {
        key: 'copy_macro',
        icon: CodeSharp,
        text: t('复制宏'),
        children: [
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
          }
        ]
      },
      /* 导入/导出 */
      {
        key: 'import_export',
        icon: ImportExportOutlined,
        text: t('导入/导出'),
        children: [
          {
            key: 'export_item_price',
            label: t('导出成本/收益分析'),
            descriptions: dealDescriptions([
              t('启用此项时，如果物品价格缓存已过期，则需要耗费一定时间来刷新数据。'),
            ]),
            type: 'switch'
          }
        ]
      },
      /* 制作报表 */
      {
        key: 'craft_statement',
        icon: TableViewOutlined,
        text: t('制作报表'),
        children: [
          {
            key: 'use_traditional_statement',
            label: t('使用旧版本制作报表'),
            descriptions: dealDescriptions([
              t('在2.0.10版本，我们添加了专业版制作报表，提供更详细的物品信息表格，并支持根据已准备素材计算尚需素材。'),
              t('如果你并不需要这些功能，或是更喜欢旧版本制作报表的风格，可以考虑打开此选项。'),
            ]),
            warnings: dealDescriptions([
              t('修改此选项的设置后需要刷新一次页面方可生效。')
            ]),
            type: 'switch'
          },
          {
            key: 'prostate_concise_mode',
            label: t('使用简洁模式展示物品'),
            descriptions: dealDescriptions([
              t('仅在专业版制作报表生效。')
            ]),
            type: 'switch'
          }
        ]
      },
      /* 推荐流程 */
      {
        key: 'recomm_process',
        icon: AllInclusiveSharp,
        text: t('推荐流程'),
        children: [
          {
            key: 'processes_show_item_details',
            label: t('显示物品详情'),
            type: 'switch'
          },
          {
            key: 'processes_craftable_item_sortby',
            label: t('制作物品排序规则'),
            type: 'select',
            options: [
              { value: 'itemId', label: t('物品ID') },
              { value: 'recipeOrder', label: t('制作笔记顺序') }
            ],
            descriptions: dealDescriptions([
              t('如果选择“制作笔记顺序”，将优先按照制作笔记(游戏内按N打开的制作界面)中配方的顺序排列。'),
            ])
          }
        ]
      },
      /* 物品价格 */
      {
        key: 'cost_benefit',
        icon: AttachMoneyOutlined,
        text: t('物品价格'),
        children: [
          {
            key: 'universalis_server',
            label: t('服务器'),
            descriptions: dealDescriptions([
              t('适用于“{f}”功能。', t('成本/收益预估')),
              t('下方的输入框支持通过输入关键词来检索选项。'),
            ]),
            warnings: dealDescriptions([
              t('修改此选项的设置后需要刷新一次页面方可生效。')
            ]),
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
            label: t('价格类型'),
            descriptions: [
              ...dealDescriptions([
                t('适用于“{f}”功能。', t('成本/收益预估')),
                t('计算成本时，默认计算制作材料NQ的价格；计算收益时，默认计算成品道具HQ的价格。'),
              ]),
              {
                value: t('部分选项说明：'),
                class: '',
                style: 'margin-top: 5px;'
              },
              ...dealDescriptions([
                t('近期成交价格：选取最近5条成交记录计算平均价格。'),
                t('当前寄售最低价：在交易板前10条在售记录中选取最低价格。'),
                t('当前寄售平均价：选取交易板前10条在售记录计算平均价格。'),
              ]),
            ],
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
            label: t('缓存有效期'),
            descriptions: dealDescriptions([
              t('适用于“{f}”功能。', t('成本/收益预估')),
              t('程序会将获取到的物品价格缓存。一旦超出设置的有效期，就需要重新获取价格信息。'),
              t('设定时间过短，会导致计算价格的效率降低；设置时间过长，则会导致结果过时。'),
            ]),
            type: 'select',
            options: [
              {
                value: 1 * 60 * 60 * 1000,
                label: t('{val}小时', 1)
              },
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
    ]
  }
]
const preferenceMenuOptions = computed(() : MenuOption[] => {
  return preferenceGroups.map(group => {
    return {
      type: 'group',
      key: group.key,
      label: group.text,
      children: group.settings.map(setting => {
        return {
          key: setting.key,
          label: setting.text,
          icon: renderIcon(setting.icon)
        }
      })
    }
  })
})
const currentUPSettings = computed(() => {
  return preferenceGroups[0].settings.find(setting => setting.key === currentMenuVal.value)?.children ?? []
})
const currentFPSettings = computed(() => {
  return preferenceGroups[1].settings.find(setting => setting.key === currentMenuVal.value)?.children ?? []
})
// #endregion

const currentMenuVal = ref<string>('general')
const formUserConfigData = ref<UserConfigModel>(deepCopy(fixUserConfig(store.state.userConfig)))
const formFuncConfigData = ref<FuncConfigModel>(deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig)))

const onLoad = () => {
  formUserConfigData.value = deepCopy(fixUserConfig(store.state.userConfig))
  formFuncConfigData.value = deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig))
}

const handleSave = () => {
  // * 处理偏好设置
  formUserConfigData.value.theme ??= 'system'
  formUserConfigData.value.language_ui ??= 'zh'
  formUserConfigData.value.language_item ??= 'auto'
  formUserConfigData.value.disable_workstate_cache ??= false
  if (formUserConfigData.value.disable_workstate_cache) {
    formUserConfigData.value.cache_work_state = {}
    formUserConfigData.value.fthelper_cache_work_state = {}
    formUserConfigData.value.gatherclock_cache_work_state = {}
  }
  const newUserConfig = fixUserConfig(formUserConfigData.value)
  store.commit('setUserConfig', newUserConfig)

  // * 处理功能设置
  const oldFuncConfig = deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig))
  if (formFuncConfigData.value.universalis_server !== oldFuncConfig?.universalis_server) {
    if (confirm(t('由于修改了服务器，将清除已获取的物品价格缓存。') + '\n' + t('要继续吗?'))) {
      formFuncConfigData.value.cache_item_prices = {}
    } else {
      return
    }
  }
  const newFuncConfig = fixFuncConfig(formFuncConfigData.value)
  store.commit('setFuncConfig', newFuncConfig)

  // * 确认刷新
  if (window.confirm(
    t('偏好设置已经保存，不过部分改动需要刷新页面才能生效。')
    + '\n' + t('要现在刷新吗?')
  )) {
    setTimeout(() => {
      location.reload()
    }, 100) // 必须设置一个延迟，不然有些设置不会生效
  } else {
    NAIVE_UI_MESSAGE.success(t('保存成功！部分改动需要刷新页面才能生效'))
  }

  // * 结算
  showModal.value = false
  emit('afterSubmit')
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    max-width="800px"
    :height="isMobile ? '650px' : '550px'"
    @on-load="onLoad"
  >
    <template #header>
      <div class="card-title">
        <n-icon><SettingsSharp /></n-icon>
        <span class="title">{{ t('偏好设置') }}</span>
      </div>
    </template>

    <div class="wrapper">
      <div class="menu-container">
        <n-menu
          v-model:value="currentMenuVal"
          :options="preferenceMenuOptions"
          style="overflow-y: auto;"
          :style="{ maxHeight: isMobile ? '650px' : '450px' }"
        />
      </div>
      <div class="content-container">
        <div class="items-container" :style="{ maxHeight: isMobile ? '320px' : '275px' }">
          <SettingItem
            v-for="item in currentUPSettings"
            :key="item.key"
            v-model:form-data="formUserConfigData"
            :setting-item="item"
          />
          <SettingItem
            v-for="item in currentFPSettings"
            :key="item.key"
            v-model:form-data="formFuncConfigData"
            :setting-item="item"
          />
        </div>
      </div>
    </div>

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
.wrapper {
  display: grid;
  grid-template-columns: 225px 1fr;
  gap: 10px;
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