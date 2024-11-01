<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NInputNumber, NScrollbar, NTable
} from 'naive-ui'
import { getItemInfo, type StatementRow } from '@/tools/item'
import ItemCell from './ItemCell.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const itemsPrepared = defineModel<Record<number, number>>('itemsPrepared', { required: true })
interface ItemStatementTableProps {
  itemsTotal: Record<number, number>,
  showItemDetails: boolean,
  containerId?: string
}
const props = defineProps<ItemStatementTableProps>()

const rows = computed(() => {
  const rowsRemaining: StatementRow[] = []
  const rowsCleaned : StatementRow[] = []
  for (const itemId in props.itemsTotal) {
    const id = Number(itemId)
    const itemInfo = getItemInfo(id)
    const _total = props.itemsTotal[id], _prepared = itemsPrepared.value[id] ?? 0
    if (!_total || _total <= 0) continue
    const item : StatementRow = {
      info: itemInfo,
      amount: {
        total: _total,
        prepared: _prepared,
        remain: _total - _prepared
      }
    }
    if (item.amount.remain > 0) {
      rowsRemaining.push(item)
    } else {
      rowsCleaned.push(item)
    }
  }
  return {
    remaining: rowsRemaining,
    cleaned: rowsCleaned
  }
})

const handleNumInputLoop = (row: StatementRow) => {
  const itemId = row.info.id
  if (itemsPrepared.value[itemId] < 0) {
    itemsPrepared.value[itemId] = row.amount.total
  }
}
</script>

<template>
  <div class="table-container">
    <n-table class="table" size="small" :single-line="false">
      <thead>
        <tr>
          <th>{{ t('物品') }}</th>
          <th>{{ t('总需') }}</th>
          <th>{{ t('已有') }}</th>
          <th>{{ t('尚需') }}</th>
        </tr>
      </thead>
    </n-table>
    <n-scrollbar trigger="none" :style="{ height: '450px', 'margin-top': '-2px' }">
      <n-table class="table" size="small" :single-line="false">
        <tbody>
          <tr v-for="item in rows.remaining" :key="'item-remaining-' + item.info.id">
            <td>
              <ItemCell
                :item="item"
                :show-item-details="showItemDetails"
                :container-id="containerId"
              />
            </td>
            <td>
              {{ item.amount.total }}
            </td>
            <td>
              <n-input-number
                v-model:value="itemsPrepared[item.info.id]"
                :min="-1"
                :max="item.amount.total"
                :precision="0"
                :size="showItemDetails ? 'small' : 'tiny'"
                button-placement="both"
                :show-button="!isMobile"
                @update:value="handleNumInputLoop(item)"
              />
            </td>
            <td>
              {{ item.amount.remain }}
            </td>
          </tr>
          <tr v-if="rows.cleaned?.length" class="prepared">
            <td colspan="4" class="bold">
              <i class="xiv e05e"></i>
              {{ t('已筹备完成') }}
            </td>
          </tr>
          <tr v-for="item in rows.cleaned" :key="'item-cleaned-' + item.info.id" class="prepared">
            <td>
              <ItemCell
                :item="item"
                :show-item-details="showItemDetails"
                :container-id="containerId"
              />
            </td>
            <td>
              {{ item.amount.total }}
            </td>
            <td>
              <n-input-number
                v-model:value="itemsPrepared[item.info.id]"
                :min="0"
                :max="item.amount.total"
                :precision="0"
                :size="showItemDetails ? 'small' : 'tiny'"
                button-placement="both"
              />
            </td>
            <td>
              {{ item.amount.remain }}
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
    width: 40%;
  }
  th:nth-child(2), td:nth-child(2),
  th:nth-child(4), td:nth-child(4) {
    width: 18%;
    text-align: center;
  }
  th:nth-child(3), td:nth-child(3) {
    width: 24%;
    text-align: center;
    .n-input-number {
      display: flex;
    }
  }
  tr.prepared td {
    background-color: var(--n-th-color-popover);
  }
  tr.prepared:hover td {
    background-color: var(--n-td-color-modal);
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