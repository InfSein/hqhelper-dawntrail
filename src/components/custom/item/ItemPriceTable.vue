<script setup lang="ts">
import ItemCell from './ItemCell.vue'
import type { ItemInfo } from '@/tools/item'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'

const t = inject<(message: string, args?: any) => string>('t')!
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

interface ItemPriceTableProps {
  items: ItemInfo[],
  showItemDetails: boolean,
  priceType: 'NQ' | 'HQ',
  containerId?: string,
}
defineProps<ItemPriceTableProps>()

const getItemPrice = (item: ItemInfo, type: 'NQ' | 'HQ') => {
  const price = funcConfig.value.cache_item_prices[item.id]?.[`${funcConfig.value.universalis_priceType}${type}`]
  if (price === undefined) {
    return {
      price: t('common.unknown'),
      total: t('common.unknown')
    }
  } else {
    const p = Math.floor(price)
    const tooltipForNoPrice = t('item.price.no_price_received') + '\n' + t('item.price.no_price_received_reason')
    const styleForNoPrice = 'cursor: help; text-decoration: underline dashed gray;'
    return {
      price: p ? p.toLocaleString() : '???',
      total: p ? (p * item.amount).toLocaleString() : '???',
      tooltip: p ? '' : tooltipForNoPrice,
      style: p ? '' : styleForNoPrice
    }
  }
}

const getItemAmount = (amount: number) => {
  return userConfig.value.item_amount_use_comma
    ? amount.toLocaleString()
    : amount
}
</script>

<template>
  <div class="table-container">
    <n-table class="table" size="small" :single-line="false">
      <thead>
        <tr>
          <th>{{ t('common.item') }}</th>
          <th>{{ t('common.amount') }}</th>
          <th>{{ t('common.unit_price') }}</th>
          <th>{{ t('common.subtotal') }}</th>
        </tr>
      </thead>
    </n-table>
    <n-scrollbar trigger="none" :style="{ height: '450px', 'margin-top': '-2px' }">
      <n-table class="table" size="small" :single-line="false">
        <tbody>
          <tr v-for="(item, index) in items" :key="'item-' + index">
            <td>
              <ItemCell
                :item-info="item"
                :amount="item.amount"
                :show-item-details="showItemDetails"
                :container-id="containerId"
              />
            </td>
            <td>
              {{ getItemAmount(item.amount) }}
            </td>
            <td>
              <span :style="getItemPrice(item, priceType).style" :title="getItemPrice(item, priceType).tooltip">
                {{ getItemPrice(item, priceType).price }}
              </span>
            </td>
            <td>
              <span :style="getItemPrice(item, priceType).style" :title="getItemPrice(item, priceType).tooltip">
                {{ getItemPrice(item, priceType).total }}
              </span>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-scrollbar>
  </div>
</template>

<style scoped>
/* All */
.table {
  width: 100%;

  th {
    font-weight: bold;
  }
  th:first-child, td:first-child {
    width: 49%;
  }
  th:nth-child(2), td:nth-child(2),
  th:nth-child(3), td:nth-child(3),
  th:nth-child(4), td:nth-child(4) {
    width: 17%;
    text-align: center;
  }
}

/* Desktop */
@media screen and (min-width: 768px) {
}

/* Mobile */
@media screen and (max-width: 767px) {
  .table {
    th:first-child, td:first-child {
      width: 46%;
    }
    th:nth-child(2), td:nth-child(2),
    th:nth-child(3), td:nth-child(3),
    th:nth-child(4), td:nth-child(4) {
      width: 18%;
      text-align: center;
    }
  }
}
</style>