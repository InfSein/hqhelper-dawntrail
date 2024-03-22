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
  NButton, NBackTop,
  NConfigProvider, NCard,
  NDropdown, NDialog, NDialogProvider,
  NFlex, NForm, NFormItem,
  NLayout, NLayoutHeader, NLayoutContent, NLayoutSider,
  NMessageProvider, NModal,
  NRadioButton, NRadioGroup,
  NScrollbar,
} from 'naive-ui'

const naive = create({
  components: [
    NButton, NBackTop,
    NConfigProvider, NCard,
    NDropdown, NDialog, NDialogProvider,
    NFlex, NForm, NFormItem,
    NLayout, NLayoutHeader, NLayoutContent, NLayoutSider,
    NMessageProvider, NModal,
    NRadioButton, NRadioGroup,
    NScrollbar,
  ]
})

import { store, key } from './store'

i18nScope.ready(()=>{
  const app = createApp(App)
  app.use<VoerkaI18nPluginOptions>(i18nPlugin, { i18nScope })
  app.use(store, key)
  app.use(naive)
  app.mount('#app')
})
