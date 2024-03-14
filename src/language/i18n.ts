// tp-document: https://juejin.cn/post/7273025171103072314

import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import jp from './jp'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh',
  messages: {
    zh,
    en,
    jp
  }
})

export default i18n