<script setup lang="ts" name="ErrorPage404">
import { computed, inject } from 'vue'
import {
  NTable
} from 'naive-ui'
import { XivJobs } from '@/assets/data'
import JobSpan from '@/components/custom/job/JobSpan.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

const frontlines = {
  sealRock: {
    name: '尘封秘岩',
    matchTypeName: '争夺战',
    img: ''
  },
  fieldOfGlory: {
    name: '荣誉野',
    matchTypeName: '碎冰战',
    img: ''
  },
  onsalHakair: {
    name: '昂萨哈凯尔',
    matchTypeName: '竞争战',
    img: ''
  },
  borderlandRuins: {
    name: '周边遗迹群',
    matchTypeName: '阵地战',
    img: ''
  },
}

const data = [
  {
    date: '2025-04-04',
    time: '11:14:55',
    job: 19,
    match: frontlines.sealRock,
    summary: {
      kills: 1,
      deaths: 4,
      assists: 15,
      damage: {
        player: 167820,
        npc: 0,
      }
    }
  },
  {
    date: '2025-04-03',
    time: '22:44:12',
    job: 20,
    match: frontlines.fieldOfGlory,
    summary: {
      kills: 0,
      deaths: 0,
      assists: 0,
      damage: {
        player: 0,
        npc: 2886415,
      }
    }
  },
  {
    date: '2025-04-02',
    time: '18:30:27',
    job: 21,
    match: frontlines.onsalHakair,
    summary: {
      kills: 3,
      deaths: 2,
      assists: 9,
      damage: {
        player: 204532,
        npc: 18765,
      }
    }
  },
  {
    date: '2025-04-01',
    time: '15:12:49',
    job: 22,
    match: frontlines.borderlandRuins,
    summary: {
      kills: 5,
      deaths: 6,
      assists: 12,
      damage: {
        player: 312874,
        npc: 45682,
      }
    }
  },
  {
    date: '2025-03-31',
    time: '20:55:33',
    job: 23,
    match: frontlines.sealRock,
    summary: {
      kills: 2,
      deaths: 3,
      assists: 8,
      damage: {
        player: 147980,
        npc: 21230,
      }
    }
  }
]
</script>

<template>
  <div id="main-container" class="flex-center w-full h-full">
    <n-table :single-line="false">
      <thead>
        <tr>
          <th rowspan="2">日期</th>
          <th rowspan="2">职业</th>
          <th colspan="4">战绩</th>
        </tr>
        <tr>
          <th>K</th>
          <th>D</th>
          <th>A</th>
          <th>伤害</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in data"
          :key="index"
          :class="{
            'bg-gray-100': index % 2 === 0,
            'bg-gray-200': index % 2 !== 0
          }"
        >
          <td>{{ item.date }} {{ item.time }}</td>
          <td>
            <JobSpan
              :jobId="item.job"
              style="display: flex; align-items: center; justify-content: center;"
            />
          </td>
          <td>{{ item.summary.kills }}</td>
          <td>{{ item.summary.deaths }}</td>
          <td>{{ item.summary.assists }}</td>
          <td>
            <div class="cell-damage">
              <div>
                <span class="bold">对人</span>
                <span>{{ item.summary.damage.player }}</span>
              </div>
              <div>
                <span class="bold">对物</span>
                <span>{{ item.summary.damage.npc }}</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<style scoped>
th {
  text-align: center;
  vertical-align: middle;
  font-weight: bold;
}
td {
  text-align: center;
  vertical-align: middle;
}
.cell-damage {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 4px;
  div {
    display: flex;
    gap: 2px;
  }
}
</style>