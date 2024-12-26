<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NButton, NIcon, NTabs, NTabPane
} from 'naive-ui'
import {
  SettingsSuggestFilled,
  CodeSharp,
  ImportExportOutlined,
  TableViewOutlined,
  AllInclusiveSharp,
  AttachMoneyOutlined,
  SaveOutlined
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import SettingItem from '../custom/general/SettingItem.vue'
import { useStore } from '@/store/index'
import { type FuncConfigKey, type FuncConfigModel, fixFuncConfig } from '@/models/config-func'
import { deepCopy } from '@/tools'
import type { SettingGroup } from '@/models'

const store = useStore()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })
interface ModalFuncPreferencesProps {
  settingGroup?: FuncConfigKey
}
const props = defineProps<ModalFuncPreferencesProps>()
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
const FuncPreferenceGroups : SettingGroup[] = [
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
const getGroupName = (key: string) => {
  for (const group of FuncPreferenceGroups) {
    if (group.key === key) {
      return group.text
    }
  }
  return ''
}
// #endregion

const currentTab = ref<FuncConfigKey>('copy_macro')
const formData = ref<FuncConfigModel>(deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig)))

const onLoad = () => {
  if (props.settingGroup) {
    currentTab.value = props.settingGroup
  }
  formData.value = deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig))
}

const handleSave = () => {
  const oldConfig = deepCopy(fixFuncConfig(store.state.funcConfig, store.state.userConfig))
  
  if (formData.value.universalis_server !== oldConfig?.universalis_server) {
    if (confirm(t('由于修改了服务器，将清除已获取的物品价格缓存。') + '\n' + t('要继续吗?'))) {
      formData.value.cache_item_prices = {}
    } else {
      return
    }
  }

  const newConfig = fixFuncConfig(formData.value)
  store.commit('setFuncConfig', newConfig)

  if (
    oldConfig?.use_traditional_statement !== newConfig.use_traditional_statement
    || oldConfig?.universalis_server !== newConfig.universalis_server
  ) {
    if (
      confirm(
        t('修改的部分设置项需要刷新页面才能生效。')
        + '\n' + t('要现在刷新吗?')
      )
    ) {
      setTimeout(() => {
        location.reload()
      }, 100) // 必须设置一个延迟，不然有些设置不会生效
    }
  }

  showModal.value = false

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
        <n-icon><SettingsSuggestFilled /></n-icon>
        <span class="title">{{ t('功能设置') }}</span>
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
        v-for="(group, index) in FuncPreferenceGroups"
        :key="index"
        :name="group.key"
      >
        <template #tab>
          <div class="tab-title">
            <n-icon v-if="group.icon" :size="isMobile ? 20 : 14"><component :is="group.icon" /></n-icon>
            <span>{{ group.text }}</span>
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