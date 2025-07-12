import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export type AvailableLocale = "zh" | "en" | "ja"

export function useLocale() {
  const { locale, t } = useI18n()

  // 当前语言
  const currentLocale = computed(() => locale.value as AvailableLocale)

  // 切换语言
  const setLocale = (lang: AvailableLocale) => {
    if (currentLocale.value !== lang) {
      locale.value = lang
      localStorage.setItem('locale', lang)
    }
  }

  return {
    t,
    currentLocale,
    setLocale,
  }
}
