<script lang="ts" setup>
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NDivider, NFlex, NPopover
} from 'naive-ui'
import XivFARImage from './XivFARImage.vue'
import ItemSpan from './ItemSpan.vue'
import { getItemInfo, type ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/user-config'
import XivAttributes from '@/assets/data/xiv-attributes.json'
import XivJobs from '@/assets/data/xiv-jobs.json'

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

const itemLanguage = computed(() => {
  if (userConfig.value.language_item !== 'auto') {
    return userConfig.value.language_item
  }
  return userConfig.value.language_ui
})

interface ItemButtonProps {
  /** 道具信息 */
  itemInfo: ItemInfo

  /** 按钮宽度 */
  btnWidth?: number;
  /** 按钮高度 */
  btnHeight?: number;
  /** 按钮颜色 */
  btnColor?: string;

  /** 悬浮窗使用自定义宽度 */
  popUseCustomWidth?: boolean;
  /** 悬浮窗的最大宽度 */
  popMaxWidth?: string;

  /** 是否显示物品图标(可选,默认false) */
  showIcon?: boolean;
  /** 是否显示物品名称(可选,默认false) */
  showName?: boolean;
  /** 是否显示物品数量(可选,默认false) */
  showAmount?: boolean;
  /** 按钮是否禁用(可选,默认false) */
  disabled?: boolean;
  /** 是否禁用物品信息提示框(可选,默认false) */
  disablePop?: boolean;
}
const props = defineProps<ItemButtonProps>()

const getJobName = (jobInfo: JobInfo) => {
  switch (itemLanguage.value) {
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
  switch (itemLanguage.value) {
    case 'ja':
      return attr.Name_ja
    case 'en':
      return attr.Name_en
    case 'zh':
    default:
      return attr.Name
  }
}
const itemHasHQ = computed(() => {
  return props.itemInfo.tempAttrsProvided.every(subArr => subArr.length >= 5)
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

const iconSize = computed(() => {
  return (props.btnHeight || 34) - 7
})
const btnWidthVal = computed(() => {
  const _w = props.btnWidth
  if (!_w) return 'auto'
  return `${_w}px`
})
const btnHeightVal = computed(() => {
  const _h = props.btnHeight
  if (!_h) return 'auto'
  return `${_h}px`
})

/** 在灰机wiki中打开物品页面 */
const openInHuijiWiki = () => {
  const url = `https://ff14.huijiwiki.com/wiki/物品:${props.itemInfo.nameZH}`
  window.open(url)
}
/** 在 Garland Data 中打开物品页面 */
const openInGarland = () => {
  const url = `https://www.garlandtools.org/db/#item/${props.itemInfo.id}`
  window.open(url)
}

</script>

<template>
  <n-popover
    v-if="itemInfo.id && !disablePop"
    :trigger="isMobile ? 'click' : 'hover'"
    :placement="isMobile ? 'bottom' : 'right-start'"
    :width="popUseCustomWidth ? undefined : (isMobile ? 'trigger' : undefined)"
    :style="{ maxWidth: popMaxWidth ?? (isMobile ? 'unset' : '290px') }"
  >
    <template #trigger>
      <n-button
        class="item-button"
        :style="{ width: btnWidthVal, height: btnHeightVal }"
        :disabled="disabled"
        :color="btnColor"
      >
        <slot>
          <div class="item-container">
            <div v-if="showIcon" class="item-icon">
              <XivFARImage
                :src="itemInfo.iconUrl"
                :size="iconSize"
              />
            </div>

            <div v-if="showName" class="item-info">
              <div class="item-name">
                {{ getItemName() }}
              </div>
              <div v-if="showAmount" class="item-amount">
                x {{ itemInfo.amount }}
              </div>
            </div>
          </div>
        </slot>
      </n-button>
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
          <p>{{ t('[{id}] [{patch}版本] [品级:{ilv}]', { patch: itemInfo.patch, id: itemInfo.id, ilv: itemInfo.itemLevel }) }}</p>
        </div>
        <div class="main-descriptions" v-html="getItemDescriptions()"></div>
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
        <div class="description-block" v-if="itemInfo.tradeInfo && itemTradeCost">
          <div class="title">{{ t('兑换') }}</div>
          <n-divider class="item-divider" />
          <div class="content">
            <div>{{ t('该物品可以通过兑换获得：') }}</div>
            <div class="item">
              <ItemSpan :item-info="getItemInfo(itemTradeCost.costId)" />
              <div class="count">
                <span> x{{ itemTradeCost.costCount }}</span>
              </div>
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
              <ItemSpan :item-info="getItemInfo(item.id)" />
              <div class="count"> x{{ item.count }}</div>
            </div>
            <div v-if="itemInfo.craftInfo?.thresholds?.craftsmanship && itemInfo.craftInfo?.thresholds?.control">
              <div>{{ t('制作条件：') }}</div>
              <div class="item">
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
              <div v-if="itemInfo.craftInfo?.masterRecipeId">{{ t('需要习得秘籍') }}</div>
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
      <!-- 操作按钮不太适合放到悬浮里，后续做进右键菜单 -->
      <n-flex v-show="false" class="item-actions">
        <n-button size="small" @click="openInHuijiWiki()">
          {{ t('在灰机wiki中打开') }}
        </n-button>
        <n-button size="small" @click="openInGarland()">
          {{ t('在Garland中打开') }}
        </n-button>
        <slot name="extra-actions" />
      </n-flex>
    </div>
  </n-popover>
  <n-button v-else-if="itemInfo.id"
    class="item-button"
    :style="{ width: btnWidth, height: btnHeight }"
    :disabled="disabled"
    :color="btnColor"
  >
    <slot>
      <div class="item-container">
        <div v-if="showIcon && itemInfo.id" class="item-icon">
          <XivFARImage
            :src="itemInfo.iconUrl"
            :size="iconSize"
          />
        </div>

        <div v-if="showName" class="item-info">
          <div class="item-name">
            {{ getItemName() }}
          </div>
          <div v-if="showAmount" class="item-amount">
            x {{ itemInfo.amount }}
          </div>
        </div>
      </div>
    </slot>
  </n-button>
  <n-button v-else
    class="item-button"
    :style="{ width: btnWidthVal, height: btnHeightVal }"
    :disabled="disabled"
    :color="btnColor"
  >
    <slot>
      <div class="item-container">
        <div class="item-icon">
        </div>

        <div v-if="showName" class="item-info">
          <div class="item-name">
            &nbsp;
          </div>
          <div v-if="showAmount" class="item-amount">
            &nbsp;
          </div>
        </div>
      </div>
    </slot>
  </n-button>
</template>

<style scoped>
:deep(.n-button__content){
  width: 100%;
  height: 100%;
}
.item-button {
  padding: 1px;

  .item-container {
    width: 100%;
    height: 100%;
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 5px;

    .item-icon {
      display: flex;
    }
    .item-info {
      margin-left: auto;
      display: flex;
      flex-direction: column;
      gap: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .item-name {
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      div {
        text-align: end;
      }
    }
  }
}
.item-popover {
  display: flex;
  flex-direction: column;
  gap: 5px;

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
  .item-divider {
    margin: 0 2px;
  }
  .item-descriptions {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .item-attributes {
      display: flex;
      align-items: center;
      gap: 3px;
      line-height: 1;
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