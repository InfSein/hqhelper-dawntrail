<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NCard, NIcon, NModal
} from 'naive-ui'
import { 
  TableViewOutlined
} from '@vicons/material'
import GroupBox from '../custom-controls/GroupBox.vue'
import ItemList from '../custom-controls/ItemList.vue'
import type { ItemInfo } from '@/tools/item';

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
// const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const showModal = defineModel<boolean>('show', { required: true })

defineProps({
  craftTargets: {
    type: Array as () => ItemInfo[],
    required: true
  },
  materialsLv1: {
    type: Array as () => ItemInfo[],
    required: true
  },
  materialsLv2: {
    type: Array as () => ItemInfo[],
    required: true
  },
  materialsLv3: {
    type: Array as () => ItemInfo[],
    required: true
  },
  materialsLv4: {
    type: Array as () => ItemInfo[],
    required: true
  },
  materialsLv5: {
    type: Array as () => ItemInfo[],
    required: true
  },
  materialsLvBase: {
    type: Array as () => ItemInfo[],
    required: true
  }
})

const handleClose = () => {
  showModal.value = false
}
</script>

<template>
  <n-modal v-model:show="showModal">
    <n-card
      closable
      role="dialog"
      class="no-select"
      style="width: 98%; max-width: 1500px;"
      :style="{ height: isMobile ? '650px' : '600px' }"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><TableViewOutlined /></n-icon>
          <span class="title">{{ t('制作报表') }}</span>
        </div>
      </template>

      <div class="wrapper desktop">
        <GroupBox id="craft-target" class="group" title-background-color="var(--n-color-modal)">
          <template #title>{{ t('成品清单') }}</template>
          <div class="container">
            <ItemList
              :items="craftTargets"
              :list-height="isMobile ? undefined : 480"
            />
          </div>
        </GroupBox>
        <GroupBox id="craft-target" class="group" title-background-color="var(--n-color-modal)">
          <template #title>{{ t('制作素材：直接') }}</template>
          <div class="container">
            <ItemList
              :items="materialsLv1"
              :list-height="isMobile ? undefined : 480"
            />
          </div>
        </GroupBox>
        <GroupBox id="craft-target" class="group" title-background-color="var(--n-color-modal)">
          <template #title>{{ t('制作素材：二级') }}</template>
          <div class="container">
            <ItemList
              :items="materialsLv2"
              :list-height="isMobile ? undefined : 480"
            />
          </div>
        </GroupBox>
        <GroupBox id="craft-target" class="group" title-background-color="var(--n-color-modal)">
          <template #title>{{ t('制作素材：基础') }}</template>
          <div class="container">
            <ItemList
              :items="materialsLvBase"
              :list-height="isMobile ? undefined : 480"
            />
          </div>
        </GroupBox>
      </div>
    </n-card>
  </n-modal>
</template>

<style scoped>
/* All */
.wrapper {
  user-select: text;
}
.wrapper.desktop {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.group .container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
}

/* Mobile only */
/* @media (max-width: 768px)*/
</style>