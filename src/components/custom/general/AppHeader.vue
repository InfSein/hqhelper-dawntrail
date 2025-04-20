<script setup lang="ts">
import { computed, h, inject, onMounted, ref, type Component, type Ref } from 'vue'
import {
  NButton, NDrawer, NDrawerContent, NDropdown, NDivider, NFlex, NIcon, NPopover,
  useMessage,
  type DropdownOption,
} from 'naive-ui'
import {
  ArrowCircleLeftOutlined,
  FileCopyFilled, FileCopyOutlined, FilePresentOutlined,
  OpenInNewOutlined,
  CasesRound, CasesOutlined,
  ImportExportOutlined,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  AccessAlarmsOutlined,
  FastfoodOutlined,
  WavesOutlined,
  HomeOutlined,
  HelpOutlineOutlined,
  MenuFilled,
  UpdateOutlined,
  SettingsSharp,
  SettingsSuggestFilled,
  EventNoteFilled,
  InfoFilled, InfoOutlined,
  DevicesOtherOutlined,
  ContactlessOutlined,
  HandshakeOutlined,
  DarkModeTwotone, LightModeTwotone,
  UpdateSharp
} from '@vicons/material'
import ModalPreferences from '@/components/modals/ModalPreferences.vue'
import ModalContactUs from '@/components/modals/ModalContactUs.vue'
import ModalChangeLogs from '@/components/modals/ModalChangeLogs.vue'
import ModalAboutApp from '@/components/modals/ModalAboutApp.vue'
import ModalFestivalEgg from '@/components/modals/ModalFestivalEgg.vue'
import ModalDonate from '@/components/modals/ModalDonate.vue'
// import ChristmasTree from '@/assets/icons/ChristmasTree.vue'
import type { AppVersionJson } from '@/models'
import { visitUrl } from '@/tools'
import EorzeaTime from '@/tools/eorzea-time'
import useUiTools from '@/tools/ui'
import AppStatus from '@/variables/app-status'
import router from '@/router'
import { fixUserConfig, type UserConfigModel } from '@/models/config-user'
import { useStore } from '@/store'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const userConfig = inject<Ref<UserConfigModel>>('userConfig')!
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const locale = inject<Ref<"zh" | "en" | "ja">>('locale') ?? ref('zh')
const isChina = computed(() => locale.value === 'zh')
const currentET = inject<Ref<EorzeaTime>>('currentET')!
const theme = inject<Ref<"light" | "dark">>('theme') ?? ref('light')
// const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
const switchTheme = inject<() => void>('switchTheme')!
const displayCheckUpdatesModal = inject<() => void>('displayCheckUpdatesModal')!

const useDesktopUi = computed(() => {
  return !isMobile.value || !!window.electronAPI
})
const canUseSubwindow = computed(() => {
  return !isMobile.value
})
const canOpenDevTools = computed(() => {
  return !!window.electronAPI?.openDevTools && userConfig.value.enable_dev_mode
})

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const { dropdownOptionsRenderer } = useUiTools(isMobile)

onMounted(() => {
  if (userConfig.value.cache_lasttime_version !== AppStatus.Version) {
    userConfig.value.cache_lasttime_version = AppStatus.Version
    const newConfig = fixUserConfig(userConfig.value)
    store.commit('setUserConfig', newConfig)
    displayChangeLogsModal()
  }
})

const showMenus = ref(false)

const showPreferencesModal = ref(false)
const preferenceModalShowUpOnly = ref(false)
const preferenceModalShowFpOnly = ref(false)
const showAboutAppModal = ref(false)
const showContactModal = ref(false)
const showChangeLogsModal = ref(false)
const showFestivalEggModal = ref(false)
const showDonateModal = ref(false)

// const showFestivalEgg = computed(() => {
//   const now = new Date()
//   const date = now.getDate()
//   return (now.getMonth() === 11) && ((date === 24 && now.getHours() >= 18) || date === 25)
// })

const canRouteBack = computed(() => {
  return router.currentRoute.value.path !== '/'
})
const handleRouteBack = () => {
  router.push('/')
}

const displayPreferencesModal = () => {
  showPreferencesModal.value = true
}
const appShowUserPrefences = () => {
  preferenceModalShowUpOnly.value = true
  preferenceModalShowFpOnly.value = false
  showPreferencesModal.value = true
}
const appShowFuncPrefences = () => {
  preferenceModalShowUpOnly.value = false
  preferenceModalShowFpOnly.value = true
  showPreferencesModal.value = true
}
const displayAboutAppModal = () => {
  showAboutAppModal.value = true
}
const displayContactModal = () => {
  showContactModal.value = true
}
const displayChangeLogsModal = () => {
  showChangeLogsModal.value = true
}
const displayDonateModal = () => {
  showDonateModal.value = true
}
const redirectToFoodAndTincPage = () => {
  router.push('/fthelper')
}
const redirectToWorkflowPage = () => {
  router.push('/workflow')
}
const redirectToGatherClockPage = () => {
  router.push('/gatherclock')
}
const openSubwindowOfGatherClock = () => {
  const url = document.location.origin + document.location.pathname + '#/gatherclock?mode=overlay'
  if (window.electronAPI?.createNewWindow) {
    window.electronAPI.createNewWindow(
      'gatherclock',
      url,
      390,
      730,
      t('采集时钟')
    )
  } else {
    window.open(
      url,
      t('采集时钟'),
      'height=730, width=390, top=120, left=150'
    )
  }
}
const openSubwindowOfFtHelper = () => {
  const url = document.location.origin + document.location.pathname + '#/fthelper?mode=overlay'
  if (window.electronAPI?.createNewWindow) {
    window.electronAPI.createNewWindow(
      'fthelper',
      url,
      1600,
      800,
      t('食药计算')
    )
  } else {
    window.open(
      url,
      t('食药计算'),
      'height=800, width=1600, top=120, left=45'
    )
  }
  
}

interface MenuItem {
  label: string
  icon: typeof MenuFilled
  hide?: boolean
  click?: () => void
}
interface DesktopMenuItem {
  label: string
  icon: typeof MenuFilled
  hide?: boolean
  disabled?: boolean
  click?: () => void
  options?: DropdownOption[]
}
const menuItems = computed(() => {
  const hideFTHelper = router.currentRoute.value.path.startsWith('/fthelper')
  const hideGatherClock = router.currentRoute.value.path.startsWith('/gatherclock')
  const hideWorkflow = router.currentRoute.value.path.startsWith('/workflow')
  const hideHome = router.currentRoute.value.path === '/'
  const changeThemeIcon = theme.value === 'light' ? DarkModeTwotone : LightModeTwotone
  return {
    changeTheme: { label: t('切换主题'), icon: changeThemeIcon, click: switchTheme } as MenuItem,
    goHome: { label: t('返回首页'), hide: hideHome, icon: HomeOutlined, click: () => { router.push('/'); } } as MenuItem,
    gatherClock: { label: t('采集时钟'), hide: hideGatherClock, icon: AccessAlarmsOutlined, click: redirectToGatherClockPage } as MenuItem,
    ftHelper: { label: t('食药计算'), hide: hideFTHelper, icon: FastfoodOutlined, click: redirectToFoodAndTincPage } as MenuItem,
    workflow: { label: t('工作流'), hide: hideWorkflow, icon: WavesOutlined, click: redirectToWorkflowPage } as MenuItem,
    userPreferences: { label: t('偏好设置'), icon: SettingsSharp, click: appShowUserPrefences } as MenuItem,
    funcPreferences: { label: t('功能设置'), icon: SettingsSuggestFilled, click: appShowFuncPrefences } as MenuItem,
    checkUpdates: { label: t('检查更新'), icon: UpdateSharp, click: handleCheckUpdates } as MenuItem,
    changelogs: { label: t('更新日志'), icon: EventNoteFilled, click: displayChangeLogsModal } as MenuItem,
    contact: { label: t('联系我们'), icon: ContactlessOutlined, click: displayContactModal } as MenuItem,
    donate: { label: t('赞助我们'), icon: HandshakeOutlined, click: displayDonateModal } as MenuItem,
    aboutApp: { label: t('关于本作'), icon: InfoOutlined, click: displayAboutAppModal } as MenuItem
  }
})
const desktopMenus = computed(() => {
  const hideFTHelper = router.currentRoute.value.path.startsWith('/fthelper')
  const hideGatherClock = router.currentRoute.value.path.startsWith('/gatherclock')
  const hideWorkflow = router.currentRoute.value.path.startsWith('/workflow')
  const changeThemeIcon = theme.value === 'light' ? DarkModeTwotone : LightModeTwotone
  const changeThemeTooltip = theme.value === 'light' ? t('为这个世界带回黑暗。') : t('静待黎明天光来。')
  const ftHelperTooltip = hideFTHelper ? t('您已经处于食药计算器的页面。') : t('帮助你制作食物与爆发药。能帮到就好。')
  const ftHelperSWTooltip = t('在新窗口中打开食药计算器。')
  const gatherClockTooltip = hideGatherClock ? t('您已经处于采集时钟页面。') : t('挖穿艾欧泽亚的好帮手！')
  const gatherClockSWTooltip = t('在新窗口中打开采集时钟。')
  const workflowTooltip = hideWorkflow ? t('您已经处于工作流页面。') : t('众生如归流。')
  const userPreferenceTooltip = t('以人的意志改变机械的程序。')
  // const funcPreferenceTooltip = t('还好我把魔法人偶的战斗力设置成了最强级别。')
  const checkUpdatesTooltip = t('更新目标的战力等级……变更攻击模式……')
  const changelogTooltip = t('修正……改良……开始对循环程序进行更新……')
  const contactTooltip = t('关注我们喵，关注我们谢谢喵。')
  const donateTooltip = t('助力程序肥多玩肥肥14！')
  const aboutTooltip = t('重新自我介绍一下库啵。')

  const buildOuterlinkOption = (key: string, label: string, url: string, icon: Component, description?: string) => {
    return {
      key, label, icon: renderIcon(icon),
      click: () => {
        visitUrl(url)
      },
      description: description ?? url
    }
  }

  return [
    /* 参考资料 */
    {
      label: '参考资料',
      icon: FileCopyFilled,
      hide: userConfig.value.language_ui !== 'zh', // 这里的内容仅限中文用户可见，不做国际化
      options: [
        {
          key: 'ref-self',
          label: '自撰攻略',
          icon: renderIcon(FileCopyOutlined),
          children: [
            buildOuterlinkOption('ref-self-1', 'DawnCrafter I: 版本7.0&7.05生产采集准备工作', 'https://bbs.nga.cn/read.php?tid=41573697', OpenInNewOutlined),
            buildOuterlinkOption('ref-self-2', 'DawnCrafter II: 版本7.1生产采集准备工作', 'https://bbs.nga.cn/read.php?tid=42486060', OpenInNewOutlined),
          ]
        },
        {
          key: 'ref-oth-book',
          label: '其他推荐攻略',
          icon: renderIcon(FilePresentOutlined),
          children: [
            buildOuterlinkOption('ref-oth-book-1', '7.0装备箱羊毛指南 by天然呆树歌', 'https://bbs.nga.cn/read.php?tid=40686962', OpenInNewOutlined),
            buildOuterlinkOption('ref-oth-book-2', '生产职业90-100练级攻略 by竹笙微凉_', 'https://bbs.nga.cn/read.php?tid=41158426', OpenInNewOutlined),
            buildOuterlinkOption('ref-oth-book-3', '7.x星级配方制作攻略 by月下独翼', 'https://bbs.nga.cn/read.php?tid=40690311', OpenInNewOutlined),
            buildOuterlinkOption('ref-oth-book-4', '7.0捕鱼人大地票据指南 by f(x)=kx+b', 'https://bbs.nga.cn/read.php?tid=42046664', OpenInNewOutlined),
            buildOuterlinkOption('ref-oth-book-5', '7.0灵砂/工票鱼信息整理 by plas_g', 'https://bbs.nga.cn/read.php?tid=41277468', OpenInNewOutlined),
            buildOuterlinkOption('ref-oth-book-6', '全战职开荒/毕业配装 by 孤风行', 'https://www.kdocs.cn/l/ceEcTzlFQBUy', OpenInNewOutlined),
          ]
        },
        {
          key: 'ref-oth-tool',
          label: '其他实用工具',
          icon: renderIcon(CasesOutlined),
          children: [
            buildOuterlinkOption('ref-oth-tool-1', '制作模拟器 by Tnze', 'https://tnze.yyyy.games/#/', OpenInNewOutlined),
            buildOuterlinkOption('ref-oth-tool-2', '配装模拟器 by Asvel', 'https://asvel.github.io/ffxiv-gearing/', OpenInNewOutlined),
          ]
        }
      ]
    },
    /* 实用工具 */
    {
      label: t('实用工具'),
      icon: CasesRound,
      options: [
        { key: 'tool-gatherclock', label: t('采集时钟'), disabled: hideGatherClock, icon: renderIcon(AccessAlarmsOutlined), description: gatherClockTooltip, click: redirectToGatherClockPage },
        { key: 'tool-fthelper', label: t('食药计算'), disabled: hideFTHelper, icon: renderIcon(FastfoodOutlined), description: ftHelperTooltip, click: redirectToFoodAndTincPage },
        { key: 'tool-workflow', label: t('工作流'), disabled: hideWorkflow, icon: renderIcon(WavesOutlined), description: workflowTooltip, click: redirectToWorkflowPage },
        { key: 'tool-divider-1', hide: !canUseSubwindow.value, type: 'divider' },
        { key: 'tool-gatherclock-subwindow', hide: !canUseSubwindow.value, label: t('采集时钟(新窗口)'), icon: renderIcon(AccessAlarmsOutlined), description: gatherClockSWTooltip, click: openSubwindowOfGatherClock },
        { key: 'tool-fthelper-subwindow', hide: !canUseSubwindow.value, label: t('食药计算(新窗口)'), icon: renderIcon(FastfoodOutlined), description: ftHelperSWTooltip, click: openSubwindowOfFtHelper },
      ]
    },
    /* 导入导出 */
    {
      label: t('导入导出'),
      icon: ImportExportOutlined,
      disabled: true,
      hide: true,
      options: [
        { key: 'ie-import', label: t('从Excel导入'), icon: renderIcon(ArrowUpwardOutlined), disabled: true, click: notDoneBtnClickEvent },
        { key: 'ie-export', label: t('导出为Excel'), icon: renderIcon(ArrowDownwardOutlined), disabled: true, click: notDoneBtnClickEvent }
      ]
    },
    /* 设置与更新 */
    {
      label: t('设置与更新'),
      icon: UpdateOutlined,
      options: [
        { key: 'sau-ct', label: t('切换主题'), icon: renderIcon(changeThemeIcon), description: changeThemeTooltip, click: switchTheme },
        { key: 'sau-up', label: t('偏好设置'), icon: renderIcon(SettingsSharp), description: userPreferenceTooltip, click: displayPreferencesModal },
        { key: 'sau-cu', label: t('检查更新'), icon: renderIcon(UpdateSharp), description: checkUpdatesTooltip, click: handleCheckUpdates },
        { key: 'sau-cl', label: t('更新日志'), icon: renderIcon(EventNoteFilled), description: changelogTooltip, click: displayChangeLogsModal },
        { key: 'sau-dt', hide:!canOpenDevTools.value, label: t('开发工具'), icon: renderIcon(DevicesOtherOutlined), click: ()=>{ window.electronAPI!.openDevTools() } }
      ],
    },
    /* 关于 */
    {
      label: t('关于'),
      icon: InfoFilled,
      options: [
        { key: 'ab-faq', label: '常见问题', hide: userConfig.value.language_ui !== 'zh', icon: renderIcon(HelpOutlineOutlined), description: '也有不常见的。', click: ()=>{ visitUrl('https://docs.qq.com/doc/DY3pPZmRGRHpubEFi') } },
        { key: 'ab-contact', label: t('联系我们'), icon: renderIcon(ContactlessOutlined), description: contactTooltip, click: displayContactModal },
        { key: 'ab-donate', label: t('赞助我们'), icon: renderIcon(HandshakeOutlined), description: donateTooltip, click: displayDonateModal },
        { key: 'ab-about', label: t('关于本作'), icon: renderIcon(InfoOutlined), description: aboutTooltip, click: displayAboutAppModal },
      ],
    }
  ] as DesktopMenuItem[]
})
function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}
const handleDesktopMenuOptionSelect = (key: string, option: any) => {
  if (option?.click) {
    option.click()
  } else {
    console.log('[开发提示] 未分配点击事件', key, option)
  }
  
}
const notDoneBtnClickEvent = () => {
  alert('还没写好呢')
}
const defaultClickEvent = () => {}

const openModal = (click?: (() => void)) => {
  // close menus first
  showMenus.value = false
  // show modal by inject
  click?.()
}

const handleCheckUpdates = async () => {
  if (window.electronAPI?.clientVersion) {
    displayCheckUpdatesModal()
  } else {
    // Mobile or PWA
    try {
      const versionUrl = document.location.origin + document.location.pathname + 'version.json'
      const versionResponse = await fetch(versionUrl)
      const versionContent = await versionResponse.json() as AppVersionJson
      const currentVersion = AppStatus.Version
      if (currentVersion !== versionContent.hqhelper) {
        if (window.confirm(t('检测到新版本{v}，是否更新?', { v: versionContent.hqhelper }))) {
          window.location.reload()
        }
      } else {
        NAIVE_UI_MESSAGE.success(t('已是最新版本'))
      }
    } catch (err) {
      NAIVE_UI_MESSAGE.error(t('检查更新失败，请稍后再试'))
      NAIVE_UI_MESSAGE.error(String(err))
    }
  }
}
</script>

<template>
  <div class="app-header">
    <div class="router-back-container" v-if="useDesktopUi">
      <n-popover trigger="hover" :keep-alive-on-hover="false" style="max-width: 300px;">
        <template #trigger>
          <n-button text style="font-size: 35px" :disabled="!canRouteBack" @click="handleRouteBack">
            <n-icon>
              <ArrowCircleLeftOutlined />
            </n-icon>
          </n-button>
        </template>
        <div class="flex-column">
          <p>{{ t('点击此按钮可以返回到首页。') }}</p>
          <p v-if="!canRouteBack">{{ t('……不过您已经在HqHelper的首页了。') }}</p>
        </div>
      </n-popover>
    </div>
    <div class="header-content">
      <div class="app-info">
        <i class="xiv hq logo-font"></i>
        <p class="app-name">HqHelper</p>

        <n-popover :trigger="isMobile ? 'click' : 'hover'" :keep-alive-on-hover="isMobile" style="max-width: 260px;">
          <template #trigger>
            <p>{{ AppStatus.Version }}</p>
          </template>
          <div class="flex-column">
            <p>{{ t('国服数据版本：{}', AppStatus.SupportedGameVersion.CN) }}</p>
            <p>{{ t('国际服数据版本：{}', AppStatus.SupportedGameVersion.GLOBAL) }}</p>
            <p>{{ t('※ 国服数据尚未更新时，显示的中文名一般为人工临时翻译，请谨慎参考。') }}</p>
          </div>
        </n-popover>

        <!-- <ChristmasTree v-if="showFestivalEgg" style="margin-left: 8px; cursor: pointer;" @click="showFestivalEggModal = true" /> -->

        <n-divider vertical></n-divider>

        <n-popover :trigger="isMobile ? 'click' : 'hover'" :keep-alive-on-hover="isMobile">
          <template #trigger>
            <p>
              <span v-if="isChina"><i class="xiv eorzea-time-chs"></i></span>
              <span v-else><i class="xiv eorzea-time"></i></span>
              <span class="time-text">{{ currentET.gameTime }}</span>
            </p>
          </template>
          <div class="flex-column flex-center">
            <p class="font-center">{{ t('艾欧泽亚时间') }}</p>
          </div>
        </n-popover>

        <div class="tail-contents" v-if="!useDesktopUi">
          <n-button ghost class="menu-button" @click="showMenus = !showMenus">
            <template #icon>
              <n-icon><menu-filled /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
      <n-divider v-if="useDesktopUi" style="margin: -1px 0 3px 0;" />
      <div class="app-menu" v-if="useDesktopUi">
        <n-dropdown
          size="small"
          placement="bottom-start"
          v-for="(item, key) in desktopMenus"
          :key="'desktop-menu-' + key"
          :options="item.options?.filter(o => !o.hide)"
          :render-option="dropdownOptionsRenderer"
          :trigger="item.options?.length ? 'hover' : 'manual'"
          @select="handleDesktopMenuOptionSelect"
        >
          <n-button
            size="tiny" tertiary
            v-show="!item?.hide"
            :disabled="item.disabled"
            @click="item.click ?? defaultClickEvent"
          >
            <template #icon>
              <n-icon><component :is="item.icon" /></n-icon>
            </template>
            {{ item.label }}
          </n-button>
        </n-dropdown>
      </div>
    </div>
    
    <n-drawer
      v-model:show="showMenus"
      placement="right"
      :width="250"
      :trap-focus="false"
      :block-scroll="false"
      to="#main-content"
    >
      <n-drawer-content>
        <n-flex vertical>
          <n-button
            v-for="(item, key) in menuItems"
            :key="key"
            v-show="!item?.hide"
            @click="openModal(item.click)"
          >
            <template #icon>
              <n-icon><component :is="item.icon" /></n-icon>
            </template>
            {{ item.label }}
          </n-button>
        </n-flex>
      </n-drawer-content>
    </n-drawer>

    <ModalPreferences
      v-model:show="showPreferencesModal"
      :app-show-up="preferenceModalShowUpOnly"
      :app-show-fp="preferenceModalShowFpOnly"
    />
    <ModalAboutApp v-model:show="showAboutAppModal" />
    <ModalContactUs v-model:show="showContactModal" />
    <ModalChangeLogs v-model:show="showChangeLogsModal" />
    <ModalFestivalEgg v-model:show="showFestivalEggModal" />
    <ModalDonate v-model:show="showDonateModal" />
  </div>
</template>

<style scoped>
/* Electron only */
.env-electron .app-header {
  width: fit-content;
  -webkit-app-region: no-drag;
}

/* All */
.app-header {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;

  .router-back-container {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .header-content .app-info {
    display: flex;
    align-items: center;
    font-size: 15px;
    line-height: 1;
    margin: 5px 0;

    .logo-font {
      color: var(--n-text-color);
    }
    .app-name {
      margin: 0 5px 0 3px;
      font-weight: 600;
    }
    .time-text {
      margin-left: 5px;
      font-weight: 400;
    }
    .tail-contents {
      margin-left: auto;
      display: flex;

      .menu-button {
        margin-left: 20px;
      }
    }
  }
}

/* Desktop */
@media screen and (min-width: 768px) {
  .app-header .header-content {
    .app-info, .app-menu {
      line-height: 1;
    }
  }
  .app-menu {
    display: flex;
    gap: 10px;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .app-header .header-content .app-info {
    height: 100%;

    .logo-font {
      font-size: 24px;
    }
  }
  .header-content, .app-info {
    width: 100%;
  }
}
</style>