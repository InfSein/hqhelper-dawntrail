import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import i18n from './locales/i18n'

import router from './router'
import { store, key } from './store'

const app = createApp(App)
app.use(router)
app.use(store, key)
app.use(i18n)
app.mount('#app')
