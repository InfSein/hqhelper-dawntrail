<script lang="ts" setup>
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NDivider, NIcon, NPopover,
  useMessage
} from 'naive-ui'
import {
  OpenInNewFilled,
  RefreshOutlined
} from '@vicons/material'
import ItemSpan from './ItemSpan.vue'
import ItemRemark from './ItemRemark.vue'
import XivFARImage from '../general/XivFARImage.vue'
import LocationSpan from '../map/LocationSpan.vue'
import {
  XivItemRemarks,
  XivJobs, type XivJob,
  XivAttributes
} from '@/assets/data'
import { useStore } from '@/store'
import { getItemInfo, getItemPriceInfo, type ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel, type ItemPriceType } from '@/models/config-func'
import type EorzeaTime from '@/tools/eorzea-time'
import UseConfig from '@/tools/use-config'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!
const currentET = inject<Ref<EorzeaTime>>('currentET')!
// const appMode = inject<Ref<"overlay" | "" | undefined>>('appMode') ?? ref('')

const {
  uiLanguage, itemLanguage, itemServer,
} = UseConfig(userConfig, funcConfig)

interface ItemPopProps {
  /** 道具信息 */
  itemInfo: ItemInfo

  /** 悬浮窗使用自定义宽度 */
  popUseCustomWidth?: boolean;
  /** 悬浮窗的自定义宽度，必须同时设置`popUseCustomWidth`才能生效 */
  popCustomWidth?: number;
  /** 悬浮窗的最大宽度 */
  popMaxWidth?: string;
  /** 手动指定悬浮窗的触发方式 */
  popTrigger?: 'hover' | 'click' | 'manual'

  /** 是否禁用物品信息提示框(可选,默认false) */
  disablePop?: boolean;

  /** 物品按钮所处容器的ID，在模态框等场景时必须传递，否则无法正常复制物品名 */
  containerId?: string
}
const props = defineProps<ItemPopProps>()

const getJobName = (jobInfo: XivJob) => {
  switch (uiLanguage.value) {
    case 'ja':
      return jobInfo?.job_name_ja || t('common.unknown')
    case 'en':
      return jobInfo?.job_name_en || t('common.unknown')
    case 'zh':
    default:
      return jobInfo?.job_name_zh || t('common.unknown')
  }
}

const getItemName = () => {
  switch (itemLanguage.value) {
    case 'zh':
      return props.itemInfo.name_zh || '未翻译的物品'
    default:
      return props.itemInfo[`name_${itemLanguage.value}`]
  }
}
/** 获取物品副名称(即其他语言的名称) */
const getItemSubName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.itemInfo.name_en
    case 'en':
      return props.itemInfo.name_ja
    case 'zh':
    default:
      return props.itemInfo.name_ja + ' / ' + props.itemInfo.name_en
  }
}
const getItemDescriptions = () => {
  let description = ''
  switch (itemLanguage.value) {
    case 'ja':
      description = props.itemInfo.descJA; break
    case 'en':
      description = props.itemInfo.descEN; break
    case 'zh':
    default:
      description = props.itemInfo.descZH
  }

  // * 处理特殊字符(好像只有E端有)
  // 处理颜色字符
  description = description.replace(/\{\{color\|id=(\d+)\|([^}]+)\}\}/g, (match, id, text) => {
    let color = ''
    if (id == 504) color = 'orange'

    if (color) {
      return `<span style="color: ${color}">${text}</span>`
    } else {
      return text
    }
  })
  // 处理斜体
  description = description.replace(/\{\{Italic\|([^}]*)\}\}/g, '<span class="italic">$1</span>')

  const descs = description.split('<br>')
  return `<p>${descs.join('</p><p>')}</p>`
}
const getItemTypeName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.itemInfo.uiTypeNameJA
    case 'en':
      return props.itemInfo.uiTypeNameEN
    case 'zh':
    default:
      return props.itemInfo.uiTypeNameZH
  }
}
const getAttrName = (attrId: number) => {
  const attr = XivAttributes[attrId]
  if (!attr) {
    return t('common.unknown')
  }
  return attr[`name_${uiLanguage.value}`]
}
const getPlaceName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.itemInfo.gatherInfo?.placeNameJA
    case 'en':
      return props.itemInfo.gatherInfo?.placeNameEN
    case 'zh':
    default:
      return props.itemInfo.gatherInfo?.placeNameZH
  }
}
const itemHasHQ = computed(() => {
  if (props.itemInfo.tempAttrsProvided?.length) {
    return props.itemInfo.tempAttrsProvided.every(subArr => subArr.length >= 5)
  } else {
    return props.itemInfo.attrsProvided.every(subArr => subArr[2] > 0)
  }
})
const itemCraftRequires = computed(() => {
  const requires : {
    id: number;
    count: number;
  }[] = []
  if (userConfig.value.item_pop_craft_show_crystals) {
    requires.push(...props.itemInfo.craftRequireCrystals)
  }
  requires.push(...props.itemInfo.craftRequires)
  return requires
})
const itemTailDescriptions = computed(() => {
  const descriptions : string[] = []
  if (itemLanguage.value === 'zh') {
    if (props.itemInfo.usedZHTemp) {
      descriptions.push(t('item.text.zh_name_is_temp'))
    } else if (props.itemInfo.chsOffline) {
      descriptions.push(t('item.text.not_installed_in_chs'))
    }
  }
  return descriptions
})
const itemTradeCost = computed(() => {
  return itemServer.value === 'chs' ? props.itemInfo.tradeInfo?.costCHS : props.itemInfo.tradeInfo?.costGlobal
})
const timeCanGather = (timeLimit: {start: string, end: string}) => {
  try {
    const parseTime = (time: string) => time.split(':').reduce((acc, val, idx) => acc + parseInt(val) * [60, 1][idx], 0)
    const s = parseTime(timeLimit.start)
    const e = parseTime(timeLimit.end)
    const c = currentET.value.hour * 60 + currentET.value.minute
    if (c >= s && c <= e) {
      return t('item.text.timelimited_gatherable')
    }
  } catch (err) {
    console.error(err)
  }
  return ''
}

const openInMomola = () => {
  window.open(`https://fish.ffmomola.com/#/wiki?fishId=${props.itemInfo.id}`)
}
const openInAngler = () => {
  let lang : string = itemLanguage.value
  switch (lang) {
    case 'zh': lang = 'cn'; break
    case 'ja': lang = 'jp'; break
  }
  let name = getItemName()
  if (props.itemInfo.chsOffline) {
    lang = 'en'
    name = props.itemInfo.name_en
  }
  const domain = `https://${lang}.ff14angler.com/`
  window.open(`${domain}?search=${name}`)
}

const openInBestCraft = () => {
  window.open(`https://tnze.yyyy.games/#/recipe?recipeId=${props.itemInfo?.craftInfo?.recipeId}`)
}

const itemPriceInfo = computed(() => {
  const priceInfo = funcConfig.value.cache_item_prices[props.itemInfo.id]
  const havePrice = !!priceInfo

  // 计算上次更新时间
  let lastUpdate = t('common.never'); let priceExpired = false
  if (priceInfo) {
    const lastUpdateTS = priceInfo.updateTime
    const diff = Math.floor((Date.now() - lastUpdateTS) / 1000)
    if (diff < 60) {
      lastUpdate = t('common.just_now')
    } else if (diff < 3600) {
      lastUpdate = t('common.val_minutes_ago', Math.floor(diff / 60))
    } else if (diff < 86400) {
      lastUpdate = t('common.val_hours_ago', Math.floor(diff / 3600))
    } else {
      lastUpdate = t('common.val_days_ago', Math.floor(diff / 86400))
    }
    priceExpired = (Date.now() - lastUpdateTS) > funcConfig.value.universalis_expireTime
  }

  // 组装各个类型的价格
  const prices = funcConfig.value.universalis_poppricetypes.map(priceType => {
    const priceNq = Math.floor(priceInfo?.[`${priceType}NQ`] ?? 0) || '???'
    const priceHq = Math.floor(priceInfo?.[`${priceType}HQ`] ?? 0) || '???'
    const tooltipForNoPrice = t('item.price.no_price') + '\n' + t('item.price.no_price_reason')
    const styleForNoPrice = 'cursor: help; text-decoration: underline dashed gray;'
    let tipNq = '', tipHq = '', styleNq = '', styleHq = ''
    if (priceNq === '???') {
      tipNq = tooltipForNoPrice; styleNq = styleForNoPrice
    }
    if (priceHq === '???') {
      tipHq = tooltipForNoPrice; styleHq = styleForNoPrice
    }
    return {
      name: getPriceTypeName(priceType),
      priceNq, tipNq, styleNq,
      priceHq, tipHq, styleHq
    }
    function getPriceTypeName(ptype: ItemPriceType) {
      switch (ptype) {
        case 'averagePrice': return t('preference.universalis_price_type.option.average')
        case 'currentAveragePrice': return t('preference.universalis_price_type.option.curr_average')
        case 'minPrice': return t('preference.universalis_price_type.option.min')
        case 'maxPrice': return t('preference.universalis_price_type.option.max')
        case 'purchasePrice': return t('preference.universalis_price_type.option.purchase_average.title')
        case 'marketLowestPrice': return t('preference.universalis_price_type.option.market_min.title')
        case 'marketPrice': return t('preference.universalis_price_type.option.market_average.title')
        default: return t('common.unknown')
      }
    }
  })

  return {
    havePrice, lastUpdate, priceExpired, prices
  }
})
const refreshingItemPrice = ref(false)
const refreshItemPrice = async () => {
  if (refreshingItemPrice.value) {
    NAIVE_UI_MESSAGE.info(t('item.price.refreshing'))
    return
  }
  refreshingItemPrice.value = true
  try {
    const itemPrices = await getItemPriceInfo(props.itemInfo.id, funcConfig.value.universalis_server)
    const newConfig = funcConfig.value
    Object.keys(itemPrices).forEach(id => {
      const itemID = Number(id)
      newConfig.cache_item_prices[itemID] = itemPrices[itemID]
    })
    await store.commit('setFuncConfig', fixFuncConfig(newConfig, store.state.userConfig))
    funcConfig.value = newConfig
    NAIVE_UI_MESSAGE.success(t('item.price.update_succeed'))
  } catch (err: any) {
    const errMsg = t('item.price.update_failed') + '\n' + err.message
    console.error(errMsg, '\n', err)
    NAIVE_UI_MESSAGE.error(errMsg)
  }
  refreshingItemPrice.value = false
}

const innerPopTrigger = computed(() => {
  if (!isMobile.value && userConfig.value.click_to_show_pop_in_span) {
    return 'click'
  } else {
    return undefined
  }
})
</script>

<template>
  <n-popover
    v-if="itemInfo.id && !disablePop"
    :trigger="popTrigger || (isMobile ? 'click' : 'hover')"
    :placement="isMobile ? 'bottom' : 'right-start'"
    :width="popUseCustomWidth ? popCustomWidth : (isMobile ? 'trigger' : undefined)"
    :style="{ maxWidth: popMaxWidth ?? (isMobile ? 'unset' : '290px') }"
  >
    <template #trigger>
      <slot />
    </template>
    <div class="item-popover">
      <div class="base-info">
        <XivFARImage
          class="item-icon"
          :src="itemInfo.iconUrl"
          :size="35"
        />
        <div class="item-names">
          <div class="main">
            <span>{{ getItemName() }}</span>
            <span class="extra-name" v-if="itemLanguage === 'zh' && itemInfo.usedZHTemp">
              {{ t('common.temp_trans') }}
            </span>
          </div>
          <div class="sub">{{ getItemSubName() }}</div>
        </div>
      </div>
      <div class="item-level">{{ t('item.text.item_level_with_val', itemInfo.itemLevel) }}</div>
      <n-divider class="item-divider" />
      <div class="item-descriptions">
        <div class="item-attributes">
          <div class="item-type">
            <XivFARImage
              class="item-icon"
              :src="itemInfo.uiTypeIconUrl"
              :size="14"
            />
            <p>{{ getItemTypeName() }}</p>
          </div>
          <p>{{ t('item.text.basic_info', { patch: itemInfo.patch, id: itemInfo.id }) }}</p>
        </div>
        <div class="main-descriptions" v-html="getItemDescriptions()"></div>
        <div class="description-block" v-if="itemInfo.attrsProvided.length">
          <div class="title">{{ t('common.armor_attr') }}</div>
          <n-divider class="item-divider" />
          <div class="content armor" v-if="itemHasHQ">
            <div
              class="item"
              v-for="(attr, index) in itemInfo.attrsProvided"
              :key="'attr-hq' + index"
            >
              <div>{{ `${getAttrName(attr[0])} +${attr[2]}` }}</div>
            </div>
          </div>
          <div class="content" v-else>
            <div
              class="item"
              v-for="(attr, index) in itemInfo.attrsProvided"
              :key="'attr-nq' + index"
            >
              <div>{{ `${getAttrName(attr[0])} +${attr[1]}` }}</div>
            </div>
          </div>
          <div class="content extra">
            {{ t('item.text.attribute_isnq_or_hq_desc', itemHasHQ ? 'HQ' : 'NQ') }}
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.tempAttrsProvided.length">
          <div class="title">{{ t('common.effect') }}</div>
          <n-divider class="item-divider" />
          <div class="content" v-if="itemHasHQ">
            <div
              class="item"
              v-for="(attr, index) in itemInfo.tempAttrsProvided"
              :key="'temp-attr-hq' + index"
            >
              <div>{{ `${getAttrName(attr[0])} +${attr[4]}% ${t('common.quoted_maximum', attr[5])}` }}</div>
            </div>
          </div>
          <div class="content" v-else>
            <div
              class="item"
              v-for="(attr, index) in itemInfo.tempAttrsProvided"
              :key="'temp-attr-nq' + index"
            >
              <div>{{ `${getAttrName(attr[0])} +${attr[2]}% ${t('common.quoted_maximum', attr[3])}` }}</div>
            </div>
          </div>
          <div class="content extra">
            {{ t('item.text.attribute_isnq_or_hq_desc', itemHasHQ ? 'HQ' : 'NQ') }}
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.canReduceFrom?.length || itemInfo.canReduceTo">
          <div class="title">{{ t('common.reduce') }}</div>
          <n-divider class="item-divider" />
          <div class="content" v-if="itemInfo.canReduceFrom?.length">
            <div>{{ t('item.text.reduce_info') }}</div>
            <div class="item" v-for="(reduce, reduceIndex) in itemInfo.canReduceFrom" :key="'reduce-' + reduceIndex">
              <ItemSpan :item-info="getItemInfo(reduce)" :container-id="containerId" />
            </div>
          </div>
          <div class="content" v-else-if="itemInfo.canReduceTo">
            <div>{{ t('item.text.reduce_can_get') }}</div>
            <div class="item">
              <ItemSpan :item-info="getItemInfo(itemInfo.canReduceTo)" :container-id="containerId" hide-pop-icon />
            </div>
          </div>
        </div>
        <div class="description-block" v-if="uiLanguage === 'zh' && XivItemRemarks[itemInfo.id]?.length">
          <div class="title">笔记</div>
          <n-divider class="item-divider" />
          <div class="content">
            <ItemRemark
              :remarks="XivItemRemarks[itemInfo.id]"
              style="line-height: 1.2;"
              :pop-trigger="innerPopTrigger"
            />
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.gatherInfo || itemInfo.isFishingItem">
          <div class="title">
            {{ t('common.gather') }}
            <div v-if="itemInfo.gatherInfo" class="extra">
              <XivFARImage
                class="icon"
                :src="XivJobs[itemInfo.gatherInfo.jobId].job_icon_url"
              />
              <p>{{ getJobName(XivJobs[itemInfo.gatherInfo.jobId]) }}</p>
            </div>
            <div v-if="itemInfo.isFishingItem" class="extra">
              <XivFARImage
                class="icon"
                :src="XivJobs[18].job_icon_url"
              />
              <p>{{ getJobName(XivJobs[18]) }}</p>
            </div>
            <div v-if="itemInfo.gatherInfo?.[`gntype_${uiLanguage}`]" class="extra">
              {{ ' - ' }}
              {{ itemInfo.gatherInfo[`gntype_${uiLanguage}`] }}
            </div>
          </div>
          <n-divider class="item-divider" />
          <div class="content" v-if="itemInfo.gatherInfo">
            <div>{{ t('item.text.gather_pos_info') }}</div>
            <div class="item">
              <LocationSpan
                :place-id="itemInfo.gatherInfo.placeID"
                :place-name="getPlaceName()"
                :coordinate-x="itemInfo.gatherInfo.posX"
                :coordinate-y="itemInfo.gatherInfo.posY"
                :pop-trigger="innerPopTrigger"
              />
            </div>
            <div class="other-attrs" v-if="itemInfo.gatherInfo.recommAetheryte" style="margin-left: 1em;">
              ※ 
              {{ t('map.text.recomm_aetheryte') + ' - ' }}
              {{ itemInfo.gatherInfo.recommAetheryte?.[`name_${itemLanguage}`] }}
            </div>
          </div>
          <div class="content" v-if="itemInfo.gatherInfo?.timeLimitInfo?.length">
            <div>{{ t('item.text.gather_time_info') }}</div>
            <div
              class="item"
              v-for="(timeLimit, timeLimitIndex) in itemInfo.gatherInfo?.timeLimitInfo"
              :key="'time-limit-' + timeLimitIndex"
            >
              <div>{{ timeLimit.start }} ~ {{ timeLimit.end }}</div>
              <div class="green">{{ timeCanGather(timeLimit) }}</div>
            </div>
          </div>
          <div class="content" v-if="itemInfo.gatherInfo?.folkloreId">
            <div>{{ t('item.text.gather_condi') }}</div>
            <div class="item small-font" v-if="itemInfo.gatherInfo?.folkloreId">
              {{ t('item.text.need_learn') }}
              <ItemSpan span-max-width="180px" :img-size="12" :item-info="getItemInfo(itemInfo.gatherInfo.folkloreId)" :container-id="containerId" />
            </div>
          </div>
          <div class="content" v-if="itemInfo.isFishingItem">
            <div>{{ t('item.text.gather_website.intro') }}</div>
            <div class="item actions">
              <n-button size="small" @click="openInAngler">
                <template #icon>
                  <n-icon><OpenInNewFilled /></n-icon>
                </template>
                {{ t('common.open_in.angler_search') }}
              </n-button>
              <n-button v-show="false" size="small" @click="openInMomola">
                <template #icon>
                  <n-icon><OpenInNewFilled /></n-icon>
                </template>
                {{ t('common.open_in.ffmomola') }}
              </n-button>
            </div>
          </div>
          <div v-show="false" class="content extra" v-if="itemInfo.isFishingItem">
            {{ t('item.text.gather_website.note') }}
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.tradeInfo && itemTradeCost">
          <div class="title">{{ t('common.trade') }}</div>
          <n-divider class="item-divider" />
          <div class="content">
            <div>{{ t('item.text.is_tradable') }}</div>
            <div class="item">
              <ItemSpan span-max-width="230px" :item-info="getItemInfo(itemTradeCost.costId)" :amount="itemTradeCost.costCount" show-amount :container-id="containerId" />
            </div>
            <div class="item" v-if="itemInfo.tradeInfo.receiveCount > 1">
              {{ t('item.text.multi_get_each_trade', itemInfo.tradeInfo.receiveCount) }}
            </div>
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.craftRequires.length">
          <div class="title">
            {{ t('common.craft.title') }}
            <div class="extra">
              <XivFARImage
                class="icon"
                :src="XivJobs[itemInfo.craftInfo?.jobId].job_icon_url"
              />
              <p>
                {{ t('item.text.recipe_level_info', {
                  lv: itemInfo.craftInfo?.craftLevel,
                  star: '★'.repeat(itemInfo.craftInfo?.starCount || 0),
                  job: getJobName(XivJobs[itemInfo.craftInfo?.jobId])
                }) }}
              </p>
            </div>
          </div>
          <n-divider class="item-divider" />
          <div class="content">
            <div class="other-attrs">
              {{ t('item.text.recipe_detail', {
                dur: itemInfo.craftInfo?.durability,
                pro: itemInfo.craftInfo?.progress,
                qua: itemInfo.craftInfo?.quality
              }) }}
              <a
                v-if="itemInfo?.craftInfo?.recipeId"
                style="padding: 0; display: flex; align-items: center; line-height: 1.2; cursor: pointer;"
                :title="t('item.text.simulate_craft_bestcraft')"
                @click="openInBestCraft"
              >
                <n-icon :size="12"><OpenInNewFilled /></n-icon>
                {{ t('common.simulate_craft') }}
              </a>
            </div>
            <div
              class="item"
              v-for="(item, index) in itemCraftRequires"
              :key="'recipe-' + index"
            >
              <ItemSpan :item-info="getItemInfo(item.id)" :amount="item.count" show-amount :container-id="containerId" />
            </div>
            <div class="other-attrs" v-if="(itemInfo.craftInfo?.yields || 1) > 1">
              {{ t('item.text.yields_info', itemInfo.craftInfo?.yields) }}
            </div>
            <div v-if="itemInfo.craftInfo?.thresholds?.craftsmanship && itemInfo.craftInfo?.thresholds?.control">
              <div>{{ t('item.text.craft_condi') }}</div>
              <div class="item small-font">
                <div v-if="itemInfo.craftInfo?.thresholds?.craftsmanship">
                  {{ t('item.text.craftsmanship_with_val', itemInfo.craftInfo?.thresholds?.craftsmanship) }}
                </div>
                <div v-if="itemInfo.craftInfo?.thresholds?.control">
                  {{ t('item.text.control_with_val', itemInfo.craftInfo?.thresholds?.control) }}
                </div>
              </div>
              <div class="item small-font" v-if="itemInfo.craftInfo?.masterRecipeId">
                {{ t('item.text.need_learn') }}
                <ItemSpan span-max-width="180px" :img-size="12" :item-info="getItemInfo(itemInfo.craftInfo.masterRecipeId)" :container-id="containerId" />
              </div>
            </div>
            <div class="other-attrs">
              <div v-if="!itemInfo.craftInfo?.qsable" class="red">{{ t('item.text.cannot_quick_synthesis') }}</div>
              <div v-if="!itemInfo.craftInfo?.hqable" class="red">{{ t('item.text.cannot_hq') }}</div>
            </div>
          </div>
        </div>
        <div class="description-block" v-if="funcConfig.universalis_showpriceinpop && itemInfo.tradable">
          <div class="title">
            {{ t('common.price') }}
            <div class="extra flex">
              <div>
                {{ t('common.last_update_with_val', itemPriceInfo.lastUpdate) }}
              </div>
              <div v-if="itemPriceInfo.priceExpired" class="red">
                ({{ t('common.expired') }})
              </div>
              <a
                :disabled="refreshingItemPrice"
                style="padding: 0; margin-left: 3px; display: flex; line-height: 1;"
                :style="refreshingItemPrice ? 'cursor: not-allowed; color: gray;' : 'cursor: pointer;'"
                @click="refreshItemPrice"
              >
                <n-icon :size="12"><RefreshOutlined /></n-icon>
                {{ refreshingItemPrice ? t('common.refreshing') : t('common.refresh') }}
              </a>
            </div>
          </div>
          <n-divider class="item-divider" />
          <div class="content">
            <div v-if="itemPriceInfo.prices.length" class="content-item-prices">
              <div></div>
              <div class="font-center">[NQ]</div>
              <div v-if="itemInfo.hqable" class="font-center">[HQ]</div>
              <div v-else />
              <template
                v-for="(price, index) in itemPriceInfo.prices"
                :key="'price-' + index"
              >
                <div>{{ price.name }}</div>
                <div class="font-center" :style="price.styleNq" :title="price.tipNq">{{ price.priceNq }}</div>
                <div v-if="itemInfo.hqable" class="font-center" :style="price.styleHq" :title="price.tipHq">{{ price.priceHq }}</div>
                <div v-else />
              </template>
            </div>
            <div v-else style="text-indent: 1em;">
              {{ t('item.price.no_show_price_type_setted', t('preference.universalis_poppricetypes.title')) }}
            </div>
          </div>
        </div>
        <slot name="extra-descriptions" />
        <div class="tail-descriptions">
          <p v-for="(desc, index) in itemTailDescriptions" :key="'tail-descriptions' + index">
            {{ t('common.note_x', itemTailDescriptions.length === 1 ? '' : index + 1) }}{{ desc }}
          </p>
        </div>
      </div>
      <!-- <n-flex v-show="false" class="item-actions">
        <n-button size="small" @click="openInHuijiWiki()">
          {{ t('common.open_in.huijiwiki') }}
        </n-button>
        <n-button size="small" @click="openInGarland()">
          {{ t('common.open_in.garland') }}
        </n-button>
        <slot name="extra-actions" />
      </n-flex> -->
    </div>
  </n-popover>
  <slot v-else />
</template>

<style scoped>
.small-font {
  font-size: calc(var(--n-font-size) - 2px);
}
.item-popover {
  user-select: text;
  
  .base-info {
    display: flex;
    align-items: flex-start;
    gap: 5px;
    margin-top: 2%;

    .item-names {
      .main span {
        line-height: 1;
        font-size: calc(var(--n-font-size) + 2px);
      }
      .sub,
      .main span.extra-name {
        line-height: 1;
        font-size: calc(var(--n-font-size) - 2px);
      }
    }
  }
  .item-level {
    line-height: 1.2;
    margin-top: 3px;
  }
  .item-divider {
    margin: 0 2px;
  }
  .item-descriptions {
    display: flex;
    flex-direction: column;
    gap: 3px;

    .item-attributes {
      display: flex;
      align-items: center;
      gap: 3px;
      line-height: 1.2;
      flex-wrap: wrap;

      .item-type {
        display: flex;
        align-items: center;
        gap: 1px;
      }
      .item-type::before { content: "["; }
      .item-type::after { content: "]"; }
    }
    .main-descriptions {
      text-indent: 1em;
      line-height: 1.2;
    }
    .temp-attr-descriptions {
      line-height: 1.2;

      .title {
        margin-top: 2px;
      }
      .content {
        margin-left: 1em;
      }
      .content .block p::before {
        content: "· ";
      }
      .extra {
        font-size: calc(var(--n-font-size) - 2px);
        margin: 2px 0 5px 0;
      }
    }
    .description-block {
      line-height: 1.2;

      .title {
        font-weight: bold;
        display: flex;
        align-items: baseline;
        --size-small: calc(var(--n-font-size) - 2px);
        --textgap-left: calc(var(--n-font-size) - 1px);

        .extra {
          margin-left: 3px;
          font-weight: normal;
          font-size: var(--size-small);
          line-height: 1;

          img {
            float: left;
            height: var(--size-small);
            display: block;
          }
          p {
            font-size: var(--size-small);
            padding-left: var(--textgap-left);
          }
        }
        .extra::after {
          content: '';
          clear: both;
          display: block;
        }
      }
      .content .item {
        margin-left: 1em;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 3px;
      }
      .content .item.actions {
        margin: 3px 1em;
        flex-direction: column;

        button {
          width: 100%;
        }
      }
      .content.armor {
        width: fit-content;
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        column-gap: 5px;
      }
      .content .content-item-prices {
        display: grid;
        grid-template-columns: repeat(3, auto);
        column-gap: 8px;
        width: fit-content;
        margin-left: 1em;
      }
      .content .other-attrs,
      .content.extra {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
        font-size: calc(var(--n-font-size) - 2px);
      }
    }
    .tail-descriptions {
      margin-top: 5px;
      font-size: calc(var(--n-font-size) - 2px);
      line-height: 1;
    }
  }
}
</style>