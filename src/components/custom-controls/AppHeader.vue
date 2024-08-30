<script setup lang="ts">
import { computed, h, inject, ref, type Component, type Ref, type VNode, onMounted } from 'vue'
import {
  NButton, NDrawer, NDrawerContent, NDropdown, NDivider, NFlex, NIcon, NPopover, NTooltip,
  useMessage,
  type DropdownOption, type DropdownGroupOption
} from 'naive-ui'
import {
  ArrowCircleLeftOutlined,
  FileCopyOutlined,
  CasesOutlined,
  ImportExportOutlined,
  ArrowUpwardOutlined,
  ArrowDownwardOutlined,
  AccessAlarmsOutlined,
  FastfoodOutlined,
  MenuFilled,
  UpdateOutlined,
  SettingsSharp,
  EventNoteFilled,
  InfoFilled,
  ContactlessSharp,
  DarkModeTwotone, LightModeTwotone,
  UpdateSharp
} from '@vicons/material'
import ModalUserPreferences from '@/components/modals/ModalUserPreferences.vue'
import ModalContactUs from '@/components/modals/ModalContactUs.vue'
import ModalChangeLogs from '@/components/modals/ModalChangeLogs.vue'
import ModalAboutApp from '@/components/modals/ModalAboutApp.vue'
import type { AppVersionJson } from '@/models'
import EorzeaTime from '@/tools/eorzea-time'
import AppStatus from '@/variables/app-status'
import router from '@/router'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const locale = inject<Ref<"zh" | "en" | "ja">>('locale') ?? ref('zh')
const isChina = computed(() => locale.value === 'zh')
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
const currentET = inject<Ref<EorzeaTime>>('currentET')!
const theme = inject<Ref<"light" | "dark">>('theme') ?? ref('light')
const switchTheme = inject<() => void>('switchTheme')!
const displayCheckUpdatesModal = inject<() => void>('displayCheckUpdatesModal')!

const NAIVE_UI_MESSAGE = useMessage()

const showMenus = ref(false)

const showUserPreferencesModal = ref(false)
const showAboutAppModal = ref(false)
const showContactModal = ref(false)
const showChangeLogsModal = ref(false)

const canRouteBack = computed(() => {
  return router.currentRoute.value.path !== '/'
})
const handleRouteBack = () => {
  router.go(-1)
}

const displayUserPreferencesModal = () => {
  showUserPreferencesModal.value = true
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
const redirectToFoodAndTincPage = () => {
  router.push('/fthelper')
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
  const changeThemeIcon = theme.value === 'light' ? DarkModeTwotone : LightModeTwotone
  return {
    changeTheme: { label: t('切换主题'), icon: changeThemeIcon, click: switchTheme } as MenuItem,
    ftHelper: { label: t('食药计算'), hide: hideFTHelper, icon: FastfoodOutlined, click: redirectToFoodAndTincPage } as MenuItem,
    contact: { label: t('联系我们'), icon: ContactlessSharp, click: displayContactModal } as MenuItem,
    changelogs: { label: t('更新日志'), hide: true, icon: EventNoteFilled, click: displayChangeLogsModal } as MenuItem,
    userPreferences: { label: t('偏好设置'), icon: SettingsSharp, click: displayUserPreferencesModal } as MenuItem,
    checkUpdates: { label: t('检查更新'), icon: UpdateSharp, click: handleCheckUpdates } as MenuItem,
    aboutApp: { label: t('关于本作'), icon: InfoFilled, click: displayAboutAppModal } as MenuItem
  }
})
const desktopMenus = computed(() => {
  const hideFTHelper = router.currentRoute.value.path.startsWith('/fthelper')
  const changeThemeIcon = theme.value === 'light' ? DarkModeTwotone : LightModeTwotone
  const changeThemeTooltip = theme.value === 'light' ? t('为这个世界带回黑暗。') : t('静待黎明天光来。')
  const ftHelperTooltip = hideFTHelper ? t('您已经处于食药计算器的页面。') : t('帮助你制作食物与爆发药。能帮到就好。')
  const gatherClockTooltip = t('此功能尚未制作完成，请耐心等待。')
  const userPreferenceTooltip = t('以人的意志改变机械的程序。')
  const checkUpdatesTooltip = t('更新目标的战力等级……变更攻击模式……')
  const changelogTooltip = t('此功能尚未制作完成，请耐心等待。')
  const contactTooltip = t('关注我们喵，关注我们谢谢喵。')
  const aboutTooltip = t('重新自我介绍一下库啵。')
  return [
    /* 参考资料 */
    {
      label: '参考资料',
      icon: FileCopyOutlined,
      hide: true, // 这里的内容仅限中文用户可见，不做国际化
      options: [
        {
          key: 'ref-self',
          label: '自撰攻略',
          icon: FileCopyOutlined,
          children: [
            { key: 'ref-self-1', label: 'DawnCrafter I: 7.0/7.05生产采集准备工作', icon: renderIcon(FileCopyOutlined), click: notDoneBtnClickEvent }
          ]
        },
        {
          key: 'ref-oth-book',
          label: '其他推荐攻略',
          icon: FileCopyOutlined,
          children: [
            { key: 'ref-oth-book-1', label: '???', icon: renderIcon(FileCopyOutlined), click: notDoneBtnClickEvent }
          ]
        },
        {
          key: 'ref-oth-tool',
          label: '其他实用工具',
          icon: FileCopyOutlined,
          children: [
            { key: 'ref-oth-tool-1', label: '???', icon: renderIcon(FileCopyOutlined), click: notDoneBtnClickEvent }
          ]
        }
      ]
    },
    /* 实用工具 */
    {
      label: t('实用工具'),
      icon: CasesOutlined,
      options: [
        { key: 'tool-gatherclock', label: t('采集时钟'), disabled: true, icon: renderIcon(AccessAlarmsOutlined), description: gatherClockTooltip, click: notDoneBtnClickEvent },
        { key: 'tool-fthelper', label: t('食药计算'), disabled: hideFTHelper, icon: renderIcon(FastfoodOutlined), description: ftHelperTooltip, click: redirectToFoodAndTincPage }
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
        { key: 'sau-up', label: t('偏好设置'), icon: renderIcon(SettingsSharp), description: userPreferenceTooltip, click: displayUserPreferencesModal },
        { key: 'sau-cu', label: t('检查更新'), icon: renderIcon(UpdateSharp), description: checkUpdatesTooltip, click: handleCheckUpdates },
        { key: 'sau-cl', label: t('更新日志'), disabled: true, icon: renderIcon(EventNoteFilled), description: changelogTooltip, click: displayChangeLogsModal }
      ],
    },
    /* 关于 */
    {
      label: t('关于'),
      icon: InfoFilled,
      options: [
        { key: 'ab-contact', label: t('联系我们'), icon: renderIcon(ContactlessSharp), description: contactTooltip, click: displayContactModal },
        { key: 'ab-about', label: t('关于本作'), icon: renderIcon(InfoFilled), description: aboutTooltip, click: displayAboutAppModal }
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
const renderOption = ({ node, option }: { node: VNode, option: DropdownOption | DropdownGroupOption }) => {
  return option.description ? h(
    NTooltip,
    { keepAliveOnHover: false, placement: 'right', style: { width: 'max-content', display: isMobile.value ? 'none' : 'inherit' } },
    {
      trigger: () => [node],
      default: () => option.description
    }
  ) : h(
    node
  )
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

const onUserPreferencesSubmitted = () => {
  showUserPreferencesModal.value = false
  appForceUpdate()
  if (window.confirm(
    t('偏好设置已经保存，不过部分改动需要刷新页面才能生效。')
    + '\n' + t('要现在刷新吗?')
  )) {
    setTimeout(() => {
      location.reload()
    }, 100) // 必须设置一个延迟，不然有些设置不会生效
  } else {
    NAIVE_UI_MESSAGE.success(t('保存成功！部分改动需要刷新页面才能生效'))
  }
}

/*
// 检查更新的方法
const checkForUpdates = () => {
  window.electronAPI.checkForUpdates()
}

// 安装更新的方法
const installUpdate = () => {
  window.electronAPI.installUpdate()
}

const minimize = () => {
  window.electronAPI.minimize()
}

const maximize = () => {
  window.electronAPI.maximize()
}

const restore = () => {
  window.electronAPI.restore()
}

const close = () => {
  window.electronAPI.close()
}

const electronVersion = ref<string>('');

// 在组件挂载后设置更新监听
onMounted(async () => {
  window.electronAPI.onUpdateReady(() => {
    alert('新版本已下载，点击按钮进行安装更新。')
  })
  electronVersion.value = await window.electronAPI.clientVersion;
  console.log('version.value', electronVersion.value)
})
*/
</script>

<template>
  <div class="app-header">
    <div class="router-back-container" v-if="!isMobile">
      <n-popover trigger="hover" :keep-alive-on-hover="isMobile" style="max-width: 300px;">
        <template #trigger>
          <n-button text style="font-size: 35px" :disabled="!canRouteBack" @click="handleRouteBack">
            <n-icon>
              <ArrowCircleLeftOutlined />
            </n-icon>
          </n-button>
        </template>
        <div class="flex-column">
          <p>{{ t('点击此按钮可以返回到上一个页面。') }}</p>
          <p v-if="!canRouteBack">{{ t('……不过您已经在HqHelper的首页了。') }}</p>
        </div>
      </n-popover>
    </div>
    <div class="header-content">
      <div class="app-info">
        <i class="xiv hq logo-font"></i>
        <p class="app-name">HQ Helper</p>

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

        <div class="tail-contents" v-if="isMobile">
          <n-button ghost class="menu-button" @click="showMenus = !showMenus">
            <template #icon>
              <n-icon><menu-filled /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
      <n-divider v-if="!isMobile" style="margin: -1px 0 3px 0;" />
      <div class="app-menu" v-if="!isMobile">
        <n-dropdown
          size="small"
          placement="bottom-start"
          v-for="(item, key) in desktopMenus"
          :key="'desktop-menu-' + key"
          :options="item.options"
          :render-option="renderOption"
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
      <!-- <button v-if="false" @click="checkForUpdates">检查更新</button>
      <button v-if="false" @click="installUpdate">安装更新</button>
      <button v-if="false" @click="minimize">minimize</button>
      <button v-if="false" @click="maximize">maximize</button>
      <button v-if="false" @click="restore">restore</button>
      <button v-if="false" @click="close">close</button>
      <button v-if="false" >{{ electronVersion }}</button> -->
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

    <ModalUserPreferences
      v-model:show="showUserPreferencesModal"
      @after-submit="onUserPreferencesSubmitted"
    />
    <ModalAboutApp v-model:show="showAboutAppModal" />
    <ModalContactUs v-model:show="showContactModal" />
    <ModalChangeLogs v-model:show="showChangeLogsModal" />
  </div>
</template>

<style scoped>
/* Electron only */
.app-header {
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

    .logo-font {
      color: var(--n-text-color);
    }
    .app-name {
      margin: 5px;
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