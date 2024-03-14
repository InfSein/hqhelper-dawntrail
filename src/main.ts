import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './language/i18n'

// UI-Libs
/*
import { showDialog, showConfirmDialog } from 'vant'
import { useDialog } from 'naive-ui'
*/
import { Toast } from 'vant'

const app = createApp(App)
app.use(i18n)
app.use(Toast)
/* app.use(showDialog)
app.use(showConfirmDialog)
app.use(useDialog) */
app.mount('#app')
