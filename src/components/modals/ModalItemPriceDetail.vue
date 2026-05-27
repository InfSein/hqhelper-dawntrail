<script setup lang="ts">
import {
  TableViewFilled,
} from '@vicons/material'
import ItemSelector from '../custom/item/ItemSelector.vue'
import ItemSpan from '../custom/item/ItemSpan.vue'
import { useStore } from '@/store'
import type { UserConfigModel } from '@/models/config-user'
import { fixFuncConfig, type FuncConfigModel } from '@/models/config-func'
import { useDialog } from '@/tools/dialog'
import { handleGetPriceError } from '@/tools/error'
import { getItemPriceInfo, ItemPriceApiVersion, type ItemInfo } from '@/tools/item'
import UseConfig from '@/tools/use-config'

const t = inject<(message: string, args?: any) => string>('t')!
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const store = useStore()
const { alertError } = useDialog(t)
const NAIVE_UI_MESSAGE = useMessage()
const {
  itemLanguage,
} = UseConfig(userConfig, funcConfig)

const showModal = defineModel<boolean>('show', { required: true })

interface ModalItemPriceDetailProps {
  items: ItemInfo[]
}
const props = defineProps<ModalItemPriceDetailProps>()

const loading = ref(false)
const selectedItems = ref<ItemInfo[]>([])
const currItem = ref(0)
const pageConfig = reactive({
  marketShowHq: false,
  purchaseShowHq: false,
})

// #region 加载
const onLoad = async () => {
  selectedItems.value = props.items
  currItem.value = selectedItems.value[0]?.id ?? 0
  await loadItemPrices()
}
const loadItemPrices = async (forceUpdate = false) => {
  loading.value = true
  try {
    const itemsToLoad = props.items.filter(item => {
      if (forceUpdate) return true
      const expiresAfter = Date.now() - funcConfig.value.universalis_expireTime
      const priceInfo = funcConfig.value.cache_item_prices[item.id]
      return !(priceInfo && priceInfo.listAll && priceInfo.updateTime > expiresAfter
        && priceInfo.v && priceInfo.v >= ItemPriceApiVersion)
    }).map(item => item.id)
    const itemPrices = await getItemPriceInfo(
      [...new Set(itemsToLoad)],
      funcConfig.value.universalis_server,
      true,
    )
    const newConfig = funcConfig.value
    Object.keys(itemPrices).forEach(id => {
      const itemID = Number(id)
      newConfig.cache_item_prices[itemID] = itemPrices[itemID]
    })
    await store.setFuncConfig(fixFuncConfig(newConfig, store.userConfig))
  } catch (error: any) {
    const errMsg = handleGetPriceError(error, t)
    await alertError(t('common.message.get_price_failed') + '\n' + errMsg)
  } finally {
    loading.value = false
  }
}
// #endregion

// #region 物品选择
const itemsForSelect = computed(() => selectedItems.value.map(item => item.id))
const handleTabAdd = () => {
  // todo 要做个弹窗
}
const handleTabClose = (itemId: number) => {
  const index = selectedItems.value.findIndex(item => item.id === itemId)
  if (index !== -1) {
    selectedItems.value.splice(index, 1)
    if (currItem.value === itemId) {
      currItem.value = selectedItems.value[0]?.id ?? 0
    }
  }
}
// #endregion

// #region 表格
const tableEmptyInfo = computed(() => {
  if (!currItem.value) {
    return '请选择物品'
  } else if (!funcConfig.value.cache_item_prices[currItem.value]?.listAll) {
    return '暂无数据'
  } else {
    return ''
  }
})
const marketBoardList = computed(() => {
  const itemPriceInfo = funcConfig.value.cache_item_prices[currItem.value]
  if (!itemPriceInfo?.marketListing) return []
  return itemPriceInfo.marketListing.filter(mi => {
    if (pageConfig.marketShowHq) {
      return mi.hq
    } else {
      return true
    }
  })
})
const purchaseHistoryList = computed(() => {
  const itemPriceInfo = funcConfig.value.cache_item_prices[currItem.value]
  if (!itemPriceInfo?.purchaseHistory) return []
  return itemPriceInfo.purchaseHistory.filter(ph => {
    if (pageConfig.purchaseShowHq) {
      return ph.hq
    } else {
      return true
    }
  })
})
// #endregion
</script>

<template>
  <MyModal
    v-model:show="showModal"
    max-width="800px"
    :icon="TableViewFilled"
    title="物品价格详表"
    @on-load="onLoad"
  >
    <n-spin :show="loading" description="正在获取物品价格……">
      <div class="wrapper">
        <div class="actions-wrapper">
          <template v-if="items.length <= 5">
            <n-tabs
              v-model:value="currItem"
              type="card"
              addable closable
              tab-style="min-width: 80px;"
              @close="handleTabClose"
              @add="handleTabAdd"
            >
              <n-tab v-for="item in items" :key="item.id" :name="item.id">
                <ItemSpan :item-info="item" hide-pop-icon />
              </n-tab>
            </n-tabs>
          </template>
          <template v-else>
            <n-input-group>
              <ItemSelector
                v-model:model-value="currItem"
                dont-clean-after-select
                options-preset="custom"
                :options="itemsForSelect"
              />
              <n-button type="primary" @click="handleTabAdd">添加</n-button>
            </n-input-group>
          </template>
        </div>
        <div class="tables-wrapper">
          <n-card size="small">
            <template #header>
              <div class="card-title">
                <i class="xiv e03e"></i>
                当前价格
                <n-checkbox
                  v-model:checked="pageConfig.marketShowHq"
                  size="small"
                  label="只看HQ"
                />
              </div>
            </template>
            <n-empty v-if="tableEmptyInfo" :description="tableEmptyInfo" />
            <n-table v-else>
              <tbody>
                <tr
                  v-for="(mi, miIndex) in marketBoardList"
                  :key="'mi_' + miIndex"
                >
                  <td>
                    <div>
                      <i class="xiv hq" v-if="mi.hq"></i>
                      {{ mi.pricePerUnit }}
                      {{ mi.quantity }}
                      {{ mi.total }}
                      {{ mi.worldName }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-card>
          <n-card size="small">
            <template #header>
              <div class="card-title">
                <i class="xiv timer"></i>
                历史交易
                <n-checkbox
                  v-model:checked="pageConfig.purchaseShowHq"
                  size="small"
                  label="只看HQ"
                />
              </div>
            </template>
            <n-empty v-if="tableEmptyInfo" :description="tableEmptyInfo" />
            <n-table v-else>
              <tbody>
                <tr
                  v-for="(ph, phIndex) in purchaseHistoryList"
                  :key="'ph_' + phIndex"
                >
                  <td>
                    <div>
                      <i class="xiv hq" v-if="ph.hq"></i>
                      {{ ph.pricePerUnit }}
                      {{ ph.quantity }}
                      {{ ph.total }}
                      {{ ph.worldName }}
                      {{ ph.buyerName }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-card>
        </div>
      </div>
    </n-spin>
  </MyModal>
</template>

<style scoped>
.wrapper {
  height: 60vh;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .actions-wrapper {
    width: 100%;
    display: flex;
    gap: 4px;
  }
  .tables-wrapper {
    width: 100%;
    flex: 1;
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .wrapper {
    height: 80vh;

    .tables-wrapper {
      grid-template-columns: 1fr;
    }
  }
}
</style>