<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import {
  NButton, NCard, NIcon, NModal, NRadio
} from 'naive-ui'
import {
  UpdateSharp,
  VpnLockRound,
  SystemUpdateAltRound,
  BrowserUpdatedRound,
  SpeedRound, RefreshRound
} from '@vicons/material'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import AppStatus from '@/variables/app-status'
import { checkUrlLag } from '@/tools/web-request'
import type { AppVersionJson } from '@/models'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })

watch(showModal, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    handleCheckUpdates()
  }
})

const latestHqHelperVersion = ref<string | null>('')
const latestElectronVersion = ref<string | null>('')
const proxyValue = ref('https://mirror.ghproxy.com')
const proxyPings = ref<Record<string, number | "timeout" | "unknown">>({})
const proxyOptions = [
  { label: t('不使用加速服务'), value: '' },
  { label: 'mirror.ghproxy.com', value: 'https://mirror.ghproxy.com' },
  { label: 'github.moeyy.xyz', value: 'https://github.moeyy.xyz' },
  { label: 'ghps.cc', value: 'https://ghps.cc' }
  // https://www.cnblogs.com/ting1/p/18356265
]
const currentElectronVersion = computed(() => {
  return window.electronAPI?.clientVersion ?? 'UNKNOWN'
})
const hqhelperNeedUpdate = computed(() => {
  return latestHqHelperVersion.value && latestHqHelperVersion.value != AppStatus.Version
})
const electronNeedUpdate = computed(() => {
  return latestElectronVersion.value && latestElectronVersion.value != AppStatus.Version
})

const handleCheckUpdates = async () => {
  if (!window.electronAPI?.httpGet) {
    alert('electronAPI.httpGet is not defined'); return
  }
  latestHqHelperVersion.value = ''
  latestElectronVersion.value = ''
  try {
    let url = document?.location?.origin + document.location.pathname + 'version.json'
    if (window.electronAPI?.clientVersion || url.includes('localhost')) {
      url = 'https://hqhelper.nbb.fan/version.json'
    }
    const versionResponse = await window.electronAPI.httpGet(url)
    const versionContent = JSON.parse(versionResponse) as AppVersionJson
    latestHqHelperVersion.value = versionContent.hqhelper
    latestElectronVersion.value = versionContent.electron
  } catch (e) {
    console.error(e)
    alert(t('检查更新失败：{error}', e))
    latestHqHelperVersion.value = null
    latestElectronVersion.value = null
  }
}

const getDoUpdateBtnText = (versionNow: string, versionLatest: string | null) => {
  if (versionLatest === '') {
    return t('检测中……')
  } else if (versionLatest === null) {
    return t('检测失败')
  } else if (versionNow === versionLatest) {
    return t('已是最新版本')
  } else {
    return t('立即更新', versionLatest)
  }
}

const handleProxyOptionChange = (e: Event) => {
  proxyValue.value = (e.target as HTMLInputElement).value
}
const handlePing = async () => {
  proxyPings.value = {}
  for (const proxyUrl of proxyOptions.map(o => o.value)) {
    proxyPings.value[proxyUrl] = await checkUrlLag(proxyUrl || 'github.com')
  }
}
const getProxyPingText = (proxy: string) => {
  const ping = proxyPings.value[proxy]
  if (ping === undefined) {
    return ''
  } else if (ping === 'timeout') {
    return t('超时')
  } else if (ping === 'unknown') {
    return t('未知')
  } else {
    return ping + 'ms'
  }
}
const getProxyPingStyle = (proxy: string) => {
  const ping = proxyPings.value[proxy]
  if (ping === undefined) {
    return ''
  } else if (ping === 'timeout') {
    return 'color: red;'
  } else if (ping === 'unknown') {
    return 'color: royalblue;'
  } else if (ping < 300) {
    return 'color: green;'
  } else if (ping < 800) {
    return 'color: orange;'
  } else {
    return 'color: orangered;'
  }
}

const handleDownloadWebPack = () => {
  if (!window.electronAPI?.downloadUpdatePack) {
    alert('electronAPI.downloadUpdatePack is not defined'); return
  }
}
const handleDownloadElectronPack = () => {
  const func = window.electronAPI?.openUrlByBrowser ?? window.open
  let proxy = proxyValue.value || ''
  if (proxy) proxy = `https://${proxy}/`
  func(`${proxy}https://github.com/InfSein/hqhelper-dawntrail/releases/download/electron.${latestElectronVersion.value}/HqHelper.Setup.exe`)
}

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
      style="width: 98%; max-width: 600px;"
      @close="handleClose"
    >
      <template #header>
        <div class="card-title">
          <n-icon><UpdateSharp /></n-icon>
          <span class="title">{{ t('检查更新') }}</span>
        </div>
      </template>

      <div class="wrapper">
        <FoldableCard class="card proxy" card-key="modal-cu-proxy" card-size="small">
          <template #header>
            <div class="card-title">
              <n-icon><VpnLockRound /></n-icon>
              <span class="title">{{ t('加速服务') }}</span>
            </div>
          </template>

          <div class="proxy-card-container">
            <div class="tip-text">
            </div>
            <div class="proxy-actions">
            </div>
            <div class="proxy-selection-container">
              <div
                class="proxy-item"
                v-for="option in proxyOptions"
                :key="'proxy-' + option.value"
              >
                <div class="proxy-option">
                  <n-radio
                    name="proxy-option"
                    :checked="proxyValue === option.value"
                    :value="option.value"
                    @change="handleProxyOptionChange"
                  >
                    {{ option.label }}
                  </n-radio>
                </div>
                <div class="proxy-ping" :style="getProxyPingStyle(option.value)">
                  {{ getProxyPingText(option.value) }}
                </div>
              </div>
            </div>
            <div class="edge-top-right">
              <n-button size="tiny" @click="handlePing">
                <template #icon>
                  <n-icon><SpeedRound /></n-icon>
                </template>
                {{ t('测速') }}
              </n-button>
            </div>
          </div>
        </FoldableCard>
        <n-card class="card web-version" size="small" embedded :bordered="false">
          <template #header>
            <div class="card-title">
              <n-icon><SystemUpdateAltRound /></n-icon>
              <span class="title">{{ t('HqHelper版本') }}</span>
            </div>
          </template>

          <div class="version-card-container">
            <div class="versions">
              <div>{{ t('当前版本：{v}', AppStatus.Version) }}</div>
              <div>
                <span>{{ t('最新版本：') }}</span>
                <span v-if="latestHqHelperVersion">{{ latestHqHelperVersion }}</span>
                <span v-else-if="latestHqHelperVersion===''">{{ t('检测中……') }}</span>
                <span v-else>{{ t('检测失败') }}</span>
              </div>
            </div>
            <div class="edge-top-right">
              <n-button size="tiny" class="btn-recheck" :disabled="!latestHqHelperVersion" @click="handleCheckUpdates">
                <template #icon>
                  <n-icon><RefreshRound /></n-icon>
                </template>
                {{ t('重新检测') }}
              </n-button>
            </div>
            <div class="action">
              <n-button
                class="btn-do-update"
                :disabled="!hqhelperNeedUpdate"
                @click="handleDownloadWebPack"
              >
                {{ getDoUpdateBtnText(AppStatus.Version, latestHqHelperVersion) }}
              </n-button>
            </div>
          </div>
        </n-card>
        <n-card class="card web-version" size="small" embedded :bordered="false">
          <template #header>
            <div class="card-title">
              <n-icon><BrowserUpdatedRound /></n-icon>
              <span class="title">{{ t('客户端版本') }}</span>
            </div>
          </template>

          <div class="version-card-container">
            <div class="versions">
              <div>{{ t('当前版本：{v}', currentElectronVersion) }}</div>
              <div>
                <span>{{ t('最新版本：') }}</span>
                <span v-if="latestElectronVersion">{{ latestElectronVersion }}</span>
                <span v-else-if="latestElectronVersion===''">{{ t('检测中……') }}</span>
                <span v-else>{{ t('检测失败') }}</span>
              </div>
            </div>
            <div class="edge-top-right">
              <n-button size="tiny" class="btn-recheck" @click="handleCheckUpdates">
                <template #icon>
                  <n-icon><RefreshRound /></n-icon>
                </template>
                {{ t('重新检测') }}
              </n-button>
            </div>
            <div class="action">
              <n-button
                class="btn-do-update"
                :disabled="!electronNeedUpdate"
                @click="handleDownloadElectronPack"
              >
                {{ getDoUpdateBtnText(currentElectronVersion, latestElectronVersion) }}
              </n-button>
            </div>
          </div>
        </n-card>
      </div>
    </n-card>
  </n-modal>
</template>

<style scoped>
/* All */
.wrapper {
  gap: 1rem;
  user-select: text;
}
.proxy-card-container {
  position: relative;

  .proxy-selection-container {
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 3px;

    .proxy-item {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
  }
}
.version-card-container {
  position: relative;

  .btn-do-update {
    margin-top: 5px;
    width: 100%;
    height: 60px;
  }
}
.submit-container {
  display: flex;
  justify-content: flex-end;
}

/* Desktop */
@media screen and (min-width: 768px) {
  .wrapper {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    .card.proxy {
      grid-column: 1 / 3;
    }
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .wrapper {
    display: flex;
    flex-direction: column;
  }
}
</style>