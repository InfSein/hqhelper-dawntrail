<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NCascader, NCollapse, NCollapseItem, NIcon, NInput, NPopover, NRadioButton, NRadioGroup, NSelect, NSwitch
} from 'naive-ui'
import {
  HelpOutlineRound
} from '@vicons/material'
import type { SettingItem } from '@/models'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const formData = defineModel<any>('formData', { required: true })
interface SettingItemProps {
  settingItem: SettingItem
}
defineProps<SettingItemProps>()
</script>

<template>
  <div class="setting-item" v-show="!settingItem.hide">
    <n-collapse arrow-placement="right">
      <n-collapse-item>
        <template #header>
          <div class="item-title">{{ settingItem.label }}</div>
        </template>
        <template #arrow>
          <n-icon v-if="settingItem.descriptions?.length" :title="t('点击以展开或折叠此设置项的描述')"><HelpOutlineRound /></n-icon>
          <n-icon v-else></n-icon>
        </template>

        <div class="item-descriptions">
          <p
            v-for="(description, index) in settingItem.descriptions"
            :key="settingItem.key + '-description-' + index"
            :class="description.class"
            :style="description.style"
          >
            {{ description.value }}
          </p>
        </div>
      </n-collapse-item>
    </n-collapse>
    <div class="item-input">
      <n-popover
        v-if="settingItem.warnings?.length"
        :trigger="isMobile ? 'click' : 'hover'"
        placement="bottom"
        :style="settingItem.type === 'switch' ? 'max-width: 300px;' : ''"
      >
        <template #trigger>
          <n-switch
            v-if="settingItem.type ==='switch'"
            v-model:value="formData[settingItem.key]"
          />
          <n-radio-group
            v-if="settingItem.type === 'radio-group'"
            v-model:value="formData[settingItem.key]"
            :name="settingItem.key"
          >
            <n-radio-button
              v-for="(option, index) in settingItem.options"
              :key="settingItem.key + '-option-' + index"
              :value="option.value"
              :label="option.label"
            />
          </n-radio-group>
          <n-select
            v-if="settingItem.type === 'select'"
            v-model:value="formData[settingItem.key]"
            :options="settingItem.options"
            :style="{ width: isMobile ? '75%' : '60%' }"
          />
          <n-cascader
            v-if="settingItem.type === 'cascader'"
            v-model:value="formData[settingItem.key]"
            :expand-trigger="!isMobile ? 'hover' : 'click'"
            :options="settingItem.options"
            check-strategy="child"
            show-path
            filterable
            :style="{ width: isMobile ? '85%' : '70%' }"
          />
          <n-input
            v-if="settingItem.type === 'string'"
            v-model:value="formData[settingItem.key]"
            type="text"
            :style="{ width: isMobile ? '85%' : '70%' }"
          />
        </template>
        <div class="flex-column flex-center">
          <p
            v-for="(warning, index) in settingItem.warnings"
            :key="settingItem.key + '-warning-' + index"
            :class="warning.class"
            :style="warning.style"
          >
            {{ warning.value }}
          </p>
        </div>
      </n-popover>
      <div v-else>
        <n-switch
          v-if="settingItem.type ==='switch'"
          v-model:value="formData[settingItem.key]"
        />
        <n-radio-group
          v-if="settingItem.type === 'radio-group'"
          v-model:value="formData[settingItem.key]"
          :name="settingItem.key"
        >
          <n-radio-button
            v-for="(option, index) in settingItem.options"
            :key="settingItem.key + '-option-' + index"
            :value="option.value"
            :label="option.label"
          />
        </n-radio-group>
        <n-select
          v-if="settingItem.type === 'select'"
          v-model:value="formData[settingItem.key]"
          :options="settingItem.options"
          :style="{ width: isMobile ? '75%' : '60%' }"
        />
        <n-cascader
          v-if="settingItem.type === 'cascader'"
          v-model:value="formData[settingItem.key]"
          :expand-trigger="!isMobile ? 'hover' : 'click'"
          :options="settingItem.options"
          check-strategy="child"
          show-path
          filterable
          :style="{ width: isMobile ? '85%' : '70%' }"
        />
        <n-input
          v-if="settingItem.type === 'string'"
          v-model:value="formData[settingItem.key]"
          type="text"
          :style="{ width: isMobile ? '85%' : '70%' }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-collapse-item__content-inner) {
  padding-top: 0 !important;
}

.setting-item {
  .item-title {
    font-weight: bold;
  }
  .item-descriptions {
    user-select: text;
  }
  .item-input {
    margin-top: 5px;
  }
}
</style>