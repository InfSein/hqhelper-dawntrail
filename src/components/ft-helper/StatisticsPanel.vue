<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NSwitch,
  useMessage
} from 'naive-ui'
import CraftStatistics from '../custom/general/CraftStatistics.vue'
import FoldableCard from '../templates/FoldableCard.vue'
import ModalCraftStatements from '../modals/ModalCraftStatements.vue'
import ModalProStatements from '../modals/ModalProStatements.vue'
import ModalCostAndBenefit from '../modals/ModalCostAndBenefit.vue'
import { useStore } from '@/store'
import { type UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import { getItemPriceInfo, calCostAndBenefit } from '@/tools/item'
import { useFufuCal } from '@/tools/use-fufu-cal'

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const { getStatementData } = useFufuCal(userConfig, funcConfig, t)

interface StatisticsPanelProps {
  itemSelected: Record<number, number>
  statistics: any
}
const props = defineProps<StatisticsPanelProps>()

const hidePrecraftMaterials = defineModel<boolean | undefined>('hidePrecraftMaterials', { required: true })

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
  if (updatingPrice.value) {
    NAIVE_UI_MESSAGE.info(t('正在加载……')); return
  }
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
        <a class="card-title-extra" href="javascript:void(0);" :disabled="updatingPrice" :style="updatingPrice ? 'cursor: not-allowed; color: gray;' : 'cursor: pointer;'" @click="handleAnalysisItemPrices">[{{ updatingPrice ? t('正在加载……') : t('成本/收益预估') }}]</a>
      </template>

      <div class="pre">
        <div class="preset-item">
          <n-switch v-model:value="hidePrecraftMaterials" :round="false" size="small" />
          <div>{{ t('只显示直接制作素材') }}</div>
        </div>
      </div>
      <CraftStatistics
        :item-selected="itemSelected"
        :hide-precraft-materials="hidePrecraftMaterials"
      />
      
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
</style>