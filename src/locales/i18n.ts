import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'
import ja from './ja.json'

const DEFAULT_LOCALE = localStorage.getItem('locale') || navigator.language.slice(0, 2) || 'zh'

const i18n = createI18n({
  legacy: false,
  globalInjection: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: 'zh',
  messages: {
    zh, en, ja,
  },
})

export default i18n