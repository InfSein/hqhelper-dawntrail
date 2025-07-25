<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref, type Ref } from 'vue'
import {
  NAlert, NButton, NCard, NIcon, NInput, NRadio
} from 'naive-ui'
import {
  UpdateSharp,
  VpnLockRound,
  SystemUpdateAltRound,
  BrowserUpdatedRound,
  SpeedRound, RefreshRound
} from '@vicons/material'
import MyModal from '../templates/MyModal.vue'
import ModalPreferences from './ModalPreferences.vue'
import FoldableCard from '../templates/FoldableCard.vue'
import type { ProcessStage, ProgressData } from 'env.electron'
import { useStore } from '@/store'
import AppStatus from '@/variables/app-status'
import { checkUrlLag } from '@/tools/web-request'
import type { AppVersionJson } from '@/models'
import { fixUserConfig, type UserConfigModel } from '@/models/config-user'
import { checkAppUpdates } from '@/tools'

const store = useStore()
const t = inject<(message: string, args?: any) => string>('t')!
// const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!

const showModal = defineModel<boolean>('show', { required: true })

onMounted(() => {
  if (window.electronAPI?.onUpdateProgress) {
    window.electronAPI.onUpdateProgress(handleProgress)
  } else {
    updateTip.titleText = t('update.message.require_ver_plus_client_to_see_progress', {
      ver: 'v3'
    })
  }
  useCustomProxy.value = userConfig.value.use_custom_proxy
  customProxyUrl.value = userConfig.value.custom_proxy_url
})
const onLoad = async () => {
  if (window.electronAPI?.clientVersion) {
    currentElectronVersion.value = await window.electronAPI?.clientVersion
  }
  handleCheckUpdates()
}

const checkingUpdates = ref(false)
const updateTip = reactive({
  updating: false,
  updating_hqhelper: false,
  updating_electron: false,
  error: false,
  titleText: '',
  contentText: '',
  downloaded: '',
  total: '',
  downloadSpeed: ''
})
const versionContent = ref<AppVersionJson>()
const latestHqHelperVersion = ref<string | null>('')
const latestElectronVersion = ref<string | null>('')
const useCustomProxy = ref(false)
const customProxyUrl = ref('')
const proxyValue = ref('https://ghfast.top')
const proxyPings = ref<Record<string, number | "timeout" | "unknown" | "error">>({})
const proxyOptions = [
  { label: t('update.proxy.dont_use_proxy'), value: '' },
  { label: 'ghfast.top', value: 'https://ghfast.top' },
  { label: 'github.moeyy.xyz', value: 'https://github.moeyy.xyz' },
  { label: 'gh.jasonzeng.dev', value: 'https://gh.jasonzeng.dev/' },
  // https://www.cnblogs.com/ting1/p/18356265
]
const currentElectronVersion = ref('UNKNOWN')
const hqhelperNeedUpdate = computed(() => {
  return latestHqHelperVersion.value && latestHqHelperVersion.value != AppStatus.Version
})
const electronNeedUpdate = computed(() => {
  return latestElectronVersion.value && latestElectronVersion.value != currentElectronVersion.value
})
const proxy = computed(() => {
  let proxy = proxyValue.value || ''
  if (useCustomProxy.value) {
    proxy = customProxyUrl.value || ''
  }
  if (proxy) proxy = `${proxy}/`
  return proxy
})

const handleShowProxySiteStatus = () => {
  window.open("https://ghproxy.link/")
}
const handleProgress = (progressData: ProgressData) => {
  const error = progressData.error
  const stage = dealProcessStage(progressData.stage)

  updateTip.error = !!error
  updateTip.downloaded = progressData.progress?.downloaded ?? "???"
  updateTip.total = progressData.progress?.total ?? "???"
  updateTip.downloadSpeed = progressData.progress?.speed ?? "???"

  updateTip.titleText = error ? t('update.message.stage_failed', dealProcessStage(error.onstage)) : t('update.message.staging', stage)
  if (progressData.stage === 'downloading') {
    updateTip.titleText += ' ' + t('update.message.downloaded_and_speed',
      { now: updateTip.downloaded, total: updateTip.total, speed: updateTip.downloadSpeed }
    )
  }

  updateTip.contentText = ''
  if (error?.msg) {
    updateTip.contentText = error.msg
  }

  if (progressData.stage === 'end') {
    updateTip.updating_hqhelper = false
    updateTip.updating_electron = false
  }
  updateTip.updating = updateTip.updating_hqhelper || updateTip.updating_electron

  function dealProcessStage(stage: ProcessStage) {
    switch (stage) {
      case 'requesting': return t('update.stage.connecting')
      case 'downloading': return t('update.stage.downloading')
      case 'extracting': return t('update.stage.extracting')
      case 'replacing': return t('update.stage.replacing')
      case 'cleaning': return t('update.stage.cleaning')
      case 'relaunching': return t('update.stage.restarting')
      case 'opening': return t('update.stage.opening')
      case 'end':
      default: return ''
    }
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
    const checkUpdateResponse = await checkAppUpdates()
    if (checkUpdateResponse.success) {
      versionContent.value = checkUpdateResponse.data!
      latestHqHelperVersion.value = versionContent.value.hqhelper
      latestElectronVersion.value = versionContent.value.electron
    } else {
      dealFailure(checkUpdateResponse.message, checkUpdateResponse)
    }
  } catch (e: any) {
    dealFailure(e?.message || 'UNKNOWN ERROR', e)
  } finally {
    checkingUpdates.value = false
  }

  function dealFailure(msg: string, errdata: any) {
    console.error(errdata)
    alert(t('update.message.check_update_failed_with_error', msg))
    latestHqHelperVersion.value = null
    latestElectronVersion.value = null
  }
}

const getDoUpdateBtnText = (versionNow: string, versionLatest: string | null) => {
  if (versionLatest === '') {
    return t('common.checking')
  } else if (versionLatest === null) {
    return t('common.check_failed')
  } else if (versionNow === versionLatest) {
    return t('update.message.already_latest')
  } else {
    return t('common.update_immedi', versionLatest)
  }
}
const hqHelperUpdateBtnText = computed(() => {
  if (updateTip.updating_hqhelper) {
    return t('common.updating')
  } else {
    return getDoUpdateBtnText(AppStatus.Version, latestHqHelperVersion.value)
  }
})
const electronUpdateBtnText = computed(() => {
  if (updateTip.updating_electron) {
    return t('common.updating')
  } else {
    return getDoUpdateBtnText(currentElectronVersion.value, latestElectronVersion.value)
  }
})

const handleProxyOptionChange = (e: Event) => {
  useCustomProxy.value = false
  proxyValue.value = (e.target as HTMLInputElement).value
}
const handlePing = async () => {
  proxyPings.value = {}
  const pingFunc = window.electronAPI?.simulatePing || checkUrlLag
  const doPing = async (proxyUrl: string) => {
    try {
      return await pingFunc(proxyUrl || 'github.com')
    } catch {
      return 'error'
    }
  }
  for (const proxyUrl of proxyOptions.map(o => o.value)) {
    proxyPings.value[proxyUrl] = await doPing(proxyUrl)
  }
  if (useCustomProxy.value && customProxyUrl.value) {
    proxyPings.value[customProxyUrl.value] = await doPing(customProxyUrl.value)
  }
}
const getProxyPingText = (proxy: string) => {
  const ping = proxyPings.value[proxy]
  if (ping === undefined) {
    return ''
  } else if (ping === 'timeout') {
    return t('common.timeout')
  } else if (ping === 'unknown') {
    return t('common.unknown')
  } else if (ping === 'error') {
    return t('common.error')
  } else {
    return ping + 'ms'
  }
}
const getProxyPingStyle = (proxy: string) => {
  const ping = proxyPings.value[proxy]
  if (ping === undefined) {
    return 'display: none;'
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

const saveUpdateSettings = () => {
  const newConfig = fixUserConfig(store.state.userConfig)
  newConfig.use_custom_proxy = useCustomProxy.value
  newConfig.custom_proxy_url = customProxyUrl.value
  store.commit('setUserConfig', newConfig)
}
const handleDownloadWebPack = async () => {
  if (!window.electronAPI?.downloadUpdatePack) {
    alert('electronAPI.downloadUpdatePack is not defined'); return
  }
  if (!window.confirm(
    t('update.alert_text.text_1')
    + '\n' + t('update.alert_text.text_2')
    + '\n' + t('update.alert_text.text_3')
    + '\n' + t('update.alert_text.text_4')
  )) {
    return
  }
  updateTip.updating_hqhelper = true

  saveUpdateSettings()
  let url = versionContent.value?.dlink_hqhelper
  if (!url) {
    alert('Update link not given. Server might be undergoing maintenance...')
  } else if (!latestHqHelperVersion.value) {
    alert('latestHqHelperVersion not given, Please retry later.')
  } else if (versionContent.value?.maintenance_webpack) {
    alert(t('update.message.server_under_maintenance') + '\n' + t('common.message.please_wait_for_a_while'))
  } else {
    url = url.replace('~PROXY', proxy.value)
    url = url.replace('~VERSION', latestHqHelperVersion.value)
    const err = await window.electronAPI.downloadUpdatePack(url)
    if (err) {
      alert(t('update.message.download_update_pack_failed_with_error', err))
      updateTip.titleText = ''
    }
  }
}
const getClientDownloadLink = async () => {
  let url : string | undefined = ''
  if (window.electronAPI?.clientPlatform) {
    const platform = await window.electronAPI.clientPlatform
    if (platform === 'darwin') {
      url = versionContent.value?.dlink_electron_mac
    } else {
      url = versionContent.value?.dlink_electron
    }
  } else {
    url = versionContent.value?.dlink_electron
  }
  return url
}
const handleDownloadElectronPack = async () => {
  if (userConfig.value.update_client_builtin) {
    if (!window.electronAPI?.downloadAndOpen) {
      alert('function downloadAndOpen is not defined.\nPlease check the client version (v6+ is required).'); return
    }
    if (!window.confirm(
      t('update.alert_text.text_8')
      + '\n' + t('update.alert_text.text_9')
      + '\n' + t('update.alert_text.text_3')
      + '\n' + t('update.alert_text.text_4')
    )) {
      return
    }
    updateTip.updating_electron = true

    saveUpdateSettings()
    let url = await getClientDownloadLink()
    if (!url) {
      alert('Update link not given. Server might be undergoing maintenance...')
    } else if (!latestElectronVersion.value) {
      alert('latestElectronVersion not given, Please retry later.')
    } else if (versionContent.value?.maintenance_client) {
      alert(t('update.message.server_under_maintenance') + '\n' + t('common.message.please_wait_for_a_while'))
    } else {
      url = url.replace('~PROXY', proxy.value)
      url = url.replace('~VERSION', latestElectronVersion.value)
      const err = await window.electronAPI.downloadAndOpen(url, t('update.file_name.client_updater') + '.exe')
      if (err) {
        alert(t('update.message.download_client_pack_failed_with_error', err))
        updateTip.titleText = ''
      }
    }
  } else {
    if (!window.confirm(
      t('update.alert_text.text_5')
      + '\n' + t('update.alert_text.text_6')
      + '\n' + t('update.alert_text.text_7')
      + '\n' + t('update.alert_text.text_4')
    )) {
      return
    }
    saveUpdateSettings()
    const func = window.electronAPI?.openUrlByBrowser ?? window.open
    let url = await getClientDownloadLink()
    if (!url) {
      alert('Update link not given. Server might be undergoing maintenance...')
    } else if (!latestElectronVersion.value) {
      alert('latestElectronVersion not given, Please retry later.')
    } else if (versionContent.value?.maintenance_client) {
      alert(t('update.message.server_under_maintenance') + '\n' + t('common.message.please_wait_for_a_while'))
    } else {
      url = url.replace('~PROXY', proxy.value)
      url = url.replace('~VERSION', latestElectronVersion.value)
      func(url)
    }
  }
}

const showPreferencesModal = ref(false)
const handleSettingButtonClick = () => {
  showPreferencesModal.value = true
}
</script>

<template>
  <MyModal
    v-model:show="showModal"
    :icon="UpdateSharp"
    :title="t('common.appfunc.check_updates')"
    height="auto"
    @on-load="onLoad"
    show-setting
    @on-setting-button-clicked="handleSettingButtonClick"
  >
    <div class="wrapper">
      <FoldableCard class="card proxy" card-key="modal-cu-proxy" card-size="small" show-card-border>
        <template #header>
          <div class="card-title">
            <n-icon><VpnLockRound /></n-icon>
            <span class="title">{{ t('update.proxy.title') }}</span>
            <div class="card-title-actions font-small">
              <a href="javascript:void(0)" @click="handleShowProxySiteStatus">[{{ t('update.text.proxy_status_view') }}]</a>
            </div>
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
                  :checked="!useCustomProxy && proxyValue === option.value"
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
            <div class="proxy-item">
              <div class="proxy-option">
                <n-radio
                  name="proxy-option"
                  v-model:checked="useCustomProxy"
                >
                  {{ t('update.text.custom_proxy') }}
                </n-radio>
              </div>
              <div class="proxy-ping">
                <n-input
                  size="tiny"
                  v-show="useCustomProxy"
                  v-model:value="customProxyUrl"
                  style="width: 250px;"
                >
                  <template #suffix>
                    <div class="proxy-ping" :style="getProxyPingStyle(customProxyUrl)">
                      ({{ getProxyPingText(customProxyUrl) }})
                    </div>
                  </template>
                </n-input>
              </div>
            </div>
          </div>
          <div class="edge-top-right">
            <n-button size="tiny" @click="handlePing">
              <template #icon>
                <n-icon><SpeedRound /></n-icon>
              </template>
              {{ t('update.text.check_connections') }}
            </n-button>
          </div>
        </div>
      </FoldableCard>
      <n-card class="card web-version" size="small" embedded>
        <template #header>
          <div class="card-title">
            <n-icon><SystemUpdateAltRound /></n-icon>
            <span class="title">{{ t('common.hqhelper_version') }}</span>
          </div>
        </template>

        <div class="version-card-container">
          <div class="versions">
            <div>{{ t('common.curr_version_with_val', AppStatus.Version) }}</div>
            <div>
              <span>{{ t('common.latest_version') }}</span>
              <span v-if="latestHqHelperVersion">{{ latestHqHelperVersion }}</span>
              <span v-else-if="latestHqHelperVersion===''">{{ t('common.checking') }}</span>
              <span v-else>{{ t('common.check_failed') }}</span>
            </div>
          </div>
          <div class="edge-top-right">
            <n-button size="tiny" class="btn-recheck" :loading="checkingUpdates" @click="handleCheckUpdates">
              <template #icon>
                <n-icon><RefreshRound /></n-icon>
              </template>
              {{ t('common.recheck') }}
            </n-button>
          </div>
          <div class="action">
            <n-button
              class="btn-do-update"
              :loading="updateTip.updating_hqhelper"
              :disabled="!hqhelperNeedUpdate || updateTip.updating_hqhelper"
              @click="handleDownloadWebPack"
            >
              {{ hqHelperUpdateBtnText }}
            </n-button>
          </div>
        </div>
      </n-card>
      <n-card class="card web-version" size="small" embedded>
        <template #header>
          <div class="card-title">
            <n-icon><BrowserUpdatedRound /></n-icon>
            <span class="title">{{ t('common.client_version') }}</span>
          </div>
        </template>

        <div class="version-card-container">
          <div class="versions">
            <div>{{ t('common.curr_version_with_val', currentElectronVersion) }}</div>
            <div>
              <span>{{ t('common.latest_version') }}</span>
              <span v-if="latestElectronVersion">{{ latestElectronVersion }}</span>
              <span v-else-if="latestElectronVersion===''">{{ t('common.checking') }}</span>
              <span v-else>{{ t('common.check_failed') }}</span>
            </div>
          </div>
          <div class="edge-top-right">
            <n-button size="tiny" class="btn-recheck" :loading="checkingUpdates" @click="handleCheckUpdates">
              <template #icon>
                <n-icon><RefreshRound /></n-icon>
              </template>
              {{ t('common.recheck') }}
            </n-button>
          </div>
          <div class="action">
            <n-button
              class="btn-do-update"
              :loading="updateTip.updating_electron"
              :disabled="!electronNeedUpdate || updateTip.updating_electron"
              @click="handleDownloadElectronPack"
            >
              {{ electronUpdateBtnText }}
            </n-button>
          </div>
        </div>
      </n-card>
      <n-alert v-if="updateTip.error" class="card upd-tip" type="error" :title="updateTip.titleText">
        {{ updateTip.contentText }}
      </n-alert>
      <n-alert v-else-if="updateTip.updating && updateTip.titleText" class="card upd-tip" type="info">
        {{ updateTip.titleText }}
      </n-alert>
    </div>

    <ModalPreferences
      v-model:show="showPreferencesModal"
      setting-group="update"
      app-show-fp
    />
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
      grid-template-columns: 150px 1fr;
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