<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import {
  NBackTop, NButton, NDivider, NIcon, NSpin,
  useMessage
} from 'naive-ui'
import type { Type } from 'naive-ui/es/button/src/interface'
import {
  LandscapeRound, FlightLandRound,
} from '@vicons/material'
import FoldableCard from '@/components/templates/FoldableCard.vue'
import { checkAppUpdates } from '@/tools'
import type { AppVersionJson } from '@/models'

const NAIVE_UI_MESSAGE = useMessage()

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })

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
      title: t('HqHelper 的大多数功能在网页端即可完成。')
        + '<br>' + t('不过，为了满足部分用户的习惯和实现一些浏览器无法完成的功能，我们也提供客户端服务。'),
      contents: []
    },
    {
      title: t('有什么特别功能吗？'),
      contents: [
        t('即使网络不佳或远程服务器崩溃，客户端也能正常提供基础的计算服务。'),
        t('客户端允许你在使用新窗口打开采集时钟期间将其置顶，从而达成类似悬浮窗的效果。')
      ]
    },
    {
      title: t('特别提醒'),
      contents: [
        t('您可以收藏此页面，从而在未来方便地下载到最新版本的客户端。'),
        t('客户端仅是搭载 HqHelper 的“容器”，下载最新版本的客户端后可能仍需要更新一次 HqHelper 的版本。')
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
      text: t('国内下载链接{index}', index++),
      type: 'primary',
      link: dlink.replace('~PROXY', vi.client_info.recomm_proxy),
      ghost: false,
    }
  ]
  vi.client_info.cn_sub_links.forEach((sublink) => {
    res.push({
      icon: LandscapeRound,
      text: t('国内下载链接{index}', index++),
      type: 'primary',
      link: sublink,
      ghost: true,
    })
  })
  res.push({
    icon: FlightLandRound,
    text: t('国际下载链接'),
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
        <span class="card-title-text">{{ t('简介') }}</span>
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
          <n-divider style="margin: 1px 5px 3px 5px" />
        </div>
      </div>
    </FoldableCard>
    <FoldableCard card-key="download-windows">
      <template #header>
        <i class="xiv square-1"></i>
        <span class="card-title-text">{{ t('{platform} 客户端', 'Windows') }}</span>
      </template>
      <div
        class="content-block"
      >
        <div v-if="loading" class="spin-container">
          <n-spin size="small" />
          <div>{{ t('正在加载……') }}</div>
        </div>
        <div v-else class="flex-col gap-4">
          <p>{{ t('当前最新版本：{ver}', appVersionInfo?.electron) }}</p>
          <p>{{ t('点击下方按钮来进行下载。') }}</p>
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
          <p>{{ t('※仅适用于 Windows 7 或更高版本') }}</p>
        </div>
      </div>
    </FoldableCard>
    <FoldableCard card-key="download-mac">
      <template #header>
        <i class="xiv square-2"></i>
        <span class="card-title-text">{{ t('{platform} 客户端', 'Mac') }}</span>
      </template>
      <div class="content-block">{{ t('开发中') }}</div>
    </FoldableCard>
    <FoldableCard card-key="download-ios">
      <template #header>
        <i class="xiv square-3"></i>
        <span class="card-title-text">{{ t('{platform} 客户端', 'iOS') }}</span>
      </template>
      <div class="content-block">{{ t('暂无计划') }}</div>
    </FoldableCard>
    <FoldableCard card-key="download-android">
      <template #header>
        <i class="xiv square-4"></i>
        <span class="card-title-text">{{ t('{platform} 客户端', 'Android') }}</span>
      </template>
      <div class="content-block">{{ t('开发中') }}</div>
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