<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NSwitch
} from 'naive-ui'
import GroupBox from '../templates/GroupBox.vue'
import FoldableCard from '../templates/FoldableCard.vue'
import ItemList from '../custom/item/ItemList.vue'
import ModalCraftStatements from '../modals/ModalCraftStatements.vue'
import ModalProStatements from '../modals/ModalProStatements.vue'
import ModalCostAndBenefit from '../modals/ModalCostAndBenefit.vue'
import { useStore } from '@/store'
import { getItemInfo, getItemPriceInfo, getStatementData, calCostAndBenefit, type ItemInfo } from '@/tools/item'
import { useNbbCal } from '@/tools/use-nbb-cal'
import type { UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'

const store = useStore()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const props = defineProps({
  statistics: {
    type: Object as () => any,
    required: true
  },
  normalGatherings: {
    type: Array as () => number[] | undefined,
    required: true
  },
  limitedGatherings: {
    type: Array as () => number[] | undefined,
    required: true
  },
  aethersandGatherings: {
    type: Array as () => number[] | undefined,
    required: true
  },
  normalCraftings: {
    type: Array as () => number[] | undefined,
    required: true
  }
})

const hidePrecraftMaterials = defineModel<boolean | undefined>('hidePrecraftMaterials', { required: true })

const { getTradeMap } = useNbbCal()
const tradeMap = getTradeMap()

const lv1Items = computed(() => {
  const items = []
  for (const id in props.statistics.lv1) {
    try {
      const item = getItemInfo(props.statistics.lv1[id])
      items.push(item)
    } catch (error) {
      console.warn('[compute.lv1Items] Error processing item ' + id + ':', error)
    }
  }
  return items
})
const lvBaseItems = computed(() => {
  const items = []
  for (const id in props.statistics.lvBase) {
    try {
      const item = getItemInfo(props.statistics.lvBase[id])
      items.push(item)
    } catch (error) {
      console.warn('[compute.lvBaseItems] Error processing item ' + id + ':', error)
    }
  }
  return items
})

const materialTarget = computed(() => {
  if (hidePrecraftMaterials.value) {
    return lv1Items.value
  } else {
    return lvBaseItems.value
  }
})
const materialTargetDescription = computed(() => {
  return [
    hidePrecraftMaterials.value
      ? t('此处的统计只计算了直接制作成品的所需素材，未包括制作半成品的所需素材。')
      : t('此处的统计包括直接制作成品的所需素材和制作半成品的所需素材。')
  ]
})

/**
 * 表示要展示的普通半成品。
 */
const commonPrecrafts = computed(() => {
  if (!props.normalCraftings?.length) {
    return [] as ItemInfo[]
  }
  const crafts = []
  for (const id in props.statistics.lv1) {
    try {
      const _id = parseInt(id)
      if (props.normalCraftings.includes(_id)) {
        const item = props.statistics.lv1[id]
        crafts.push(getItemInfo(item))
      }
    } catch (error) {
      console.warn('[compute.commonPrecrafts] Error processing item ' + id + ':', error)
    }
  }
  return crafts
})

/**
 * 表示需要用亚拉戈神典石或工票兑换的道具。
 */
const tomeScriptItems = computed(() => {
  const items : ItemInfo[] = []
  materialTarget.value.forEach(material => {
    if (props.aethersandGatherings?.includes(material.id)) return
    if (!tradeMap[material.id]) return
    items.push(material)
  })
  return items
})

/**
 * 表示碎晶/水晶/晶簇统计。
 */
const crystals = computed(() => {
  const _crystals : ItemInfo[] = []
  materialTarget.value.forEach(material => {
    if (material.uiTypeId === 59) {
      _crystals.push(material)
    }
  })
  return _crystals
})

/**
 * 表示限时采集品统计。
 * 包括灵砂。
 */
const gatheringsTimed = computed(() => {
  const aethersands : ItemInfo[] = []
  const gathers : ItemInfo[] = []

  materialTarget.value.forEach(material => {
    if (props.aethersandGatherings?.includes(material.id)) {
      aethersands.push(material)
    }
    if (material.gatherInfo?.timeLimitInfo?.length) {
      gathers.push(material)
    }
  })

  return [...aethersands, ...gathers]
})

/**
 * 表示非限时(常规)采集品统计。
 */
const gatheringsCommon = computed(() => {
  const gathers : ItemInfo[] = []
  materialTarget.value.forEach(material => {
    if (material.gatherInfo?.placeID && !material.gatherInfo.timeLimitInfo?.length) {
      gathers.push(material)
    }
  })
  return gathers
})

/**
 * 表示其他道具统计。
 */
const otherMaterials = computed(() => {
  const items : ItemInfo[] = []
  materialTarget.value.forEach(material => {
    const _id = material.id
    if (props.aethersandGatherings?.includes(_id)) return
    if (props.normalCraftings?.includes(_id)) return
    if (props.limitedGatherings?.includes(_id)) return
    if (props.normalGatherings?.includes(_id)) return
    if (tradeMap[_id]) return
    if (material.uiTypeId === 59) return
    if (material.gatherInfo) return
    items.push(material)
  })
  return items
})

const showStatementModal = ref(false)
const showProStatementModal = ref(false)
const showStatement = () => {
  if (funcConfig.value.use_traditional_statement) {
    showStatementModal.value = true
  } else {
    showProStatementModal.value = true
  }
}
const statementData = computed(() => {
  return getStatementData(props.statistics)
})

const showCostAndBenefitModal = ref(false)
const costAndBenefit = computed(() => {
  return calCostAndBenefit(funcConfig.value, statementData.value)
})
const updatingPrice = ref(false)
const updateItemPrices = async () => {
  if (costAndBenefit.value.updateRequired) {
    updatingPrice.value = true
    try {
      const items : number[] = []
      statementData.value.craftTargets.forEach(item => {
        items.push(item.id)
      })
      statementData.value.materialsLvBase.forEach(item => {
        items.push(item.id)
      })
      const itemPrices = await getItemPriceInfo([...new Set(items)], funcConfig.value.universalis_server)
      const newConfig = funcConfig.value
      Object.keys(itemPrices).forEach(id => {
        const itemID = Number(id)
        newConfig.cache_item_prices[itemID] = itemPrices[itemID]
      })
      await store.commit('setFuncConfig', fixFuncConfig(newConfig, store.state.userConfig))
    } catch (error : any) {
      console.error(error)
      alert(t('获取价格失败') + '\n' + (error?.message ?? error))
    }
    updatingPrice.value = false
  }
}
const handleAnalysisItemPrices = async () => {
  await updateItemPrices()
  showCostAndBenefitModal.value = true
}
</script>

<template>
  <div>
    <FoldableCard card-key="ft-statistics">
      <template #header>
        <i class="xiv square-2"></i>
        <span class="card-title-text">{{ t('查看统计') }}</span>
        <a class="card-title-extra" href="javascript:void(0);" @click="showStatement">{{ t('[查看报表]') }}</a>
        <a class="card-title-extra" href="javascript:void(0);" @click="handleAnalysisItemPrices">[{{ t('成本/收益预估') }}]</a>
      </template>

      <div class="pre">
        <div class="preset-item">
          <n-switch v-model:value="hidePrecraftMaterials" :round="false" size="small" />
          <div>{{ t('只显示直接制作素材') }}</div>
        </div>
      </div>
      <div class="wrapper">
        <GroupBox id="common-precrafts-group" class="group" title-background-color="var(--n-color-embedded)">
          <template #title>{{ t('半成品统计') }}</template>
          <div class="container">
            <ItemList
              :items="commonPrecrafts"
              :list-height="isMobile ? undefined : 245"
              :show-collector-icon="!userConfig.hide_collector_icons"
            />
          </div>
        </GroupBox>
        <GroupBox
          id="tome-script-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('兑换道具统计')"
          :descriptions="materialTargetDescription"
        >
          <div class="container">
            <ItemList
              :items="tomeScriptItems"
              :list-height="isMobile ? undefined : 245"
            />
          </div>
        </GroupBox>
        <GroupBox
          id="crystals-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('水晶统计')"
          :descriptions="materialTargetDescription"
        >
          <div class="container">
            <ItemList
              :items="crystals"
              :list-height="isMobile ? undefined : 245"
            />
          </div>
        </GroupBox>
        <GroupBox
          id="common-gatherings-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('常规采集品统计')"
          :descriptions="materialTargetDescription"
        >
          <div class="container">
            <ItemList
              :items="gatheringsCommon"
              :list-height="isMobile ? undefined : 245"
              :show-collector-icon="!userConfig.hide_collector_icons"
            />
          </div>
        </GroupBox>
        <GroupBox
          id="timed-gatherings-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('限时采集品&灵砂统计')"
          :descriptions="materialTargetDescription"
        >
          <div class="container">
            <ItemList
              :items="gatheringsTimed"
              :list-height="isMobile ? undefined : 245"
              :show-collector-icon="!userConfig.hide_collector_icons"
            />
          </div>
        </GroupBox>
        <GroupBox
          id="other-materials-group" class="group" title-background-color="var(--n-color-embedded)"
          :title="t('其他素材统计')"
          :descriptions="[
            t('未被其他分组归类的道具。'),
            ...materialTargetDescription
          ]"
        >
          <div class="container">
            <ItemList
              :items="otherMaterials"
              :list-height="isMobile ? undefined : 245"
              :show-collector-icon="!userConfig.hide_collector_icons"
            />
          </div>
        </GroupBox>
      </div>
      
      <ModalCraftStatements
        v-model:show="showStatementModal"
        v-bind="statementData"
      />
      <ModalProStatements
        v-model:show="showProStatementModal"
        v-bind="statementData"
      />
      <ModalCostAndBenefit
        v-model:show="showCostAndBenefitModal"
        :cost-items="statementData.materialsLvBase"
        :benefit-items="statementData.craftTargets"
        :cost-info="costAndBenefit.costInfo"
        :benefit-info="costAndBenefit.benefitInfo"
      />
    </FoldableCard>
  </div>
</template>

<style scoped>
.pre {
  margin-bottom: 15px;

  .preset-item {
    width: fit-content;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px;
    border: 1px solid var(--n-color-target);
    border-radius: var(--n-border-radius);
  }
}
.wrapper {
  row-gap: 15px;
  column-gap: 10px;
}
/* Desktop */
@media screen and (min-width: 768px) {
  .wrapper {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-flow: row;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .wrapper {
    display: flex;
    flex-direction: column;
  }
}
</style>