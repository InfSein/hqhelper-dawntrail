import './assets/main.css'
import App from './App.vue'
import i18n from './locales/i18n'
import router from './router'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')
