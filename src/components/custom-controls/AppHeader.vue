<script setup lang="ts">
import { computed, h, inject, ref, type Component, type Ref } from 'vue'
import {
  NButton, NButtonGroup, NDrawer, NDrawerContent, NDropdown, NDivider, NFlex, NIcon, NPopover,
  useMessage,
  type DropdownOption
} from 'naive-ui'
import {
  ArrowCircleLeftOutlined,
  FileCopyOutlined,
  SpaOutlined,
  ImportExportOutlined,
  FastfoodOutlined,
  MenuFilled,
  SettingsSharp,
  EventNoteFilled,
  InfoFilled,
  ContactlessSharp
} from '@vicons/material'
import ModalUserPreferences from '@/components/modals/ModalUserPreferences.vue'
import ModalContactUs from '@/components/modals/ModalContactUs.vue'
import ModalChangeLogs from '@/components/modals/ModalChangeLogs.vue'
import ModalAboutApp from '@/components/modals/ModalAboutApp.vue'
import EorzeaTime from '@/tools/eorzea-time'
import AppStatus from '@/variables/app-status'
import router from '@/router'

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const isMobile = inject<Ref<boolean>>('isMobile') ?? ref(false)
const locale = inject<Ref<"zh" | "en" | "ja">>('locale') ?? ref('zh')
const isChina = computed(() => locale.value === 'zh')
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})
const currentET = inject<Ref<EorzeaTime>>('currentET')!

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
const menuItems = computed(() => {
  const hideFTHelper = router.currentRoute.value.path.startsWith('/fthelper')
  return {
    ftHelper: { label: t('食药计算'), hide: hideFTHelper, icon: FastfoodOutlined, click: redirectToFoodAndTincPage } as MenuItem,
    contact: { label: t('联系我们'), icon: ContactlessSharp, click: displayContactModal } as MenuItem,
    changelogs: { label: t('更新日志'), hide: true, icon: EventNoteFilled, click: displayChangeLogsModal } as MenuItem,
    userPreferences: { label: t('偏好设置'), icon: SettingsSharp, click: displayUserPreferencesModal } as MenuItem,
    aboutApp: { label: t('关于本作'), icon: InfoFilled, click: displayAboutAppModal } as MenuItem
  }
})
interface DesktopMenuItem {
  label: string
  icon: typeof MenuFilled
  hide?: boolean
  disabled?: boolean
  click?: () => void
  options?: DropdownOption[]
}
const desktopMenus = computed(() => {
  const hideFTHelper = router.currentRoute.value.path.startsWith('/fthelper')
  return [
    /* 参考资料 */
    {
      label: t('参考资料'),
      icon: FileCopyOutlined,
      options: [
        {
          key: 'ref-self',
          label: t('自撰攻略'),
          icon: FileCopyOutlined,
          children: [
            {
              key: 'ref-self-1',
              label: t('DawnCrafter I: 7.0/7.05生产采集准备工作'),
              icon: renderIcon(FileCopyOutlined),
              click: () => {
                alert('还没写好呢')
              }
            }
          ]
        },
        {
          key: 'ref-oth-book',
          label: t('其他推荐攻略'),
          icon: FileCopyOutlined,
          children: [
            {
              key: 'ref-oth-book-1',
              label: t('???'),
              icon: renderIcon(FileCopyOutlined),
              click: () => {
                alert('还没写好呢')
              }
            }
          ]
        },
        {
          key: 'ref-oth-tool',
          label: t('其他实用工具'),
          icon: FileCopyOutlined,
          children: [
            {
              key: 'ref-oth-tool-1',
              label: t('???'),
              icon: renderIcon(FileCopyOutlined),
              click: () => {
                alert('还没写好呢')
              }
            }
          ]
        }
      ]
    },
    /* 实用工具 */
    {
      label: t('实用工具'),
      icon: SpaOutlined,
      options: [
        { key: 'tool-fthelper', label: t('食药计算'), disabled: hideFTHelper, icon: renderIcon(FastfoodOutlined), click: redirectToFoodAndTincPage }
      ]
    },
    /* 导入导出 */
    {
      label: t('导入导出'),
      icon: ImportExportOutlined,
      disabled: true,
      options: [],
      click: () => {
        alert('还没写好呢')
      }
    },
    /* 设置与更新 */
    {
      label: t('设置与更新'),
      icon: ImportExportOutlined,
      options: [
        { key: 'sau-up', label: t('偏好设置'), icon: renderIcon(SettingsSharp), click: displayUserPreferencesModal },
        { key: 'sau-cl', label: t('更新日志'), disabled: true, icon: renderIcon(EventNoteFilled), click: displayChangeLogsModal }
      ],
    },
    /* 关于 */
    {
      label: t('关于'),
      icon: InfoFilled,
      options: [
        { key: 'ab-contact', label: t('联系我们'), icon: renderIcon(ContactlessSharp), click: displayContactModal },
        { key: 'ab-about', label: t('关于本作'), icon: renderIcon(InfoFilled), click: displayAboutAppModal }
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
  }
  console.log(key, option)
}
const defaultClickEvent = () => {}

const openModal = (click?: (() => void)) => {
  // close menus first
  showMenus.value = false
  // show modal by inject
  click?.()
}


const onUserPreferencesSubmitted = () => {
  showUserPreferencesModal.value = false
  appForceUpdate()
  NAIVE_UI_MESSAGE.success(t('保存成功！部分改动需要刷新页面才能生效'))
}
</script>

<template>
  <div class="app-header">
    <div class="router-back-container" v-if="!isMobile">
      <n-button text style="font-size: 35px" :disabled="!canRouteBack" @click="handleRouteBack">
        <n-icon>
          <ArrowCircleLeftOutlined />
        </n-icon>
      </n-button>
    </div>
    <div class="header-content">
      <div class="app-info">
        <i class="xiv hq logo-font"></i>
        <p class="app-name">HQ Helper</p>
        <n-popover trigger="hover" style="max-width: 260px;">
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

        <n-popover trigger="hover">
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
      <div class="app-menu" v-if="!isMobile">
        <n-dropdown
          size="small"
          placement="bottom-start"
          v-for="(item, key) in desktopMenus"
          :key="'desktop-menu-' + key"
          :options="item.options"
          :trigger="item.options?.length ? 'hover' : 'manual'"
          @select="handleDesktopMenuOptionSelect"
        >
          <n-button
            size="tiny" tertiary
            v-show="!item?.hide"
            :disabled="item.disabled"
            @click="item.click ?? defaultClickEvent"
          >
            <n-icon><component :is="item.icon" /></n-icon>
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