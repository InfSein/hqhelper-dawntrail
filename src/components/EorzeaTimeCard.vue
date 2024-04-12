<script setup lang="ts">
import { type Ref, computed, inject, ref } from 'vue'
import EorzeaTime from '../tools/EorzeaTime'

const locale = inject<Ref<"zh" | "en" | "ja">>('locale') ?? ref('zh');
const isChina = computed(() => locale.value === 'zh');

const eorzeaTime = ref<EorzeaTime>(new EorzeaTime())
setInterval(() => {
  eorzeaTime.value = new EorzeaTime()
}, 200)
</script>

<template>
  <n-card embedded :bordered="false">
    <n-flex style="justify-content: center; align-items: center;">
      <n-popover trigger="hover">
        <template #trigger>
          <p>
            <span v-if="isChina"><i class="xiv local-time-chs"></i></span>
            <span v-else><i class="xiv local-time"></i></span>
            <span class="time-text">{{ eorzeaTime.localTime }}</span>
          </p>
        </template>
        <div class="flex-column flex-center">
          <p class="font-center">{{ t('本地时间') }}</p>
        </div>
      </n-popover>
      <n-divider vertical />
      <n-popover trigger="hover">
        <template #trigger>
          <p>
            <span v-if="isChina"><i class="xiv eorzea-time-chs"></i></span>
            <span v-else><i class="xiv eorzea-time"></i></span>
            <span class="time-text">{{ eorzeaTime.gameTime }}</span>
          </p>
        </template>
        <div class="flex-column flex-center">
          <p class="font-center">{{ t('艾欧泽亚时间') }}</p>
        </div>
      </n-popover>
    </n-flex>
  </n-card>
</template>

<style scoped>
.time-text {
  margin-left: 5px;
  /* font-family: system-ui, -apple-system; */
  font-weight: 400;
}
</style>