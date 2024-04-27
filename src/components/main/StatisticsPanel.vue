<script setup lang='ts'>
import { ref, inject } from 'vue'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import GroupBox from '../custom-controls/GroupBox.vue'
  
const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

const sampleData = ref({
  tinctureBtns: [
    { text: '刚力', color: 'rgb(255,128,128)', amount: 0 },
    { text: '巧力', color: 'rgb(128,128,255)', amount: 6 },
    { text: '耐力', color: 'rgb(255,192,128)', amount: 11 },
    { text: '智力', color: 'rgb(0,191,255)', amount: 95 },
    { text: '意力', color: 'rgb(64,224,208)', amount: 2 },
    { text: '点数', color: 'rgb(240,240,240)', amount: 999 }
  ],
  masterBtns: [
    { job: '刻木', text: '暗樱木材', amount: 10 },
    { job: '锻铁', text: '软银锭', amount: 20 },
    { job: '雕金', text: '紫锂辉石', amount: 0 },
    { job: '制革', text: '恐鳄鞣革', amount: 8 },
    { job: '裁缝', text: '石榴红棉布', amount: 120 },
  ]
})
</script>

<template>
  <FoldableCard card-key="main-statistics">
    <template #header>
      <i class="xiv square-4"></i>
      <span class="card-title-text">{{ t('查看统计') }}</span>
    </template>
    <n-flex>
      <n-card size="small">
        <template #title>{{ t('半成品表') }}</template>
        <n-flex size="small">
          <GroupBox>
            <template #title>{{ t('特殊') }}</template>
            <n-flex>
              <n-button
                v-for="(btn, btnIndex) in sampleData.tinctureBtns"
                :key="'tinctureBtn' + btnIndex"
                :color="btn.color"
              >
                <p>{{ btn.text }}</p>
                <p>x {{ btn.amount }}</p>
              </n-button>
            </n-flex>
          </GroupBox>
          <GroupBox>
            <template #title>{{ t('秘籍半成品') }}</template>
            <n-flex>
              <n-button
                v-for="(btn, btnIndex) in sampleData.masterBtns"
                :key="'masterBtns' + btnIndex"
              >
                <p>{{ btn.job }} - {{ btn.text }}</p>
                <p>x {{ btn.amount }}</p>
              </n-button>
            </n-flex>
          </GroupBox>
        </n-flex>
      </n-card>
    </n-flex>
  </FoldableCard>
</template>
  
<style scoped>
  
</style>