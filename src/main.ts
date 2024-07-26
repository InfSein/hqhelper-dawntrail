import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import i18nPlugin, { type VoerkaI18nPluginOptions } from '@voerkai18n/vue'
import { i18nScope } from './languages'

import router from './router'
import { store, key } from './store'

i18nScope.ready(() => {
  const app = createApp(App)
  app.use(router)
  app.use<VoerkaI18nPluginOptions>(i18nPlugin, { i18nScope })
  app.use(store, key)
  app.mount('#app')
})
