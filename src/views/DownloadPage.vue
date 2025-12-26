<script setup lang="ts">
import type { Type } from 'naive-ui/es/button/src/interface'
import {
  LandscapeRound, FlightLandRound,
} from '@vicons/material'
import { checkAppUpdates } from '@/tools'
import type { AppVersionJson } from '@/models'

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(message: string, args?: any) => string>('t')!

const loading = ref(false)
const appVersionInfo = ref<AppVersionJson | undefined>(undefined)

onMounted(async () => {
  loading.value = true
  const checkUpdateResponse = await checkAppUpdates()
  if (checkUpdateResponse.success) {
    appVersionInfo.value = checkUpdateResponse.data!
  } else {
    NAIVE_UI_MESSAGE.error(checkUpdateResponse.message)
  }
  loading.value = false
})

const introData = computed(() => {
  return [
    {
      title: t('download_page.text.text_1')
        + '<br>' + t('download_page.text.text_2'),
      contents: []
    },
    {
      title: t('download_page.text.text_3'),
      contents: [
        t('download_page.text.text_4'),
        t('download_page.text.text_5')
      ]
    },
    {
      title: t('common.special_notice'),
      contents: [
        t('download_page.text.text_6'),
        t('download_page.text.text_7')
      ]
    }
  ]
})
const winAppBtns = computed(() => {
  const vi = appVersionInfo.value
  if (!vi) return []
  const dlink = vi.dlink_electron.replace('~VERSION', vi.electron)
  let index = 1
  const res : {
    icon: typeof LandscapeRound;
    text: string;
    type: Type;
    link: string;
    ghost: boolean;
  }[] = [
    {
      icon: LandscapeRound,
      text: t('download_page.link.cn_with_index', index++),
      type: 'primary',
      link: dlink.replace('~PROXY', vi.client_info.recomm_proxy),
      ghost: false,
    }
  ]
  vi.client_info.cn_sub_links.forEach((sublink) => {
    res.push({
      icon: LandscapeRound,
      text: t('download_page.link.cn_with_index', index++),
      type: 'primary',
      link: sublink,
      ghost: true,
    })
  })
  res.push({
    icon: FlightLandRound,
    text: t('download_page.link.global'),
    type: 'info',
    link: dlink.replace('~PROXY', ''),
    ghost: false,
  })
  return res
})
const macAppBtns = computed(() => {
  const vi = appVersionInfo.value
  if (!vi) return []
  const dlink = vi.dlink_electron_mac.replace('~VERSION', vi.electron)
  let index = 1
  const res : {
    icon: typeof LandscapeRound;
    text: string;
    type: Type;
    link: string;
    ghost: boolean;
  }[] = [
    {
      icon: LandscapeRound,
      text: t('download_page.link.cn_with_index', index++),
      type: 'primary',
      link: dlink.replace('~PROXY', vi.client_info.recomm_proxy),
      ghost: false,
    }
  ]
  vi.client_info.mac_cn_sub_links.forEach((sublink) => {
    res.push({
      icon: LandscapeRound,
      text: t('download_page.link.cn_with_index', index++),
      type: 'primary',
      link: sublink,
      ghost: true,
    })
  })
  res.push({
    icon: FlightLandRound,
    text: t('download_page.link.global'),
    type: 'info',
    link: dlink.replace('~PROXY', ''),
    ghost: false,
  })
  return res
})

const handleDownloadBtnClick = (link: string) => {
  window.open(link, '_blank')
}
</script>

<template>
  <div id="main-container">
    <FoldableCard card-key="download-intro">
      <template #header>
        <i class="xiv help"></i>
        <span class="card-title-text">{{ t('common.brief_intro') }}</span>
      </template>
      <div
        v-for="(intro, introIndex) in introData"
        :key="'intro-' + introIndex"
        class="content-block"
      >
        <div class="intro">
          <p class="title" v-html="intro.title" />
          <ul>
            <li v-for="(content, contentIndex) in intro.contents" :key="introIndex + '-content-' + contentIndex">{{ content }}</li>
          </ul>
          <n-divider style="margin: 1px 5px 3px" />
        </div>
      </div>
    </FoldableCard>
    <FoldableCard card-key="download-windows">
      <template #header>
        <i class="xiv square-1"></i>
        <span class="card-title-text">{{ t('download_page.text.text_11', 'Windows') }}</span>
      </template>
      <div
        class="content-block"
      >
        <div v-if="loading" class="spin-container">
          <n-spin size="small" />
          <div>{{ t('common.loading') }}</div>
        </div>
        <div v-else class="flex-col gap-4">
          <p>{{ t('download_page.text.text_8', appVersionInfo?.electron) }}</p>
          <p>{{ t('download_page.text.text_9') }}</p>
          <div class="download-btn-container">
            <n-button
              v-for="(btn, btnIndex) in winAppBtns"
              :key="'win-app-btn-' + btnIndex"
              size="small"
              :type="btn.type"
              :ghost="btn.ghost"
              @click="() => handleDownloadBtnClick(btn.link)"
            >
              <template #icon>
                <n-icon :size="16" :component="btn.icon" />
              </template>
              {{ btn.text }}
            </n-button>
          </div>
          <p>{{ t('download_page.text.text_10') }}</p>
        </div>
      </div>
    </FoldableCard>
    <FoldableCard card-key="download-mac">
      <template #header>
        <i class="xiv square-2"></i>
        <span class="card-title-text">{{ t('download_page.text.text_11', 'Mac') }}</span>
      </template>
      <div class="content-block">
        <div v-if="loading" class="spin-container">
          <n-spin size="small" />
          <div>{{ t('common.loading') }}</div>
        </div>
        <div v-else class="flex-col gap-4">
          <p>{{ t('download_page.text.text_8', appVersionInfo?.electron) }}</p>
          <p>{{ t('download_page.text.text_9') }}</p>
          <div class="download-btn-container">
            <n-button
              v-for="(btn, btnIndex) in macAppBtns"
              :key="'mac-app-btn-' + btnIndex"
              size="small"
              :type="btn.type"
              :ghost="btn.ghost"
              @click="() => handleDownloadBtnClick(btn.link)"
            >
              <template #icon>
                <n-icon :size="16" :component="btn.icon" />
              </template>
              {{ btn.text }}
            </n-button>
          </div>
          <p>{{ t('download_page.text.text_12') }}</p>
          <p>{{ t('download_page.text.text_13') }}</p>
          <n-alert type="info" :title="t('common.tip')" style="width: fit-content; margin-top: 8px;">
            <p>{{ t('download_page.text.text_14') }}</p>
            <p>{{ t('download_page.text.text_15') }}</p>
            <p>
              <span>{{ t('common.please_refer_to') }}</span>
              <a target="_blank" href="https://zhuanlan.zhihu.com/p/135948430">https://zhuanlan.zhihu.com/p/135948430</a>
            </p>
          </n-alert>
        </div>
      </div>
    </FoldableCard>
    <FoldableCard card-key="download-ios">
      <template #header>
        <i class="xiv square-3"></i>
        <span class="card-title-text">{{ t('download_page.text.text_11', 'iOS') }}</span>
      </template>
      <div class="content-block">{{ t('common.not_planned') }}</div>
    </FoldableCard>
    <FoldableCard card-key="download-android">
      <template #header>
        <i class="xiv square-4"></i>
        <span class="card-title-text">{{ t('download_page.text.text_11', 'Android') }}</span>
      </template>
      <div class="content-block">{{ t('common.developing') }}</div>
    </FoldableCard>
    
    <n-back-top />
  </div>
</template>

<style scoped>
:deep(.n-spin) {
  --n-size: 14px !important;
}

#main-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .content-block {
    line-height: 1.2;
    padding: 0 1.5em;

    .download-btn-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .intro {
    .title {
      font-weight: bold;
      line-height: 1.5;
    }
    ul {
      padding-left: 1.5em;
    }
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .download-btn-container {
    flex-direction: column;
  }
}
</style>