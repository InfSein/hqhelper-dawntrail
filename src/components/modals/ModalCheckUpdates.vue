<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue'
import {
  NAlert, NButton, NCard, NIcon, NRadio
} from 'naive-ui'
import {
  UpdateSharp,
  VpnLockRound,
  SystemUpdateAltRound,
  BrowserUpdatedRound,
  SpeedRound, RefreshRound
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import type { ProgressData } from 'env.electron'
import FoldableCard from '../custom-controls/FoldableCard.vue'
import AppStatus from '@/variables/app-status'
import { checkUrlLag } from '@/tools/web-request'
import type { AppVersionJson } from '@/models'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)

const showModal = defineModel<boolean>('show', { required: true })

onMounted(() => {
  if (window.electronAPI?.onUpdateProgress) {
    window.electronAPI.onUpdateProgress(handleProgress)
  } else {
    updateTip.preText = t('{ver}版本以上的客户端才能查看当前更新进度。', {
      ver: 'v3'
    })
  }
})
const onLoad = async () => {
  if (window.electronAPI?.clientVersion) {
    currentElectronVersion.value = await window.electronAPI?.clientVersion
  }
  handleCheckUpdates()
}

const checkingUpdates = ref(false)
const updating = ref(false)
const updateTip = reactive({
  updating: false,
  preText: '',
  downloaded: '',
  total: '',
  downloadSpeed: ''
})
const versionContent = ref<AppVersionJson>()
const latestHqHelperVersion = ref<string | null>('')
const latestElectronVersion = ref<string | null>('')
const proxyValue = ref('https://mirror.ghproxy.com')
const proxyPings = ref<Record<string, number | "timeout" | "unknown" | "error">>({})
const proxyOptions = [
  { label: t('不使用加速服务'), value: '' },
  { label: 'mirror.ghproxy.com', value: 'https://mirror.ghproxy.com' },
  { label: 'ghp.ci', value: 'https://ghp.ci' },
  { label: 'github.moeyy.xyz', value: 'https://github.moeyy.xyz' },
  { label: 'ghps.cc', value: 'https://ghps.cc' }
  // https://www.cnblogs.com/ting1/p/18356265
]
const currentElectronVersion = ref('UNKNOWN')
const hqhelperNeedUpdate = computed(() => {
  return latestHqHelperVersion.value && latestHqHelperVersion.value != AppStatus.Version
})
const electronNeedUpdate = computed(() => {
  return latestElectronVersion.value && latestElectronVersion.value != currentElectronVersion.value
})

const handleProgress = (progressData: ProgressData) => {
  updateTip.downloaded = progressData.progress?.downloaded ?? "???"
  updateTip.total = progressData.progress?.total ?? "???"
  updateTip.downloadSpeed = progressData.progress?.speed ?? "???"
  switch (progressData.stage) {
    case 'requesting': 
      updateTip.preText = t('正在建立连接……')
      break
    case 'downloading':
      updateTip.preText = t('正在下载更新包…… 已下载{now}MB，总需下载{total}MB | 当前速度：{speed}MB/s',
        { now: updateTip.downloaded, total: updateTip.total, speed: updateTip.downloadSpeed }
      )
      break
    case 'extracting':
      updateTip.preText = t('正在解压更新包……')
      break
    case 'replacing':
      updateTip.preText = t('正在替换文件……')
      break
    case 'cleaning':
      updateTip.preText = t('正在清理临时文件……')
      break
    case 'relaunching':
      updateTip.preText = t('正在重启程序……')
      break
    case 'end':
      updateTip.updating = false
      break
    default:
      updateTip.preText = ''
  }
}
const handleCheckUpdates = async () => {
  if (!window.electronAPI?.httpGet) {
    alert('electronAPI.httpGet is not defined'); return
  }
  checkingUpdates.value = true
  latestHqHelperVersion.value = ''
  latestElectronVersion.value = ''
  try {
    let url = document?.location?.origin + document.location.pathname + 'version.json'
    if (window.electronAPI || url.includes('localhost')) {
      url = 'https://hqhelper.nbb.fan/version.json'
    }
    const versionResponse = await window.electronAPI.httpGet(url)
    versionContent.value = JSON.parse(versionResponse) as AppVersionJson
    latestHqHelperVersion.value = versionContent.value.hqhelper
    latestElectronVersion.value = versionContent.value.electron
  } catch (e: any) {
    console.error(e)
    alert(t('检查更新失败：{error}', e?.message || 'UNKNOWN ERROR' + e))
    latestHqHelperVersion.value = null
    latestElectronVersion.value = null
  } finally {
    checkingUpdates.value = false
  }
}

const getDoUpdateBtnText = (versionNow: string, versionLatest: string | null, dontshowUpdating = false) => {
  if (versionLatest === '') {
    return t('检测中……')
  } else if (versionLatest === null) {
    return t('检测失败')
  } else if (versionNow === versionLatest) {
    return t('已是最新版本')
  } else if (!dontshowUpdating && (updateTip.updating || updating.value)) {
    return t('正在更新')
  } else {
    return t('立即更新', versionLatest)
  }
}

const handleProxyOptionChange = (e: Event) => {
  proxyValue.value = (e.target as HTMLInputElement).value
}
const handlePing = async () => {
  proxyPings.value = {}
  const pingFunc = window.electronAPI?.simulatePing || checkUrlLag
  for (const proxyUrl of proxyOptions.map(o => o.value)) {
    try {
      proxyPings.value[proxyUrl] = await pingFunc(proxyUrl || 'github.com')
    } catch {
      proxyPings.value[proxyUrl] = 'error'
    }
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
  } else if (ping === 'error') {
    return t('错误')
  } else {
    return ping + 'ms'
  }
}
const getProxyPingStyle = (proxy: string) => {
  const ping = proxyPings.value[proxy]
  if (ping === undefined) {
    return ''
  } else if (ping === 'timeout' || ping === 'error') {
    return 'color: red;'
  } else if (ping === 'unknown') {
    return 'color: royalblue;'
  } else if (ping < 200) {
    return 'color: green;'
  } else if (ping < 400) {
    return 'color: orange;'
  } else {
    return 'color: orangered;'
  }
}

const handleDownloadWebPack = async () => {
  if (!window.electronAPI?.downloadUpdatePack) {
    alert('electronAPI.downloadUpdatePack is not defined'); return
  }
  if (!window.confirm(
    t('即将开始下载HqHelper更新包，可能需要一些时间。')
    + '\n' + t('更新成功后将自动重启程序。')
    + '\n' + t('如果长时间无反应，请尝试关闭程序，重新打开并调整“加速服务”的设置。')
    + '\n' + t('确认要现在开始更新吗?')
  )) {
    return
  }
  updating.value = true
  updateTip.updating = true

  let proxy = proxyValue.value || ''
  if (proxy) proxy = `${proxy}/`
  let url = versionContent.value?.dlink_hqhelper
  if (!url) {
    alert('Update link not given. Server might be undergoing maintenance...')
  } else if (!latestHqHelperVersion.value) {
    alert('latestHqHelperVersion not given, Please retry later.')
  } else {
    url = url.replace('~PROXY', proxy)
    url = url.replace('~VERSION', latestHqHelperVersion.value)
    const err = await window.electronAPI.downloadUpdatePack(url)
    if (err) {
      alert(t('下载更新包失败：{errmsg}', err))
      updateTip.preText = ''
    }
  }
  updating.value = false
}
const handleDownloadElectronPack = () => {
  if (!window.confirm(
    t('即将开始下载客户端更新包。由于客户端体积较大，将调用系统默认浏览器打开下载页。')
    + '\n' + t('下载成功后，运行下载的安装包即可将客户端更新到新版本。')
    + '\n' + t('如果下载速度过慢，请尝试取消下载，调整“加速服务”的设置后重试。')
    + '\n' + t('确认要现在开始更新吗?')
  )) {
    return
  }
  const func = window.electronAPI?.openUrlByBrowser ?? window.open
  let proxy = proxyValue.value || ''
  if (proxy) proxy = `${proxy}/`
  let url = versionContent.value?.dlink_electron
  if (!url) {
    alert('Update link not given. Server might be undergoing maintenance...')
  } else if (!latestElectronVersion.value) {
    alert('latestElectronVersion not given, Please retry later.')
  } else {
    url = url.replace('~PROXY', proxy)
    url = url.replace('~VERSION', latestElectronVersion.value)
    func(url)
  }
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="UpdateSharp"
    :title="t('检查更新')"
    height="auto"
    @on-load="onLoad"
  >
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
            <n-button size="tiny" class="btn-recheck" :loading="checkingUpdates" @click="handleCheckUpdates">
              <template #icon>
                <n-icon><RefreshRound /></n-icon>
              </template>
              {{ t('重新检测') }}
            </n-button>
          </div>
          <div class="action">
            <n-button
              class="btn-do-update"
              :loading="updating || updateTip.updating"
              :disabled="!hqhelperNeedUpdate || updating || updateTip.updating"
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
            <n-button size="tiny" class="btn-recheck" :loading="checkingUpdates" @click="handleCheckUpdates">
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
              {{ getDoUpdateBtnText(currentElectronVersion, latestElectronVersion, true) }}
            </n-button>
          </div>
        </div>
      </n-card>
      <n-alert v-if="updateTip.preText" class="card upd-tip" type="info">
        {{ updateTip.preText }}
      </n-alert>
    </div>
  </MyModal>
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

    .card.proxy, .card.upd-tip {
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