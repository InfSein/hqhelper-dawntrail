<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NDivider, NIcon, NInput, NPopover, NRadio, NRadioGroup,
  useMessage
} from 'naive-ui'
import {
  ViewListSharp, CopyAllOutlined
} from '@vicons/material'
import GroupBox from '@/components/templates/GroupBox.vue'
import ButtonCopyAsMacro from '../macro/ButtonCopyAsMacro.vue'
import type { ItemInfo, StatementRow } from '@/tools/item'
import type { UserConfigModel } from '@/models/config-user'
import type { FuncConfigModel } from '@/models/config-func'
import { CopyToClipboard, deepCopy } from '@/tools'
import UseConfig from '@/tools/use-config'

const NAIVE_UI_MESSAGE = useMessage()
const t = inject<(message: string, args?: any) => string>('t')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const funcConfig = inject<Ref<FuncConfigModel>>('funcConfig')!

const {
  itemLanguage,
} = UseConfig(userConfig, funcConfig)

const getItemName = (itemInfo: ItemInfo) => {
  switch (itemLanguage.value) {
    case 'zh':
      return itemInfo.name_zh || '未翻译的物品'
    default:
      return itemInfo[`name_${itemLanguage.value}`]
  }
}

interface ItemListPopProps {
  rows: StatementRow[]
}
const props = defineProps<ItemListPopProps>()

const amountRule = ref<"all" | "prepared" | "remaining">('all')
const listPopContainer = ref<HTMLElement>()

const items = computed(() => {
  const arr : ItemInfo[] = []
  props.rows.filter(row => {
    switch (amountRule.value) {
      case 'all':
        return true
      case 'prepared':
        return row.amount.prepared > 0
      case 'remaining':
        return row.amount.remain > 0
    }
  }).forEach(row => {
    const item = deepCopy(row.info)
    switch (amountRule.value) {
      case 'all': item.amount = row.amount.total; break
      case 'prepared': item.amount = row.amount.prepared; break
      case 'remaining': item.amount = row.amount.remain; break
    }
    arr.push(item)
  })
  return arr
})
const listValue = computed(() => {
  const result : string[] = []
  items.value.forEach(item => {
    if (item.amount) {
      if (userConfig.value.item_list_style === 'teamcraft') {
        result.push(`${item.amount}x ${getItemName(item)}`)
      } else if (userConfig.value.item_list_style === 'tight') {
        result.push(`${getItemName(item)}x${item.amount}`)
      } else {
        result.push(`${getItemName(item)} x ${item.amount}`)
      }
    }
  })
  return result.join('\n')
})

const handleCopyList = async () => {
  if (!listValue?.value?.length) {
    NAIVE_UI_MESSAGE.info(t('common.message.nothing_to_copy')); return
  }
  const response = await CopyToClipboard(listValue.value, listPopContainer.value)
  if (response) {
    NAIVE_UI_MESSAGE.error(t('common.message.copy_failed_unexpected_error'))
  } else {
    NAIVE_UI_MESSAGE.success(t('common.message.copy_succeed'))
  }
}
</script>

<template>
  <n-popover
    :trigger="isMobile ? 'click' : 'hover'"
    :placement="isMobile ? 'bottom' : 'right-start'"
    :width="290"
  >
    <template #trigger>
      <slot />
    </template>

    <div class="wrapper" ref="listPopContainer">
      <div class="pop-title font-big">
        <n-icon :size="16"><ViewListSharp /></n-icon>
        <span>{{ t('common.list') }}</span>
      </div>
      <n-divider style="margin: 0 0 3px 0;" />
      <div class="groupboxes-container">
        <GroupBox
          :title="t('common.options')"
          title-background-color="var(--n-color-modal, var(--n-color))"
          class="config-container"
        >
          <div class="config-item">
            <div class="title">{{ t('statement.list.use_amount_of') }}</div>
            <div class="content">
              <n-radio-group
                v-model:value="amountRule"
                name="amount-rule"
              >
                <n-radio value="all">
                  {{ t('statement.table.total') }}
                </n-radio>
                <n-radio value="prepared">
                  {{ t('statement.table.prepared') }}
                </n-radio>
                <n-radio value="remaining">
                  {{ t('statement.table.requires') }}
                </n-radio>
              </n-radio-group>
            </div>
          </div>
        </GroupBox>
        <GroupBox
          :title="t('common.content')"
          title-background-color="var(--n-color-modal, var(--n-color))"
        >
          <div class="actions-container">
            <ButtonCopyAsMacro
              :items="items"
              :container="listPopContainer"
            />
            <n-button size="tiny" @click="handleCopyList">
              <template #icon>
                <n-icon><CopyAllOutlined /></n-icon>
              </template>
              {{ t('statement.list.copy_list') }}
            </n-button>
          </div>
          <n-input
            v-model:value="listValue"
            readonly
            autosize
            type="textarea"
            :placeholder="t('common.no_required_items')"
            style="height: 250px;"
          />
        </GroupBox>
      </div>
    </div>
  </n-popover>
</template>

<style scoped>
.wrapper {
  .pop-title {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .groupboxes-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
  }
  .config-container {
    margin-bottom: 3px;

    .config-item {
      margin-left: 0.5em;
      .content {
        margin-left: 1em;
      }
    }
  }
  .actions-container {
    text-align: end;
    button {
      margin-left: 3px;
    }
  }
}
</style>