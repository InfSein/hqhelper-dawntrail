<script lang="ts" setup>
import { computed, inject, ref, type Ref } from 'vue'
import {
  NDivider, NPopover
} from 'naive-ui'
import XivFARImage from './XivFARImage.vue'
import ItemSpan from './ItemSpan.vue'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config'
import XivAttributes from '@/assets/data/xiv-attributes.json'
import XivJobs from '@/assets/data/xiv-jobs.json'
import type EorzeaTime from '@/tools/eorzea-time'

interface JobInfo {
  job_id: number,
  job_name_en: string,
  job_name_zh: string,
  job_name_ja: string,
  job_icon_url: string
}
const jobMap = XivJobs as Record<number, JobInfo>

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const currentET = inject<Ref<EorzeaTime>>('currentET')!

const uiLanguage = computed(() => {
  return userConfig.value.language_ui
})
const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})

interface ItemPopProps {
  /** 道具信息 */
  itemInfo: ItemInfo

  /** 悬浮窗使用自定义宽度 */
  popUseCustomWidth?: boolean;
  /** 悬浮窗的自定义宽度，必须同时设置`popUseCustomWidth`才能生效 */
  popCustomWidth?: number;
  /** 悬浮窗的最大宽度 */
  popMaxWidth?: string;

  /** 是否禁用物品信息提示框(可选,默认false) */
  disablePop?: boolean;
}
const props = defineProps<ItemPopProps>()

const getJobName = (jobInfo: JobInfo) => {
  switch (uiLanguage.value) {
    case 'ja':
      return jobInfo?.job_name_ja || t('未知')
    case 'en':
      return jobInfo?.job_name_en || t('未知')
    case 'zh':
    default:
      return jobInfo?.job_name_zh || t('未知')
  }
}

const getItemName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.itemInfo.nameJA
    case 'en':
      return props.itemInfo.nameEN
    case 'zh':
    default:
      return props.itemInfo.nameZH || '未翻译的物品'
  }
}
/** 获取物品副名称(即其他语言的名称) */
const getItemSubName = () => {
  switch (itemLanguage.value) {
    case 'ja':
      return props.itemInfo.nameEN
    case 'en':
      return props.itemInfo.nameJA
    case 'zh':
    default:
      return props.itemInfo.nameJA + ' / ' + props.itemInfo.nameEN
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
  const attrMap = XivAttributes as any
  const attr = attrMap[attrId.toString()]
  if (!attr) {
    return t('未知')
  }
  switch (uiLanguage.value) {
    case 'ja':
      return attr.Name_ja
    case 'en':
      return attr.Name_en
    case 'zh':
    default:
      return attr.Name
  }
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
const itemTailDescriptions = computed(() => {
  const descriptions : string[] = []
  if (itemLanguage.value === 'zh' && props.itemInfo.usedZHTemp) {
    descriptions.push(t('该物品国服尚未实装，中文名为临时译名。'))
  }
  return descriptions
})
const itemServer = computed(() => {
  let server = userConfig.value.item_server
  if (!server || server === 'auto') {
    const lang = userConfig.value.language_ui
    if (lang === 'zh') {
      server = 'chs'
    } else {
      server = 'global'
    }
  }
  return server
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
      return t('进行中')
    }
  } catch (err) {
    console.error(err)
  }
  return ''
}
</script>

<template>
  <n-popover
    v-if="itemInfo.id && !disablePop"
    :trigger="isMobile ? 'click' : 'hover'"
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
              {{ t('(暂译)') }}
            </span>
          </div>
          <div class="sub">{{ getItemSubName() }}</div>
        </div>
      </div>
      <div class="item-level">{{ t('物品品级 {ilv}', itemInfo.itemLevel) }}</div>
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
          <p>{{ t('[{patch}版本] [{id}]', { patch: itemInfo.patch, id: itemInfo.id }) }}</p>
        </div>
        <div class="main-descriptions" v-html="getItemDescriptions()"></div>
        <div class="description-block" v-if="itemInfo.attrsProvided.length">
          <div class="title">{{ t('装备属性') }}</div>
          <n-divider class="item-divider" />
          <div class="content" v-if="itemHasHQ">
            <div
              class="item"
              v-for="(attr, index) in itemInfo.attrsProvided"
              :key="'attr-hq' + index"
            >
              <div class="attr-name">{{ getAttrName(attr[0]) }}</div>
              <div> +{{ attr[2] }}</div>
            </div>
          </div>
          <div class="content" v-else>
            <div
              class="item"
              v-for="(attr, index) in itemInfo.attrsProvided"
              :key="'attr-nq' + index"
            >
              <div class="attr-name">{{ getAttrName(attr[0]) }}</div>
              <div> +{{ attr[1] }}</div>
            </div>
          </div>
          <div class="content extra">
            {{ t('※ 此处仅展示物品的{NQorHQ}属性', itemHasHQ ? 'HQ' : 'NQ') }}
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.tempAttrsProvided.length">
          <div class="title">{{ t('效果') }}</div>
          <n-divider class="item-divider" />
          <div class="content" v-if="itemHasHQ">
            <div
              class="item"
              v-for="(attr, index) in itemInfo.tempAttrsProvided"
              :key="'temp-attr-hq' + index"
            >
              <div class="attr-name">{{ getAttrName(attr[0]) }}</div>
              <div> +{{ attr[4] }}% {{ t('(上限{})', attr[5]) }}</div>
            </div>
          </div>
          <div class="content" v-else>
            <div
              class="item"
              v-for="(attr, index) in itemInfo.tempAttrsProvided"
              :key="'temp-attr-nq' + index"
            >
              <div class="attr-name">{{ getAttrName(attr[0]) }}</div>
              <div> +{{ attr[2] }}% {{ t('(上限{})', attr[3]) }}</div>
            </div>
          </div>
          <div class="content extra">
            {{ t('※ 此处仅展示物品的{NQorHQ}属性', itemHasHQ ? 'HQ' : 'NQ') }}
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.canReduceFrom?.length">
          <div class="title">{{ t('精选') }}</div>
          <n-divider class="item-divider" />
          <div class="content">
            <div>{{ t('该物品可以通过精选以下道具获得：') }}</div>
            <div class="item" v-for="(reduce, reduceIndex) in itemInfo.canReduceFrom" :key="'reduce-' + reduceIndex">
              <ItemSpan :item-info="getItemInfo(reduce)" />
            </div>
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.gatherInfo">
          <div class="title">{{ t('采集') }}</div>
          <n-divider class="item-divider" />
          <div class="content">
            <div>{{ t('该物品可以在以下位置采集：') }}</div>
            <div class="item">
              <div>
                {{ getPlaceName() }} {{ t('(X:{x}, Y:{y})', { x: itemInfo.gatherInfo.posX, y: itemInfo.gatherInfo.posY }) }}
              </div>
            </div>
          </div>
          <div class="content" v-if="itemInfo.gatherInfo?.timeLimitInfo?.length">
            <div>{{ t('该物品只能在以下ET内采集：') }}</div>
            <div
              class="item"
              v-for="(timeLimit, timeLimitIndex) in itemInfo.gatherInfo?.timeLimitInfo"
              :key="'time-limit-' + timeLimitIndex"
            >
              <div>{{ timeLimit.start }} ~ {{ timeLimit.end }}</div>
              <div class="green">{{ timeCanGather(timeLimit) }}</div>
            </div>
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.tradeInfo && itemTradeCost">
          <div class="title">{{ t('兑换') }}</div>
          <n-divider class="item-divider" />
          <div class="content">
            <div>{{ t('该物品可以通过兑换获得：') }}</div>
            <div class="item">
              <ItemSpan :item-info="getItemInfo(itemTradeCost.costId)" :amount="itemTradeCost.costCount" show-amount />
            </div>
            <div class="item" v-if="itemInfo.tradeInfo.receiveCount > 1">
              {{ t('每次兑换可获得{receive}个', itemInfo.tradeInfo.receiveCount) }}
            </div>
          </div>
        </div>
        <div class="description-block" v-if="itemInfo.craftRequires.length">
          <div class="title">
            {{ t('制作') }}
            <span class="extra">
              <XivFARImage
                class="icon"
                :src="jobMap[itemInfo.craftInfo?.jobId].job_icon_url"
                :size="12"
              />
              {{ t('{lv}级{star}{job}配方', {
                lv: itemInfo.craftInfo?.craftLevel,
                star: '★'.repeat(itemInfo.craftInfo?.starCount || 0),
                job: getJobName(jobMap[itemInfo.craftInfo?.jobId])
              }) }}
            </span>
          </div>
          <n-divider class="item-divider" />
          <div class="content">
            <div
              class="item"
              v-for="(item, index) in itemInfo.craftRequires"
              :key="'recipe-' + index"
            >
              <ItemSpan :item-info="getItemInfo(item.id)" :amount="item.count" show-amount />
            </div>
            <div v-if="itemInfo.craftInfo?.thresholds?.craftsmanship && itemInfo.craftInfo?.thresholds?.control">
              <div>{{ t('制作条件：') }}</div>
              <div class="item small-font" v-if="itemInfo.craftInfo?.masterRecipeId">
                {{ t('需要习得') }}
                <ItemSpan :img-size="12" :item-info="getItemInfo(itemInfo.craftInfo.masterRecipeId)" />
              </div>
              <div class="item small-font">
                <div v-if="itemInfo.craftInfo?.thresholds?.craftsmanship">
                  {{ t('作业精度{value}', itemInfo.craftInfo?.thresholds?.craftsmanship) }}
                </div>
                <div v-if="itemInfo.craftInfo?.thresholds?.control">
                  {{ t('加工精度{value}', itemInfo.craftInfo?.thresholds?.control) }}
                </div>
              </div>
            </div>
            <div class="other-attrs" v-if="(itemInfo.craftInfo?.yields || 1) > 1">
              {{ t('每次制作会产出{yields}个成品', itemInfo.craftInfo?.yields) }}
            </div>
            <div class="other-attrs">
              <div v-if="!itemInfo.craftInfo?.qsable" class="red">{{ t('无法进行简易制作') }}</div>
              <div v-if="!itemInfo.craftInfo?.hqable" class="red">{{ t('无法制作优质道具') }}</div>
            </div>
          </div>
        </div>
        <slot name="extra-descriptions" />
        <div class="tail-descriptions">
          <p v-for="(desc, index) in itemTailDescriptions" :key="'tail-descriptions' + index">
            {{ t('注{}：', itemTailDescriptions.length === 1 ? '' : index + 1) }}{{ desc }}
          </p>
        </div>
      </div>
      <!-- <n-flex v-show="false" class="item-actions">
        <n-button size="small" @click="openInHuijiWiki()">
          {{ t('在灰机wiki中打开') }}
        </n-button>
        <n-button size="small" @click="openInGarland()">
          {{ t('在Garland中打开') }}
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

        .extra {
          margin-left: 3px;
          font-weight: normal;
          font-size: calc(var(--n-font-size) - 2px);

          .icon { vertical-align: text-bottom; }
        }
      }
      .content .item {
        margin-left: 1em;
        display: flex;
        align-items: center;
        gap: 3px;
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