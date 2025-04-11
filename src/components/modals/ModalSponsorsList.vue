<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import {
  NBadge, NIcon, NTable, NScrollbar, NSpin, NTooltip,
} from 'naive-ui'
import {
  ChecklistRtlSharp
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })

interface SponsorInfo {
  name: string;
  date: string;
  word: string;
  isGen1Sponsor?: boolean;
}

const sponsorLoadingStatus = ref<"finished" | "loading" | "error">('loading')
const sponsorLoadError = ref('')
const sponsors = ref<SponsorInfo[]>([])

const loadSponsors = async () => {
  try {
    sponsorLoadingStatus.value = 'loading'
    sponsorLoadError.value = ''
    sponsors.value = []
    let loadSponsorsResponse : string
    let url = document?.location?.origin + document.location.pathname + 'data/sponsors.json'
    if (window.electronAPI?.httpGet) {
      url = 'https://hqhelper.nbb.fan/data/sponsors.json'
      loadSponsorsResponse = await window.electronAPI.httpGet(url)
    } else {
      loadSponsorsResponse = await fetch(url)
        .then(response => response.text())
    }
    const sponsorsContent = JSON.parse(loadSponsorsResponse) as {
      sponsors: SponsorInfo[]
    }
    sponsors.value = sponsorsContent.sponsors
    sponsorLoadingStatus.value = 'finished'
  } catch (e: any) {
    sponsorLoadingStatus.value = 'error'
    sponsorLoadError.value = e?.message ?? 'UNKNOWN ERROR' + e
  }
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="ChecklistRtlSharp"
    :title="t('致谢名单')"
    @on-load="loadSponsors"
  >
    <div class="wrapper">
      <div v-if="sponsorLoadingStatus === 'loading'" class="spin-container">
        <n-spin size="small" style="text-indent: initial;" />
        <div>{{ t('正在加载……') }}</div>
      </div>
      <n-alert
        v-else-if="sponsorLoadingStatus === 'error'"
        type="error"
        :title="t('加载失败')"
        class="alert-container"
      >
        <div>{{ sponsorLoadError }}</div>
        <a @click="loadSponsors">
          <n-icon :size="14"><RefreshOutlined /></n-icon>
          {{ t('重试') }}
        </a>
      </n-alert>
      <div v-else class="table-container">
        <n-table :single-line="false">
          <thead>
            <tr>
              <th>{{ t('赞助者') }}</th>
              <th>{{ t('日期') }}</th>
              <th>{{ t('留言') }}</th>
            </tr>
          </thead>
        </n-table>
        <n-scrollbar trigger="none" :style="{ height: '400px', 'margin-top': '-2px' }">
          <n-table class="table" size="small" :single-line="false">
            <tbody>
              <tr v-for="(sponsor, index) in sponsors" :key="'sponsor-' + index">
                <td>
                  <div class="sponsor-cell">
                    <span>{{ sponsor.name }}</span>
                    <n-tooltip v-if="sponsor.isGen1Sponsor" :trigger="isMobile ? 'click' : 'hover'">
                      <template #trigger>
                        <n-badge type="warning" value="Gen1" />
                      </template>
                      {{ t('前代HqHelper的赞助者') }}
                    </n-tooltip>
                  </div>
                </td>
                <td>
                  {{ sponsor.date }}
                </td>
                <td>
                  {{ sponsor.word }}
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-scrollbar>
      </div>
    </div>
  </MyModal>
</template>

<style scoped>
.wrapper {
  height: 450px;

  .spin-container {
    display: flex;
    align-items: center;
    gap: 3px;
    margin: 5px 0 0 1.2em;
    text-indent: initial;
  }
  .alert-container {
    margin: 5px 2em 0 1.2em;

    a {
      padding: 0;
      margin-left: 3px;
      display: flex;
      line-height: 1;
      cursor: pointer;
      width: fit-content;
      text-indent: initial;
    }
  }
  .table-container {
    table {
      width: 100%;

      th {
        font-weight: bold;
      }
      th:first-child, td:first-child,
      th:nth-child(3), td:nth-child(3) {
        width: 40%;
      }
      th:nth-child(2), td:nth-child(2),
      th:nth-child(3), td:nth-child(3) {
        text-align: center;
      }
      .sponsor-cell {
        display: flex;
        align-items: center;
        padding-left: 6px;
      }
    }
  }
}
</style>