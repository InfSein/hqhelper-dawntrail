<script setup lang="ts">
import CraftStatistics from '../custom/general/CraftStatistics.vue'
import ModalCraftStatements from '../modals/ModalCraftStatements.vue'
import ModalProStatements from '../modals/ModalProStatements.vue'
import ModalCostAndBenefit from '../modals/ModalCostAndBenefit.vue'
import { useStore } from '@/store'
import { type UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import { useDialog } from '@/tools/dialog'
import { getItemPriceInfo, calCostAndBenefit } from '@/tools/item'
import { useFufuCal } from '@/tools/use-fufu-cal'

const t = inject<(message: string, args?: any) => string>('t')!
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const store = useStore()
const { alertError } = useDialog(t)
const NAIVE_UI_MESSAGE = useMessage()
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
      await store.setFuncConfig(fixFuncConfig(newConfig, store.userConfig))
    } catch (error : any) {
      console.error(error)
      await alertError(t('common.message.get_price_failed') + '\n' + (error?.message ?? error))
    }
    updatingPrice.value = false
  }
}
const handleAnalysisItemPrices = async () => {
  if (updatingPrice.value) {
    NAIVE_UI_MESSAGE.info(t('common.loading')); return
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
        <span class="card-title-text">{{ t('statistics.view_statistics') }}</span>
        <a class="card-title-extra" href="javascript:void(0);" @click="showStatement">{{ t('common.mquoted_view_statement') }}</a>
        <a class="card-title-extra" href="javascript:void(0);" :disabled="updatingPrice" :style="updatingPrice ? 'cursor: not-allowed; color: gray;' : 'cursor: pointer;'" @click="handleAnalysisItemPrices">[{{ updatingPrice ? t('common.loading') : t('statistics.group.cost_and_benefit.title') }}]</a>
      </template>

      <div class="pre">
        <div class="preset-item">
          <n-switch v-model:value="hidePrecraftMaterials" :round="false" size="small" />
          <div>{{ t('statistics.preference.show_direct_materials_only') }}</div>
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