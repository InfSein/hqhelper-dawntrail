<script setup lang="ts" name="FT Helper">
import { computed, inject, ref } from 'vue'
import {
  NButton, NResult
} from 'naive-ui'
import { useNbbCal } from '@/tools/use-nbb-cal'
import ItemSelectionPanel from '@/components/ft-helper/ItemSelectionPanel.vue'
import StatisticsPanel from '@/components/ft-helper/StatisticsPanel.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

const { doCal, getFoodAndTincs } = useNbbCal()

const workState = ref({
  patch: '7.0',
  itemSelected: {} as Record<number, number>
})

const fixItemSelections = () => {
  const data = getFoodAndTincs()
  data.forEach(pd => {
    pd.foods?.forEach(item => {
      if (workState.value.itemSelected[item] === undefined) {
        workState.value.itemSelected[item] = 0
      }
    })
    pd.tincs?.forEach(item => {
      if (workState.value.itemSelected[item] === undefined) {
        workState.value.itemSelected[item] = 0
      }
    })
  })
}
fixItemSelections()

const itemSelected = ref<Record<number, number>>({})
</script>

<template>
  <div id="main-container">
    <div id="left-layout">
      <ItemSelectionPanel
        v-model:patch="workState.patch"
        v-model:item-selected="workState.itemSelected"
      />
    </div>
    <div id="right-layout">
      <StatisticsPanel
      />
    </div>
  </div>
</template>

<style scoped>
/* All */
#main-container {
  max-width: 100%;
}

/* PC only */
@media screen and (min-width: 768px) {
  #main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
    overflow: auto;
  }
}

/* Mobile only */
@media screen and (max-width: 767px) {
  #main-container {
    display: flex;
    flex-direction: column;

    #left-layout {
      width: 100%;
      display: flex;
      flex-direction: column;

      .job-panel {
        width: 100%;
      }
      .gear-panel {
        width: 100%;
      }
    }
    #right-layout {
      width: 100%;

      .statistics-panel {
        width: 100%;
      }
    }
  }
}
</style>