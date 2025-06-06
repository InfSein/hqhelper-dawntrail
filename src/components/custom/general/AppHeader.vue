<script setup lang="ts">
import { computed, h, inject, onMounted, ref, type Component, type Ref, type VNode } from 'vue'
import {
  NButton, NDrawer, NDrawerContent, NDropdown, NDivider, NFlex, NIcon, NPopover,
  useMessage,
  type DropdownOption, type MenuOption,
NTooltip,
} from 'naive-ui'
import {
  ArrowCircleLeftOutlined,
  FileCopyFilled, FilePresentOutlined,
  OpenInNewOutlined,
  CasesRound, CasesOutlined,
  HomeOutlined,
  AccessAlarmsOutlined,
  FastfoodOutlined,
  WavesOutlined,
  CodeOutlined,
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
  DevicesOutlined,
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
import { checkAppUpdates, visitUrl } from '@/tools'
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
const canOpenDevTools = computed(() => {
  return !!window.electronAPI?.openDevTools && userConfig.value.enable_dev_mode
})

const store = useStore()
const NAIVE_UI_MESSAGE = useMessage()
const { renderIcon, optionsRenderer } = useUiTools(isMobile)

onMounted(() => {
  if (userConfig.value.cache_lasttime_version !== AppStatus.Version) {
    userConfig.value.cache_lasttime_version = AppStatus.Version
    const newConfig = fixUserConfig(userConfig.value)
    store.commit('setUserConfig', newConfig)
    showChangeLogsModal.value = true
  }
})

const showMenus = ref(false)
const menuDropdownVisiGroup = ref([false, false, false, false, false, false])

const showPreferencesModal = ref(false)
const preferenceModalShowUpOnly = ref(false)
const preferenceModalShowFpOnly = ref(false)
const showAboutAppModal = ref(false)
const showContactModal = ref(false)
const showChangeLogsModal = ref(false)
const showFestivalEggModal = ref(false)
const showDonateModal = ref(false)

interface MyMenuItem {
  key: string
  icon: Component
  label: string
  hide?: boolean
  disabled?: boolean
  click?: () => void
  options?: MyMenuOption[]
}
type MyMenuOption = CommonMenuOption | MenuDivider | RouterMenuOption
interface CommonMenuOption {
  type: 'common'
  icon: Component
  label: string
  description?: string
  hide?: boolean
  disabled?: boolean
  children?: MenuOption[]
  click?: () => void
  mobileClick?: () => void
  customRenderer?: () => VNode
}
interface MenuDivider {
  type: 'divider'
  hide?: boolean
}
interface RouterMenuOption {
  type: 'router'
  icon: Component
  label: string
  /** 在默认状态下的描述 */
  description: string
  hide?: boolean
  disabled?: boolean
  /** 路由键 */
  routerKey: string
  /** 允许在新窗口中打开 */
  allowNewWindow: boolean
  /** 新窗口默认参数 */
  defaultNewWindowOption?: {
    width: number,
    height: number,
    /** 顶部偏移，仅在浏览器生效 */
    top: number,
    /** 左部偏移，仅在浏览器生效 */
    left: number
  }
}

const menuData = computed(() => {
  const data : MyMenuItem[] = [
    /* 参考资料 */
    {
      key: 'refs',
      icon: FileCopyFilled,
      label: '参考资料',
      hide: userConfig.value.language_ui !== 'zh', // 这里的内容仅限中文用户可见，不做国际化
      options: [
        {
          type: 'common',
          label: '推荐攻略',
          icon: FilePresentOutlined,
          hide: isMobile.value,
          children: buildOuterlinkOptions([
            { url: 'https://bbs.nga.cn/read.php?tid=41158426', label: '生产职业90-100练级攻略 by竹笙微凉_' },
            { url: 'https://bbs.nga.cn/read.php?tid=40690311', label: '7.x星级配方制作攻略 by月下独翼' },
            { url: 'https://bbs.nga.cn/read.php?tid=41258536', label: '7.x秘籍配方采集制作攻略 by竹笙微凉_' },
            { url: 'https://bbs.nga.cn/read.php?tid=41277468', label: '7.0灵砂/工票鱼信息整理 by plas_g' },
            { url: 'https://bbs.nga.cn/read.php?tid=42046664', label: '7.0捕鱼人大地票据指南 by f(x)=kx+b' },
            { url: 'https://bbs.nga.cn/read.php?tid=43895399', label: '宇宙探索攻略 by 天然呆树歌' },
            { url: 'https://www.kdocs.cn/l/ceEcTzlFQBUy', label: '全战职开荒/毕业配装 by 孤风行' }
          ], 'ref-oth-book'),
        },
        {
          type: 'common',
          label: '推荐工具',
          icon: CasesOutlined,
          hide: isMobile.value,
          children: buildOuterlinkOptions([
            { url: 'https://tnze.yyyy.games/#/', label: '制作模拟器 by Tnze' },
            { url: 'https://asvel.github.io/ffxiv-gearing/', label: '配装模拟器 by Asvel' },
            { url: 'https://fish.ffmomola.com/#/', label: '鱼糕 by 红豆年糕' },
            { url: 'https://cn.ff14angler.com/', label: '饥饿的猫' },
          ], 'ref-oth-tool'),
        }
      ],
    },
    /* 实用工具 */
    {
      key: 'tools',
      icon: CasesRound,
      label: t('实用工具'),
      options: [
        {
          type: 'router',
          icon: HomeOutlined,
          label: t('返回首页'),
          description: '',
          hide: !isMobile.value,
          routerKey: '',
          allowNewWindow: false,
        },
        {
          type: 'router',
          icon: AccessAlarmsOutlined,
          label: t('采集时钟'),
          description: t('挖穿艾欧泽亚的好帮手！'),
          routerKey: 'gatherclock',
          allowNewWindow: true,
          defaultNewWindowOption: {
            width: 390,
            height: 730,
            top: 120,
            left: 150
          },
        },
        {
          type: 'router',
          icon: FastfoodOutlined,
          label: t('食药计算'),
          description: t('帮助你制作食物与爆发药。能帮到就好。'),
          routerKey: 'fthelper',
          allowNewWindow: true,
          defaultNewWindowOption: {
            width: 1600,
            height: 800,
            top: 120,
            left: 45
          },
        },
        {
          type: 'router',
          icon: WavesOutlined,
          label: t('工作流'),
          description: t('众生如归流。'),
          routerKey: 'workflow',
          allowNewWindow: false,
        },
        {
          type: 'router',
          icon: CodeOutlined,
          label: t('宏管理'),
          description: t('管理，收容，跑路……'),
          hide: isMobile.value,
          routerKey: 'macromanage',
          allowNewWindow: false,
        },
      ]
    },
    /* 设置与更新 */
    {
      key: 'settings_and_updates',
      label: t('设置与更新'),
      icon: UpdateOutlined,
      options: [
        {
          type: 'common',
          label: t('切换主题'),
          icon: theme.value === 'light' ? DarkModeTwotone : LightModeTwotone,
          description: theme.value === 'light' ? t('为这个世界带回黑暗。') : t('静待黎明天光来。'),
          click: switchTheme
        },
        {
          type: 'common',
          label: t('偏好设置'),
          icon: SettingsSharp,
          description: t('以人的意志改变机械的程序。'),
          click: () => {
            showPreferencesModal.value = true
          },
          mobileClick: () => {
            preferenceModalShowUpOnly.value = true
            preferenceModalShowFpOnly.value = false
            showPreferencesModal.value = true
          }
        },
        {
          type: 'common',
          label: t('功能设置'),
          icon: SettingsSuggestFilled,
          hide: !isMobile.value,
          mobileClick: () => {
            preferenceModalShowUpOnly.value = false
            preferenceModalShowFpOnly.value = true
            showPreferencesModal.value = true
          }
        },
        {
          type: 'common',
          label: t('检查更新'),
          icon: UpdateSharp,
          description: t('更新目标的战力等级……变更攻击模式……'),
          click: handleCheckUpdates
        },
        {
          type: 'common',
          label: t('更新日志'),
          icon: EventNoteFilled,
          description: t('修正……改良……开始对循环程序进行更新……'),
          click: () => {
            showChangeLogsModal.value = true
          }
        },
        {
          type: 'common',
          label: t('开发工具'),
          icon: DevicesOtherOutlined,
          description: t('帝国正在开发究极神兵的后续机体……'),
          hide: !canOpenDevTools.value,
          click: () => {
            window.electronAPI!.openDevTools()
          }
        },
      ],
    },
    /* 关于 */
    {
      key: 'about',
      label: t('关于'),
      icon: InfoFilled,
      options: [
        {
          type: 'common',
          label: '常见问题',
          icon: HelpOutlineOutlined,
          description: '也有不常见的。',
          hide: userConfig.value.language_ui !== 'zh',
          click: () => {
            visitUrl('https://docs.qq.com/doc/DY3pPZmRGRHpubEFi')
          }
        },
        {
          type: 'common',
          label: t('联系我们'),
          icon: ContactlessOutlined,
          description: t('关注我们喵，关注我们谢谢喵。'),
          click: () => {
            showContactModal.value = true
          }
        },
        {
          type: 'common',
          label: t('赞助我们'),
          icon: HandshakeOutlined,
          description: t('请务必量力而行。'),
          click: () => {
            showDonateModal.value = true
          }
        },
        {
          type: 'common',
          label: t('关于本作'),
          icon: InfoOutlined,
          description: t('重新自我介绍一下库啵。'),
          click: () => {
            showAboutAppModal.value = true
          }
        },
        {
          type: 'divider',
          hide: !!window.electronAPI || isMobile.value,
        },
        {
          type: 'router',
          icon: DevicesOutlined,
          label: t('下载客户端'),
          hide: !!window.electronAPI || isMobile.value,
          description: t('以备不时之需。'),
          routerKey: 'download',
          allowNewWindow: false,
        },
      ],
    },
  ]
  return data
})

const desktopMenuData = computed(() => {
  return menuData.value.map(menuitem => {
    return {
      key: menuitem.key,
      icon: menuitem.icon,
      label: menuitem.label,
      hide: menuitem.hide,
      disabled: menuitem.disabled,
      click: menuitem.click,
      options: menuitem.options?.map((option, optionIndex) => {
        const builtOption = buildMenuOption(option)
        builtOption.key = `${menuitem.key}-${optionIndex}`
        return builtOption
      })
    }
  })
})
const mobileMenuData = computed(() => {
  const mobileOptions: CommonMenuOption[] = []
  menuData.value.forEach(({ options }) => {
    options?.forEach(option => {
      if (option.type === 'common' && !option.hide) {
        mobileOptions.push(option)
      } else if (option.type === 'router' && !option.hide) {
        const {
          currentlyOnPage, redirectToPage,
        } = resolveRouterMenuOption(option)
        mobileOptions.push({
          type: 'common',
          icon: option.icon,
          label: option.label,
          disabled: option.disabled || currentlyOnPage,
          click: redirectToPage,
        })
      }
    })
  })
  return mobileOptions.map(option => {
    return {
      icon: option.icon,
      label: option.label,
      hide: option.hide,
      disabled: option.disabled,
      click: option.mobileClick ?? option.click,
    }
  })
})

const buildMenuOption = (menuOption : MyMenuOption) : DropdownOption => {
  if (menuOption.type === 'divider') {
    return { type: 'divider', hide: menuOption.hide }
  } else if (menuOption.type === 'router') {
    const { customRenderer } = resolveRouterMenuOption(menuOption)
    return {
      type: 'render',
      hide: menuOption.hide,
      render: customRenderer,
    }
  } else {
    return {
      icon: renderIcon(menuOption.icon),
      label: menuOption.label,
      description: menuOption.description,
      hide: menuOption.hide,
      disabled: menuOption.disabled,
      children: menuOption.children,
      click: menuOption.click,
      customRenderer: menuOption.customRenderer
    }
  }
}
const buildOuterlinkOptions = (
  options: {
    url: string, label: string, description?: string
  }[],
  key: string,
  icon?: Component
) => {
  return options.map((option, index) => {
    return {
      key: `${key}-${index}`,
      icon: renderIcon(icon ?? OpenInNewOutlined),
      label: option.label,
      click: () => {
        visitUrl(option.url)
      },
      description: option.description ?? option.url
    }
  })
}
const resolveRouterMenuOption = (menuOption: RouterMenuOption) => {
  const routerUrl = `/${menuOption.routerKey}`
  const pageUrl = document.location.origin + document.location.pathname + `#/${menuOption.routerKey}?mode=overlay`
  const currentlyOnPage = router.currentRoute.value.path === routerUrl
  const buttonGroupTooltip = currentlyOnPage ? t('您已经处于{}页面。', menuOption.label) : menuOption.description
  const redirectToPage = () => {
    router.push(routerUrl)
    hideMenuDropdowns()
  }
  const openSubWindow = () => {
    const width = menuOption.defaultNewWindowOption?.width ?? 800
    const height = menuOption.defaultNewWindowOption?.height ?? 600
    const top = menuOption.defaultNewWindowOption?.top ?? 100
    const left = menuOption.defaultNewWindowOption?.left ?? 100
    if (window.electronAPI?.createNewWindow) {
      window.electronAPI.createNewWindow(
        menuOption.routerKey,
        pageUrl,
        width,
        height,
        menuOption.label
      )
    } else {
      window.open(
        pageUrl,
        menuOption.label,
        `height=${height}, width=${width}, top=${top}, left=${left}`
      )
    }
    hideMenuDropdowns()
  }
  const customRenderer = () => {
    return h(
      NTooltip,
      {
        keepAliveOnHover: false,
        placement: 'right',
        style: {
          width: 'max-content',
          display: isMobile.value ? 'none' : 'inherit',
        }
      },
      {
        trigger: () => h(
          'div',
          {
            class: 'flex-vac gap-2',
            style: `
              padding: 0 4px;
            `,
          },
          [
            h(
              NButton,
              {
                quaternary: true,
                size: 'small',
                disabled: currentlyOnPage || menuOption.disabled,
                class: 'appheader-menu-button',
                style: menuOption.allowNewWindow ? '' : 'width: 100%;',
                onClick: redirectToPage,
              },
              {
                default: () => h(
                  'div',
                  { class: 'button-content' },
                  [
                    h(
                      'div',
                      { class: 'button-icon' },
                      [
                        h(NIcon, { size: 14 }, {
                          default: () => h(menuOption.icon)
                        })
                      ]
                    ),
                    menuOption.label
                  ]
                )
              }
            ),
            menuOption.allowNewWindow ? h(
              NButton,
              {
                quaternary: true,
                type: 'primary',
                size: 'small',
                disabled: currentlyOnPage || menuOption.disabled,
                class: 'n-square-button',
                title: t('在新窗口中打开{tool}', menuOption.label),
                onClick: openSubWindow,
              },
              {
                default: () => h(NIcon, { size: 14 }, {
                  default: () => h(OpenInNewOutlined)
                })
              }
            ) : undefined,
          ].filter(item => !!item)
        ),
        default: () => h('span', buttonGroupTooltip)
      }
    )
  }
  return {
    currentlyOnPage,
    buttonGroupTooltip,
    redirectToPage,
    openSubWindow,
    customRenderer,
  }
}

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

const handleDesktopMenuOptionSelect = (key: string, option: any) => {
  if (option?.click) {
    option.click()
  } else {
    console.log('[开发提示] 未分配点击事件', key, option)
  }
}
const defaultClickEvent = () => {}
const hideMenuDropdowns = () => {
  menuDropdownVisiGroup.value = menuDropdownVisiGroup.value.map(() => false)
}

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
    try {
      const checkUpdateResponse = await checkAppUpdates()
      if (checkUpdateResponse.success) {
        const versionContent = checkUpdateResponse.data!
        const currentVersion = AppStatus.Version
        if (currentVersion !== versionContent.hqhelper) {
          if (window.confirm(t('检测到新版本{v}，是否更新?', { v: versionContent.hqhelper }))) {
            const cacheKeys = await caches.keys()
            for (const name of cacheKeys) {
              await caches.delete(name)
            }
            location.reload()    
          }
        } else {
          NAIVE_UI_MESSAGE.success(t('已是最新版本'))
        }
      } else {
        NAIVE_UI_MESSAGE.error(checkUpdateResponse.message)
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
        <div class="flex-col">
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
          <div class="flex-col">
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
          <div class="flex-col flex-center">
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
          v-for="(item, itemIndex) in desktopMenuData"
          :key="'desktop-menu-' + itemIndex"
          v-model:show="menuDropdownVisiGroup[itemIndex]"
          :options="item.options?.filter(o => !o.hide)"
          :render-option="optionsRenderer"
          :trigger="item.options?.length ? 'hover' : 'manual'"
          @select="handleDesktopMenuOptionSelect"
        >
          <n-button
            size="tiny" tertiary
            v-show="!item?.hide"
            :disabled="item.disabled"
            class="no-select"
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
            v-for="(item, key) in mobileMenuData"
            :key="key"
            v-show="!item?.hide"
            :disabled="item.disabled"
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