// tp-document: https://juejin.cn/post/7273025171103072314

import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import ja from './ja'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh',
  messages: {
    zh,
    en,
    ja
  }
})

export default i18n