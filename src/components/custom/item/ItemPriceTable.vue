<script setup lang="ts">
import { inject, type PropType, type Ref } from 'vue'
import {
  NScrollbar, NTable
} from 'naive-ui'
import ItemCell from './ItemCell.vue'
import type { ItemInfo } from '@/tools/item'
import type { FuncConfigModel } from '@/models/config-func'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
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
      price: t('未知'),
      total: t('未知')
    }
  } else {
    const p = Math.floor(price)
    const tooltipForNoPrice = t('没有获取到价格。') + '\n' + t('可能原因：物品未实装/交易数据不足')
    const styleForNoPrice = 'cursor: help; text-decoration: underline dashed gray;'
    return {
      price: p ? p : '???',
      total: p ? p * item.amount : '???',
      tooltip: p ? '' : tooltipForNoPrice,
      style: p ? '' : styleForNoPrice
    }
  }
}
</script>

<template>
  <div class="table-container">
    <n-table class="table" size="small" :single-line="false">
      <thead>
        <tr>
          <th>{{ t('物品') }}</th>
          <th>{{ t('数量') }}</th>
          <th>{{ t('单价') }}</th>
          <th>{{ t('小计') }}</th>
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
              {{ item.amount }}
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
    width: 55%;
  }
  th:nth-child(2), td:nth-child(2),
  th:nth-child(3), td:nth-child(3),
  th:nth-child(4), td:nth-child(4) {
    width: 15%;
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