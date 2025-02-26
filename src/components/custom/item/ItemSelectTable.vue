<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NInputNumber, NScrollbar, NTable
} from 'naive-ui'
import ItemCell from './ItemCell.vue'
import { getItemInfo, type StatementRow } from '@/tools/item'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const items = defineModel<Record<number, number>>('items', { required: true })
interface ItemStatementTableProps {
  showItemDetails: boolean,
  containerId?: string
  contentHeight?: string
}
defineProps<ItemStatementTableProps>()

const tableContainer = ref<HTMLElement>()

const rows = computed(() => {
  const rowsAll : StatementRow[] = []
  for (const itemId in items.value) {
    const id = Number(itemId)
    const itemInfo = getItemInfo(id)
    const amount = items.value[id]
    itemInfo.amount = amount
    const _total = amount, _prepared = 0
    if (!_total || _total <= 0) continue
    const item : StatementRow = {
      info: itemInfo,
      amount: {
        total: _total,
        prepared: _prepared,
        remain: _total - _prepared
      }
    }
    rowsAll.push(item)
  }
  return rowsAll
})

const handleDealNumInputEdge = (row: StatementRow) => {
  const itemId = row.info.id
  if (items.value[itemId] <= 0) {
    delete items.value[itemId]
  }
}
</script>

<template>
  <div class="table-container" ref="tableContainer">
    <n-table class="table" size="small" :single-line="false">
      <thead>
        <tr>
          <th>{{ t('物品') }}</th>
          <th>{{ t('数量') }}</th>
        </tr>
      </thead>
    </n-table>
    <n-scrollbar trigger="none" :style="{ height: contentHeight ?? '450px', 'margin-top': '-2px' }">
      <n-table class="table" size="small" :single-line="false">
        <tbody>
          <tr v-for="item in rows" :key="'item-' + item.info.id">
            <td>
              <ItemCell
                :item="item"
                :show-item-details="showItemDetails"
                :container-id="containerId"
              />
            </td>
            <td>
              <n-input-number
                v-model:value="items[item.info.id]"
                :min="0"
                :max="99999"
                :precision="0"
                :size="showItemDetails ? 'small' : 'tiny'"
                button-placement="both"
                :show-button="!isMobile"
                placeholder="0"
                @update:value="handleDealNumInputEdge(item)"
              />
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-scrollbar>
  </div>
</template>

<style scoped>
/* All */
:deep(.n-scrollbar-container) {
  padding: inherit !important;
}
.table {
  width: 100%;

  th {
    font-weight: bold;
  }
  th:first-child, td:first-child {
    width: 70%;
  }
  th:nth-child(2), td:nth-child(2) {
    width: 30%;
    text-align: center;
    .n-input-number {
      display: flex;
    }
  }
}


/* Desktop */
@media screen and (min-width: 768px) {
}

/* Mobile */
@media screen and (max-width: 767px) {
  .table {
    th:first-child, td:first-child {
      width: 70%;
    }
    th:nth-child(2), td:nth-child(2) {
      width: 30%;
      text-align: center;
    }
  }
}
</style>