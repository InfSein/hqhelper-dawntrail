import { computed, type Ref } from "vue"
import { getImgCdnUrl } from "./item"
import type { CloudConfigModel } from "@/models/config-cloud"

const useCloud = (
  cloudConfig: Ref<CloudConfigModel>,
  t: (message: string, args?: any) => string,
) => {
  const avatarUrl = computed(() => {
    if (cloudConfig.value.nbb_account_avatar_vip) {
      return cloudConfig.value.nbb_account_avatar_vip
    } else if (cloudConfig.value.nbb_account_avatar) {
      return getImgCdnUrl(cloudConfig.value.nbb_account_avatar)
    } else {
      return './image/game-job/companion/none.png'
    }
  })
  const userNickName = computed(() => {
    return cloudConfig.value.nbb_account_nickname || t('cloud.text.not_logged_in')
  })
  const userLoggedIn = computed(() => !!cloudConfig.value.nbb_account_token)
  const userTitle = computed(() => {
    if (!userLoggedIn.value) return '-'
    return cloudConfig.value.nbb_account_title || '-'
  })

  return {
    avatarUrl,
    userNickName,
    userLoggedIn,
    userTitle,
  }
}

export default useCloud