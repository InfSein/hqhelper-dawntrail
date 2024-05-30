import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import i18nPlugin, { type VoerkaI18nPluginOptions } from '@voerkai18n/vue'
import { i18nScope } from './languages'

// UI-Libs
import {
  // creater
  create,
  // components
  // use a-z sort
  NAlert,
  NButton, NButtonGroup, NBackTop,
  NCard, NConfigProvider, NCollapse, NCollapseItem,
  NDrawer, NDrawerContent, NDropdown, NDialog, NDialogProvider, NDivider,
  NFlex, NForm, NFormItem,
  NIcon, NImage, NInputNumber,
  NLayout, NLayoutHeader, NLayoutContent, NLayoutSider,
  NMessageProvider, NModal,
  NPopover,
  NRadioButton, NRadioGroup,
  NScrollbar, NSwitch,
  NTabs, NTabPane
} from 'naive-ui'

const naive = create({
  components: [
    NAlert,
    NButton, NButtonGroup, NBackTop,
    NCard, NConfigProvider, NCollapse, NCollapseItem,
    NDrawer, NDrawerContent, NDropdown, NDialog, NDialogProvider, NDivider,
    NFlex, NForm, NFormItem,
    NIcon, NImage, NInputNumber,
    NLayout, NLayoutHeader, NLayoutContent, NLayoutSider,
    NMessageProvider, NModal,
    NPopover,
    NRadioButton, NRadioGroup,
    NScrollbar, NSwitch,
    NTabs, NTabPane
  ]
})

import { store, key } from './store'

i18nScope.ready(() => {
  const app = createApp(App)
  app.use<VoerkaI18nPluginOptions>(i18nPlugin, { i18nScope })
  app.use(store, key)
  app.use(naive)
  app.mount('#app')
})
