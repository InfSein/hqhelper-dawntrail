import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './language/i18n'

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

const app = createApp(App)
app.use(i18n)
app.use(store, key)
app.use(naive)
app.mount('#app')
