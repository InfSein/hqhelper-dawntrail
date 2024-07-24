<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import {
  NButton, NDrawer, NDrawerContent, NDivider, NFlex, NIcon, NPopover,
  useMessage
} from 'naive-ui'
import {
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

const t = inject<(text: string, ...args: any[]) => string>('t') ?? (() => { return '' })
const locale = inject<Ref<"zh" | "en" | "ja">>('locale') ?? ref('zh')
const isChina = computed(() => locale.value === 'zh')
const appForceUpdate = inject<() => {}>('appForceUpdate') ?? (() => {})

const NAIVE_UI_MESSAGE = useMessage()

const eorzeaTime = ref<EorzeaTime>(new EorzeaTime())
setInterval(() => {
  eorzeaTime.value = new EorzeaTime()
}, 200)

const showMenus = ref(false)

const showUserPreferencesModal = ref(false)
const showAboutAppModal = ref(false)
const showContactModal = ref(false)
const showChangeLogsModal = ref(false)
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

const menuItems = [
  { key: 'user-preferences', label: t('偏好设置'), icon: SettingsSharp, click: displayUserPreferencesModal },
  { key: 'contact-us', label: t('联系我们'), icon: ContactlessSharp, click: displayContactModal },
  { key: 'change-logs', label: t('更新日志'), icon: EventNoteFilled, click: displayChangeLogsModal },
  { key: 'about-app', label: t('关于本作'), icon: InfoFilled, click: displayAboutAppModal },
]

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
    <i class="xiv hq logo-font"></i>
    <p class="app-name">HQ Helper</p>
    <n-popover trigger="hover" style="max-width: 260px;">
      <template #trigger>
        <p>{{ AppStatus.Version }}</p>
      </template>
      <div class="flex-column">
        <p>{{ t('国服数据版本：{}', AppStatus.SupportedGameVersion.CN) }}</p>
        <p>{{ t('国际服数据版本：{}', AppStatus.SupportedGameVersion.GLOBAL) }}</p>
        <p>{{ t('※ 国服数据尚未更新时，显示的中文名一般为作者自译，请谨慎参考。') }}</p>
      </div>
    </n-popover>

    <n-divider vertical></n-divider>

    <n-popover trigger="hover">
      <template #trigger>
        <p>
          <span v-if="isChina"><i class="xiv eorzea-time-chs"></i></span>
          <span v-else><i class="xiv eorzea-time"></i></span>
          <span class="time-text">{{ eorzeaTime.gameTime }}</span>
        </p>
      </template>
      <div class="flex-column flex-center">
        <p class="font-center">{{ t('艾欧泽亚时间') }}</p>
      </div>
    </n-popover>

    <div class="tail-contents">
      <n-button ghost class="menu-button" @click="showMenus = !showMenus">
        <template #icon>
          <n-icon><menu-filled /></n-icon>
        </template>
      </n-button>
    </div>
    
    <n-drawer
      v-model:show="showMenus"
      placement="right"
      :width="250"
      :trap-focus="false"
      :block-scroll="false"
      to="#main-container"
    >
      <n-drawer-content>
        <n-flex vertical>
          <n-button
            v-for="item in menuItems"
            :key="item.key"
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
.app-header {
  display: flex;
  align-items: center;
  line-height: 35px;

  .logo-font {
    font-size: 24px;
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
</style>