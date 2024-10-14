<script setup lang="ts">
import { inject, type PropType, type Ref } from 'vue'
import {
  NScrollbar, NTable
} from 'naive-ui'
import type { ItemInfo } from '@/tools/item'
import ItemSpan from './ItemSpan.vue'
import type { UserConfigModel } from '@/models/user-config'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

defineProps({
  items: {
    type: Array as PropType<ItemInfo[]>,
    required: true
  },
  priceType: {
    type: String as PropType<'NQ' | 'HQ'>,
    required: true
  }
})

const getItemPrice = (item: ItemInfo, type: 'NQ' | 'HQ') => {
  const priceKey = userConfig.value.universalis_priceType + type as "averagePriceNQ" | "currentAveragePriceNQ" | "minPriceNQ" | "maxPriceNQ"
    | "averagePriceHQ" | "currentAveragePriceHQ" | "minPriceHQ" | "maxPriceHQ"
  const price = userConfig.value.cache_item_prices[item.id]?.[priceKey]
  if (price === undefined) {
    return {
      price: t('未知'),
      total: t('未知')
    }
  } else {
    const p = Math.floor(price)
    return {
      price: p,
      total: p * item.amount
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
              <ItemSpan
                :item-info="item"
              />
            </td>
            <td>
              {{ item.amount }}
            </td>
            <td>
              {{ getItemPrice(item, priceType).price }}
            </td>
            <td>
              {{ getItemPrice(item, priceType).total }}
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