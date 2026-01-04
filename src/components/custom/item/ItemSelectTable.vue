<script setup lang="ts">
import ItemCell from './ItemCell.vue'
import { getItemInfo, type ItemInfo } from '@/tools/item'

const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const items = defineModel<Record<number, number>>('items', { required: true })
interface ItemSelectTableProps {
  showItemDetails: boolean,
  itemSpanMaxWidth?: string
  containerId?: string
  contentHeight?: string
}
defineProps<ItemSelectTableProps>()

const tableContainer = ref<HTMLElement>()

interface ItemSelectRow {
  info: ItemInfo,
  amount: number
}

const rows = computed(() => {
  const rowsAll : ItemSelectRow[] = []
  for (const itemId in items.value) {
    const id = Number(itemId)
    const itemInfo = getItemInfo(id)
    const amount = items.value[id]
    itemInfo.amount = amount
    const item : ItemSelectRow = {
      info: itemInfo,
      amount: amount
    }
    rowsAll.push(item)
  }
  return rowsAll
})

const handleDealNumInputEdge = (row: ItemSelectRow) => {
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
          <th>{{ t('common.item') }}</th>
          <th>{{ t('common.amount') }}</th>
        </tr>
      </thead>
    </n-table>
    <n-scrollbar trigger="none" :style="{ height: contentHeight ?? '450px', 'margin-top': '-2px' }">
      <n-table class="table" size="small" :single-line="false">
        <tbody>
          <tr v-for="item in rows" :key="'item-' + item.info.id">
            <td>
              <ItemCell
                :item-info="item.info"
                :amount="item.amount"
                :show-item-details="showItemDetails"
                :item-span-max-width="itemSpanMaxWidth"
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