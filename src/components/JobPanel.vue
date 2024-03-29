<script setup lang="ts">
import { inject } from 'vue'
import JobButton from './user-controls/JobButton.vue'
import GroupBox from './user-controls/GroupBox.vue'

const t = inject<(i18nKey: string) => string>('t') ?? (() => { return '' })

// todo: I dont know how to import icons automatically
// for now, they have to be imported manually
// import codes could be collapsed by `region`
// todo: After the better solution is found, codes below should be refactored

// #region data

import IconDoH from '@/assets/game-icons/jobs/role/clear_doh.png'
import IconDoL from '@/assets/game-icons/jobs/role/clear_dol.png'
import IconDpsMagic from '@/assets/game-icons/jobs/role/clear_dps_magic.png'
import IconDpsMelee from '@/assets/game-icons/jobs/role/clear_dps.png'
import IconDpsRanged from '@/assets/game-icons/jobs/role/clear_dps_ranged.png'
import IconTank from '@/assets/game-icons/jobs/role/clear_tank.png'
import IconHealer from '@/assets/game-icons/jobs/role/clear_healer.png'

import IconWarrior from '@/assets/game-icons/jobs/job/battle/warrior.png'
import IconPaladin from '@/assets/game-icons/jobs/job/battle/paladin.png'
import IconDarkKnight from '@/assets/game-icons/jobs/job/battle/darkknight.png'
import IconGunbreaker from '@/assets/game-icons/jobs/job/battle/gunbreaker.png'

import IconWhiteMage from '@/assets/game-icons/jobs/job/battle/whitemage.png'
import IconScholar from '@/assets/game-icons/jobs/job/battle/scholar.png'
import IconAstrologian from '@/assets/game-icons/jobs/job/battle/astrologian.png'
import IconSage from '@/assets/game-icons/jobs/job/battle/sage.png'

import IconMonk from '@/assets/game-icons/jobs/job/battle/monk.png'
import IconDragoon from '@/assets/game-icons/jobs/job/battle/dragoon.png'
import IconNinja from '@/assets/game-icons/jobs/job/battle/ninja.png'
import IconReaper from '@/assets/game-icons/jobs/job/battle/reaper.png'

import IconBard from '@/assets/game-icons/jobs/job/battle/bard.png'
import IconMachinist from '@/assets/game-icons/jobs/job/battle/machinist.png'
import IconDancer from '@/assets/game-icons/jobs/job/battle/dancer.png'


import IconBlackMage from '@/assets/game-icons/jobs/job/battle/blackmage.png'
import IconSummoner from '@/assets/game-icons/jobs/job/battle/summoner.png'
import IconRedMage from '@/assets/game-icons/jobs/job/battle/redmage.png'


import IconCarpenter from '@/assets/game-icons/jobs/job/non-battle/carpenter.png'
import IconBlacksmith from '@/assets/game-icons/jobs/job/non-battle/blacksmith.png'
import IconArmorer from '@/assets/game-icons/jobs/job/non-battle/armorer.png'
import IconGoldsmith from '@/assets/game-icons/jobs/job/non-battle/goldsmith.png'
import IconLeatherworker from '@/assets/game-icons/jobs/job/non-battle/leatherworker.png'
import IconWeaver from '@/assets/game-icons/jobs/job/non-battle/weaver.png'
import IconAlchemist from '@/assets/game-icons/jobs/job/non-battle/alchemist.png'
import IconCulinarian from '@/assets/game-icons/jobs/job/non-battle/culinarian.png'

import IconBotanist from '@/assets/game-icons/jobs/job/non-battle/botanist.png'
import IconMiner from '@/assets/game-icons/jobs/job/non-battle/miner.png'
import IconFisher from '@/assets/game-icons/jobs/job/non-battle/fisher.png'

// #endregion

const jobs = {
  tanks: [
    { job: 'warrior', iconPath: IconWarrior },
    { job: 'paladin', iconPath: IconPaladin },
    { job: 'darkknight', iconPath: IconDarkKnight },
    { job: 'gunbreaker', iconPath: IconGunbreaker },
  ],
  healers: [
    { job: 'whitemage', iconPath: IconWhiteMage },
    { job: 'scholar', iconPath: IconScholar },
    { job: 'astrologian', iconPath: IconAstrologian },
    { job: 'sage', iconPath: IconSage },
  ],
  melee_dps: [
    { job: 'monk', iconPath: IconMonk },
    { job: 'dragoon', iconPath: IconDragoon },
    { job: 'ninja', iconPath: IconNinja },
    { job: 'reaper', iconPath: IconReaper },
  ],
  ranged_dps: [
    { job: 'bard', iconPath: IconBard },
    { job: 'machinist', iconPath: IconMachinist },
    { job: 'dancer', iconPath: IconDancer },
  ],
  magic_dps: [
    { job: 'blackmage', iconPath: IconBlackMage },
    { job: 'summoner', iconPath: IconSummoner },
    { job: 'redmage', iconPath: IconRedMage },
  ],
  crafters: [
    { job: 'carpenter', iconPath: IconCarpenter },
    { job: 'blacksmith', iconPath: IconBlacksmith },
    { job: 'armorer', iconPath: IconArmorer },
    { job: 'goldsmith', iconPath: IconGoldsmith },
    { job: 'leatherworker', iconPath: IconLeatherworker },
    { job: 'weaver', iconPath: IconWeaver },
    { job: 'alchemist', iconPath: IconAlchemist },
    { job: 'culinarian', iconPath: IconCulinarian },
  ],
  gatherers: [
    { job: 'botanist', iconPath: IconBotanist },
    { job: 'miner', iconPath: IconMiner },
    { job: 'fisher', iconPath: IconFisher },
  ]
}
</script>

<template>
  <n-card embedded :bordered="false">
    <n-flex :size="[12,12]">
      <GroupBox border-color="#409eff">
        <template #title>
          <img :src="IconTank" width="14" height="14" />
          <span>{{t('防护职业')}}</span>
        </template>
        <n-flex size="small">
          <div v-for="job in jobs.tanks" :key="job.job">
            <JobButton role="tank" :job="job.job" :job-icon="job.iconPath" />
          </div>
        </n-flex>
      </GroupBox>
      <GroupBox border-color="#67c23a">
        <template #title>
          <img :src="IconHealer" width="14" height="14" />
          <span>{{t('治疗职业')}}</span>
        </template>
        <n-flex size="small">
          <div v-for="job in jobs.healers" :key="job.job">
            <JobButton role="healer" :job="job.job" :job-icon="job.iconPath" />
          </div>
        </n-flex>
      </GroupBox>
      <GroupBox border-color="#f56c6c">
        <template #title>
          <img :src="IconDpsMelee" width="14" height="14" />
          <span>{{t('近战职业')}}</span>
        </template>
        <n-flex size="small">
          <div v-for="job in jobs.melee_dps" :key="job.job">
            <JobButton role="dps" :job="job.job" :job-icon="job.iconPath" />
          </div>
        </n-flex>
      </GroupBox>
      <GroupBox border-color="#f56c6c">
        <template #title>
          <img :src="IconDpsRanged" width="14" height="14" />
          <span>{{t('远程物理职业')}}</span>
        </template>
        <n-flex size="small">
          <div v-for="job in jobs.ranged_dps" :key="job.job">
            <JobButton role="dps" :job="job.job" :job-icon="job.iconPath" />
          </div>
        </n-flex>
      </GroupBox>
      <GroupBox border-color="#f56c6c">
        <template #title>
          <img :src="IconDpsMagic" width="14" height="14" />
          <span>{{t('远程魔法职业')}}</span>
        </template>
        <n-flex size="small">
          <div v-for="job in jobs.magic_dps" :key="job.job">
            <JobButton role="dps" :job="job.job" :job-icon="job.iconPath" />
          </div>
        </n-flex>
      </GroupBox>
      <GroupBox border-color="#a4acb2">
        <template #title>
          <img :src="IconDoH" width="14" height="14" />
          <span>{{t('能工巧匠')}}</span>
        </template>
        <n-flex size="small">
          <div v-for="job in jobs.crafters" :key="job.job">
            <JobButton role="other" :job="job.job" :job-icon="job.iconPath" />
          </div>
        </n-flex>
      </GroupBox>
      <GroupBox border-color="#a4acb2">
        <template #title>
          <img :src="IconDoL" width="14" height="14" />
          <span>{{t('大地使者')}}</span>
        </template>
        <n-flex size="small">
          <div v-for="job in jobs.gatherers" :key="job.job">
            <JobButton role="other" :job="job.job" :job-icon="job.iconPath" />
          </div>
        </n-flex>
      </GroupBox>
    </n-flex>
  </n-card>
</template>